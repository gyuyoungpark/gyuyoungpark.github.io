"""Build the minimal Figure 5 schematic; Python standard library only.

The streamfunction gives an incompressible, wall-tangent illustrative field.
It is not a momentum-equation solution or a thermal simulation.
"""
from pathlib import Path
from html import escape
import json
import math

ROOT = Path(__file__).resolve().parent
ASSET = ROOT.parents[2] / 'public/images/columns/electron-fluid/figure-5-drive-response.svg'
TEAL, WALL, BG = '#286b8a', '#8aa4ac', '#f1f5f3'
WARM = '#c2854c'
CY, EXTENT = 600.0, 310.0
LEVELS = (-0.74, -0.37, 0.0, 0.37, 0.74)
parts = []


def half_width(x):
    return 150.0 - 90.0 * math.exp(-(x / 125.0) ** 2)


def width_derivative(x):
    return 180.0 * x / 125.0 ** 2 * math.exp(-(x / 125.0) ** 2)


def field(x, y):
    h = half_width(x)
    s = y / h
    vx = (1.0 - s * s) / h
    return vx, vx * s * width_derivative(x)


def points(center, level, start=-EXTENT, end=EXTENT, n=240):
    return [(center + x, CY + level * half_width(x))
            for x in (start + (end - start) * i / n for i in range(n + 1))]


def path(coords, **attrs):
    d = 'M' + ' L'.join(f'{x:.4f},{y:.4f}' for x, y in coords)
    attributes = ' '.join(f'{key.replace("_", "-")}="{value}"' for key, value in attrs.items())
    return f'<path d="{d}" {attributes}/>'


def arrowhead(x, y, dx=1.0, dy=0.0, size=13.0, color=TEAL):
    norm = math.hypot(dx, dy)
    ux, uy = dx / norm, dy / norm
    back_x, back_y = x - size * ux, y - size * uy
    coords = [(x, y), (back_x - size * 0.42 * uy, back_y + size * 0.42 * ux),
              (back_x + size * 0.42 * uy, back_y - size * 0.42 * ux)]
    return '<polygon points="' + ' '.join(f'{px:.4f},{py:.4f}' for px, py in coords) + f'" fill="{color}"/>'


def label(x, y, text, color='#385663', size=40):
    parts.append(f'<text x="{x}" y="{y}" text-anchor="middle" '
                 f'font-size="{size}" font-weight="500" fill="{color}">{escape(text)}</text>')


parts.append(f'<rect width="1600" height="900" fill="{BG}"/>')
label(800, 122, 'Stronger drive', size=42)
parts.append('<g id="possible-pathways" fill="none" stroke="#9aaeb3" stroke-width="3.5" stroke-linecap="round">')
parts.append('<path d="M800 156 V190 M400 219 V190 H1200 V219"/>')
parts.append('</g>')
for center in (400, 1200):
    parts.append(arrowhead(center, 232, 0, 1, 15, '#9aaeb3'))
label(400, 306, 'Flow acceleration')
label(1200, 306, 'Electron heating')

for case, center in enumerate((400, 1200)):
    top, bottom = points(center, -1), points(center, 1)
    polygon = top + list(reversed(bottom))
    fill = 'url(#cool-channel)' if case == 0 else 'url(#warm-channel)'
    parts.append(f'<g id="channel-{case}">')
    parts.append(path(polygon + [polygon[0]], fill=fill, stroke='none'))
    parts.append(path(top, fill='none', stroke=WALL, stroke_width=4, stroke_linecap='round'))
    parts.append(path(bottom, fill='none', stroke=WALL, stroke_width=4, stroke_linecap='round'))
    parts.append('</g>')
    parts.append(f'<g id="current-{case}" fill="none" stroke="{TEAL}" stroke-width="4" stroke-linecap="round">')
    for level in LEVELS:
        parts.append(path(points(center, level), fill='none', data_level=level))
    parts.append('</g>')
    # Centerline arrow length is proportional to local axial current density.
    parts.append(f'<g id="speed-arrows-{case}" stroke="{TEAL}" stroke-width="6" stroke-linecap="round">')
    for x in (-195.0, 0.0, 195.0):
        length = 6300.0 / half_width(x)
        head_x = center + x + length / 2
        parts.append(f'<path d="M{center+x-length/2:.4f},{CY} H{head_x-11:.4f}" fill="none" data-center="{x}" data-length="{length:.6f}"/>')
        parts.append(arrowhead(head_x, CY, size=15))
    parts.append('</g>')
    # Smaller arrowheads supply the direction of the remaining streamlines.
    parts.append(f'<g id="streamline-arrows-{case}">')
    for level in (LEVELS[0], LEVELS[1], LEVELS[3], LEVELS[4]):
        x = 93.0
        y = level * half_width(x)
        vx, vy = field(x, y)
        parts.append(arrowhead(center+x, CY+y, vx, vy, 12))
    parts.append('</g>')

