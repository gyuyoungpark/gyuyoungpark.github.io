"""Check Figure 4's serialized artwork independently against archived FEM data.

This script does not import the drawing generator or solve the PDE again. It
extracts contours from the saved streamfunction, checks the actual SVG paths and
arrow polygons, and writes svg-validation.json next to this script. The stored
current contains vertex samples of the original P2 solution, so arrow checks use
linear interpolation of those samples, not a new full-quadrature FEM audit.
"""
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.tri import LinearTriInterpolator, Triangulation


HERE = Path(__file__).resolve().parent
MODEL_ROOT = HERE.parent
REPO_ROOT = MODEL_ROOT.parent.parent
SVG_PATH = REPO_ROOT / "public/images/columns/electron-fluid/figure-4-cavity-flow.svg"
REPORT_PATH = HERE / "svg-validation.json"
NS = {"s": "http://www.w3.org/2000/svg"}
NUMBER = r"[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?"
SCALE = 200.0
BASE_Y = 705.0
COORD_TOL = 2e-5  # SVG serializes coordinates to five decimal places.
ALIGNMENT_MIN = 0.98
OPEN_FRACTIONS = np.array([.16, .42, .70, .94, .995])
LOOP_FRACTIONS = np.array([.25, .65])
CASES = (("Vortex", .4, 400.0), ("Open flow", 1.0, 1200.0))


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def parse_points(value, path=False):
    remainder = re.sub(NUMBER, "", value)
    allowed = r"[MLZ\s,]*" if path else r"[\s,]*"
    check(re.fullmatch(allowed, remainder) is not None,
          "Expected absolute M/L path coordinates or polygon points")
    numbers = np.array([float(v) for v in re.findall(NUMBER, value)])
    check(numbers.size % 2 == 0 and numbers.size >= 4, "Invalid coordinate pairs")
    points = numbers.reshape(-1, 2)
    check(np.isfinite(points).all(), "SVG coordinates must be finite")
    return points


def to_screen(points, cx):
    return np.c_[cx + SCALE * points[:, 0], BASE_Y - SCALE * points[:, 1]]


def to_physical(points, cx):
    return np.c_[(points[:, 0] - cx) / SCALE, (BASE_Y - points[:, 1]) / SCALE]


def panel_index(element, svg):
    # Infer the panel from the clip rectangle, rather than path list ordering.
    ref = element.attrib.get("clip-path", "")
    match = re.fullmatch(r"url\(#([^)]*)\)", ref)
    check(match is not None, "Physical paths must carry a panel clip reference")
    clip = svg.find(f"s:defs/s:clipPath[@id='{match.group(1)}']/s:rect", NS)
    check(clip is not None, "Panel clip rectangle is missing")
    center = float(clip.attrib["x"]) + float(clip.attrib["width"]) / 2
    centers = np.array([c[2] for c in CASES])
    index = int(np.argmin(abs(centers - center)))
    check(abs(centers[index] - center) < COORD_TOL, "Unexpected panel position")
    return index


def extracted_contours(tri, psi, levels):
    fig, ax = plt.subplots()
    contours = ax.tricontour(tri, psi, levels=levels)
    results = []
    for level, segments in zip(levels, contours.allsegs):
        for segment in segments:
            if len(segment) > 1:
                results.append((float(level), np.array(segment, copy=True)))
    plt.close(fig)
    return results


def nearest_segment(point, paths):
    best = None
    for index, points in enumerate(paths):
        start, step = points[:-1], np.diff(points, axis=0)
        denom = np.sum(step * step, axis=1)
        valid = denom > 0
        fraction = np.zeros(len(step))
        fraction[valid] = np.sum((point - start[valid]) * step[valid], axis=1) / denom[valid]
        fraction = np.clip(fraction, 0, 1)
        distance = np.linalg.norm(start + fraction[:, None] * step - point, axis=1)
        distance[~valid] = np.inf
        segment = int(np.argmin(distance))
        candidate = (float(distance[segment]), index, step[segment])
        if best is None or candidate[0] < best[0]:
            best = candidate
    return best


def arrow_axis(points):
    check(points.shape == (3, 2), "Arrowhead must be one triangle")
    # The two rear corners form the shortest triangle edge. This identifies the
    # tip independently of vertex ordering in the generator.
    lengths = np.array([np.linalg.norm(points[(i + 1) % 3] - points[i]) for i in range(3)])
    base_start = int(np.argmin(lengths))
    base = (points[base_start] + points[(base_start + 1) % 3]) / 2
    tip = points[(base_start + 2) % 3]
    direction = tip - base
    check(np.linalg.norm(direction) > 1, "Degenerate direction marker")
    return (tip + base) / 2, direction / np.linalg.norm(direction)


