"""Figure 3: thumbnail-style transport regimes, with analytic velocity profiles."""
from pathlib import Path
from html import escape
import json
import numpy as np

ROOT = Path(__file__).resolve().parent
TEAL = '#286b8a'
GRAY = '#8aa4ac'
BG = '#f1f5f3'
groups = {key: [] for key in ('geometry','data','arrows','labels')}
definitions = []


def add(markup, group='geometry'):
    groups[group].append(markup)


def path(points, color, width=3, group='geometry', dash=None, opacity=1):
    d='M'+' L'.join(f'{x:.5f},{y:.5f}' for x,y in points)
    ds=f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<path d="{d}" stroke="{color}" stroke-width="{width}" fill="none" '
        f'stroke-linecap="round" stroke-linejoin="round" opacity="{opacity}"{ds}/>',group)


def text(x,y,label,size=35,color='#385663'):
    add(f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}" fill="{color}">{escape(label)}</text>','labels')


def arrow(origin, length, color=TEAL, width=5, head=15, gradient=False):
    x,y=origin
    assert length>0
    h=min(head,length*.42)
    stroke=color
    if gradient:
        name=f'speed-{len(definitions)}'
        definitions.append(f'<linearGradient id="{name}" x1="{x}" y1="{y}" x2="{x+length}" y2="{y}" gradientUnits="userSpaceOnUse"><stop stop-color="#83b5c1" stop-opacity=".50"/><stop offset="1" stop-color="{TEAL}"/></linearGradient>')
        stroke=f'url(#{name})'
    path([(x,y),(x+length-h,y)],stroke,width,'arrows')
    add(f'<polygon points="{x+length:.5f},{y:.5f} {x+length-h:.5f},{y-.46*h:.5f} '
        f'{x+length-h:.5f},{y+.46*h:.5f}" fill="{color}"/>','arrows')


def electron(x,y,r=13):
    add(f'<circle cx="{x:.5f}" cy="{y:.5f}" r="{r}" fill="{TEAL}" stroke="{BG}" stroke-width="3"/>','arrows')
    path([(x-r*.36,y),(x+r*.36,y)],'#fff',2.5,'arrows')


def channel(index,left,height):
    top,bottom=430-height/2,430+height/2
    name=f'channel-{index}'
    definitions.append(f'''<linearGradient id="{name}" x1="0" y1="{top}" x2="0" y2="{bottom}" gradientUnits="userSpaceOnUse">
    <stop stop-color="#eaf1f2"/><stop offset=".5" stop-color="#d7e9ec"/><stop offset="1" stop-color="#eaf1f2"/></linearGradient>''')
    add(f'<rect x="{left}" y="{top}" width="400" height="{height}" fill="url(#{name})"/>')
    for y in (top,bottom):
        path([(left,y),(left+400,y)],GRAY,5)
    return top,bottom


def profile(s, ratio):
    """v(y)/v(0), s=y/W, ratio=W/D_nu; no-slip walls at s=±1/2."""
    s=np.asarray(s,dtype=float)
    return (np.cosh(ratio/2)-np.cosh(ratio*s))/(np.cosh(ratio/2)-1)


heights=[124,258,420]
for i,(left,height) in enumerate(zip([100,600,1100],heights)):
    channel(i,left,height)

text(300,132,'Ballistic')
text(800,132,'Viscous')
text(1300,112,'Bulk momentum')
text(1300,153,'relaxation')

# Illustrative diffuse boundary scattering, not specular bounces and not
# a Boltzmann trajectory simulation. There are deliberately no arrowheads.
ballistic_paths=[
    np.array([[119.,410.],[249.,492.],[331.,368.],[478.,433.]]),
    np.array([[121.,463.],[184.,368.],[385.,492.],[479.,395.]])
]
for curve in ballistic_paths:
    path(curve,'#8aa4ac',3.2,'data',dash='5 9',opacity=.85)
for curve,segment,fraction in [(ballistic_paths[0],0,.43),(ballistic_paths[1],2,.60)]:
    point=curve[segment]+fraction*(curve[segment+1]-curve[segment])
    electron(*point,12)

