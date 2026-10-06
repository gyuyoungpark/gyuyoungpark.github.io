"""Render Figure 4 from archived FEM nodal fields; no PDE is solved by this script.

Run: python make_figure4.py
The parent solve_flow.py and flow-data/*.json retain the original P2/P1 FEM
method and full-quadrature reports. Only nodal current and streamfunction were
archived in NPZ, so this script explicitly separates nodal rechecks from those
earlier FEM diagnostics. Matplotlib is used only to extract contour paths.
"""
from pathlib import Path
import hashlib
import json
from xml.sax.saxutils import escape
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.tri import Triangulation, LinearTriInterpolator

ROOT = Path(__file__).resolve().parent
DATA = ROOT.parent / 'flow-data'
ARTWORK = ROOT.parents[2] / 'public' / 'images' / 'columns' / 'electron-fluid' / 'figure-4-cavity-flow.svg'
BLUE, WALL, TEXT, BG = '#286b8a', '#8aa4ac', '#314c59', '#f1f5f3'
SCALE, BASE_Y, HALF_WIDTH = 200.0, 705.0, 320.0 / 200.0
OPEN_FRACTIONS = np.array([.16, .42, .70, .94, .995])
LOOP_FRACTIONS = np.array([.25, .65])


def number(v):
    return f'{float(v):.5f}'.rstrip('0').rstrip('.')


def tag(name, attrs, content=None):
    attributes = ' '.join(f'{k.replace("_", "-")}="{escape(str(v))}"' for k, v in attrs.items())
    return f'<{name} {attributes}/>' if content is None else f'<{name} {attributes}>{content}</{name}>'


def contour_segments(tri, psi, levels):
    fig, ax = plt.subplots()
    cs = ax.tricontour(tri, psi, levels=levels)
    result = [[np.array(seg, copy=True) for seg in segs if len(seg) > 1] for segs in cs.allsegs]
    plt.close(fig)
    return result


def interpolate_current(tri, current):
    ix, iy = (LinearTriInterpolator(tri, v) for v in current)
    def at(points):
        points = np.atleast_2d(points)
        return np.stack([np.asarray(ix(*points.T)), np.asarray(iy(*points.T))], axis=1)
    return at


def loop_diagnostics(tri, psi, current, Q, h):
    # Match the archived definition: maximum is taken away from the opening.
    excess = float(np.max(psi[tri.y > 1 + h]) - Q)
    result = {'psi_excess_over_wall': excess, 'closed_contours': []}
    if excess <= 1e-7:
        return result
    at = interpolate_current(tri, current)
    for seg in contour_segments(tri, psi, [Q + .5 * excess])[0]:
        closure = float(np.linalg.norm(seg[-1] - seg[0]))
        if len(seg) < 5 or closure >= 1e-7:
            continue
        d = np.diff(seg, axis=0)
        mid = (seg[:-1] + seg[1:]) / 2
        signed_area = .5 * np.sum(seg[:-1, 0] * seg[1:, 1] - seg[1:, 0] * seg[:-1, 1])
        raw_circulation = float(np.sum(at(mid) * d))
        ccw_circulation = raw_circulation * np.sign(signed_area)
        result['closed_contours'].append({
            'vertices': len(seg), 'closure_error': closure,
            'area': float(abs(signed_area)),
            'ccw_circulation_from_nodal_current': float(ccw_circulation),
            'rotation': 'counterclockwise' if ccw_circulation > 0 else 'clockwise',
        })
    return result


def recheck_file(path):
    z = np.load(path)
    p, t, j, psi = (z[k] for k in ['p', 't', 'j', 'psi'])
    tri = Triangulation(*p, t.T)
    edges = np.concatenate([t[[0, 1]].T, t[[1, 2]].T, t[[2, 0]].T])
    edges = np.sort(edges, axis=1)
    unique, count = np.unique(edges, return_counts=True, axis=0)
    boundary_nodes = np.unique(unique[count == 1])
    wall_nodes = boundary_nodes[~np.isclose(np.abs(p[0, boundary_nodes]), 5)]
    Q, R, D = (float(z[k]) for k in ['Q', 'R', 'D'])
    h = float(path.stem.split('-h')[1])
    at = interpolate_current(tri, j)
    y = np.linspace(0, 1, 2001)
    fluxes = [float(np.trapezoid(at(np.c_[np.full_like(y, x), y])[:, 0], y)) for x in [-5, -4, 4, 5]]
    report = {
        'file': path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'finite_fields': bool(all(np.isfinite(v).all() for v in [p, j, psi])),
        'wall_current_nodal_max': float(np.max(np.abs(j[:, wall_nodes]))),
        'inlet_current_is_left_to_right': bool(np.all(j[0, boundary_nodes[p[0, boundary_nodes] == -5]] >= -1e-12)),
        'nodal_linear_fluxes': fluxes,
        'nodal_linear_flux_relative_spread': (max(fluxes) - min(fluxes)) / Q,
        'Q': Q, 'R': R, 'a': float(z['a']), 'D': D, 'h': h,
    }
    if R:
        report.update(loop_diagnostics(tri, psi, j, Q, h))
    else:
        profile = (1 - np.cosh((y - .5) / D) / np.cosh(.5 / D)) / (1 - 1 / np.cosh(.5 / D))
        report['straight_profile_nodal_linear_max_error'] = float(np.max(np.abs(at(np.c_[np.zeros_like(y), y])[:, 0] - profile)))
    assert report['finite_fields']
    assert report['wall_current_nodal_max'] < 1e-12
    assert report['inlet_current_is_left_to_right']
    # These are checks of the P1 interpolation of saved nodal samples, not P2 FEM.
    if h <= .0225:
        assert report['nodal_linear_flux_relative_spread'] < 3e-3
    return report


