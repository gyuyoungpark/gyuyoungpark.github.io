# Research overview sources

Reviewed on 2026-10-06. The 14 English overviews describe the central finding, the new approach, and its significance in original prose. Each stays within the requested 300-word limit. Full results and discussion were read from publisher HTML, publisher PDFs, or author-hosted full manuscripts; abstracts alone were not used.

The short thumbnail captions and all publication metadata remain in `research-papers.json`. The longer detail-page paragraphs are in `research-summaries.json`. The DOI above each overview links to the original paper. Source links and editorial scope notes below document the reading and claim review.

## Probabilistic multiplication operation via chaotic polarity switching in a single magnetic vortex

ID: `probabilistic-multiplication-2026`. Overview: 181 words.

- [Full-text source 1](https://www.nature.com/articles/s41598-026-68180-8_reference.pdf)

Evidence checked:

- Competing edge-soliton and vortex-antivortex reversal pathways produce irregular dwell times. — Results: Vortex-polarity switching and dynamical regimes, pp. 4–6.
- Threshold T changes encoded probability without changing magnetic dynamics. — Results: Generation and representative statistical evaluation of stochastic bitstreams, pp. 6–8.
- One oscillator, gating ratio, and normalization implement an expectation-value fractional product. — Results: Operating landscape and proof-of-concept probabilistic multiplication, pp. 9–10.
- Zero-temperature simulation proof of concept; no device-level energy or universal performance advantage claimed. — Discussion and Methods, pp. 10–13.

Scope retained in the editorial review:

- Deterministic chaos-derived variability, conceptually distinct from thermal true randomness.
- Detailed statistics at one selected operating point; NIST tests apply to a separately extracted sequence, not the raw arithmetic stream.
- No fabricated arithmetic hardware, energy measurement, or operand-wide accuracy benchmark.

## Emergence of moiré magnetic chaos in twisted bilayer CrI3

ID: `moire-chaos-2026`. Overview: 177 words.

- [Full-text source 1](https://arxiv.org/html/2608.13062v1)

Evidence checked:

- Frustrated patches produce a narrowly distributed ensemble of metastable domain patterns. — II.1 Frustration-induced nonlinearity and high metastability; Supplement S2.
- Tiny perturbations reorganize terminal patterns; positive finite-time expansion is transient. — II.2 Damage spreading and structural chaos; Supplement S7.
- Nearly fair binary occupancy, no detected pairwise correlations; higher-order dependence not excluded. — II.3 Statistical characterization; Supplement S4.
- Patterns persist at low temperatures and dissolve during heating; shuffled exchange map destroys domain formation. — II.4 Thermal robustness; Supplement S6 null control.

Scope retained in the editorial review:

- Relaxational basin sensitivity and transient chaos, not sustained equilibrium chaos; asymptotic Lyapunov exponent is non-positive.
- Binary top-layer occupancy, not exhaustive characterization of local ternary states or proof of all 2^N states being accessible.
- Pairwise independence tests do not prove higher-order independence.
- Smallest perturbations approach single-precision resolution; do not quote the saturated finite-amplitude estimate as an asymptotic Lyapunov exponent.
- Thermal robustness follows a finite simulation protocol, not measured long-time retention; device throughput is only prospective.

## Field-like spin-orbit torque associated with out-of-plane spin polarization in Py/van der Waals heterostructures

ID: `field-like-torque-2026`. Overview: 171 words.

- [Full-text source 1](https://www.nature.com/articles/s41598-026-62886-5_reference.pdf)

Evidence checked:

- Angle-resolved Raman probes reduced symmetry; angular FMR analysis finds a z-polarized field-like component in WTe2 and MoTe2, absent in Pt. — Results and discussion, pp. 6–14; Figs. 1–4; Table 1.
- Simulation torque magnitudes are taken from measurements; field-like torque initiates departure and damping-like torque sustains reversal. — Results and discussion, pp. 15–18; Fig. 5.
- Spin versus orbital mechanisms are not separately isolated. — Results and discussion, p. 14.

Scope retained in the editorial review:

- Experimental evidence concerns torque spectroscopy, not a measured fast switching device.
- Microscopic spin-based and orbital-mediated contributions remain unresolved.
- Faster Py/MoTe2 dynamics are not uniquely assigned to field-like versus damping-like torque.

## Magneto-rotation coupling dominates surface acoustic wave driven ferromagnetic resonance in the longitudinal geometry

ID: `saw-magnetorotation-2026`. Overview: 182 words.

- [Full-text source 1](https://arxiv.org/html/2603.17758v1)

Evidence checked:

- Framework implements three distinct acoustic-magnetic coupling channels. — II Model; III Implementation; IV Benchmark Simulations.
- Longitudinal MEL field exerts no direct transverse torque; MR drives resonance and standing-wave response. — IV.6 Spatially resolved coupling; V.1 Channel decomposition; VI Parametric vs. direct driving.
- Angular coupling analysis agrees qualitatively with simulation. — V.2 Angle-dependent rates; V.3 Simulation validation.
- Ordinary YIG crystalline Kmr is much below the enhanced value used for strong-coupling plots; acoustic back-action is neglected. — VI Magneto-rotation coupling constant; VI Limitations.

Scope retained in the editorial review:

- Externally prescribed acoustic wave; no self-consistent elastic back-action or simulated phonon-magnon hybridization from coupled dynamics.
- Strong-coupling sweeps employ adjustable/enhanced Kmr; ordinary YIG estimate lies outside strong coupling.
- Standing-wave benchmark intentionally amplifies Kmr to make the mechanism visible.
- Zero transverse torque concerns direct equilibrium driving; longitudinal strain can still act parametrically.

## Multimode cavity magnonics in mumax+: from coherent to dissipative coupling in ferromagnets and antiferromagnets

ID: `cavity-magnonics-2026`. Overview: 185 words.

- [Full-text source 1](https://arxiv.org/html/2603.03706v1)

Evidence checked:

- Python benchmark tier and CUDA-native kernels with spatial profiles are distinct implementations; kernels await build integration. — III.1 CUDA-native solver; III.2 Python co-simulation.
- Splitting, Rabi dynamics, uniform-mode overlap selection, and magnon-mediated transfer match coupled-mode theory. — IV.1–IV.5 benchmark simulations.
- Antiferromagnetic model parameters place resonance in GHz rather than typical THz scale; separate Neel-vector spectra. — IV.7 Antiferromagnetic cavity magnonics.
- Dissipative model produces level attraction; accuracy bounded by time-window spectral resolution and splitting timestep. — IV.8 Abnormal anticrossing; V Discussion; Fig. 11.

Scope retained in the editorial review:

- All published benchmarks run Python co-simulation; fully integrated CUDA-native performance is not benchmarked.
- Antiferromagnetic parameters are deliberately chosen for an illustrative GHz model, not a material-specific realistic prediction.
- Nonuniform spin-wave addressing is represented by reduced overlap models; CUDA spatially resolved tier is needed for production large-grid calculations.
- Classical mean-field micromagnetic and cavity amplitudes; quantum entanglement/transduction/detection are application context, not demonstrated results.

## Perpendicular standing spin waves in AuPt/GdFeCo induced by spin-orbit torques

ID: `standing-spin-waves-2025`. Overview: 150 words.

- [Full-text source 1](https://www.nature.com/articles/s42005-025-02433-2)

Evidence checked:

- Third-order modes and cap-dependent pinning: Results, Figures 3–7.

Scope retained in the editorial review:

- Device implementation and sub-terahertz operation were not demonstrated.

## From trochoidal symmetry to chaotic vortex-core reversal in magnetic nanostructures

ID: `vortex-chaos-2025`. Overview: 163 words.

- [Full-text source 1](https://www.nature.com/articles/s44306-025-00108-w)

Evidence checked:

- Geometry: Figures 2–3; chaos and sensitivity: Figures 4–5.

Scope retained in the editorial review:

- Zero-temperature simulations; computing devices were proposed, not demonstrated.

## Multi-level probabilistic computing: application to the multiway number partitioning problems

ID: `multilevel-probabilistic-2025`. Overview: 163 words.

- [Full-text source 1](https://www.nature.com/articles/s41598-025-14531-w)

Evidence checked:

- Update rule: Theory; annealing: Figure 4; multilevel outcomes: Figure 6; randomness: Methods.

Scope retained in the editorial review:

- Multilevel hardware and guaranteed optimality were not established.

## Exceptional Field-like Spin–Orbit Torques in Pd/Co Heterostructures Enabled by Interfacial Spin–Orbit Coupling

ID: `pdco-fieldlike-sot-2025`. Overview: 166 words.

- [Full-text source 1](https://doi.org/10.1021/acsaelm.5c00339)
- [Full-text source 2](https://drive.google.com/file/d/1RLRRu4A-TBlcT7HL5PF9AkxHKkK71aQW/view)

Evidence checked:

- Torque measurements: Sections 3.1–3.2; interpretation: 3.3; switching simulations: 3.4.

Scope retained in the editorial review:

- Switching is simulated; microscopic mechanism remains partly interpretative.

## Reconfigurable all-in-one chaotic computing with skyrmions: Leveraging periodic modulations of perpendicular magnetic anisotropy

ID: `reconfigurable-skyrmion-2024`. Overview: 175 words.

- [Full-text source 1](https://doi.org/10.1103/PhysRevB.109.174420)
- [Full-text source 2](https://drive.google.com/file/d/1cbWn8zHOm2oVyT_GnhmtWL_LGOKdVhA4/view)

Evidence checked:

- Patterns: III A–B; sixteen functions and common readout: III C–D; device proposal: IV.

Scope retained in the editorial review:

- Simulated concept; finite-temperature fault tolerance and measured energy savings are not established.

## Emergence of chaos in magnetic-field-driven skyrmions

ID: `skyrmion-chaos-2023`. Overview: 176 words.

- [Full-text source 1](https://arxiv.org/pdf/2309.04243)
- [Full-text source 2](https://doi.org/10.1103/PhysRevB.108.174441)

Evidence checked:

- Methods and Results, pp. 3-6: higher gyrotropic mode couples to nonuniform breathing; deformation changes inertia and restoring force.
- Results, pp. 7-11 and Figures 3-4: bifurcation, initial-condition sensitivity, local Lyapunov maps, temporal transitions, and breakdown.

Scope retained in the editorial review:

- Full author preprint and supplement read; publisher article not independently accessed.
- Single idealized confined Co/Pt skyrmion, micromagnetic simulation; not an experimental computing demonstration.
- Positive local Lyapunov values also occur in unstable ordered states; summary relies on combined diagnostics rather than exponent sign alone.

## Magnetization reversals in magnetosome linear-chain assemblies extracted from magnetotactic bacteria: an experimental and micromagnetic simulation study

ID: `magnetosome-chains-2023`. Overview: 188 words.

- [Full-text source 1](https://pubs.rsc.org/en/content/articlelanding/2023/tc/d3tc01517c)
- [Full-text source 2](https://drive.google.com/file/d/12ra4f4XSJCaCWUJ205dJgMtsWJtrRALK/view)

Evidence checked:

- Results, pp. 9795-9797 and Figures 2-4: field alignment, concentration-dependent coercivity, and angular hysteresis.
- Results, pp. 9799-9801 and Figures 6-8: end/corner nucleation, successive switching, chain-number and spacing effects.

Scope retained in the editorial review:

- Full publisher PDF shared by author laboratory read via drive.usercontent.google.com; direct RSC fulltext access returned 403.
- Simulations are quasistatic with accelerated relaxation; lower switching fields should not be presented as measured faster temporal switching.
- Biocompatibility motivates the work; this paper does not establish clinical safety or efficacy.

## Recursive evolution of spin-wave multiplets in magnonic crystals of antidot-lattice fractals

ID: `antidot-fractals-2021`. Overview: 193 words.

- [Full-text source 1](https://www.nature.com/articles/s41598-021-00417-0)

Evidence checked:

- Results, Figures 2-4: recursive multiplets, spatial mode inheritance, and energy asymmetry.
- Origin of spin-wave multiplets, Figure 5: symmetric nonfractal control has unsplit modes.
- Discussion and Methods: geometric/field tuning; periodic-boundary Permalloy simulations.

Scope retained in the editorial review:

- Complete publisher fulltext, including Results, Discussion, and Methods, read.
- Finite recursion levels in periodically repeated simulated motifs; no universal infinite-fractal theorem or fabricated device demonstrated.

## Robust formation of skyrmion and skyrmionium in magnetic hemispherical shells and their dynamic switching

ID: `hemispherical-shells-2021`. Overview: 184 words.

- [Full-text source 1](https://fun.univie.ac.at/fileadmin/user_upload/p_fun/PhysRevB.104.134427.pdf)
- [Full-text source 2](https://doi.org/10.1103/PhysRevB.104.134427)

Evidence checked:

- Sections III A-B, Figures 2-3: phase maps, chirality-dependent curvature effect, and zero-intrinsic-DMI stability.
- Sections III C-E, Figures 4-9: mode coupling, texture conversions, polarity reversal, and switching maps.

Scope retained in the editorial review:

- Complete coauthor-hosted publisher PDF read through Summary.
- Numerical idealized shells; mode spectra use reduced damping for resolution; experimental memory operation is not demonstrated.
- Some drive regions exhibit repeated switching; summary does not imply all applied resonant fields produce a unique final state.
