"""Independent checks of Figure 1's serialized SVG and scattering momenta.

Run after make_figure1.py. Uses only the Python standard library.
"""
from pathlib import Path
import json
import math
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
NS = '{http://www.w3.org/2000/svg}'
svg = ET.parse(ROOT/'figure-1.svg').getroot()
labels = [''.join(e.itertext()) for e in svg.iter(NS+'text')]
assert not any('schematic' in s.lower() for s in labels)
arrows = next(g for g in svg.iter(NS+'g') if g.get('id')=='arrows')
children = list(arrows)
drawn = []
for i,node in enumerate(children):
    if node.tag==NS+'path' and node.get('stroke-width')=='5.5':
        numbers = [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?',node.get('d'))]
        tail = numbers[:2]
        head = children[i+1]
        assert head.tag==NS+'polygon'
        tip = [float(n) for n in head.get('points').split()[0].split(',')]
        drawn.append([(tip[0]-tail[0])/58, -(tip[1]-tail[1])/58])

expected = [[2,0],[1,math.sqrt(3)],[1,-math.sqrt(3)],[4,0],[4,0]]
assert len(drawn)==5
svg_error = max(abs(x-y) for p,q in zip(drawn,expected) for x,y in zip(p,q))
assert svg_error<1e-6  # SVG coordinates rounded to five decimals.
balance = math.hypot(*(drawn[0][j]-drawn[1][j]-drawn[2][j] for j in range(2)))
assert balance<1e-6
ee_balance = math.hypot(*(drawn[3][j]-drawn[4][j] for j in range(2)))
assert ee_balance<1e-6

def rotate(v,angle):
    c,s=math.cos(angle),math.sin(angle)
    return [c*v[0]-s*v[1],s*v[0]+c*v[1]]

# Recompute limiting velocities from the orbit equations without importing
# the generator or trusting its declared before/after vectors.
def nucleus_velocity(u):
    den=2*math.cosh(u)-1
    return rotate([-2*math.sinh(u)/den,2*math.sqrt(3)*math.cosh(u)/den],-math.pi/3)

def pair_velocity(u):
    den=math.sqrt(2)*math.cosh(u)+1
    rel=rotate([2*math.sinh(u)/den,2*math.cosh(u)/den],-math.pi/4)
    return [[2+rel[0]/2,rel[1]/2],[2-rel[0]/2,-rel[1]/2]]

nuclear_limits=[nucleus_velocity(-24),nucleus_velocity(24)]
ee_limits=[pair_velocity(-24),pair_velocity(24)]
nuclear_limit_error=max(abs(x-y) for p,q in zip(nuclear_limits,expected[:2]) for x,y in zip(p,q))
ee_expected=[[[2,1],[2,-1]],[[3,0],[1,0]]]
ee_limit_error=max(abs(x-y) for p,q in zip(ee_limits,ee_expected) for a,b in zip(p,q) for x,y in zip(a,b))
assert nuclear_limit_error<1e-9 and ee_limit_error<1e-9
energies=[sum(x*x for p in state for x in p)/2 for state in ee_expected]
assert energies==[5,5]

# Finite-mass countercheck: identical electron momentum magnitudes are NOT
# exact if a finite, initially stationary free nucleus gains recoil energy.
# Arbitrary example mass ratio (not assigned to any actual material).
M=2000.; p0=2.; angle=math.pi/3
q=p0*(math.cos(angle)+math.sqrt(M*M-math.sin(angle)**2))/(M+1)
recoil_squared=p0*p0+q*q-2*p0*q*math.cos(angle)
finite_energy_residual=abs(p0*p0/2-q*q/2-recoil_squared/(2*M))
assert q<p0 and finite_energy_residual<1e-12
report={
    'schematic_label_absent':True,
    'svg_extracted_momenta':drawn,
    'svg_vector_max_error':svg_error,
    'svg_nuclear_momentum_balance_error':balance,
    'svg_pair_momentum_balance_error':ee_balance,
    'analytic_nuclear_velocities_at_u_plus_minus_24':nuclear_limits,
    'analytic_pair_velocities_at_u_plus_minus_24':ee_limits,
    'nuclear_asymptote_max_error':nuclear_limit_error,
    'pair_asymptote_max_error':ee_limit_error,
    'pair_asymptotic_energy_before_after':energies,
    'nuclear_electron_momentum_magnitude_before_after':[2,2],
    'nuclear_electron_flow_direction_component_before_after':[2,1],
    'orange_vector_meaning':'Momentum gained by nucleus; negative of electron momentum change.',
    'finite_mass_crosscheck':{'illustrative_mass_ratio':M,'outgoing_electron_momentum_magnitude':q,
        'exact_energy_balance_residual':finite_energy_residual,
        'note':'Not the mass ratio used in the drawing; demonstrates why equal magnitudes require the heavy-target limit.'},
}
(ROOT/'momentum-audit.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,indent=2))