def screen(points, cx):
    points = np.asarray(points)
    return np.c_[cx + SCALE * points[:, 0], BASE_Y - SCALE * points[:, 1]]


def path_data(points):
    return 'M' + ' L'.join(f'{number(x)},{number(y)}' for x, y in points)


def arrow_on_path(seg, current_at, closed, cx, ordinal):
    # Pick a long interior segment with a well-resolved FEM direction. Selection
    # changes which part is annotated; it does not change the contour or field.
    mid = (seg[:-1] + seg[1:]) / 2
    delta = np.diff(seg, axis=0)
    length = np.linalg.norm(delta, axis=1)
    v = current_at(mid)
    speed = np.linalg.norm(v, axis=1)
    agreement = np.sum(delta * v, axis=1) / np.maximum(length * speed, 1e-100)
    valid = (np.abs(mid[:, 0]) < HALF_WIDTH - .12) & (mid[:, 1] > .035) & (speed > 1e-7) & (length > 1e-8) & (np.abs(agreement) > .98)
    if closed:
        valid &= mid[:, 1] > 1.0
        desired = np.array([-.17 if ordinal == 0 else .12, 1.4])
    else:
        desired = np.array([.10, np.max(seg[:, 1])])
    score = np.sum((mid - desired) ** 2, axis=1)
    score[~valid] = np.inf
    idx = int(np.argmin(score))
    if not np.isfinite(score[idx]):
        return '', None
    direction = delta[idx] / length[idx]
    if agreement[idx] < 0:
        direction *= -1
    # Invert physical y for screen y, preserving the calculated direction.
    unit = np.array([direction[0], -direction[1]])
    pos = screen(mid[idx:idx+1], cx)[0]
    normal = np.array([-unit[1], unit[0]])
    points = np.array([pos + 7 * unit, pos - 7 * unit + 4.75 * normal, pos - 7 * unit - 4.75 * normal])
    screen_current = np.array([v[idx, 0], -v[idx, 1]])
    alignment = float(np.dot(unit, screen_current) / np.linalg.norm(screen_current))
    assert alignment > .98
    arrow = tag('polygon', {'points': ' '.join(f'{number(x)},{number(y)}' for x, y in points), 'fill': BLUE, 'data_case': 0 if cx < 800 else 1})
    return arrow, {'physical_point': mid[idx].tolist(), 'screen_tangent_dot_unit_current': alignment, 'closed_contour': bool(closed)}


