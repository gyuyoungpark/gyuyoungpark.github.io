"""Editable Figure 1: thumbnail palette, analytic Coulomb trajectories.

Run: python make_figure1.py
Requires NumPy. All coordinates, momenta, and trajectories remain editable.
"""
from pathlib import Path
from html import escape
import json
import math
import numpy as np

ROOT = Path(__file__).resolve().parent
TEAL, PALE, ORANGE = '#286b8a', '#b8cfd4', '#bd8650'
groups = {key: [] for key in ('geometry', 'data', 'arrows', 'labels')}


def add(s, group='geometry'):
    groups[group].append(s)


def path(points, stroke, width=4, group='data', opacity=1, dash=None):
    d = 'M'+' L'.join(f'{x:.5f},{y:.5f}' for x, y in points)
    extra = f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{width}" '
        f'stroke-linecap="round" stroke-linejoin="round" opacity="{opacity}"{extra}/>', group)


def arrow(a, b, color=TEAL, width=5, head=19, gradient=None):
    a, b = np.asarray(a), np.asarray(b)
    delta = b-a
    unit = delta/np.linalg.norm(delta)
    base = b-head*unit
    path([a, base], gradient or color, width, 'arrows')
    side = np.array([-unit[1], unit[0]])*head*.44
    coords = ' '.join(f'{x:.5f},{y:.5f}' for x, y in [b, base+side, base-side])
    add(f'<polygon points="{coords}" fill="{color}"/>', 'arrows')


def disc(p, r=15, positive=False):
    x, y = p
    color = ORANGE if positive else TEAL
    add(f'<circle cx="{x:.5f}" cy="{y:.5f}" r="{r}" fill="{color}" stroke="#f1f5f3" stroke-width="4"/>', 'arrows')
    h = r*.36
    path([(x-h,y),(x+h,y)], '#ffffff', 3 if positive else 2.4, 'arrows')
    if positive:
        path([(x,y-h),(x,y+h)], '#ffffff', 3, 'arrows')


def text(x,y,s,size=33,color='#385663',anchor='middle'):
    add(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" '
        f'text-anchor="{anchor}">{escape(s)}</text>', 'labels')


def rotation(angle):
    c,s = np.cos(angle), np.sin(angle)
    return np.array([[c,-s],[s,c]])


def screen(xy, origin, scale):
    return np.asarray(origin)+scale*np.asarray(xy)*[1,-1]


# Attractive, heavy fixed nucleus: m=1, k=4, v_inf=2, a=1, e=2.
# x'(u)=2-cosh(u), y'(u)=sqrt(3)sinh(u), rotated -60 degrees.
# t(u)=(2 sinh(u)-u)/2. This is an analytic orbit, not an artistic spline.
u = np.linspace(-1.7,1.7,1201)
rot = rotation(-np.pi/3)
nuclear_xy = np.c_[2-np.cosh(u), np.sqrt(3)*np.sinh(u)] @ rot.T
nuclear_velocity = (2*np.c_[-np.sinh(u),np.sqrt(3)*np.cosh(u)] /
                    (2*np.cosh(u)-1)[:,None]) @ rot.T
nuclear_t = (2*np.sinh(u)-u)/2
nuclear_radius = np.linalg.norm(nuclear_xy,axis=1)

# Repulsive equal-mass electrons: relative reduced mass=1/2, k=2,
# v_rel,inf=2, a=1, e=sqrt(2). Center of mass travels at (2,0).
# t(u)=(sqrt(2)sinh(u)+u)/2; relative orbit rotated -45 degrees.
v = np.linspace(-1.55,1.55,1201)
rot_ee = rotation(-np.pi/4)
relative = np.c_[np.sqrt(2)+np.cosh(v),np.sinh(v)] @ rot_ee.T
relative_velocity = (2*np.c_[np.sinh(v),np.cosh(v)] /
                     (np.sqrt(2)*np.cosh(v)+1)[:,None]) @ rot_ee.T
ee_t = (np.sqrt(2)*np.sinh(v)+v)/2
com = np.c_[2*ee_t,np.zeros(len(v))]
electron_xy = [com+relative/2,com-relative/2]
electron_velocity = [np.array([2.,0])+relative_velocity/2,
                     np.array([2.,0])-relative_velocity/2]

# Soft bands echo the thumbnail's channel fill; their width has no data meaning.
nuclear_curve = screen(nuclear_xy,(393,427),66)
ee_curves = [screen(a,(1170,410),51) for a in electron_xy]
for curve in [nuclear_curve,*ee_curves]:
    path(curve,'#dfebeb',42,'geometry',.67)

# Atom core is a single positive center, not a periodic crystal model.
# The incoming asymptote guide was removed for a cleaner trajectory scene.
origin=np.array([393.,427.]); s=66
disc(origin,31,positive=True)

for name,curve in [('nuclear',nuclear_curve),('ee1',ee_curves[0]),('ee2',ee_curves[1])]:
    path(curve,f'url(#{name}-flow)',5,'data')
    # Short terminal tangent arrow: encodes direction only, not momentum magnitude.
    tangent=curve[-1]-curve[-2]
    tangent=tangent/np.linalg.norm(tangent)
    arrow(curve[-1]-tangent*33,curve[-1]+tangent*7,width=5,head=19)

