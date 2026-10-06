# Figure 4: side-cavity current flow

The article uses `public/images/columns/electron-fluid/figure-4-cavity-flow.svg`. The pale background and teal palette match its existing thumbnail. Visible text consists only of `Vortex` and `Open flow`; physical parameters and interpretation remain in the caption and this source documentation.

Both panels use the same spatial scale (200 pixels per channel width), the same channel width W=1, and the same viscous length Dν=0.25. Cavity radius and opening width change together: R=0.4, a=0.6 on the left; R=1, a=1.5 on the right. The figure illustrates geometry at fixed transport parameters, rather than changing momentum relaxation.

The generator reuses the parent `flow-data/` FEM solution and reports from `solve_flow.py`. It extracts five representative open streamfunction contours per panel and two closed contours in the smaller cavity. It does not rerun the PDE or add hand-drawn flow paths. Compared with the older numerical PNG, the displayed contour selection is reduced; the archived fields remain unchanged.

The model is steady and linear, with no-slip impermeable walls, fully developed inlet/outlet current profiles, and a potential reference fixed at one degree of freedom. The original solver and mesh convergence limitations are documented in the [parent README](../README.md). A small, grid-dependent corner circulation in the larger cavity is not a basis for asserting that all circulation is absent. Colors are decorative and contour density does not encode current magnitude. Arrows indicate conventional current; mean electron motion is opposite.

This is an illustrative calculation, not a reproduction of an experimental device or a universal threshold. The room-temperature graphene cavity experiment and its model are described in [the original paper](https://arxiv.org/html/2408.00182v1).

## Rebuild

```powershell
python make_figure4.py
python verify_svg.py
```

Use the packages listed in `requirements.txt`. The generator checks archived nodal fields, wall values, flux, closed loops, and arrow direction; its checks of saved nodal interpolation do not reconstruct all original P2 FEM quadrature diagnostics. The independent verifier checks serialized geometry and arrows against the same raw data. The website directly renders the vector SVG; raster previews are optional review artifacts.
