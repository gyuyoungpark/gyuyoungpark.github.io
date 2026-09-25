"""Rebuild the five article figures. Run solve_flow.py first for Figure 4.
Python 3.12; numpy, scipy, matplotlib, scikit-fem, triangle.
SVG + 3200 x 1800 PNG. All labels and plotted geometry are code-generated.
"""
from pathlib import Path
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, Circle, Rectangle
from matplotlib.tri import Triangulation, LinearTriInterpolator

ROOT=Path(__file__).resolve().parent
BLUE='#2563EB'; ORANGE='#D97706'; DARK='#26313b'; GRAY='#8b969f'; LIGHT='#e5eaf0'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':17,'text.color':DARK,
    'axes.labelcolor':DARK,'xtick.color':DARK,'ytick.color':DARK,
    'svg.fonttype':'path','mathtext.fontset':'dejavusans','savefig.facecolor':'white'})
VALIDATION={}

def canvas(kind='Schematic'):
    fig=plt.figure(figsize=(16,9),facecolor='white')
    ax=fig.add_axes([0,0,1,1]); ax.set(xlim=(0,16),ylim=(0,9));ax.axis('off')
    ax.text(15.4,.3,kind,ha='right',va='bottom',fontsize=12,color=GRAY)
    return fig,ax

def text(ax,x,y,s,size=18,color=DARK,weight='normal',ha='center',**kwargs):
    return ax.text(x,y,s,fontsize=size,color=color,fontweight=weight,ha=ha,va='center',**kwargs)

def arrow(ax,x,y,dx,dy,c=BLUE,lw=2.5,scale=15,**kwargs):
    a=FancyArrowPatch((x,y),(x+dx,y+dy),arrowstyle='-|>',mutation_scale=scale,
        color=c,lw=lw,shrinkA=0,shrinkB=0,**kwargs);ax.add_patch(a);return a

def line(ax,x,y,c=GRAY,lw=2,**kwargs): ax.plot(x,y,color=c,lw=lw,**kwargs)
def dot(ax,x,y,c=BLUE,r=.065): ax.add_patch(Circle((x,y),r,color=c,zorder=4))
def save(fig,n):
    fig.savefig(ROOT/f'figure-{n}.svg')
    fig.savefig(ROOT/f'figure-{n}.png',dpi=200)
    plt.close(fig)

def figure1():
    fig,ax=canvas()
    text(ax,4.05,8.15,'Momentum redistribution',23,weight='bold')
    text(ax,4.05,7.55,'Normal electron–electron scattering',16,color=GRAY)
    text(ax,12,8.15,'Momentum relaxation',23,weight='bold')
    text(ax,12,7.55,'Scattering from the environment',16,color=GRAY)
    line(ax,[8,8],[1.25,8.4],LIGHT,1)
    pre=np.array([[2,1],[2,-1.]])
    post=np.array([[3,0],[1,0.]])
    scale=.52
    for x,label,vectors,prime in [(1.3,'Before',pre,''),(4.9,'After',post,"'")]:
        text(ax,x+.9,6.7,label,17,color=GRAY)
        for i,(v,y) in enumerate(zip(vectors,[5.55,3.9])):
            dot(ax,x,y); arrow(ax,x,y,*(v*scale))
            text(ax,x-.25,y,rf'$p_{i+1}{prime}$',18,ha='right')
        arrow(ax,x,2.65,4*scale,0,lw=3)
    text(ax,4.05,1.75,r'$p_1+p_2=p_1^{\prime}+p_2^{\prime}$',23)
    text(ax,4.05,.95,'Electronic momentum conserved',18,BLUE,weight='bold')
    origin=np.array([10.15,4.15]); vin=np.array([2.8,0]); vout=2.8*np.array([2**-.5,2**-.5])
    dot(ax,*origin)
    arrow(ax,*origin,*vin); arrow(ax,*origin,*vout)
    text(ax,11.65,3.72,r'$p_{\rm in}$',20,color=BLUE)
    text(ax,10.72,5.75,r'$p_{\rm out}$',20,color=BLUE)
    arrow(ax,*(origin+vout),*(vin-vout),c=ORANGE)
    text(ax,14.05,5.3,'Momentum\ntransferred\nto lattice',16,color=ORANGE)
    for x in np.linspace(10.4,14.2,7):
        for y in [2.25,2.65,3.05]: dot(ax,x,y,c='#c7ced4',r=.045)
    ax.add_patch(Rectangle((12.25,2.5),.25,.25,angle=45,color=ORANGE))
    text(ax,12,1.65,r'$\Delta p_{\rm lattice}=p_{\rm in}-p_{\rm out}$',21)
    text(ax,12,.95,'Electronic momentum transferred',18,ORANGE,weight='bold')
    VALIDATION['figure1']={'momentum_sum_error':float(np.max(abs(pre.sum(0)-post.sum(0)))),
        'equal_speed_error':float(abs(np.linalg.norm(vin)-np.linalg.norm(vout))),
        'environment_balance_error':float(np.linalg.norm(vout+(vin-vout)-vin))}
    save(fig,1)