# One electron in the nuclear scene, two at the same time in the e-e scene.
disc(nuclear_curve[455],17)
for curve in ee_curves:
    disc(curve[len(v)//2],17)

text(405,133,'Nuclear scattering',36)
text(1200,133,'Electron–electron scattering',36)

# Asymptotic momentum comparisons. Every vector uses 58 px / momentum unit.
# Only these straight lower arrows encode momentum magnitude.
scale=58.
before=np.array([[2.,1.],[2.,-1.]])
after=np.array([[3.,0.],[1.,0.]])
pin=np.array([2.,0.]); pout=np.array([1.,np.sqrt(3)])
transfer=pin-pout

def momentum(origin,p,color=TEAL):
    end=np.asarray(origin)+scale*np.asarray(p)*[1,-1]
    arrow(origin,end,color,width=5.5,head=18)
    return end

text(210,623,'Before',28,color='#728d98')
text(512,623,'After',28,color='#728d98')
text(994,623,'Before',28,color='#728d98')
text(1341,623,'After',28,color='#728d98')
momentum((152,754),pin)
tip=momentum((454,754),pout)
momentum(tip,transfer,ORANGE)
path([(454,754),(570,754)],PALE,2,'geometry',1,'4 9')
momentum((878,754),before.sum(axis=0))
momentum((1225,754),after.sum(axis=0))
text(362,765,'→',30,color='#9bb2b8')
text(1169,765,'=',30,color='#9bb2b8')

# Independent physics checks: energy, total momentum, force law and asymptotes.
nuclear_energy=np.sum(nuclear_velocity**2,axis=1)/2-4/nuclear_radius
ee_total=electron_velocity[0]+electron_velocity[1]
ee_energy=(np.sum(electron_velocity[0]**2,axis=1)+
           np.sum(electron_velocity[1]**2,axis=1))/2+2/np.linalg.norm(relative,axis=1)
nuclear_acc=np.gradient(nuclear_velocity,nuclear_t,axis=0,edge_order=2)
nuclear_force=-4*nuclear_xy/nuclear_radius[:,None]**3
ee_rel_acc=np.gradient(relative_velocity,ee_t,axis=0,edge_order=2)
ee_rel_force=4*relative/np.linalg.norm(relative,axis=1)[:,None]**3
report={
    'panel_order':['nuclear scattering','electron-electron scattering'],
    'nuclear_energy_max_error':float(np.max(abs(nuclear_energy-2))),
    'nuclear_relative_force_residual_max':float(np.max(np.linalg.norm(nuclear_acc-nuclear_force,axis=1)/np.linalg.norm(nuclear_force,axis=1))),
    'ee_energy_max_error':float(np.max(abs(ee_energy-5))),
    'ee_total_momentum_max_error':float(np.max(abs(ee_total-[4,0]))),
    'ee_relative_force_residual_max':float(np.max(np.linalg.norm(ee_rel_acc-ee_rel_force,axis=1)/np.linalg.norm(ee_rel_force,axis=1))),
    'momentum_before':before.tolist(),'momentum_after':after.tolist(),
    'nuclear_incoming':pin.tolist(),'nuclear_outgoing':pout.tolist(),'nucleus_recoil_momentum':transfer.tolist(),
    'nuclear_momentum_balance_error':float(np.linalg.norm(pin-pout-transfer)),
    'ee_momentum_balance_error':float(np.linalg.norm(before.sum(0)-after.sum(0))),
    'ee_asymptotic_kinetic_energy_error':float(abs(np.sum(before**2)-np.sum(after**2))/2),
    'momentum_scale_pixels_per_unit':scale,
    'display_y_sign':-1,
    'curve_samples':len(u),
    'assumptions':['Classical unscreened two-body Coulomb model; not material-specific.',
                   'Heavy nucleus fixed in orbit calculation; momentum transfer retained in lower vector diagram.',
                   'Lower momenta are asymptotic, not local velocities at the finite path endpoints.',
                   'Broad pale strokes are visual guides, not uncertainty bands or interaction boundaries.',
                   'Electron and nucleus disc radii are symbolic, not physical sizes.'],
}
for key in ['nuclear_energy_max_error','ee_energy_max_error','ee_total_momentum_max_error',
            'nuclear_momentum_balance_error','ee_momentum_balance_error','ee_asymptotic_kinetic_energy_error']:
    assert report[key]<1e-12,(key,report[key])
for key in ['nuclear_relative_force_residual_max','ee_relative_force_residual_max']:
    assert report[key]<1e-4,(key,report[key])

gradients=[]
for name,curve in [('nuclear',nuclear_curve),('ee1',ee_curves[0]),('ee2',ee_curves[1])]:
    a,b=curve[0],curve[-1]
    gradients.append(f'<linearGradient id="{name}-flow" x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" gradientUnits="userSpaceOnUse"><stop stop-color="#83b5c1" stop-opacity=".55"/><stop offset="1" stop-color="{TEAL}"/></linearGradient>')

content='\n'.join(f'<g id="{name}">\n'+ '\n'.join(items)+'\n</g>' for name,items in groups.items())
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-labelledby="title desc">
<title id="title">Nuclear scattering and electron–electron scattering</title>
<desc id="desc">Left: an electron bends toward a positive heavy nucleus and transfers momentum to it. Right: two electrons repel and redistribute momentum while their total momentum is conserved. Curves follow classical analytic Coulomb orbits. Lower vectors compare asymptotic momenta with a common scale.</desc>
<defs>{''.join(gradients)}</defs>
<rect width="1600" height="900" fill="#f1f5f3"/>
<g font-family="Helvetica, Arial, sans-serif" font-weight="400">{content}</g>
</svg>'''
(ROOT/'figure-1.svg').write_text(svg,encoding='utf-8')
(ROOT/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
