# Content keywords

Keywords are derived from content metadata. Register a topic once in a content item's `tags`; the homepage keyword list, keyword results, and links on that content then use the same index. There is no second keyword list to maintain.

- **VAGUE:** add or edit a JSON article in `src/data/columns/`. Each file has `id`, `title`, `titleEn`, `date` (YYYY-MM-DD), `description`, `tags`, and `blocks`. Optional `thumbnail` and `thumbnailAlt` set its preview image. Files are discovered automatically and sorted newest first.
- **Research:** add `tags` to the paper in `src/data/research-papers.json`, using English topic strings. Papers are sorted newest first and use the same keyword index as other content.
- **Activities:** add `tags` to the talk or seminar in `src/data/activities.json`, using English topic strings.

Use English topic names, for example `"Electron Hydrodynamics"`. Journal names are not seeded as keywords; keep publication details in the content's publication metadata instead. The six existing physics themes remain available even before related content is published.

Matching ignores letter case, extra whitespace, and equivalent Unicode width forms. Each content item appears only once per keyword. Blank or `Untitled` placeholders do not publish keywords. The first registered spelling is displayed, with the existing physics-theme spelling taking priority. Topic colors are stable across content additions and ordering changes.

Keyword URLs use `/#/keywords/<encoded keyword>`. Links in a keyword result point to the article or the relevant Research/Activities card. Keyword data is rebuilt as part of the normal website build; deploy content updates as usual.

Run the dependency-free index checks with Node 24 or later:

```sh
node --test tests/keywords.test.mjs
```
