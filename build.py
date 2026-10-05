from pathlib import Path
import json
root=Path(__file__).resolve().parent
data=json.loads((root/'data/atlas-data.json').read_text())
editorial=json.loads((root/'data/editorial-en.json').read_text())
for p in data['people']:
 if p['nameZh'] in editorial:p['editorial']=editorial[p['nameZh']]
 if p.get('summaryEn'):p.setdefault('editorial',{})['summary_en']=p['summaryEn']
research={'findings':json.loads((root/'data/findings.json').read_text()),'method':json.loads((root/'data/method-content.json').read_text())}
s=(root/'src/index.template.html').read_text()
for token,value in [('__ATLAS_DATA__',data),('__RESEARCH_DATA__',research)]:
 s=s.replace(token,json.dumps(value,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
(root/'index.html').write_text(s)
print('Built research edition: 72 profiles, Findings, Method and guided tour.')