# Resample the same analytic curves to fit a full-size electron on every row.
# Symbols remain clear of both walls and adjacent symbols.
samples=np.array([-.43,-.33,-.23,-.115,0,.115,.23,.33,.43])
ratios=[.2,12.]
arrow_max=310.
results=[]
for left,height,ratio in zip([600,1100],heights[1:],ratios):
    values=profile(samples,ratio)
    row_data=[]
    for s,f in zip(samples,values):
        y=430-height*s
        length=arrow_max*f
        x=left+42
        arrow((x,y),length,gradient=True,head=14,width=4.5)
        # Charge symbols identify electrons; arrows depict local mean drift,
        # not the microscopic trajectories of these illustrative particles.
        electron(x+.40*length,y,12)
        row_data.append({'s':float(s),'f':float(f),'tail':[x,float(y)],
                         'tip':[float(x+length),float(y)],'length':float(length),
                         'electron_center':[float(x+.40*length),float(y)],
                         'electron_radius':12})
    dense=np.linspace(-.5,.5,10001)
    f=profile(dense,ratio)
    ds=dense[1]-dense[0]
    second=(f[2:]-2*f[1:-1]+f[:-2])/(ds*ds)
    forcing=np.cosh(ratio/2)/(np.cosh(ratio/2)-1)
    residual=np.max(abs(f[1:-1]-second/(ratio*ratio)-forcing))/forcing
    numerical_mean=float(np.trapezoid(f,dense))
    exact_mean=float((np.cosh(ratio/2)-(2/ratio)*np.sinh(ratio/2))/(np.cosh(ratio/2)-1))
    # Tests cover walls, symmetry, monotonicity, mean, and a finite-difference
    # residual of v-D_nu^2 v''=constant, not just a declared plotting function.
    assert np.max(abs(profile([-.5,.5],ratio)))==0
    assert profile(0,ratio)==1
    assert f.min()>=0 and f.max()<=1
    assert np.max(abs(f-f[::-1]))<1e-11
    assert np.all(np.diff(f[5000:])<=1e-11)
    assert residual<2e-6
    assert abs(numerical_mean-exact_mean)<3e-8
    results.append({
        'W_over_Dnu':ratio,'wall_values':profile([-.5,.5],ratio).tolist(),
        'center':float(profile(0,ratio)),'symmetry_error':float(np.max(abs(f-f[::-1]))),
        'minimum':float(f.min()),'maximum':float(f.max()),
        'relative_ode_residual_finite_difference':float(residual),'ode_tolerance':2e-6,
        'numerical_mean':numerical_mean,'exact_mean':exact_mean,
        'mean_error':abs(numerical_mean-exact_mean),'mean_tolerance':3e-8,
        'parabola_max_difference':float(np.max(abs(f-(1-4*dense**2)))),
        'samples':row_data,
    })

# Width changes across the comparison; the visual heights are not a scale model.
arrow((111,724),1378,color='#9bb2b8',width=2.5,head=14)
text(800,773,'Increasing W',29,color='#728d98')

report={
    'ell_ee_over_Dnu':.001,
    'W_over_Dnu':[.00002,.2,12],
    'displayed_channel_heights':heights,
    'geometry_to_physical_scale':False,
    'profiles':results,
    'ballistic_paths':[p.tolist() for p in ballistic_paths],
    'ballistic_interpretation':'Illustrative paths with diffuse wall scattering; no directional arrowheads.',
    'vector_meaning':'Electron mean velocity, normalized separately by the center value in each continuum panel.',
    'flow_electron_count':18,
    'electron_symbol_meaning':'One illustrative electron per mean-drift arrow; positions are not simulated trajectories or density samples.',
    'all_regimes_can_be_linear':True,
    'visible_badges':False,
}
for curve in ballistic_paths:
    assert np.all((curve[:,1]>=368)&(curve[:,1]<=492))
    for j in (1,2):
        before=curve[j]-curve[j-1]
        after=curve[j+1]-curve[j]
        assert before[1]*after[1]<0
        assert not np.isclose(abs(before[1]/before[0]),abs(after[1]/after[0]))

content='\n'.join(f'<g id="{key}">\n'+ '\n'.join(items)+'\n</g>' for key,items in groups.items())
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-labelledby="title desc">
<title id="title">Electron transport as channel width increases</title>
<desc id="desc">Narrow, medium and wide channels compare ballistic paths, a viscous velocity profile and a bulk momentum relaxation profile. Each teal arrow has an electron symbol and represents normalized mean drift velocity, not an individual trajectory. The wide channel retains frequent electron-electron collisions and has a nearly uniform interior velocity with no-slip boundary layers. Channel widths are schematic, not drawn to scale. All three regimes can have linear response.</desc>
<defs>{''.join(definitions)}</defs>
<rect width="1600" height="900" fill="{BG}"/>
<g font-family="Helvetica, Arial, sans-serif" font-weight="400">{content}</g>
</svg>'''
(ROOT/'figure-3.svg').write_text(svg,encoding='utf-8')
(ROOT/'validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps({p['W_over_Dnu']:{k:v for k,v in p.items() if k!='samples'} for p in results},indent=2))