def verify():
    check(SVG_PATH.is_file(), f"Figure has not been generated yet: {SVG_PATH}")
    svg = ET.parse(SVG_PATH).getroot()
    check(svg.attrib.get("viewBox") == "0 0 1600 900", "Unexpected SVG viewBox")
    check(len(svg.findall(".//s:image", NS)) == 0, "Artwork must remain vector-only")
    check(not any("transform" in e.attrib for e in svg.iter()),
          "An unaccounted SVG transform would invalidate the coordinate audit")
    text_nodes = svg.findall(".//s:text", NS)
    labels = ["".join(e.itertext()).strip() for e in text_nodes]
    check(labels == ["Vortex", "Open flow"], "Visible labels must remain minimal")

    boundary_elements = svg.findall("s:g[@id='geometry']/s:path", NS)
    data_elements = svg.findall("s:g[@id='data']/s:path", NS)
    arrow_elements = svg.findall("s:g[@id='arrows']/s:polygon", NS)
    check(len(boundary_elements) == 2, "Expected two exact physical boundaries and no scale bars")
    check(len(data_elements) == 12, "Expected seven left and five right streamline paths")
    check(len(arrow_elements) == 12, "Each displayed streamline needs one direction marker")
    check(len(svg.findall("s:g[@id='data']/*", NS)) == 12,
          "Unexpected additional data geometry")
    check(len(svg.findall("s:g[@id='arrows']/*", NS)) == 12,
          "Unexpected additional arrow geometry")

    reports = []
    arrow_counts = []
    all_coordinate_errors = []
    for index, (label, radius, cx) in enumerate(CASES):
        data_path = MODEL_ROOT / "flow-data" / f"R{radius:g}-h0.0225.npz"
        with np.load(data_path) as saved:
            p, t, j, psi, polygon = [saved[key].copy() for key in ("p", "t", "j", "psi", "polygon")]
            q, d, a = [float(saved[key]) for key in ("Q", "D", "a")]
        check(all(np.isfinite(v).all() for v in (p, j, psi, polygon)), "Non-finite archived model data")
        check(abs(d - .25) < 1e-12, "Both cases must have Dnu/W=0.25")
        check(abs(a - 1.5 * radius) < 1e-12, "Cavity and opening must increase together")
        tri = Triangulation(*p, t.T)
        finder = tri.get_trifinder()
        current = [LinearTriInterpolator(tri, component) for component in j]
        scalar = LinearTriInterpolator(tri, psi)

        boundaries = [e for e in boundary_elements if panel_index(e, svg) == index]
        check(len(boundaries) == 1, "One boundary is required per panel")
        actual_boundary = parse_points(boundaries[0].attrib["d"], path=True)
        expected_polygon = np.vstack([polygon, polygon[0]])
        expected_boundary = to_screen(expected_polygon, cx)
        check(actual_boundary.shape == expected_boundary.shape, "Boundary vertex count changed")
        boundary_error = float(np.max(abs(actual_boundary - expected_boundary)))
        check(boundary_error <= COORD_TOL, "SVG wall no longer matches the archived mesh geometry")
        sx, x0 = np.linalg.lstsq(np.c_[expected_polygon[:, 0], np.ones(len(expected_polygon))],
                                  actual_boundary[:, 0], rcond=None)[0]
        sy, y0 = np.linalg.lstsq(np.c_[expected_polygon[:, 1], np.ones(len(expected_polygon))],
                                  actual_boundary[:, 1], rcond=None)[0]
        check(abs(sx - SCALE) < 1e-4 and abs(sy + SCALE) < 1e-4,
              "Panel axes must use the same physical spatial scale")
        check(abs(x0 - cx) < COORD_TOL and abs(y0 - BASE_Y) < COORD_TOL,
              "Physical panel origin changed")

        levels = q * OPEN_FRACTIONS
        if index == 0:
            levels = np.r_[levels, q + float(psi.max() - q) * LOOP_FRACTIONS]
        expected = extracted_contours(tri, psi, levels)
        elements = [e for e in data_elements if panel_index(e, svg) == index]
        expected_count = 7 if index == 0 else 5
        check(len(elements) == len(expected) == expected_count, "Displayed contours changed")
        actual_paths = [parse_points(e.attrib["d"], path=True) for e in elements]
        unmatched = list(range(len(expected)))
        path_reports = []
        coordinate_errors = []
        closed_count = 0
        for actual in actual_paths:
            candidates = []
            for candidate in unmatched:
                target = to_screen(expected[candidate][1], cx)
                if target.shape == actual.shape:
                    error = min(float(np.max(abs(actual - target))),
                                float(np.max(abs(actual - target[::-1]))))
                    candidates.append((error, candidate))
            check(bool(candidates), "Streamline vertices do not match a computed contour")
            error, candidate = min(candidates)
            check(error <= COORD_TOL, "A streamline was moved, smoothed, or invented")
            unmatched.remove(candidate)
            coordinate_errors.append(error)
            level, original = expected[candidate]
            physical = to_physical(actual, cx)
            middle = (physical[:-1] + physical[1:]) / 2
            inside = finder(*middle.T) >= 0
            check(bool(inside.all()), "Streamline segment lies outside the physical mesh")
            values = scalar(*middle.T)
            check(not np.ma.getmaskarray(values).any(), "Unable to evaluate a streamline in its mesh")
            scalar_error = float(np.max(abs(np.asarray(values) - level)))
            check(scalar_error < 1e-6, "Path does not follow its saved streamfunction level")
            closed = bool(np.linalg.norm(original[-1] - original[0]) < 1e-7)
            closed_count += int(closed)
            check(closed == (level > q), "Closed loops must belong to the physical cavity circulation")
            path_reports.append({"level": level, "closed": closed,
                                 "vertices": len(actual), "coordinate_error_px": error,
                                 "streamfunction_error_at_segment_midpoints": scalar_error})
        check(not unmatched, "A computed display contour is missing")
        check(closed_count == (2 if index == 0 else 0), "Unexpected displayed circulation topology")

        # Arrows are classified by their location, since triangles need no clip.
        arrows = []
        for element in arrow_elements:
            points = parse_points(element.attrib["points"])
            position, direction = arrow_axis(points)
            if int(np.argmin([abs(position[0] - c[2]) for c in CASES])) == index:
                arrows.append((points, position, direction))
        check(len(arrows) == expected_count, "Each panel needs one arrow per displayed contour")
        arrow_counts.append(len(arrows))
        annotated_paths = []
        arrow_reports = []
        for points, position, direction in arrows:
            physical = to_physical(points, cx)
            edge_middle = (physical + np.roll(physical, -1, axis=0)) / 2
            check(bool((finder(*np.vstack([physical, edge_middle]).T) >= 0).all()),
                  "A direction marker protrudes outside the channel or cavity")
            distance, path_index, tangent = nearest_segment(position, actual_paths)
            check(distance <= COORD_TOL, "Direction marker is detached from its streamline")
            tangent /= np.linalg.norm(tangent)
            tangent_alignment = abs(float(np.dot(direction, tangent)))
            check(tangent_alignment > ALIGNMENT_MIN, "Direction marker is not tangent to its streamline")
            point = to_physical(position[None, :], cx)[0]
            samples = [component(*point) for component in current]
            check(not any(np.ma.is_masked(v) for v in samples), "Direction marker lies outside the saved current field")
            vector = np.array([float(samples[0]), -float(samples[1])])
            speed = float(np.linalg.norm(vector))
            check(speed > 1e-7, "A direction marker was placed on unresolved near-zero current")
            alignment = float(np.dot(direction, vector) / speed)
            check(alignment > ALIGNMENT_MIN, "Direction marker points against the computed current")
            annotated_paths.append(path_index)
            arrow_reports.append({"streamline_index": path_index,
                                  "distance_from_streamline_px": distance,
                                  "tangent_alignment": tangent_alignment,
                                  "current_alignment": alignment,
                                  "physical_anchor": point.tolist()})
        check(len(set(annotated_paths)) == expected_count, "A streamline is missing its arrow or has duplicate arrows")
        all_coordinate_errors.extend(coordinate_errors + [boundary_error])
        reports.append({"label": label, "R_over_W": radius, "a_over_W": a,
                        "Dnu_over_W": d, "source_npz_sha256": hashlib.sha256(data_path.read_bytes()).hexdigest(),
                        "inferred_x_scale_px_per_W": float(sx),
                        "inferred_y_scale_px_per_W": float(-sy),
                        "boundary_coordinate_error_px": boundary_error,
                        "contour_levels": levels.tolist(), "closed_paths_shown": closed_count,
                        "paths": path_reports, "arrows": arrow_reports})

    report = {
        "status": "passed", "svg": str(SVG_PATH.relative_to(REPO_ROOT)),
        "svg_sha256": hashlib.sha256(SVG_PATH.read_bytes()).hexdigest(),
        "method": "Independent Matplotlib contours from saved FEM streamfunction; actual serialized SVG geometry and arrows checked without importing the drawing generator.",
        "scope": "This verifies presentation of archived nodal fields. It does not rerun the PDE or independently reproduce full P2 FEM quadrature diagnostics. Unconverged tiny Case B corner loops are not displayed; no claim of their absence is made.",
        "coordinate_tolerance_px": COORD_TOL, "current_alignment_required": ALIGNMENT_MIN,
        "displayed_streamline_paths": 12, "direction_markers": 12,
        "all_marker_vertices_and_edge_midpoints_inside_mesh": True,
        "one_marker_per_displayed_streamline": True,
        "visible_labels": labels, "common_physical_scale_px_per_W": SCALE,
        "max_serialized_coordinate_error_px": max(all_coordinate_errors),
        "nonintersection_basis": "Every path matches an unmodified contour of the same continuous, piecewise-linear scalar field, at a distinct level; arbitrary crossings or added paths are excluded by the coordinate and scalar-level checks.",
        "panels": reports,
    }
    REPORT_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"status": report["status"], "paths": 12, "arrows": sum(arrow_counts),
                      "max_coordinate_error_px": report["max_serialized_coordinate_error_px"],
                      "minimum_current_alignment": min(a["current_alignment"] for p in reports for a in p["arrows"]),
                      "report": str(REPORT_PATH)}, indent=2))


if __name__ == "__main__":
    verify()
