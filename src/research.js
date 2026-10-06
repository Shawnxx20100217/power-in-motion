(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const research = researchData;
  const findings = research.findings.findings;
  const method = research.method;
  const tourSpec = method.guidedTour;
  const viewNodes = {atlas: document.getElementById('atlas'), findings: document.getElementById('findings'), method: document.getElementById('method')};
  const hero = document.querySelector('.hero');
  const panel = document.getElementById('tourPanel');
  let activeView = 'atlas', lastLanguage = '', returnFinding = null, activeEvidence = null;
  let routeInitialized = false;
  let keepSynthesisOnLanguageChange = false;
  let methodSectionOnLanguageChange = null;
  let tour = {active:false, index:0, auto:false, remaining:20, timer:null};
  const tr = (en, zh) => state.lang === 'en' ? en : zh;
  const field = (value, prefix) => value[prefix + (state.lang === 'en' ? 'En' : 'Zh')] || '';
  const safe = escapeHTML;
  window.researchBeforeLanguageChange=function () {
    const rect=viewNodes.findings.querySelector('.research-synthesis')?.getBoundingClientRect();
    keepSynthesisOnLanguageChange=activeView==='findings'&&rect&&rect.top<window.innerHeight&&rect.bottom>document.querySelector('.topbar').getBoundingClientRect().height;
    methodSectionOnLanguageChange=null;
    if(activeView==='method'&&!tour.active){
      const header=document.querySelector('.topbar').getBoundingClientRect().height;
      const current=[...viewNodes.method.querySelectorAll('.method-section')].filter(section=>section.getBoundingClientRect().top<=header+48).at(-1);
      if(current&&current.getBoundingClientRect().bottom>header)methodSectionOnLanguageChange=current.id;
    }
  };
  function scrollToNode(node) {
    if (!node) return;
    const header = document.querySelector('.topbar').getBoundingClientRect().height + (window.atlasRecordOffset?.(node)||0);
    const rect=node.getBoundingClientRect();
    window.scrollTo({top:window.scrollY + rect.top - header - 22, behavior:'instant'});
  }
  function personName(id) {const p = peopleById.get(id); return p ? displayName(p) : id;}
  function sourceLinks(event) {
    return (event.sourceRefs || []).map((ref, i) => {
      const s = sourceRecord(ref);
      if (!/^https?:\/\//.test(s?.url || '')) return '';
      return `<a href="${safe(s.url)}" target="_blank" rel="noopener noreferrer" title="${safe(s.title)}">${tr('Source','来源')} ${i + 1} ↗</a>`;
    }).join('');
  }
  function recordRow(record, findingId, withEvents=true) {
    const person = peopleById.get(record.personId);
    if (!person) return '';
    const ids = record.eventIds || [];
    const ev = person.placeLeads.filter(e=>ids.includes(e.id));
    return `<div class="finding-record"><div><h4>${safe(displayName(person))}<small>${safe(secondaryName(person))}</small></h4><button class="evidence-button" data-evidence-person="${safe(person.id)}" data-evidence-events="${safe(ids.join('|'))}" data-return-finding="${safe(findingId||'')}">${tr('Open in atlas ↗','在地图中查看 ↗')}</button></div><ul>${withEvents ? ev.map(e=>`<li><strong>${safe((state.lang==='en'?e.dateTextEn:e.dateTextZh)||e.dateText||tr('Date not established','日期未定'))}</strong> · ${safe(field(e,'title'))}<br>${sourceLinks(e)}</li>`).join('') : ''}</ul></div>`;
  }
  function personIndex(records, findingId) {
    return `<ul class="denominator-people">${records.map(r=>`<li><button class="text-link" data-evidence-person="${safe(r.personId)}" data-evidence-events="${safe((r.eventIds||[]).join('|'))}" data-return-finding="${safe(findingId||'')}">${safe(personName(r.personId))}</button></li>`).join('')}</ul>`;
  }
  function denominatorAudit(finding) {
    const all=finding.denominatorPeople || finding.denominatorPersonIds.map(personId=>({personId,eventIds:[]}));
    const matched=new Set(finding.matches.map(r=>r.personId));
    const additional=all.filter(r=>!matched.has(r.personId));
    return `<details class="finding-audit"><summary>${tr('Inspect the denominator','核对完整分母')} · ${all.length}</summary><p class="denominator-note">${safe(field(finding,'denominatorLabel'))}. ${tr('All included people are listed here. Contributing evidence appears above; additional eligible records follow. A missing record is not a negative fact.','这里列出全部纳入人物。贡献统计的证据见上方；其余合格记录列于下方。缺失记录不等于否定事实。')}</p>${personIndex(all,finding.id)}${additional.some(r=>r.eventIds.length)?`<details><summary>${tr('Additional denominator evidence','分母中其他人物的证据')} · ${additional.length}</summary><div class="finding-records">${additional.map(r=>recordRow(r,finding.id)).join('')}</div></details>`:''}</details>`;
  }
  function periodComparison(finding) {
    if(!finding.periodBreakdown)return '';
    return `<section class="period-comparison" aria-label="${tr('Compare the recorded periods','比较各时期的现有记录')}"><h3>${tr('The same question, across periods','同一个问题，放到不同时期')}</h3><p>${safe(field(finding,'periodMethod'))}</p><div class="period-comparison-list">${finding.periodBreakdown.map(row=>`<details class="period-comparison-row"><summary><span>${safe(field(row,'label'))}<small>${row.startYear}–${row.endYear}</small></span><strong>${row.numerator}<span> / ${row.denominator}</span></strong><span class="period-coverage">${row.coverage.peopleWithDatedSupportedRecords} ${tr('profiles with dated evidence','人有可定年来源记录')}</span></summary><p>${tr('Numerator: people documented in at least two selected cities during intersecting event intervals. Denominator: people with at least one qualifying center record.','分子：相交事件区间内至少涉及两座所选城市的人物。分母：至少有一项合格中心活动记录的人物。')}</p><details class="finding-audit"><summary>${tr('Contributors and sources','贡献人物与来源')} · ${row.numerator}</summary><div class="finding-records">${row.matches.length?row.matches.map(r=>recordRow(r,finding.id)).join(''):`<p>${tr('No qualifying record in this edition.','本版未有合格记录。')}</p>`}</div></details><details class="finding-audit"><summary>${tr('Full denominator and event evidence','完整分母及事件依据')} · ${row.denominator}</summary><div class="finding-records">${row.denominatorPeople.map(r=>recordRow(r,finding.id)).join('')}</div></details>${row.boundarySpanningPeople.length?`<details class="finding-audit"><summary>${tr('Intervals crossing this period’s boundary','跨过该时期边界的区间')} · ${row.coverage.boundarySpanningEventCount}</summary><p>${tr('These intervals overlap this period but do not establish continuous presence in every year.','这些区间与本时期相交，并不能证明每年持续在场。')}</p><div class="finding-records">${row.boundarySpanningPeople.map(r=>recordRow(r,finding.id)).join('')}</div></details>`:''}<details class="finding-audit"><summary>${tr('Profiles behind the dated-evidence coverage count','可定年资料覆盖人数的名单')}</summary>${personIndex(row.coverage.peopleWithDatedSupportedRecordIds.map(personId=>({personId})),finding.id)}</details></details>`).join('')}</div><p class="research-caution">${safe(field(finding,'periodLimits'))}</p>${finding.periodDateExclusions.length?`<details class="finding-audit"><summary>${tr('Center records excluded from period assignment','未分配到时期的中心记录')} · ${finding.periodDateExclusions.length} ${tr('people','人')}</summary><div class="finding-records">${finding.periodDateExclusions.map(r=>recordRow(r,finding.id)).join('')}</div></details>`:''}</section>`;
  }
  function renderSynthesis() {
    const synthesis=research.synthesis;
    const paragraphs=synthesis[state.lang==='en'?'paragraphsEn':'paragraphsZh'];
    return `<section class="research-synthesis" id="finding-synthesis" aria-labelledby="synthesis-title"><div class="synthesis-text"><h2 id="synthesis-title">${safe(field(synthesis,'title'))}</h2>${paragraphs.map(parts=>`<p>${parts.map(part=>part.href?`<a href="${safe(part.href)}">${safe(part.text)}</a>`:safe(part.text)).join('')}</p>`).join('')}</div></section>`;
  }
  function noteProse(value) {
    // Keep every original character; paragraph boundaries only change presentation.
    const sentences=value.split(/(?<=[。！？])|(?<=[.!?])(?=\s)/);
    const paragraphs=[];
    const limit=state.lang==='en'?240:90;
    sentences.forEach(sentence=>{
      const previous=paragraphs.at(-1);
      if(previous!==undefined&&previous.length+sentence.length<=limit)paragraphs[paragraphs.length-1]+=sentence;
      else paragraphs.push(sentence);
    });
    const emphasis=state.lang==='en'?
      ['Count unique people','Deduplicate by person and city.','count unique people.','documented personal presence','does not establish that a person never studied elsewhere','does not imply holding power','not a causal effect of education']:
      ['按人物去重','按人物与城市去重','事件级来源、明确本人到场','不代表从未在外求学','不等同于掌权','不证明学习导致从政'];
    return `<div class="note-prose">${paragraphs.map(paragraph=>{
      let html=safe(paragraph);
      emphasis.forEach(phrase=>{html=html.replace(safe(phrase),`<strong>${safe(phrase)}</strong>`);});
      return `<p>${html}</p>`;
    }).join('')}</div>`;
  }
  function renderFindings() {
    viewNodes.findings.innerHTML=`<header class="research-header"><div><p class="eyebrow">02 / ${tr('FINDINGS','研究发现')}</p><h1 class="findings-title" tabindex="-1">${tr('Patterns, with their evidence.','<span class="finding-title-line">让每个发现，</span><span class="finding-title-line">都能回到证据。</span>')}</h1><p class="research-intro">${safe(field(research.findings,'intro'))}</p></div><aside class="research-aside"><strong>${research.findings.meta.peopleCount} ${tr('lives','位人物')}</strong>${tr('Three descriptive queries. Different questions use different denominators. These results describe the current records, not all political lives in modern China.','三个描述性查询，不同问题使用不同分母。结果描述当前资料，不能代表中国近现代全部政治人物。')}<br><span>${tr('Data reviewed','资料审查')} · ${safe(research.findings.meta.dataAsOf||'')}</span></aside></header><div class="findings-list">${findings.map((f,index)=>{
      const exceptions=f.institutionOnlyEvidence || [];
      return `<article class="finding-card" id="finding-${safe(f.id)}"><div class="finding-main"><div class="finding-metric"><span class="finding-number">${String(index+1).padStart(2,'0')} / ${tr('OBSERVATION','观察')}</span><div class="finding-ratio">${f.numerator}<small> / ${f.denominator}</small></div><div class="finding-metric-label">${safe(field(f,'denominatorLabel'))}</div></div><div><h2>${safe(field(f,'title'))}</h2><p class="finding-claim">${safe(field(f,'claim'))}</p><button type="button" class="finding-evidence-link" data-open-finding-audit="${safe(f.id)}" aria-controls="audit-${safe(f.id)}">${tr('View contributing records','查看贡献记录')} · ${f.matches.length} ${tr('people','人')} <span aria-hidden="true">↓</span></button><div class="finding-notes"><div><h3>${tr('How this was counted','如何统计')}</h3>${noteProse(field(f,'method'))}</div><div><h3>${tr('What this cannot establish','这不能证明什么')}</h3>${noteProse(field(f,'limitations'))}</div></div><details class="finding-audit" id="audit-${safe(f.id)}"><summary>${tr('Inspect the contributing records','核对贡献这些统计的记录')} · ${f.matches.length} ${tr('people','人')}</summary><div class="finding-records">${f.matches.map(p=>recordRow(p,f.id)).join('')}</div></details>${denominatorAudit(f)}${exceptions.length?`<details class="finding-audit"><summary>${tr('Institution-only qualifications excluded from the count','仅有授予学位的机构记录，未计入')} · ${exceptions.length}</summary><div class="finding-records">${exceptions.map(p=>recordRow(p,f.id)).join('')}</div></details>`:''}${periodComparison(f)}</div></div></article>`;
    }).join('')}</div>${renderSynthesis()}<div class="research-download"><a href="data/findings.json" download>${tr('Download the findings & event references','下载发现与事件依据')} ↓</a><a href="#method" data-view="method">${tr('Read the full method','阅读完整方法')} ↗</a></div>`;
    if(keepSynthesisOnLanguageChange){keepSynthesisOnLanguageChange=false;requestAnimationFrame(()=>scrollToNode(document.getElementById('finding-synthesis')));}
  }
  function coverageMatrix() {
    const rows=research.findings.coverage.periodTierRows;
    const cell=(value)=>value.count?`<details><summary>${value.count}</summary>${personIndex(value.personIds.map(personId=>({personId})),null)}</details>`:'<span class="coverage-empty">0</span>';
    return `<div class="coverage-matrix"><h3>${tr('Who is visible in the sample?','样本覆盖了哪些人物？')}</h3><p>${tr('Counts use profile period tags, not event dates. Overlapping memberships cannot be added. Unresolved includes mixed or unassigned tiers. Expand a cell to see every person.','按人物时期标签统计，不按事件日期统计。重叠归属不可相加；未定包括混合层级与尚未分层者。展开单元格可查看全部人物。')}</p><div class="table-scroll"><table><caption>${tr('People by recorded period and tier','人物时期与层级覆盖')}</caption><thead><tr><th scope="col">${tr('Period','时期')}</th><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th><th scope="col">${tr('Unresolved','未定')}</th><th scope="col">${tr('Total','合计')}</th></tr></thead><tbody>${rows.map(row=>`<tr><th scope="row">${safe(field(row,'label'))}<small>${row.startYear}–${row.endYear}</small></th>${['A','B','C','unresolved'].map(tier=>`<td>${cell(row.tiers[tier])}</td>`).join('')}<td>${row.peopleCount}</td></tr>`).join('')}</tbody></table></div><p class="research-caution">${tr('Empty cells expose sample gaps; they do not mean no such historical actors existed. Coverage is not a measure of historical influence.','空白层级反映样本缺口，并不表示历史上没有这类人物。覆盖人数不是历史影响力指标。')}</p></div>`;
  }
  function sourceCoverage() {
    const c=research.findings.coverage;
    return `<div class="source-coverage"><h3>${tr('Current reference coverage','当前事件来源覆盖')}</h3><dl><div><dt>${tr('Supported events','有来源事件')}</dt><dd>${c.supportedEventCount.toLocaleString()}</dd></div><div><dt>${tr('One cited source URL','仅一条来源网址')}</dt><dd>${c.singleReferenceEventCount.toLocaleString()}</dd></div><div><dt>${tr('Two or more source URLs','两条及以上来源网址')}</dt><dd>${c.multipleReferenceEventCount.toLocaleString()}</dd></div><div><dt>${tr('Dates not established','日期未定')}</dt><dd>${c.missingDateEventCount}</dd></div></dl><p>${tr('These figures count distinct URLs explicitly supporting each event. Multiple links may reproduce the same account; this is reference coverage, not a count of independently corroborated facts.','按每条事件中明确支持该事件的不同来源网址去重统计。多条链接可能转载同一材料；这些数字表示引用覆盖，不等同于独立交叉核验的事实数量。')}</p></div>`;
  }
  function methodText(value) {
    return safe(value.replaceAll('{{peopleCount}}',String(research.findings.meta.peopleCount)).replaceAll('{{dataAsOf}}',research.findings.meta.dataAsOf||''));
  }
  function renderMethod() {
    const contentsOpen=viewNodes.method.querySelector('#methodContents')?.open ?? (window.innerWidth>850);
    viewNodes.method.innerHTML=`<header class="research-header"><div><p class="eyebrow">03 / ${tr('METHOD','研究方法')}</p><h1 tabindex="-1">${safe(field(method,'title'))}</h1><p class="research-intro">${safe(field(method,'intro'))}</p></div><aside class="research-aside"><strong>${tr('Make the method visible.','方法，也应当可见。')}</strong>${tr('An exploratory digital humanities project. Source notes, uncertainty and reproducible counts are part of the argument.','一项探索性的数字人文项目。来源说明、不确定性与可复算的统计，都是研究本身的一部分。')}</aside></header><div class="method-layout"><details id="methodContents" class="method-contents" ${contentsOpen?'open':''}><summary>${tr('Contents','目录')}</summary><nav class="method-index" aria-label="${tr('Method sections','方法章节')}"><p class="method-position" aria-live="off"></p>${method.sections.map((s,i)=>`<a href="#method/${s.id}" data-method-section="${s.id}">${String(i+1).padStart(2,'0')} · ${safe(field(s,'title'))}</a>`).join('')}</nav></details><div>${method.sections.map(s=>`<section class="method-section" id="method-${s.id}" tabindex="-1"><h2>${safe(field(s,'title'))}</h2>${(s['paragraphs'+(state.lang==='en'?'En':'Zh')]||[]).map(p=>`<p>${methodText(p)}</p>`).join('')}${s.bulletsEn?.length?`<ul>${(s.id==='periods'?atlasData.periods.map(p=>field(p,'label')+': '+p.startYear+'–'+p.endYear):s['bullets'+(state.lang==='en'?'En':'Zh')]||[]).map(p=>`<li>${methodText(p)}</li>`).join('')}</ul>`:''}${s.id==='tiers'?coverageMatrix():''}${s.id==='sources'?sourceCoverage():''}</section>`).join('')}<div class="research-download"><a href="data/atlas-data.json" download>${tr('Download the research dataset','下载研究数据')} ↓</a><a href="data/review-coverage.json" download>${tr('View the coverage audit','查看资料覆盖审查')} ↓</a><a href="data/evidence-review.json" download>${tr('Read the evidence correction log','查看证据更正记录')} ↓</a><a href="https://github.com/Shawnxx20100217/power-in-motion" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div></div>`;
    requestAnimationFrame(updateMethodPosition);
  }
  function updateMethodPosition() {
    if(activeView!=='method')return;
    const offset=document.querySelector('.topbar').getBoundingClientRect().height+48;
    const sections=[...viewNodes.method.querySelectorAll('.method-section')];
    const current=sections.filter(s=>s.getBoundingClientRect().top<=offset).at(-1)||sections[0];
    if(!current)return;
    const sectionId=current.id.replace('method-','');
    viewNodes.method.querySelectorAll('[data-method-section]').forEach(a=>{
      const active=a.dataset.methodSection===sectionId;a.classList.toggle('active',active);
      if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
    });
    const position=viewNodes.method.querySelector('.method-position');
    position.textContent=tr('Reading','正在阅读')+' '+String(sections.indexOf(current)+1).padStart(2,'0')+' / '+sections.length;
  }
  function renderNavigation() {
    document.querySelector('[data-view="atlas"]').textContent=tr('Atlas','地图');
    document.querySelector('[data-view="findings"]').textContent=tr('Findings','发现');
    document.querySelector('[data-view="method"]').textContent=tr('Method','方法');
    document.getElementById('startTour').textContent=tr('90-second tour','90秒导览');
    document.getElementById('guidedMode').textContent=tr('Take the 90-second tour','开始90秒导览');
    document.getElementById('heroResearchLine').innerHTML=`${quality.people} ${tr('people','位人物')} · ${research.findings.meta.eventCount.toLocaleString()} ${tr('sourced events','条有来源事件')} · ${Math.min(...atlasData.periods.map(p=>p.startYear))}–${Math.max(...atlasData.periods.map(p=>p.endYear))} <a href="#findings" data-view="findings">${tr('Explore the findings','查看研究发现')} ↗</a>`;
    document.querySelectorAll('.site-nav [data-view]').forEach(a=>a.setAttribute('aria-current',a.dataset.view===activeView?'page':'false'));
    document.getElementById('evidenceReturn').innerHTML=`<button data-back-finding="${safe(returnFinding||'')}">← ${tr('Back to the finding and its sample','返回发现及其样本依据')}</button>`;
    document.getElementById('evidenceReturn').hidden=!returnFinding;
    const contextReturn=document.querySelector('#recordContext .profile-map-return');
    if(contextReturn&&returnFinding){contextReturn.removeAttribute('data-back-map');contextReturn.dataset.backFinding=returnFinding;contextReturn.textContent=tr('← Back to finding','← 返回发现');}
    document.title=activeView==='atlas'?'Power in Motion — A Digital Atlas of Modern China':`${tr(activeView==='findings'?'Findings':'Method',activeView==='findings'?'研究发现':'研究方法')} · Power in Motion`;
  }
  function restoreEvidence(){
    if(!activeEvidence || activeEvidence.personId!==state.selectedId)return;
    activeEvidence.eventIds.forEach(id=>{const row=document.getElementById('event-'+id);if(row){row.classList.add('evidence-focus');const detail=row.querySelector('.event-evidence');if(detail)detail.open=true;}});
  }
  window.researchRefresh=function () {
    const languageChanged=lastLanguage!==state.lang;
    const methodSection=methodSectionOnLanguageChange;
    const methodRoute=location.hash;
    methodSectionOnLanguageChange=null;
    renderNavigation();
    if(lastLanguage!==state.lang){renderFindings();renderMethod();lastLanguage=state.lang;}
    if(languageChanged&&activeView==='method'&&methodSection)requestAnimationFrame(()=>{
      if(activeView!=='method'||tour.active||location.hash!==methodRoute)return;
      scrollToNode(document.getElementById(methodSection));
      updateMethodPosition();
    });
    restoreEvidence();
    if(routeInitialized && location.hash.startsWith('#atlas?')){
      const params=new URLSearchParams(location.hash.split('?')[1]);params.set('lang',state.lang);
      if(activeEvidence&&activeEvidence.personId===state.selectedId){params.set('person',state.selectedId);if(activeEvidence.eventIds.length)params.set('events',activeEvidence.eventIds.join('|'));else params.delete('events');}
      else if(params.get('person')!==state.selectedId){params.set('person',state.selectedId||'');params.delete('events');activeEvidence=null;}
      history.replaceState(null,'','#atlas?'+params);
    }else if(routeInitialized&&languageChanged&&['','#'].includes(location.hash.split('?')[0])){
      const params=new URLSearchParams(location.hash.split('?')[1]);params.set('lang',state.lang);
      history.replaceState(null,'','#?'+params);
    }
    if(tour.active) renderTour();
    const evidenceRoute=location.hash;
    if(languageChanged&&activeView==='atlas'&&evidenceRoute.startsWith('#atlas?')&&activeEvidence?.personId===state.selectedId)requestAnimationFrame(()=>{
      if(activeView!=='atlas'||location.hash!==evidenceRoute)return;
      restoreEvidence();
      if(tour.active){dockTour();scrollToNode(panel);}
      else {const target=activeEvidence.eventIds.map(id=>document.getElementById('event-'+id)).find(Boolean);if(target)scrollToNode(target);}
    });
  };
  function navigate(view,options={}) {
    activeView=Object.hasOwn(viewNodes,view)?view:'atlas';
    Object.entries(viewNodes).forEach(([key,node])=>node.hidden=key!==activeView);
    hero.hidden=activeView!=='atlas';
    renderNavigation();
    if(tour.active)renderTour();
    if(!options.keepHash)history.pushState(null,'',`#${activeView}${options.section?'/'+encodeURIComponent(options.section):''}`);
    const target=options.section?document.getElementById(`${activeView==='findings'?'finding':'method'}-${options.section}`):(activeView==='atlas'?document.querySelector('.map-panel'):viewNodes[activeView]);
    scrollToNode(target || viewNodes[activeView]);
    if(activeView==='atlas')requestAnimationFrame(renderMap);
    if(activeView==='method')requestAnimationFrame(updateMethodPosition);
  }
  function openEvidence(personId,eventIds=[],findingId=null,keepHash=false) {
    const person=peopleById.get(personId);if(!person)return;
    state.period='all';state.timeScope='period';state.placeKey=null;state.layer='all';state.mode='guided';state.search='';state.verifiedOnly=false;state.selectedId=personId;
    personSearch.value='';returnFinding=findingId;activeEvidence={personId,eventIds};
    navigate('atlas',{keepHash:true});syncUI();
    document.querySelectorAll('[data-mode]').forEach(button=>button.classList.toggle('active',button.dataset.mode===state.mode));
    const rows=eventIds.map(id=>document.getElementById('event-'+id)).filter(Boolean);
    rows.forEach(row=>{row.classList.add('evidence-focus');const evidence=row.querySelector('.event-evidence');if(evidence)evidence.open=true;});
    if(!keepHash){const params=new URLSearchParams({person:personId,lang:state.lang});if(eventIds.length)params.set('events',eventIds.join('|'));if(findingId)params.set('finding',findingId);history.pushState(null,'','#atlas?'+params);}
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(typeof window.atlasShowRecord==='function')window.atlasShowRecord(eventIds);
      else scrollToNode(rows[0]||dossier);
      if(tour.active){dockTour();scrollToNode(panel);const control=panel.querySelector('[data-tour="'+(tour.lastFocusAction||'next')+'"]');control?.focus({preventScroll:true});}
    }));
  }
  window.atlasOpenRecord=openEvidence;

  function routeFromHash() {
    const [path,query='']=location.hash.slice(1).split('?');const parts=path.split('/');const params=new URLSearchParams(query);
    if(['en','zh'].includes(params.get('lang'))){state.lang=params.get('lang');syncUI();}
    if(parts[0]==='atlas'&&params.has('person'))openEvidence(params.get('person'),(params.get('events')||'').split('|').filter(Boolean),params.get('finding'),true);
    else if(Object.hasOwn(viewNodes,parts[0])){let section='';try{section=decodeURIComponent(parts[1]||'');}catch{}navigate(parts[0],{section,keepHash:true});}
    else {navigate('atlas',{keepHash:true});if(!path)window.scrollTo({top:0,behavior:'instant'});}
  }
  function stopTimer(){if(tour.timer){clearInterval(tour.timer);tour.timer=null;}}
  function setAutoplay(on){tour.auto=on;stopTimer();if(on)tour.timer=setInterval(()=>{
    if(document.hidden)return;
    tour.remaining=Math.max(0,tour.remaining-1);
    const timer=panel.querySelector('.tour-clock');if(timer)timer.textContent=String(tour.remaining)+'s';
    if(!tour.remaining){if(tour.index<tourSpec.steps.length-1)goTour(tour.index+1);else closeTour();}
  },1000);renderTour();}
  function closeTour(){stopTimer();tour.active=false;tour.auto=false;panel.hidden=true;document.body.classList.remove('touring');document.documentElement.style.removeProperty('--tour-height');document.getElementById('startTour').focus({preventScroll:true});}
  function dockTour(){
    if(!tour.active)return;
    const action=tourSpec.steps[tour.index].action;
    let target=null;
    if(activeView==='method')target=document.getElementById('method-'+(action.kind==='method'?action.sectionId:method.sections[0].id));
    if(activeView==='findings')target=document.getElementById('finding-'+(action.kind==='finding'&&action.findingId!=='first'?action.findingId:findings[0].id));
    if(activeView==='atlas'){
      if(activeEvidence?.personId===state.selectedId)target=activeEvidence.eventIds.map(id=>document.getElementById('event-'+id)).find(Boolean);
      target=target||document.querySelector('.map-panel');
    }
    if(target?.classList.contains('map-panel'))target.prepend(panel);
    else if(target&&target!==panel&&target.parentElement)target.before(panel);
    else viewNodes[activeView].prepend(panel);
  }
  function renderTour(){
    if(!tour.active)return;const step=tourSpec.steps[tour.index];
    const focusAction=panel.contains(document.activeElement)?document.activeElement.dataset.tour:(document.activeElement===document.body?tour.lastFocusAction:null);
    panel.hidden=false;
    panel.innerHTML=`<div class="tour-top"><span>${tr('GUIDED TOUR','研究导览')} · ${tour.index+1} / ${tourSpec.steps.length} · <span class="tour-clock">${tour.remaining}s</span></span><button class="tour-close" data-tour="close">${tr('Close','关闭')} ×</button></div><h2 id="tourTitle">${safe(field(step,'title'))}</h2><p>${safe(field(step,'body'))}</p><div class="tour-progress" aria-hidden="true"><span style="width:${(tour.index+1)/tourSpec.steps.length*100}%"></span></div><div class="tour-controls"><button data-tour="previous" ${tour.index===0?'disabled':''}>← ${tr('Back','上一步')}</button><button data-tour="auto" aria-pressed="${tour.auto}">${tour.auto?tr('Pause','暂停'):tr('Auto-play','自动播放')}</button><button data-tour="next">${tour.index===tourSpec.steps.length-1?tr('Finish','完成'):tr('Next','下一步')} →</button></div><p class="tour-hint">${tr('Approx. 90 seconds. Manual by default; follow the evidence at your own pace.','约90秒。默认手动前进，可以停下来逐项核对来源。')}</p>`;
    dockTour();
    if(focusAction){const button=panel.querySelector('[data-tour="'+focusAction+'"]');if(button&&!button.disabled)button.focus({preventScroll:true});}
  }
  function goTour(index,focusAction=null){
    tour.index=index;tour.remaining=tourSpec.steps[index].durationSeconds;
    const action=tourSpec.steps[index].action;
    if(action.kind==='method')navigate('method',{section:action.sectionId});
    if(action.kind==='person')openEvidence(action.personId,[action.eventId]);
    if(action.kind==='finding')navigate('findings',{section:action.findingId==='first'?findings[0].id:action.findingId});
    if(action.kind==='atlas'){
      state.period='all';state.timeScope='period';state.placeKey=null;state.layer='all';state.search='';state.verifiedOnly=false;state.mode='explore';personSearch.value='';returnFinding=null;activeEvidence=null;syncUI();
      document.querySelectorAll('[data-mode]').forEach(button=>button.classList.toggle('active',button.dataset.mode==='explore'));
      navigate('atlas');
    }
    renderTour();
    requestAnimationFrame(()=>{dockTour();scrollToNode(panel);if(focusAction){const control=panel.querySelector('[data-tour="'+focusAction+'"]');if(control&&!control.disabled)control.focus({preventScroll:true});}});
  }
  function startTour(){stopTimer();tour={active:true,index:0,auto:false,remaining:20,timer:null};document.body.classList.add('touring');goTour(0,'next');}
  document.addEventListener('click',event=>{
    const target=event.target.closest('button,a');if(!target)return;
    // A real link handles keyboard activation and preserves language. Repeated
    // home clicks need an explicit scroll because the hash may already match.
    if(target.hasAttribute('data-home')&&target.hash===location.hash&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();routeFromHash();}
    if(target.dataset.view){event.preventDefault();navigate(target.dataset.view);}
    if(target.dataset.methodSection){event.preventDefault();navigate('method',{section:target.dataset.methodSection});}
    if(target.dataset.openFindingAudit){
      const audit=document.getElementById('audit-'+target.dataset.openFindingAudit);
      if(audit){audit.open=true;const summary=audit.querySelector('summary');summary?.focus({preventScroll:true});scrollToNode(summary||audit);}
    }
    if(target.dataset.evidencePerson){if(tour.active)setAutoplay(false);openEvidence(target.dataset.evidencePerson,(target.dataset.evidenceEvents||'').split('|').filter(Boolean),target.dataset.returnFinding);}
    if(target.hasAttribute('data-back-finding'))navigate('findings',{section:target.dataset.backFinding});
    if(target.id==='startTour'||target.id==='guidedMode'){event.preventDefault();startTour();}
    if(target.dataset.tour){
      const action=target.dataset.tour;
      if(action==='close')closeTour();
      if(action==='auto')setAutoplay(!tour.auto);
      if(action==='previous'&&tour.index>0){setAutoplay(false);goTour(tour.index-1,'previous');}
      if(action==='next'){if(tour.index===tourSpec.steps.length-1)closeTour();else{setAutoplay(false);goTour(tour.index+1,'next');}}
    }
    if(tour.active&&target.tagName==='A'&&/^https?:/.test(target.href))setAutoplay(false);
  });
  document.addEventListener('focusin',e=>{if(e.target?.dataset?.tour)tour.lastFocusAction=e.target.dataset.tour;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&tour.active)closeTour();});
  let methodScrollPending=false;
  window.addEventListener('scroll',()=>{if(activeView==='method'&&!methodScrollPending){methodScrollPending=true;requestAnimationFrame(()=>{updateMethodPosition();methodScrollPending=false;});}},{passive:true});
  matchMedia('(max-width:850px)').addEventListener('change',event=>{const contents=document.getElementById('methodContents');if(contents)contents.open=!event.matches;});
  window.addEventListener('hashchange',routeFromHash);
  window.addEventListener('popstate',routeFromHash);
  window.researchRefresh();routeFromHash();routeInitialized=true;
})();
