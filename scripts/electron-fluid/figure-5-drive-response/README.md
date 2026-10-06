# Figure 5: stronger electrical drive

The live article uses `public/images/columns/electron-fluid/figure-5-drive-response.svg`.
Rebuild it with `python make_figure5.py` (standard library only).

The two branches show possible, coexisting changes: geometry-dependent flow
acceleration and electron heating. Both panels deliberately retain the same
geometry and orderly current pattern. Heating is symbolized by a thermometer
and a warm fill, with no temperatures, heat map, random trajectories, vortex,
or nonlinear I–V curve.

For a smooth channel half-width `h(x)`, streamlines have `y=s h(x)` and
streamfunction `psi=s-s^3/3`. The resulting illustrative field is
`jx=(1-s^2)/h`, `jy=jx s h'`: it is divergence-free, has constant section flux,
and vanishes at the walls. Centerline arrow length is proportional to local
axial current density; at uniform carrier density, its magnitude is also
proportional to the mean electron speed. These are kinematic checks, not a Navier–Stokes solution; no
momentum or energy equation was solved and no thermal coefficients are inferred.
The arrows show conventional current, opposite to mean electron motion.

A symmetric constriction illustrates local acceleration and deceleration, but
does not on its own establish a net nonlinear two-terminal response. The two
panels do not assert that either effect occurs at a particular drive or that
heating must increase or decrease viscosity in every material.

Primary sources for the conceptual distinction:

- Hui et al., [Beyond Ohm’s law: Bernoulli effect and streaming in electron hydrodynamics](https://arxiv.org/abs/2010.00019), Physical Review B 103, 235152 (2021).
- Wang et al., [Joule heating and electronic Gurzhi effect in hydrodynamic differential transport in an electron liquid](https://arxiv.org/html/2603.21346v1), preprint (2026).
