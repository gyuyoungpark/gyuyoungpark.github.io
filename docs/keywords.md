# Content keywords

Keywords are derived from content metadata. Register a topic once in a content item's `tags`; the homepage keyword list, keyword results, and links on that content then use the same index. There is no second keyword list to maintain.

- **VAGUE:** add or edit a JSON article in `src/data/columns/`. Each file has `id`, `title`, `titleEn`, `date` (YYYY-MM-DD), `description`, `tags`, and `blocks`. Optional `thumbnail` and `thumbnailAlt` set its preview image. Files are discovered automatically and sorted newest first.
- **Research:** add `tags` to the paper in `src/data/research-papers.json`, using English topic strings. Papers are sorted newest first and use the same keyword index as other content.
- **Activities:** add `tags` to the talk or seminar in `src/data/activities.json`, using English topic strings.
- **Achievements:** add awards, fellowships, or scholarships to `src/data/achievements.json`. Keep repeated dates together in `dateLabel` and use the latest known year or month in `date` for sorting. Omit an organization when the source does not give one. Leave `tags` empty unless a topic is explicitly supported by the record.

Use English topic names, for example `"Electron Hydrodynamics"`. Journal names are not seeded as keywords; keep publication details in the content's publication metadata instead. Only keywords with at least one valid related content item are displayed. Removing the last related item also removes its keyword automatically, including preferred physics themes.

Matching ignores letter case, extra whitespace, and equivalent Unicode width forms. Each content item appears only once per keyword. Blank or `Untitled` placeholders do not publish keywords. The first registered spelling is displayed, with the existing physics-theme spelling taking priority.

Backgrounds are randomly selected from the 90 color swatches sampled from the user-supplied Munsell chart. The palette uses representative RGB values from the chart image, not a conversion of the printed Munsell coordinates. A keyword keeps the same background across all badges and rerenders within one page load; reloading chooses colors again. Text is pure black or white, whichever gives the higher sRGB contrast ratio (at least 4.5:1 for all palette colors). Badges have no borders; hover changes opacity, selected keywords show a check mark, and keyboard focus uses a ring.

Click keywords to toggle multiple topics. Selected topics appear as removable chips below the keyword cloud; Clear restores all posts. Research, VAGUE, and Activities show only posts matching at least one selected topic (OR), without duplicates, and hide sections with no results. Section navigation keeps the selection. Content badges add their topic to the current selection.

Keyword URLs use `/#/keywords/<encoded keyword>,<encoded keyword>`, so selections can be bookmarked and browser Back/Forward restores previous selections. Each topic is encoded separately, including any literal comma in its name. An empty selection uses `/#keywords`. Keyword data is rebuilt as part of the normal website build; deploy content updates as usual.

Content cards open internal detail pages at `/#/research/<id>`, `/#/activities/<id>`, `/#/columns/<id>`, or `/#/achievements/<id>`. The detail page keeps the keyword selection when returning to a section. Research pages link out through the record's DOI at `https://doi.org/<doi>`; research and activity records without a DOI use their official source URL. Achievements show their recorded dates and organization. Image source links are on detail pages. Keyword badges remain separate filter links within each card. Achievements with no topic tags are hidden while a keyword filter is active and return when cleared.

Run the keyword, route, and rendered page checks with Node 24 or later:

```sh
node --test tests/keywords.test.mjs tests/contentRoutes.test.mjs tests/contentPages.test.mjs
```
