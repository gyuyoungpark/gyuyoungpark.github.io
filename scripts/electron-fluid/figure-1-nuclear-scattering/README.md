# Figure 1: nuclear and electron–electron scattering

This is the source for the revised figure used by `ColumnFigure.tsx`.
The generator produces an editable SVG with analytic classical Coulomb orbits.
The incoming trajectory guide and the visible “Schematic” label are omitted.
The lower dotted line remains as a guide to the momentum-vector sum.

From this directory, with Python and NumPy installed:

```sh
python make_figure1.py
python audit_momentum.py
```

Copy the resulting `figure-1.svg` to
`public/images/columns/electron-fluid/figure-1-nuclear-scattering.svg`.

The first script checks energy, momentum, and force residuals. The second
independently reads the SVG arrow endpoints and recomputes asymptotic velocities.
See `captions.md` for interpretation and the heavy-nucleus approximation.
