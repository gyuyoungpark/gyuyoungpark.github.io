"""Check serialized arrow geometry independently of the SVG generator."""
from pathlib import Path
import json
import math
import re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent
ns='{http://www.w3.org/2000/svg}'
svg=ET.parse(ROOT/'figure-3.svg').getroot()
group=next(g for g in svg.iter(ns+'g') if g.get('id')=='arrows')
children=list(group)
vectors=[]
for i,node in enumerate(children):
    if node.tag==ns+'path' and node.get('stroke-width')=='4.5':
        coords=[float(n) for n in re.findall(r'-?\d+(?:\.\d+)?',node.get('d'))]
        tip=[float(n) for n in children[i+1].get('points').split()[0].split(',')]
        vectors.append({'tail':coords[:2],'tip':tip,'length':tip[0]-coords[0]})
assert len(vectors)==18
circles=[c for c in children if c.tag==ns+'circle']
assert len(circles)==20  # Two ballistic symbols and one per continuum arrow.
flow_circles=[c for c in circles if float(c.get('cx'))>600]
assert len(flow_circles)==18
errors=[]
wall_clearances=[]
for row in vectors:
    left,height,ratio=(600,258,.2) if row['tail'][0]<1000 else (1100,420,12)
    s=(430-row['tail'][1])/height
    expected=310*(math.cosh(ratio/2)-math.cosh(ratio*s))/(math.cosh(ratio/2)-1)
    errors.append(abs(row['length']-expected))
    assert row['tip'][1]==row['tail'][1]
    assert left<row['tail'][0]<row['tip'][0]<left+400
    assert abs(s)<.5
    matches=[c for c in flow_circles
             if float(c.get('cy'))==row['tail'][1]
             and row['tail'][0]<float(c.get('cx'))<row['tip'][0]]
    assert len(matches)==1
    c=matches[0]
    radius=float(c.get('r'))+float(c.get('stroke-width'))/2
    assert abs(float(c.get('cx'))-(row['tail'][0]+.4*row['length']))<1e-5
    assert float(c.get('cx'))-radius>row['tail'][0]
    assert float(c.get('cx'))+radius<row['tip'][0]-14
    clearance=height/2-abs(float(c.get('cy'))-430)-radius-2.5
    assert clearance>0
    wall_clearances.append(clearance)
symbol_clearances=[]
for i,a in enumerate(flow_circles):
    for b in flow_circles[i+1:]:
        clearance=math.hypot(float(a.get('cx'))-float(b.get('cx')),
                             float(a.get('cy'))-float(b.get('cy')))-27
        assert clearance>0
        symbol_clearances.append(clearance)
assert max(errors)<1e-5
labels=[''.join(e.itertext()) for e in svg.iter(ns+'text')]
assert labels==['Ballistic','Viscous','Bulk momentum','relaxation','Increasing W']
assert not any('schematic' in s.lower() for s in labels)
# All gradients used by horizontal arrow strokes must have a non-degenerate
# coordinate system, including when the path's bounding-box height is zero.
gradients=[g for g in svg.iter(ns+'linearGradient') if g.get('id','').startswith('speed-')]
assert len(gradients)==18
assert all(g.get('gradientUnits')=='userSpaceOnUse' for g in gradients)
data=next(g for g in svg.iter(ns+'g') if g.get('id')=='data')
assert len(list(data))==2 and all(p.get('marker-end') is None for p in data)
report={'arrow_count':len(vectors),'max_svg_arrow_length_error_pixels':max(errors),
        'flow_electron_count':len(flow_circles),'all_flow_arrows_have_one_electron':True,
        'minimum_electron_wall_clearance_pixels':min(wall_clearances),
        'minimum_electron_pair_clearance_pixels':min(symbol_clearances),
        'tolerance_pixels':1e-5,'labels':labels,'gradients_use_explicit_coordinates':True,
        'ballistic_paths_have_no_arrowheads':True,'viewBox':svg.get('viewBox')}
(ROOT/'svg-validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,indent=2))