# Symbolic thermometer: no measured temperature or thermal map is implied.
parts.append(f'<g id="heating-symbol" stroke="{WARM}" stroke-linecap="round" stroke-linejoin="round">')
parts.append(f'<path d="M1188 423 V365 A12 12 0 0 1 1212 365 V423 A23 23 0 1 1 1188 423Z" fill="{BG}" stroke-width="4"/>')
parts.append(f'<path d="M1200 378 V438" fill="none" stroke-width="7"/>')
parts.append(f'<circle cx="1200" cy="441" r="13" fill="{WARM}" stroke="none"/>')
parts.append('<path d="M1225 370 H1236 M1225 387 H1236 M1225 404 H1236" fill="none" stroke-width="3"/>')
parts.append('</g>')

definitions = '''<defs>
  <linearGradient id="cool-channel" x1="0" y1="450" x2="0" y2="750" gradientUnits="userSpaceOnUse">
    <stop stop-color="#eaf1f2"/><stop offset=".5" stop-color="#d7e9ec"/><stop offset="1" stop-color="#eaf1f2"/>
  </linearGradient>
  <linearGradient id="warm-channel" x1="0" y1="450" x2="0" y2="750" gradientUnits="userSpaceOnUse">
    <stop stop-color="#f1e9df"/><stop offset=".5" stop-color="#e9d9c4"/><stop offset="1" stop-color="#f1e9df"/>
  </linearGradient>
</defs>'''
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" fill="none">\n'
       '<title>Flow acceleration and electron heating under stronger drive</title>\n'
       '<desc>Two possible and coexisting changes under stronger electrical drive. '
       'Both panels show the same smooth constriction and orderly illustrative current streamlines. '
       'Longer centerline arrows mark larger axial current density in the narrow region. '
       'A warm decorative fill and a thermometer symbolize electron heating, not a temperature map. '
       'Arrows indicate conventional current, opposite to mean electron motion. '
       'No nonlinear current-voltage curve or turbulence is implied.</desc>\n'
       + definitions + '\n<g font-family="Segoe UI, Arial, sans-serif">\n'
       + '\n'.join(parts) + '\n</g>\n</svg>\n')
ASSET.write_text(svg, encoding='utf-8')

# Physical checks on the illustrative field, independent of artwork styling.
flux = []
divergence = []
for x in (-300.0, -150.0, 0.0, 150.0, 300.0):
    h = half_width(x)
    n = 1000
    dy = 2 * h / n
    flux.append(sum((field(x, -h + i * dy)[0] + field(x, -h + (i+1) * dy)[0]) * dy / 2
                    for i in range(n)))
    for s in (-0.8, -0.4, 0.0, 0.4, 0.8):
        y, eps = s * h, 0.001
        dvx = (field(x+eps, y)[0] - field(x-eps, y)[0]) / (2*eps)
        dvy = (field(x, y+eps)[1] - field(x, y-eps)[1]) / (2*eps)
        divergence.append(abs(dvx+dvy))
assert max(flux)-min(flux) < 1e-12
assert max(divergence) < 1e-10
assert all(field(x, sign*half_width(x)) == (0.0, 0.0)
           for x in (-300.0, 0.0, 300.0) for sign in (-1, 1))
validation = {
    'model': 'Illustrative streamfunction, not a solved momentum or thermal field',
    'flux_spread': max(flux)-min(flux),
    'max_finite_difference_divergence': max(divergence),
    'wall_current_density_zero': True,
    'minimum_half_width': half_width(0),
    'center_to_wide_axial_current_density_ratio': half_width(195)/half_width(0),
    'arrow_convention': 'Conventional current; mean electron motion is opposite',
    'thermal_map': False,
    'visible_labels': ['Stronger drive', 'Flow acceleration', 'Electron heating'],
}
(ROOT/'validation.json').write_text(json.dumps(validation, indent=2)+'\n', encoding='utf-8')
print(json.dumps(validation, indent=2))