def figure2():
    fig,ax=canvas('Analytic model')
    text(ax,4.4,8.1,'Flow in a straight channel',23,weight='bold')
    text(ax,12.1,8.1,'Cross-channel profile',23,weight='bold')
    ymin,ymax=2.5,6.55
    line(ax,[1.65,7.8],[ymin,ymin],DARK,3);line(ax,[1.65,7.8],[ymax,ymax],DARK,3)
    for s in np.linspace(-.5,.5,11):
        f=1-4*s*s
        if f>1e-12: arrow(ax,2,4.525+s*4.05,4.65*f,0,lw=2.5)
    ax.add_patch(FancyArrowPatch((1.12,ymin),(1.12,ymax),arrowstyle='<->',mutation_scale=13,color=GRAY,lw=1.5))
    text(ax,.78,4.525,r'$W$',20)
    text(ax,5.4,6.97,'No-slip boundary',16,color=GRAY)
    text(ax,4.5,2.08,'Maximum current density at the centre',15,color=BLUE)
    arrow(ax,7.15,1.83,.6,0,c=GRAY,lw=1.2,scale=10);arrow(ax,7.15,1.83,0,.45,c=GRAY,lw=1.2,scale=10)
    text(ax,7.95,1.83,r'$x$',15);text(ax,7.15,2.45,r'$y$',15)
    plot=fig.add_axes([.60,.29,.31,.43])
    s=np.linspace(-.5,.5,1001);f=1-4*s*s
    plot.plot(s,f,c=BLUE,lw=3)
    plot.set(xlim=(-.5,.5),ylim=(0,1.08),xlabel=r'$y/W$',ylabel=r'$j_x/j_{\max}$')
    plot.set_xticks([-.5,0,.5],[r'$-1/2$','0',r'$+1/2$']);plot.set_yticks([0,1])
    for side in ['top','right']:plot.spines[side].set_visible(False)
    plot.spines['bottom'].set_color(GRAY);plot.spines['left'].set_color(GRAY)
    plot.tick_params(labelsize=17)
    text(ax,12.1,7.05,'Ideal Poiseuille profile',16,color=BLUE)
    text(ax,12.1,1.68,r'$j_x/j_{\max}=1-4(y/W)^2$',21)
    text(ax,8,.95,'Uniform density • No slip • Weak bulk momentum loss',18)
    text(ax,8,.48,'Blue arrows: conventional current',13,color=GRAY)
    mean=float(np.trapezoid(f,s))
    VALIDATION['figure2']={'endpoint_error':float(max(abs(f[0]),abs(f[-1]))),'centre_error':float(abs(f[500]-1)),
        'symmetry_error':float(max(abs(f-f[::-1]))),'minimum':float(min(f)),
        'mean':mean,'mean_error':abs(mean-2/3),'integration_tolerance':1e-6}
    assert abs(mean-2/3)<1e-6
    save(fig,2)