def build():
    archived = {}
    rechecked = {}
    for path in sorted(DATA.glob('*.npz')):
        rechecked[path.stem] = recheck_file(path)
        archived[path.stem] = json.loads(path.with_suffix('.json').read_text())
    geometry, data, arrows, labels = [], [], [], []
    render_report = []
    definitions = ['<linearGradient id="channel-fill" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#eaf1f2"/><stop offset="0.55" stop-color="#d7e9ec"/><stop offset="1" stop-color="#eaf1f2"/></linearGradient>']
    for k, (R, cx) in enumerate([(.4, 400.), (1., 1200.)]):
        z = np.load(DATA / f'R{R:g}-h0.0225.npz')
        tri = Triangulation(*z['p'], z['t'].T)
        current_at = interpolate_current(tri, z['j'])
        Q, D = float(z['Q']), float(z['D'])
        clip_id = f'panel-{k}'
        definitions.append(f'<clipPath id="{clip_id}"><rect x="{cx-320:g}" y="140" width="640" height="570"/></clipPath>')
        # Exact archived piecewise-linear boundary, merely cropped for display.
        boundary = screen(np.vstack([z['polygon'], z['polygon'][0]]), cx)
        geometry.append(tag('path', {'d': path_data(boundary) + ' Z', 'fill': 'url(#channel-fill)', 'stroke': WALL, 'stroke_width': 4.5, 'stroke_linejoin': 'round', 'clip_path': f'url(#{clip_id})'}))
        excess = float(z['psi'].max() - Q)
        levels = Q * OPEN_FRACTIONS
        # The tiny Case B corner loops are not grid-converged. No artificial
        # loops or an absence claim is added; the limitation is in the caption.
        if k == 0:
            levels = np.r_[levels, Q + excess * LOOP_FRACTIONS]
        segs_by_level = contour_segments(tri, z['psi'], levels)
        actual_arrows = []
        counts = []
        all_points = []
        for n, (level, segs) in enumerate(zip(levels, segs_by_level)):
            counts.append(len(segs))
            for seg in segs:
                all_points.append(seg)
                data.append(tag('path', {'d': path_data(screen(seg, cx)), 'fill': 'none', 'stroke': BLUE, 'stroke_width': 4.5, 'stroke_linecap': 'round', 'stroke_linejoin': 'round', 'clip_path': f'url(#{clip_id})', 'data_case': k, 'data_level': number(level)}))
                arrow, check = arrow_on_path(seg, current_at, level > Q, cx, n - len(OPEN_FRACTIONS))
                if arrow:
                    arrows.append(arrow)
                    actual_arrows.append(check)
        # Iso-contours at distinct values cannot cross for the same scalar
        # interpolant. Independently confirm their midpoints lie in the mesh.
        finder = tri.get_trifinder()
        outside = 0
        for seg in all_points:
            midpoint = (seg[:-1] + seg[1:]) / 2
            outside += int(np.sum(finder(*midpoint.T) < 0))
        assert outside == 0
        labels.append(tag('text', {'x': cx, 'y': 116, 'text_anchor': 'middle', 'font_size': 35, 'font_weight': 500}, ['Vortex', 'Open flow'][k]))
        render_report.append({'case': 'AB'[k], 'R': R, 'a': float(z['a']), 'W': 1, 'D': D, 'pixels_per_W': SCALE,
                              'contour_levels': levels.tolist(), 'segments_per_level': counts, 'outside_mesh_segment_midpoints': outside, 'arrow_checks': actual_arrows})
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">\n'
    svg += '<title>Computed electron-current streamlines in two side cavities</title>\n'
    svg += '<desc>Same channel width, physical scale, and viscous length in both panels. The smaller cavity contains a closed counterclockwise current circulation; the larger cavity shows predominantly open flow. Teal paths are selected contours of the archived numerical streamfunction. Arrowheads indicate conventional current, opposite to mean electron motion. Pale fill is decorative, not a measured field.</desc>\n'
    svg += f'<rect width="1600" height="900" fill="{BG}"/>\n<defs>' + ''.join(definitions) + '</defs>\n'
    for group_id, elements in [('geometry', geometry), ('data', data), ('arrows', arrows), ('labels', labels)]:
        attrs = {'id': group_id}
        if group_id == 'labels':
            attrs.update({'font_family': 'Segoe UI, Arial, sans-serif', 'fill': TEXT})
        svg += tag('g', attrs, '\n' + '\n'.join(elements) + '\n') + '\n'
    svg += '</svg>\n'
    ARTWORK.write_text(svg, encoding='utf-8')
    validation = {
        'provenance': 'Archived local solve_flow.py results from electron-fluid-figures. PDE solver was not rerun for the design revision.',
        'current_scope': 'NPZ contains mesh, vertex current, vertex streamfunction, and geometry. Current rechecks use linear nodal interpolation; they cannot independently reconstruct original P2 quadrature residuals.',
        'tolerances': {'finite_fields': True, 'nodal_wall_current': 1e-12, 'nodal_flux_relative_spread_finest_mesh_only': .003, 'closed_contour_closure': 1e-7, 'arrow_alignment_minimum': .98, 'outside_mesh_midpoints': 0},
        'archived_fem_reports_not_rerun': archived,
        'current_nodal_rechecks': rechecked,
        'current_svg_geometry_checks': render_report,
        'visual_rendering_review': 'Performed separately by the parent rendering workflow; not asserted by this calculation script.'
    }
    (ROOT / 'figure4-validation.json').write_text(json.dumps(validation, indent=2), encoding='utf-8')
    print(json.dumps({'svg': str(ARTWORK), 'rechecked_files': len(rechecked), 'panels': render_report}, indent=2))


if __name__ == '__main__':
    build()
