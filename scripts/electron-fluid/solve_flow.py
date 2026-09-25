"""Taylor-Hood FEM for j - D^2 lap(j) = -grad(phi), div(j)=0.
Dimensionless W=1, sigma0=1. Prescribed fully developed current on contacts,
no-slip solid walls, one pressure gauge. No pressure penalty is used.
"""
from pathlib import Path
import json, sys
import numpy as np
import triangle
from scipy.sparse import bmat
from skfem import MeshTri, Basis, FacetBasis, Functional, ElementVector, ElementTriP2, ElementTriP1, BilinearForm, LinearForm, asm, solve, condense
from skfem.helpers import dot, ddot, grad, div
from skfem.models.poisson import laplace
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.tri import Triangulation

OUT = Path(__file__).parent / 'flow-data'
OUT.mkdir(exist_ok=True)

def profile(y, D):
    return (1 - np.cosh((y-.5)/D)/np.cosh(.5/D))/(1-1/np.cosh(.5/D))

def primitive(y, D):
    return (y-D*(np.sinh((y-.5)/D)+np.sinh(.5/D))/np.cosh(.5/D))/(1-1/np.cosh(.5/D))

def model(R, h, D=.25, a_ratio=1.5, L=10):
    a = a_ratio*R
    if R:
        d=np.sqrt(R*R-(a/2)**2); cy=1+d
        start=np.arctan2(-d,a/2)
        theta=np.linspace(start,np.pi-start,max(32,int(2*np.pi*R/h)+1))
        arc=np.c_[R*np.cos(theta),cy+R*np.sin(theta)]
        polygon=np.vstack([[-L/2,0],[L/2,0],[L/2,1],arc,[-L/2,1]])
    else:
        cy=0
        polygon=np.array([[-L/2,0],[L/2,0],[L/2,1],[-L/2,1]])
    n=len(polygon)
    m=triangle.triangulate({'vertices':polygon,'segments':np.c_[np.arange(n),np.roll(np.arange(n),-1)]}, f'pq30a{h*h/2:.8f}')
    mesh=MeshTri(m['vertices'].T,m['triangles'].T)
    u=Basis(mesh,ElementVector(ElementTriP2()),intorder=4)
    p=Basis(mesh,ElementTriP1(),intorder=4)
    s=Basis(mesh,ElementTriP2(),intorder=4)
    @BilinearForm
    def stiffness(j,v,w): return dot(j,v)+D*D*ddot(grad(j),grad(v))
    @BilinearForm
    def continuity(j,q,w): return div(j)*q
    A=asm(stiffness,u); B=asm(continuity,u,p)
    K=bmat([[A,-B.T],[-B,None]],format='csr')
    x=np.zeros(u.N+p.N)
    contacts=u.get_dofs(lambda x: np.isclose(np.abs(x[0]),L/2))
    ux=contacts.all(['u^1']); x[ux]=profile(u.doflocs[1,ux],D)
    @Functional
    def normal_flux(w): return dot(w.j,w.n)
    left=FacetBasis(mesh,u.elem,facets=mesh.facets_satisfying(lambda z:np.isclose(z[0],-L/2)),intorder=4)
    right=FacetBasis(mesh,u.elem,facets=mesh.facets_satisfying(lambda z:np.isclose(z[0],L/2)),intorder=4)
    Qin=-asm(normal_flux,left,j=left.interpolate(x[:u.N]))
    Qout=asm(normal_flux,right,j=right.interpolate(x[:u.N]))
    outlet=u.get_dofs(lambda z:np.isclose(z[0],L/2)).all(['u^1'])
    x[outlet]*=Qin/Qout  # exact discrete flux compatibility; roundoff-scale shape correction
    gauge=u.N+np.argmin(np.sum((p.doflocs-np.array([[-L/2],[0]]))**2,axis=0))
    fixed=np.r_[u.get_dofs().all(),gauge]
    solution=solve(*condense(K,np.zeros(K.shape[0]),x=x,D=fixed))
    j=solution[:u.N]; jf=u.interpolate(j)
    divergence=jf.grad[0,0]+jf.grad[1,1]
    area=np.sum(u.dx)
    div_rms=float(np.sqrt(np.sum(divergence**2*u.dx)/area))
    grad_rms=float(np.sqrt(np.sum(np.sum(jf.grad**2,axis=(0,1))*u.dx)/area))
    weak_div=float(np.max(np.abs(B@j)))
    @LinearForm
    def curl_rhs(v,w): return (jf.grad[1,0]-jf.grad[0,1])*v
    sx=np.zeros(s.N); sd=s.get_dofs().all()
    sx[sd]=primitive(np.clip(s.doflocs[1,sd],0,1),D)
    psi=solve(*condense(asm(laplace,s),asm(curl_rhs,s),x=sx,D=sd))
    # Projected streamfunction gradient compared to independently solved current.
    psif=s.interpolate(psi)
    discrepancy=(psif.grad[1]-jf[0])**2+(-psif.grad[0]-jf[1])**2
    stream_error=float(np.sqrt(np.sum(discrepancy*u.dx)/np.sum(np.sum(jf**2,axis=0)*u.dx)))
    Q=float(primitive(1,D))
    ys=np.linspace(0,1,501)
    fluxes=[]
    for xx in [-L/2,-L/2+1,L/2-1,L/2]:
        values=u.probes(np.array([np.full_like(ys,xx),ys]))@j
        fluxes.append(float(np.trapezoid(values[:len(ys)],ys)))
    walls=mesh.boundary_facets()
    mid=mesh.p[:,mesh.facets[:,walls]].mean(axis=1)
    walls=walls[~np.isclose(np.abs(mid[0]),L/2)]
    wallmax=float(np.max(np.abs(j[u.get_dofs(facets=walls).all()])))
    coarse_psi=psi[s.nodal_dofs[0]]
    cavity=mesh.p[1]>1+h
    overshoot=float(np.max(coarse_psi[cavity])-Q) if np.any(cavity) else 0
    # Closed contour evidence: contour above the top-wall streamfunction Q.
    loops=0
    if overshoot>1e-7:
        fig,ax=plt.subplots()
        c=ax.tricontour(Triangulation(*mesh.p,mesh.t.T),coarse_psi,levels=[Q+.5*overshoot])
        loops=sum(len(seg)>4 and np.linalg.norm(seg[0]-seg[-1])<1e-7 for seg in c.allsegs[0])
        plt.close(fig)
    err=None
    if R==0:
        samples=u.probes(np.array([np.zeros_like(ys),ys]))@j
        err=float(np.max(np.abs(samples[:len(ys)]-profile(ys,D))))
    report=dict(R=R,a=a,D=D,W=1,L=L,h=h,triangles=int(mesh.nelements),dofs=int(u.N+p.N),
        sigma0=1,outlet_profile_scale=float(Qin/Qout),flux_analytic=Q,fluxes=fluxes,flux_relative_spread=(max(fluxes)-min(fluxes))/Q,
        divergence_rms=div_rms,divergence_over_gradient=div_rms/grad_rms,
        weak_divergence_max=weak_div,wall_current_max=wallmax,
        streamfunction_current_relative_error=stream_error,psi_excess_over_Q=overshoot,
        closed_contours_above_wall=int(loops),straight_profile_max_error=err)
    name=f'R{R:g}-h{h:g}'
    np.savez_compressed(OUT/f'{name}.npz',p=mesh.p,t=mesh.t,j=j[u.nodal_dofs],psi=coarse_psi,polygon=polygon,Q=Q,R=R,a=a,D=D,cy=cy)
    (OUT/f'{name}.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report),flush=True)
    return report

if __name__=='__main__':
    radii=[float(x) for x in sys.argv[1].split(',')] if len(sys.argv)>1 else [0,.4,1,2]
    h=float(sys.argv[2]) if len(sys.argv)>2 else .09
    for R in radii: model(R,h)