def figure3():
    fig,ax=canvas('Schematic • Not to scale')
    text(ax,8,8.3,r'Fixed material and boundary properties • $\ell_{ee}\ll D_\nu$',18)
    centers=[2.9,8,13.1]
    labels=['Ballistic','Viscous-dominated','Ohmic /\nbulk-relaxation-dominated']
    conditions=[r'$W\ll\ell_{ee}$',r'$\ell_{ee}\ll W\ll D_\nu$',r'$W\gg D_\nu$']
    notes=['Individual trajectories matter','Collective momentum transfer','Bulk momentum loss dominates']
    for i,x in enumerate(centers):
        text(ax,x,7.32,labels[i],21 if i<2 else 18,weight='bold')
        text(ax,x,6.56,conditions[i],22,color=BLUE)
        text(ax,x,5.88,notes[i],14,color=GRAY)
        height=[.62,1.24,1.95][i];base=4.2
        line(ax,[x-1.7,x+1.7],[base-height/2]*2,DARK,2.4)
        line(ax,[x-1.7,x+1.7],[base+height/2]*2,DARK,2.4)
        if i==0:
            line(ax,np.linspace(x-1.6,x+1.6,7),base+np.array([-.15,.31,-.31,.31,-.31,.31,-.1]),GRAY,1.5,ls='--')
            line(ax,[x-1.6,x-.65,x+.3,x+1.6],[base+.1,base-.31,base+.31,base-.1],GRAY,1,ls='--')
        else:
            for s in np.linspace(-.45,.45,9):
                f=(1-4*s*s) if i==1 else (1-np.cosh(12*s)/np.cosh(6))/(1-1/np.cosh(6))
                arrow(ax,x-1.45,base+s*height,2.75*f,0,lw=1.8,scale=10)
    for x in [5.45,10.55]:
        for off in np.linspace(-.32,.32,20): ax.add_patch(Rectangle((x+off,3.05),.04,4.7,color=LIGHT,alpha=.045,lw=0))
    arrow(ax,.9,2.62,14.2,0,c=GRAY,lw=2)
    text(ax,8,2.21,r'Increasing channel width $W$',20,weight='bold')
    text(ax,5.45,2.96,r'$\ell_{ee}$',16,color=GRAY);text(ax,10.55,2.96,r'$D_\nu$',16,color=GRAY)
    text(ax,13.8,2.15,r'$D_\nu=\sqrt{\nu\tau_{\rm mr}}$',17)
    ax.add_patch(Rectangle((.8,1.05),14.4,.64,color='#eef3fc',lw=0))
    text(ax,8,1.37,'Linear response is possible in all three regimes',20,color=BLUE)
    text(ax,8,.69,'Nonlinearity depends separately on driving conditions',15,color=GRAY)
    save(fig,3)

def figure4():
    fig,ax=canvas('Numerical model')
    text(ax,4.15,8.25,'Steady vortex',23,weight='bold')
    text(ax,11.9,8.25,'Open cavity flow',23,weight='bold')
    text(ax,4.15,7.68,'Smaller cavity and opening',16,color=GRAY)
    text(ax,11.9,7.68,'Larger cavity and opening',16,color=GRAY)
    for k,R in enumerate([.4,1.]):
        z=np.load(ROOT/'flow-data'/f'R{R:g}-h0.0225.npz')
        p,t,psi=z['p'],z['t'],z['psi'];Q=float(z['Q']);D=float(z['D'])
        tri=Triangulation(*p,t.T)
        panel=fig.add_axes([.045+k*.485,.25,.445,.52]);panel.set_aspect('equal');panel.axis('off')
        panel.set(xlim=(-2.3,2.3),ylim=(-.28,3.06))
        levels=np.r_[Q*np.array([.12,.3,.5,.7,.86,.94,.98,.993,.998])]
        excess=psi.max()-Q
        if excess>1e-6: levels=np.r_[levels,Q+excess*np.array([.18,.4,.65,.86])]
        contours=panel.tricontour(tri,psi,levels=levels,colors=BLUE,linewidths=1.4)
        # Direction arrows are tangent to computed contours, oriented using FEM j.
        ix=LinearTriInterpolator(tri,z['j'][0]);iy=LinearTriInterpolator(tri,z['j'][1])
        for level,segs in zip(levels,contours.allsegs):
            for seg in segs:
                inside=seg[(abs(seg[:,0])<1.9)&(seg[:,1]>.03)]
                if len(inside)<8:continue
                if level<Q and level/Q>.985 and R==.4:continue
                idx=len(inside)//2;v=inside[idx]
                tangent=inside[min(idx+2,len(inside)-1)]-inside[max(idx-2,0)]
                jv=np.array([float(ix(*v)),float(iy(*v))])
                if np.dot(tangent,jv)<0:tangent=-tangent
                length=np.linalg.norm(tangent)
                if length>0:
                    tangent=tangent/length*(.055 if level>Q else .09)
                    arrow(panel,*(v-tangent*.5),*tangent,lw=1.1,scale=8)
        polygon=z['polygon']
        line(panel,np.r_[polygon[:,0],polygon[0,0]],np.r_[polygon[:,1],polygon[0,1]],DARK,2.2)
        panel.plot([1.6,1.6+D],[-.17,-.17],c=GRAY,lw=2.5)
        panel.text(1.6+D/2,-.28,r'$D_\nu$',ha='center',va='top',fontsize=13,color=GRAY)
        text(ax,4.15+k*7.75,1.72,rf'$R/W={R:g}\quad a/W={float(z["a"]):g}\quad D_\nu/W=0.25$',17)
    text(ax,8,1.08,r'Same $D_\nu$ • Same channel width • Linear response',18)
    text(ax,8,.59,'A steady vortex does not imply turbulence',15,color=GRAY)
    save(fig,4)

