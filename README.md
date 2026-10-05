# Power in Motion · 权力迁徙图

An English-first, bilingual digital humanities atlas of political lives in modern China, 1840–2026.

**[Explore the live website](https://shawnxx20100217.github.io/power-in-motion/)**

The research edition combines 72 profiles and 1,098 source-supported events with an interactive schematic map, three reproducible descriptive findings, a detailed Method page and an optional 90-second guided tour. Every finding exposes its denominator, supporting people and exact event records.

## Evidence and scope

This is a curated research sample, not a census or ranking. Sources were reviewed on 5 October 2026; each living person's status retains its own source date. 35 original place leads remain unresolved. Source-supported facts, jurisdictional associations, native places and documented personal presence are distinct. Map points are schematic and connecting lines are reading aids, not verified travel routes.

The project used AI-assisted research compilation, translation, programming and source checks. It is not an independently peer-reviewed dataset. The Method page states source limitations, selection bias and unresolved questions. Linked texts and documents remain with their original publishers; this repository stores concise event summaries and source references.

## Structure

- `index.html`: standalone website; also the GitHub Pages entry point.
- `src/index.template.html`: editable HTML, CSS and application logic.
- `data/atlas-data.json`: canonical research data and references.
- `data/findings.json`: counts, full contributing evidence and denominator membership.
- `data/method-content.json`: English/Chinese research method and tour script.
- `data/review-coverage.json`: coverage and unresolved issues per person.
- `scripts/compute_findings.py`: reproducible queries.
- `build.py`: assembles the static page using Python's standard library.

## Reproduce

```sh
python3 scripts/compute_findings.py --input data/atlas-data.json --output data/findings.json
python3 build.py
python3 -m http.server 8000
```

Open `http://localhost:8000`. No package install, account or API key is required. The HTML also opens directly from disk; data download links need the accompanying `data` directory.

GitHub Pages serves the `main` branch root. This repository includes only the public website and its research materials.
