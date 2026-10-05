"""Build the static site and its reproducible findings in one step."""
from pathlib import Path
import hashlib
import importlib.util
import json

root = Path(__file__).resolve().parent
raw = (root / 'data/atlas-data.json').read_bytes()
data = json.loads(raw)
spec = importlib.util.spec_from_file_location('compute_findings', root / 'scripts/compute_findings.py')
compute = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compute)
findings = compute.build(data, raw)
expected_hash = hashlib.sha256(raw).hexdigest()
if findings['meta']['inputSha256'] != expected_hash:
    raise ValueError('Refusing a build: findings do not match the source data.')
if (root / 'data/atlas-data.json').read_bytes() != raw:
    raise ValueError('Source data changed during the build; rerun after the edit finishes.')
(root / 'data/findings.json').write_text(json.dumps(findings, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
editorial = json.loads((root / 'data/editorial-en.json').read_text())
for person in data['people']:
    if person['nameZh'] in editorial:
        person['editorial'] = editorial[person['nameZh']]
    if person.get('summaryEn'):
        person.setdefault('editorial', {})['summary_en'] = person['summaryEn']
research = {'findings': findings, 'method': json.loads((root / 'data/method-content.json').read_text())}
html = (root / 'src/index.template.html').read_text()
for token, name in [('__SITE_CSS__', 'styles.css'), ('__ATLAS_JS__', 'atlas.js'), ('__RESEARCH_JS__', 'research.js')]:
    html = html.replace(token, (root / 'src' / name).read_text())
for token, value in [('__ATLAS_DATA__', data), ('__RESEARCH_DATA__', research)]:
    html = html.replace(token, json.dumps(value, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
for token in ('__SITE_CSS__', '__ATLAS_JS__', '__RESEARCH_JS__', '__ATLAS_DATA__', '__RESEARCH_DATA__'):
    if token in html:
        raise ValueError(f'Unresolved build token: {token}')
(root / 'index.html').write_text(html, encoding='utf-8')
print(f"Built {len(data['people'])} profiles and {findings['meta']['eventCount']} sourced events; findings match {expected_hash[:12]}.")