def figure5():
    fig,ax=canvas()
    text(ax,8,8.2,'Stronger electrical drive',24,weight='bold')
    line(ax,[8,8],[7.79,7.47],GRAY,1.7)
    for x,c in [(4,BLUE),(12,ORANGE)]:
        line(ax,[8,x],[7.47,7.47],c,1.7);arrow(ax,x,7.47,0,-.38,c=c,lw=1.7)
    text(ax,4,6.7,'Flow dynamics',24,BLUE,weight='bold')
    text(ax,12,6.7,'Electron heating',24,ORANGE,weight='bold')
    text(ax,4,6.04,'Faster drift',19);text(ax,12,6.04,'Joule heating',19)
    arrow(ax,4,5.73,0,-.34,lw=1.5);arrow(ax,12,5.73,0,-.34,c=ORANGE,lw=1.5)
    text(ax,4,5.03,'Convective acceleration',19)
    text(ax,12,5.03,r'Higher electron temperature $T_e$',19)
    # Constriction: analytic positive width; current arrows are directed right.
    x=np.linspace(1.8,6.2,301);half=.48-.3*np.exp(-((x-4)/.67)**2)
    line(ax,x,3.8+half,DARK,2.3);line(ax,x,3.8-half,DARK,2.3)
    for xpos,dx in [(2.2,.55),(3.6,.85),(5.3,.55)]: arrow(ax,xpos,3.8,dx,0,lw=2)
    text(ax,4,2.94,r'$(\mathbf{u}\cdot\nabla)\mathbf{u}$',23,color=BLUE)
    # Small symbolic thermometer: no temperatures or simulated thermal map.
    ax.add_patch(Circle((12,3.46),.19,color=ORANGE))
    ax.add_patch(Rectangle((11.91,3.46),.18,.7,ec=ORANGE,fc='white',lw=2))
    line(ax,[12,12],[3.5,3.96],ORANGE,3)
    text(ax,12,2.94,r'$\tau_{ee},\ \tau_{\rm mr},\ \nu$',23,color=ORANGE)
    text(ax,8,4.14,'Both can\noccur together',15,color=GRAY)
    text(ax,4,2.24,'Possible nonlinear response',19,color=BLUE)
    text(ax,12,2.24,'Changed scattering and viscosity',19,color=ORANGE)
    for x,c in [(4,BLUE),(12,ORANGE)]:
        line(ax,[x,x,8],[1.96,1.5,1.5],c,1.6)
    arrow(ax,8,1.5,0,-.35,c=GRAY,lw=1.5)
    text(ax,8,.84,'A nonlinear I–V curve alone does not identify the cause.',21,weight='bold')
    text(ax,4,.28,r'$\mathbf{u}$: electron drift • Blue arrows: conventional current',11,color=GRAY)
    save(fig,5)

if __name__=='__main__':
    figure1();figure2();figure3();figure4();figure5()
    (ROOT/'analytic-validation.json').write_text(json.dumps(VALIDATION,indent=2))
    print(json.dumps(VALIDATION,indent=2))
