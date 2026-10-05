# Power in Motion · 权力迁徙图

An English-first, bilingual digital humanities atlas of political lives in modern China, 1840–2026.

**[Explore the live website](https://shawnxx20100217.github.io/power-in-motion/)**

The research edition combines 72 profiles and 1,098 source-supported events with an interactive schematic map, three reproducible descriptive findings, a Method page and an optional 90-second guided tour. Findings expose their denominators, contributing people and exact event records. The multi-center finding also compares dated evidence across five overlapping periods; a separate period-by-tier matrix makes sample coverage visible.

## Exploring the atlas

- Start with four sourced records from Sun Yat-sen's life, or search by a person's name, role or political entity in English or Chinese.
- A period selection shows only dated events whose intervals intersect that period. **Full lives** shows the entire biographies of the associated people. The complete biographical record below the map always retains all recorded years.
- Filter birthplaces, ancestral origins and upbringing separately. Click a shared place to inspect all matching people and their event references.
- Open a full record, inspect source support, and return to the map or finding. Narrow screens use collapsible controls and a full-width record; the optional tour appears alongside the content being discussed.

## Evidence and scope

This is a curated research sample, not a census or ranking. As of the 5 October 2026 review, the catalog contains 301 source URLs. Of the 1,098 supported events, 1,037 cite one source URL and 61 cite multiple URLs. Multiple links do not automatically establish independent corroboration. There are 35 unresolved original place leads and 71 sourced events without established dates.

Source-supported facts, jurisdictional associations, ancestral places and documented personal presence remain distinct. Map positions are schematic. The 215 available connecting segments are reading aids, not verified journeys: same-year multi-place ambiguity, overlapping date intervals and jurisdiction-only records cannot determine a travel order. Applying a period filter never creates new connections across excluded events.

The targeted [evidence review](data/evidence-review.json) records political-entity chronology corrections, a review of the 17 profiles previously marked living, and additional references for nine existing events. It distinguishes review dates, source dates and the dates supported by those sources. It also records partial source support and retrieval limitations. This update does **not** claim a fresh independent verification of all 1,098 events; each person's status remains bounded by its own evidence date.

The project used AI-assisted research compilation, translation, programming and source checks. It is not an independently peer-reviewed dataset. The Method page states source limitations, selection bias, the research motivation and unresolved questions. Linked texts and documents remain with their original publishers; this repository stores concise event summaries and source references.

## Structure

- `index.html`: generated standalone website and GitHub Pages entry point; edit the source files below instead.
- `src/index.template.html`: page structure and build placeholders.
- `src/styles.css`: responsive layout, bilingual typography and visual styling.
- `src/atlas.js`: atlas filters, schematic map, place records and biographies.
- `src/research.js`: Findings, Method, evidence links and guided tour.
- `data/atlas-data.json`: canonical research data and source catalog.
- `data/editorial-en.json`: English editorial copy merged during the build.
- `data/findings.json`: generated counts, denominators, period comparisons and coverage statistics.
- `data/method-content.json`: bilingual method content and tour script.
- `data/review-coverage.json`: profile coverage and unresolved issues.
- `data/evidence-review.json`: targeted correction and reference audit trail.
- `scripts/compute_findings.py`: reproducible research queries.
- `build.py`: recomputes findings, checks their input hash and assembles the static page using Python's standard library.

## Reproduce

From the repository root:

```sh
python3 build.py
python3 -m http.server 8000
```

Open `http://localhost:8000`. No package install, account or API key is required. The HTML also opens directly from disk; download links need the accompanying `data` directory. To regenerate only the findings, run `python3 scripts/compute_findings.py`.

GitHub Pages serves the `main` branch root. Commit the updated source/data and generated `index.html` together when publishing a change. This repository contains only the public website and its research materials.
