# Figure 3: channel-width crossover

The published asset is `public/images/columns/electron-fluid/figure-3-transport-regimes.svg`.
The generator uses an analytic no-slip velocity profile for the two continuum panels;
the ballistic paths are illustrative. Read `captions.md` for assumptions and interpretation.

From this folder, install the pinned NumPy requirement and run:

```sh
python make_figure3.py
python verify_svg.py
```

This creates `figure-3.svg` and refreshes both validation JSON files. Copy the SVG
to the published asset path after review. The verifier reads the generated SVG,
checks all 18 mean-flow arrows against the analytic solution, and checks that
every arrow has one electron symbol clear of the walls and adjacent symbols.

The lower part of the illustration contains only `Increasing W`. Mean-flow
interpretation, normalization, schematic channel-width scaling, and the possibility
of linear response in all three regimes are explained in the article caption.
