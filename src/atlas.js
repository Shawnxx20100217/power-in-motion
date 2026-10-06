
    const atlasData = __ATLAS_DATA__;
    const normalizedPeriods = (atlasData.periods || []).map(period => ({ ...period, label: period.labelZh || period.label || '', labelEn: period.labelEn || period.label_en || '', range: period.range || `${period.startYear || period.start_year}—${period.endYear || period.end_year}`, start: period.start || period.startYear || period.start_year, end: period.end || period.endYear || period.end_year }));
    const periods = [{ id: 'all', label: '全时期', labelEn: 'All periods', range: '1840—2026', start: 1840, end: 2026 }, ...normalizedPeriods];
    const sourceCatalog = atlasData.sources || [];
    const sourceById = new Map(sourceCatalog.map(source => [source.source_id || source.id, source]));
    const placeDefs = {
      xianxiang: { name: '湖南湘乡', x: 505, y: 350 }, shaoshan: { name: '湖南韶山', x: 515, y: 367 }, guangan: { name: '四川广安', x: 445, y: 363 }, huizhou: { name: '广东惠州', x: 615, y: 405 },
      xiangshan: { name: '广东香山 / 中山', x: 604, y: 427 }, fenghua: { name: '浙江奉化', x: 695, y: 318 }, yangzhou: { name: '江苏扬州', x: 676, y: 257 },
      beijing: { name: '北京', x: 650, y: 144 }, yanan: { name: '延安', x: 492, y: 200 }, xian: { name: '西安', x: 500, y: 249 },
      huaian: { name: '江苏淮安', x: 660, y: 238 }, shanghai: { name: '上海', x: 710, y: 292 }, nanjing: { name: '南京', x: 672, y: 284 }, wuhan: { name: '武汉', x: 585, y: 316 },
      chongqing: { name: '重庆', x: 475, y: 338 }, guangzhou: { name: '广州', x: 601, y: 419 }, hongkong: { name: '香港', x: 629, y: 454 },
      macau: { name: '澳门', x: 615, y: 459 }, taipei: { name: '台北', x: 744, y: 413 }, qingdao: { name: '青岛', x: 691, y: 218 },
      paris: { name: '巴黎', x: 116, y: 177 }, france: { name: '法国', x: 150, y: 235 }, baise: { name: '广西百色', x: 505, y: 405 }, tokyo: { name: '东京', x: 827, y: 238 }, honolulu: { name: '檀香山', x: 96, y: 386 },
      haicheng: { name: '海城', x: 727, y: 169 }, shenyang: { name: '奉天 / 沈阳', x: 735, y: 145 }, tianjin: { name: '天津', x: 666, y: 190 },
      changsha: { name: '长沙', x: 530, y: 355 }, fuzhou: { name: '福州', x: 670, y: 395 }, nanchang: { name: '南昌', x: 615, y: 365 },
      kunming: { name: '昆明', x: 395, y: 430 }, hangzhou: { name: '杭州', x: 700, y: 330 }, jilin: { name: '吉林', x: 760, y: 115 },
      lanzhou: { name: '兰州', x: 440, y: 250 }, urumqi: { name: '乌鲁木齐', x: 310, y: 210 }, dali: { name: '大理', x: 370, y: 455 },
      '苏联': { name: '苏联', x: 210, y: 220 }, '美国': { name: '美国', x: 70, y: 260 }, '英国': { name: '英国', x: 95, y: 210 },
      '伊犁': { name: '伊犁', x: 280, y: 245 }, '新疆': { name: '新疆', x: 330, y: 240 }, '西藏': { name: '西藏', x: 355, y: 330 },
      sanzhi: { name: '三芝', x: 744, y: 396 }, taiwan_region: { name: '台湾（区域）', x: 735, y: 440 },
      shuangfeng: { name: '湘乡县（今双峰）', x: 510, y: 380 }, huiyang: { name: '归善（今惠阳）', x: 623, y: 416 },
      canada: { name: '加拿大', x: 48, y: 340 }, york_university: { name: '约克大学', x: 115, y: 350 },
      cornell: { name: '康奈尔大学', x: 70, y: 305 }, london: { name: '伦敦', x: 115, y: 285 }, liverpool: { name: '利物浦', x: 90, y: 235 },
    };
    Object.assign(placeDefs, atlasData.schematicPlaces || {});
    const places = placeDefs;
    // Presentation only: keys, coordinates and historical event records remain unchanged.
    const placeDisplay = __PLACE_DISPLAY__;
    const roleEn = {
      '革命': 'Revolutionary', '政党': 'Party leadership', '政治': 'Political leadership', '军事': 'Military', '改革': 'Reform', '思想': 'Political thought',
      '外交': 'Diplomacy', '行政': 'Public administration', '安全治理': 'Security governance', '组织': 'Organization', '司法': 'Judiciary', '港澳治理': 'Hong Kong & Macao governance',
      '宫廷政治': 'Court politics', '统一战线': 'United front', '经济治理': 'Economic governance', '民主化': 'Democratization', '产业政策': 'Industrial policy', '工程治理': 'Engineering governance',
      '地方军阀': 'Regional power', '地方政权': 'Regional power', '经济改革': 'Economic reform', '争议政治力量': 'Contested political actor'
    };
    const typeEn = { career: 'Career', birth: 'Birth / birth date', ancestral: 'Ancestral origin', upbringing: 'Upbringing', education: 'Education', political_activity: 'Political activity', activity: 'Political activity', office: 'Public office', appointment: 'Public office', war: 'War / theatre', regional_base: 'Regional base', death: 'Death / event', key: 'Key place', unknown: 'Place lead' };
    const typeZh = { career: '职业经历', birth: '出生 / 日期', ancestral: '籍贯 / 祖籍', upbringing: '成长地', education: '教育', political_activity: '政治活动', activity: '政治活动', office: '任职', appointment: '任职', war: '战争 / 战区', regional_base: '区域基地', death: '死亡 / 事件', key: '地点线索', unknown: '地点线索' };
    const eventLayers = [
      {id:'birth',types:['birth'],marker:'birth',en:'Birthplace',zh:'出生地'},
      {id:'ancestral',types:['ancestral'],marker:'ancestral',en:'Ancestral origin',zh:'籍贯 / 祖籍'},
      {id:'upbringing',types:['upbringing'],marker:'ancestral',en:'Upbringing / residence',zh:'成长 / 居住'},
      {id:'education',types:['education'],marker:'education',en:'Education',zh:'教育'},
      {id:'political_activity',types:['political_activity','activity'],marker:'activity',en:'Political activity',zh:'政治活动'},
      {id:'office',types:['office','appointment'],marker:'appointment',en:'Public office',zh:'任职'},
      {id:'career',types:['career'],marker:'key',en:'Career',zh:'职业经历'},
      {id:'key',types:['key','unknown','war','regional_base','death'],marker:'key',en:'Other records',zh:'其他记录'}
    ];
    const eventLayerById = new Map(eventLayers.map(layer=>[layer.id,layer]));
    const eventLayerByType = new Map(eventLayers.flatMap(layer=>layer.types.map(type=>[type,layer])));
    const eventLayer = type => eventLayerByType.get(type) || eventLayerById.get('key');
    typeEn.upbringing='Upbringing / residence';typeZh.upbringing='成长 / 居住';
    const state = { period: 'all', layer: 'all', mode: 'guided', search: '', verifiedOnly: false, timeScope: 'period', placeKey: null, selectedId: atlasData.people?.find(person => person.nameZh === '孙中山')?.id || atlasData.people?.[0]?.id || null, lang: 'en' };
    const periodList = document.getElementById('periodList');
    const layerList = document.getElementById('layerList');
    const miniList = document.getElementById('miniList');
    const personSearch = document.getElementById('personSearch');
    const dossier = document.getElementById('dossier');
    const routeLayer = document.getElementById('routeLayer');
    const placeLayer = document.getElementById('placeLayer');
    const labelLayer = document.getElementById('labelLayer');
    const coverageFilter = document.createElement('button');
    coverageFilter.id = 'coverageFilter';
    coverageFilter.className = 'coverage-filter';
    coverageFilter.type = 'button';
    personSearch.insertAdjacentElement('afterend', coverageFilter);

    function escapeHTML(value) { return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
    function rawToKey(raw) {
      const text = String(raw || '');
      const pairs = [['北京','beijing'],['上海','shanghai'],['南京','nanjing'],['广州','guangzhou'],['重庆','chongqing'],['西安','xian'],['延安','yanan'],['淮安','huaian'],['武汉','wuhan'],['香港','hongkong'],['澳门','macau'],['台北','taipei'],['台湾','taiwan_region'],['巴黎','paris'],['法国','france'],['百色','baise'],['惠州','huizhou'],['东京','tokyo'],['檀香山','honolulu'],['湘乡','xianxiang'],['韶山','shaoshan'],['广安','guangan'],['香山','xiangshan'],['奉化','fenghua'],['扬州','yangzhou'],['海城','haicheng'],['奉天','shenyang'],['沈阳','shenyang'],['天津','tianjin'],['长沙','changsha'],['福州','fuzhou'],['南昌','nanchang'],['昆明','kunming'],['杭州','hangzhou'],['吉林','jilin'],['兰州','lanzhou'],['乌鲁木齐','urumqi'],['大理','dali'],['苏联','苏联'],['美国','美国'],['英国','英国'],['伊犁','伊犁'],['新疆','新疆'],['西藏','西藏']];
      return pairs.find(([needle]) => text.includes(needle))?.[1] || null;
    }
    function sourceRecord(ref) {
      if (!ref) return null;
      if (typeof ref === 'string') ref = { sourceId: ref };
      const raw = sourceById.get(ref.sourceId || ref.id) || ref;
      return { ...raw, ...ref, source_id: raw.source_id || raw.id || ref.sourceId || ref.id, title: ref.title || raw.title || raw.titles?.[0] || raw.url || 'Source', tier: raw.tier || raw.tiers?.[0] || ref.tier || '', scope: raw.scope || raw.scopes?.[0] || ref.scope || '', url: ref.url || raw.url || '' };
    }
    function normalizeEvent(event, index) {
      const raw = event.raw_zh || event.rawZh || event.raw || event.placeText || event.place || '';
      const type = event.type || 'unknown';
      const key = event.mapKey || event.placeKey || (event.status === 'verified' ? null : (places[event.place] ? event.place : rawToKey(raw))); // Verified locations require an explicit reviewed map key.
      const pending = event.pending !== false && event.status !== 'verified';
      return { ...event, id: event.id || `lead-${index}`, raw, type, place: key, pending, status: event.status || (pending ? 'unstructured_lead' : 'broad_region'), label: event.label || typeZh[type] || '地点线索', note: event.note || event.qualifier || '', pendingReasons: event.pendingReasons || (pending ? ['Event-level place and coordinate verification pending.'] : []) };
    }
    function normalizePerson(person) {
      const nameZh = person.nameZh || person.name || '';
      const editorial = person.editorial || {};
      const nameEn = editorial.name_en || person.nameEn || person.name_en || person.roman || nameZh;
      const roleCodes = person.roleTags || person.roles || [];
      const roleLabelsZh = person.roleLabelsZh || roleCodes;
      const roleLabelsEn = editorial.roles_en || person.roleLabelsEn || roleCodes.map(role => roleEn[role] || role);
      const sourceRefs = person.sourceRefs || [];
      const placeLeads = (person.placeLeads || person.events || person.path || []).map(normalizeEvent);
      const claims = person.claims || [{ id: `${person.id}-claim`, textZh: person.claimZh || person.officeImpactZh || person.notesZh || '', textEn: person.claim || person.claimEn || '', status: 'editorial', sourceRefs: [], origin: 'merged record' }];
      const noteItems = Array.isArray(person.notes) ? person.notes.map(note => typeof note === 'string' ? note : note?.text || '').filter(Boolean) : [person.notes || person.notesZh || ''].filter(Boolean);
      return { ...person, editorial, id: person.id || person.person_id, name: nameZh, nameZh, nameEn, roman: nameEn.toUpperCase(), periods: person.periodIds || person.periods || [], roles: roleLabelsZh, roleCodes, roleTags: roleCodes, roleLabelsZh, rolesEn: roleLabelsEn, layer: person.layer || '—', status: person.recordStatus || person.status || 'candidate', candidateStatus: person.candidateStatus || '', evidenceLevel: person.evidenceLevel || person.sourceGrades?.[0] || person.sourceGrade || 'Pending', entities: person.entities || [], coverage: person.rawCoverage || person.coverage_scope || '', claims, placeLeads, path: placeLeads, sourceRefs, notes: noteItems.join(' · '), notesZh: person.notesZh || noteItems.join(' · '), uncertainty: person.uncertainty || person.uncertaintyFlags || '', officeImpactZh: person.officeImpactZh || '', officeImpactEn: editorial.office_impact_en || person.officeImpactEn || '', inclusionBasisEn: editorial.inclusion_en || person.inclusionBasisEn || '', notesEn: person.notesEn || editorial.notes_en || '', claim: editorial.summary_en || claims[0]?.textEn || person.claim || '', claimZh: claims[0]?.textZh || person.claimZh || '' };
    }
    const people = (atlasData.people || []).map(normalizePerson);
    const peopleById = new Map(people.map(person => [person.id, person]));
    const quality = {
      people: people.length,
      peopleWithClaims: people.filter(person => (person.claims || []).length > 0).length,
      leads: people.reduce((total, person) => total + (person.placeLeads || []).length, 0),
      typedLeads: people.reduce((total, person) => total + (person.placeLeads || []).filter(item => item.type && item.type !== 'unknown').length, 0),
      verifiedLeads: people.reduce((total, person) => total + (person.placeLeads || []).filter(item => !item.pending && item.status === 'verified').length, 0),
      coordinates: people.reduce((total, person) => total + (person.placeLeads || []).filter(item => item.coordinates).length, 0)
    };
    function periodLabel(period) { return state.lang === 'en' ? (period.labelEn || period.label) : period.label; }
    function displayName(person) { return state.lang === 'en' ? person.nameEn : person.nameZh; }
    function secondaryName(person) { return state.lang === 'en' ? person.nameZh : person.nameEn; }
    function roleLabel(role) { return state.lang === 'en' ? (roleEn[role] || role) : role; }
    function mapPlaceLabel(key, lang=state.lang) { return lang==='en' ? (placeDisplay[key]?.labelEn || places[key]?.name || key || 'Place pending') : (places[key]?.name || key || '待核地点'); }
    function pathLabel(item) { return state.lang === 'en' ? (typeEn[item.type] || item.label || 'Place lead') : (typeZh[item.type] || item.label || '地点线索'); }
    function pathNote(item) {
      if (item.status === 'verified') return state.lang === 'en' ? (item.qualifierEn || (item.place ? 'Source checked; map position is schematic.' : 'Source checked; no map position assigned.')) : (item.qualifierZh || (item.place ? '已核对事件来源；地图位置为示意。' : '已核对来源，未指定地图坐标。'));
      if (item.note || item.noteEn || item.noteZh) return state.lang === 'en' ? (item.noteEn || item.note || item.noteZh) : (item.noteZh || item.note || item.noteEn);
      if (item.pending) return state.lang === 'en' ? 'Event-level verification pending.' : '事件级核验待完成。';
      return state.lang === 'en' ? (item.qualifierEn || item.qualifier || '') : (item.qualifierZh || item.qualifier || '');
    }
    function eventEvidenceState(item) { return !item.pending && item.status === 'verified' ? 'verified' : item.type && item.type !== 'unknown' ? 'typed' : 'lead'; }
    function layerMatches(item, layer) {
      return layer === 'all' || eventLayer(item.type).id === layer;
    }
    function selectedPerson() { return peopleById.get(state.selectedId) || null; }
    function currentPeople() { return people.filter(person => { const periodMatch = state.period === 'all' || person.periods.includes(state.period); const haystack = [person.nameZh, person.nameEn, ...(person.roles || []), ...(person.rolesEn || []), ...(person.entities || []), ...(person.politicalEntitiesEn || []), ...(person.politicalEntitiesZh || []), person.notesZh, person.notesEn, person.claim, person.claimZh, person.inclusionBasisEn, person.officeImpactEn].filter(Boolean).join(' ').toLowerCase(); return periodMatch && (!state.verifiedOnly || person.placeLeads.some(item=>isVerified(item)&&supportedRefs(item).length)) && (!state.search || haystack.includes(state.search.toLowerCase())); }); }
    function pathClass(type) { return eventLayer(type).marker; }
    function eventYear(event) {
      const value = event.yearStart ?? event.year ?? event.startYear ?? event.dateYear;
      if (value == null || value === '') return null;
      const parsed = Number(value);
      return Number.isInteger(parsed) ? parsed : null;
    }
    function isVerified(item) { return !item.pending && item.status === 'verified'; }
    function supportedRefs(item) { return (item.sourceRefs || []).filter(ref => ref.relationship === 'event_evidence' && ref.evidenceStatus === 'event_supported' && /^https?:\/\//.test(sourceRecord(ref)?.url || '')); }
    function verifiedEvents(person) {
      return (person.placeLeads || []).filter(item => isVerified(item) && item.type && item.type !== 'unknown' && eventYear(item) !== null && supportedRefs(item).length && item.place && places[item.place] && item.routeEligible !== false && (item.coordinates || /^schematic_/.test(item.coordinateStatus || '')));
    }
    function routeSegments(person, scoped = false) {
      const events = verifiedEvents(person).sort((a, b) => eventYear(a) - eventYear(b));
      const segments = [];
      const endOf = event => Math.max(eventYear(event), Number(event.yearEnd ?? eventYear(event)));
      // Dates are compared at year precision. Different places in overlapping year intervals
      // cannot be assigned an arrival/departure order merely from source row order.
      const ambiguous = new Set(events.filter(event => events.some(other =>
        other !== event && other.place !== event.place && eventYear(event) <= endOf(other) && eventYear(other) <= endOf(event)
      )));
      for (let i = 1; i < events.length; i++) {
        const from = events[i - 1], to = events[i];
        const endYear = from.yearEnd == null ? eventYear(from) : Number(from.yearEnd);
        // Equal years, overlapping ranges, and repeated locations do not prove a movement order.
        if (from.place === to.place || eventYear(from) === eventYear(to) || endYear >= eventYear(to) || ambiguous.has(from) || ambiguous.has(to)) continue;
        // Apply the period gate to existing adjacent pairs; filtering must never create a new bridge.
        if (scoped && (!eventInTimeScope(from) || !eventInTimeScope(to))) continue;
        segments.push({from, to});
      }
      return segments;
    }
    function routePath(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const lift = Math.max(12, Math.min(54, Math.abs(dx) * .16));
      const midX = (x1 + x2) / 2;
      return `M ${x1} ${y1} Q ${midX} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
    }
    function renderVerifiedRoutes(list) {
      const routePeople = state.selectedId ? list.filter(person => person.id === state.selectedId) : list;
      routePeople.forEach(person => {
        for (const segment of routeSegments(person, true)) {
          if (!layerMatches(segment.from, state.layer) || !layerMatches(segment.to, state.layer)) continue;
          const from = places[segment.from.place];
          const to = places[segment.to.place];
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', routePath(from.x, from.y, to.x, to.y));
          path.setAttribute('class', `route verified-route ${person.id === state.selectedId ? 'selected' : 'dim'}`);
          path.setAttribute('aria-label', `${displayName(person)}: ${mapPlaceLabel(segment.from.place)} → ${mapPlaceLabel(segment.to.place)}`);
          routeLayer.appendChild(path);
        }
      });
    }

    function selectedPeriod() { return periods.find(period => period.id === state.period) || periods[0]; }
    function eventInTimeScope(event) {
      if (state.period === 'all' || state.timeScope === 'life') return true;
      const start = eventYear(event);
      if (start === null) return false;
      const value = event.yearEnd ?? event.endYear ?? start;
      const end = Number.isInteger(Number(value)) ? Number(value) : start;
      const period = selectedPeriod();
      return start <= period.end && Math.max(start, end) >= period.start;
    }
    function mappedEvents(person) {
      return person.placeLeads.filter(event => eventInTimeScope(event) && layerMatches(event, state.layer) && (!state.verifiedOnly || (isVerified(event)&&supportedRefs(event).length)) && event.place && places[event.place]);
    }
    function uniqueEventSources(event) {
      return [...new Map(supportedRefs(event).map(sourceRecord).filter(ref => ref?.url).map(ref => [ref.url, ref])).values()];
    }
    function evidenceCounts(events) {
      const supported = events.filter(event => isVerified(event) && uniqueEventSources(event).length);
      return { supported: supported.length, single: supported.filter(event => uniqueEventSources(event).length === 1).length, multiple: supported.filter(event => uniqueEventSources(event).length > 1).length };
    }
    function labelText(id, value, fallback) {
      const node = document.getElementById(id) || fallback;
      if (node) node.textContent = value;
    }
    function renderLanguage() {
      const en = state.lang === 'en';
      document.querySelectorAll('[data-mode]').forEach(button=>{button.classList.toggle('active',button.dataset.mode===state.mode);button.setAttribute('aria-pressed',String(button.dataset.mode===state.mode));});
      document.documentElement.lang = en ? 'en' : 'zh-CN';
      document.documentElement.dataset.lang = state.lang;
      document.title = en ? 'Power in Motion — A Digital Atlas of Modern China' : '权力迁徙图 · 中国近现代政治人物地图';
      document.querySelectorAll('.sea-label').forEach((label,index)=>{label.textContent=(en?['East China Sea','South China Sea','Schematic map']:['东海','南海','地理示意图'])[index];});
      document.querySelectorAll('[data-lang]').forEach(button=>{button.classList.toggle('active',button.dataset.lang===state.lang);button.setAttribute('aria-pressed',String(button.dataset.lang===state.lang));});
      const allEvidence = evidenceCounts(people.flatMap(person=>person.placeLeads));
      labelText('topStatus',en ? `Research collection · ${atlasData.meta?.asOf || '2026-10-05'} · ${quality.people} people · ${allEvidence.supported} sourced events` : `研究样本 · ${atlasData.meta?.asOf || '2026-10-05'} · ${quality.people} 位人物 · ${allEvidence.supported} 条有来源事件`);
      document.querySelector('.brand-name').innerHTML=en?'POWER IN MOTION <span class="cn-note">权力迁徙图</span>':'权力迁徙图 <span class="cn-note">POWER IN MOTION</span>';
      document.querySelector('.brand-name').href=`#?lang=${state.lang}`;
      document.querySelector('.brand-name').setAttribute('aria-label',en?'Power in Motion — Home':'权力迁徙图 — 返回首页');
      labelText('heroEyebrow',en?'1840 — 2026 · MODERN CHINA':'1840 — 2026 · 中国近现代');
      document.getElementById('hero-title').innerHTML=en?'Where do<br><em>political lives begin?</em><span class="cn-note">政治人物从哪里来？</span>':'政治人物<br><em>从哪里来？</em><span class="cn-note">Where do political lives begin?</span>';
      labelText('heroDek',en?'Explore the places that shaped political lives in modern China: local communities, schools, movements, and centers of power. Open each biography to inspect its sources and limits.':'从地方社会、学校、政治组织到权力中心，探索中国近现代政治人物的空间经历。打开人物档案，逐项检查来源与证据边界。');
      document.getElementById('enterAtlas').innerHTML=en?'Explore the atlas <span aria-hidden="true">↗</span>':'进入地图 <span aria-hidden="true">↗</span>';
      labelText('guidedMode',en?'Follow one life':'跟随一位人物');
      const caption=document.querySelector('.hero-caption'); if(caption)caption.textContent=en?'Selected records, not a reconstructed journey.':'精选履历记录，不代表实际行程还原。';
      document.querySelector('.section-intro .eyebrow').textContent=en?'01 / EXPLORE THE ATLAS':'01 / 探索地图';
      labelText('atlas-title',en?'Start with a place. Follow a life.':'从一处地点，进入一段人生。');
      const subtitle=document.querySelector('.section-intro > div > .cn-note'); if(subtitle)subtitle.textContent=en?'从一处地点，进入一段人生。':'Start with a place. Follow a life.';
      document.querySelector('.section-intro > p').textContent=en?`${quality.people} curated profiles across five overlapping periods. Select a person, inspect an event, then follow its source.`:`${quality.people} 份人物档案，横跨五个重叠时期。选择人物、查看事件，再追溯来源。`;
      labelText('modeLabel',en?'Viewing mode':'查看模式',document.querySelector('.mode-switch')?.previousElementSibling);
      labelText('periodsLabel',en?'Periods':'历史时期',periodList.previousElementSibling);
      labelText('layersLabel',en?'Event type':'事件类型',layerList.previousElementSibling);
      labelText('peopleLabel',en?`People · ${currentPeople().length}/${quality.people}`:`人物 · ${currentPeople().length}/${quality.people}`,personSearch.closest('.control-block')?.querySelector('.panel-label'));
      labelText('filterToggle',en?'Explore & filter':'探索与筛选');
      document.querySelector('.mode-switch').setAttribute('aria-label',en?'Viewing mode':'查看模式');
      document.querySelector('[data-mode="guided"]').textContent=en?'Focus on one life':'聚焦一位人物';
      document.querySelector('[data-mode="explore"]').textContent=en?'Explore shared places':'探索共同地点';
      coverageFilter.textContent=en?'Sourced events only':'仅显示有来源事件';
      coverageFilter.setAttribute('aria-pressed',String(state.verifiedOnly));coverageFilter.classList.toggle('active',state.verifiedOnly);
      personSearch.placeholder=en?'Search name, role, or entity':'搜索姓名、角色或政治实体';personSearch.setAttribute('aria-label',personSearch.placeholder);
      document.querySelector('.map-panel').setAttribute('aria-label',en?'Schematic map of biographical places':'人物履历地点示意图');
      document.querySelector('.map-key').setAttribute('aria-label',en?'Location legend':'地点图例');
      const legendGroups=new Map();eventLayers.forEach(layer=>{if(!legendGroups.has(layer.marker))legendGroups.set(layer.marker,[]);legendGroups.get(layer.marker).push(layer[en?'en':'zh']);});
      document.querySelector('.map-key').innerHTML=[...legendGroups].map(([kind,labels])=>`<div class="key-row"><span class="key-mark ${kind}"></span>${escapeHTML(labels.join(' · '))}</div>`).join('')+`<div class="key-row"><span class="key-mark ghost"></span>${en?'Unreviewed lead':'待核线索'}</div>`;
      document.querySelector('.timeline-head span').textContent=en?'OVERLAPPING PERIODS':'重叠时期';
      document.querySelector('.discovery-label').textContent=en?'RESEARCH NOTE · READING THE EVIDENCE':'研究说明 · 阅读证据';
      document.querySelector('#discovery h3').textContent=en?'A line is a way to read a life. It is not proof of a journey.':'连线帮助阅读履历，并不证明一次旅程。';
      document.querySelector('#discovery > div:first-child > p:last-child').textContent=en?`${quality.people} curated biographies contain ${allEvidence.supported} source-backed events. ${allEvidence.single} events cite one source URL; ${allEvidence.multiple} cite more than one. Multiple URLs do not necessarily mean independent corroboration. The collection is not a representative census.`:`${quality.people} 份选定人物档案收录 ${allEvidence.supported} 条有来源事件，其中 ${allEvidence.single} 条引用单一来源网址，${allEvidence.multiple} 条引用多个网址。多个链接并不等于独立交叉核验；这一样本不构成历史人物的代表性普查。`;
      document.querySelector('.discovery-side').innerHTML=en?'<strong>Keep three things separate.</strong>Recorded presence, a jurisdiction, and an ancestral place mean different things. Only dated personal presence can support a connection.':'<strong>区分三种地点关系。</strong>本人到场、任职辖区与籍贯含义不同。只有时间明确的本人到场记录，才可参与示意连接。';
      const methods=en?[['02 / METHOD','Follow lives across places.','Read the inclusion rules, overlapping periods and evidence limits.'],['03 / EVIDENCE','Inspect the source behind an event.',`${allEvidence.supported} sourced events. Dates, location precision and source support remain separate checks.`],['04 / STATUS',`${quality.people} people, an open research collection.`,'Sample coverage and remaining gaps are visible in Method.']]:[['02 / 方法','循着履历，探索地点。','查看纳入标准、时期重叠规则与证据边界。'],['03 / 证据','查看事件背后的来源。',`${allEvidence.supported} 条有来源事件。日期、地点精度与来源支持分别核对。`],['04 / 状态',`${quality.people} 位人物，持续完善的研究样本。`,'在方法页查看样本覆盖情况与仍待研究的缺口。']];
      document.querySelectorAll('.method-item').forEach((item,index)=>{if(!methods[index])return;const [eyebrow,title,body]=methods[index];item.querySelector('.eyebrow').textContent=eyebrow;item.querySelector('h3').textContent=title;item.querySelector('p:last-child').textContent=body;});
      document.querySelector('footer span:first-child').textContent=en?'Power in Motion / 权力迁徙图 · Research edition':'权力迁徙图 / Power in Motion · 研究版';
      document.querySelector('footer span:last-child').textContent=en?'Digital humanities · history × geography × evidence':'数字人文 · 历史 × 地理 × 证据';
      renderHeroRecord();
    }
    function renderPeriods() {
      periodList.innerHTML=periods.map(period=>`<button class="${state.period===period.id?'active':''}" data-period="${period.id}" data-focus-key="period-${period.id}" aria-pressed="${state.period===period.id}">${escapeHTML(periodLabel(period))}<span class="period-range">${period.range}</span></button>`).join('');
      periodList.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{state.period=button.dataset.period;state.timeScope='period';state.placeKey=null;syncUI();}));
      document.getElementById('timelineTrack').innerHTML=periods.slice(1).map(period=>`<button class="timeline-segment ${state.period===period.id?'active':''}" data-period="${period.id}" data-focus-key="timeline-${period.id}" aria-pressed="${state.period===period.id}"><span>${escapeHTML(periodLabel(period))}</span></button>`).join('');
      document.querySelectorAll('.timeline-segment').forEach(button=>button.addEventListener('click',()=>{state.period=button.dataset.period;state.timeScope='period';state.placeKey=null;syncUI();}));
      let controls=document.getElementById('timeScopeControls');
      if(!controls){controls=document.createElement('div');controls.id='timeScopeControls';periodList.insertAdjacentElement('afterend',controls);}
      const en=state.lang==='en';controls.hidden=state.period==='all';
      controls.innerHTML=`<div class="scope-switch" role="group" aria-label="${en?'Event time scope':'事件时间范围'}"><button type="button" data-scope="period" data-focus-key="scope-period" aria-pressed="${state.timeScope==='period'}">${en?'In this period':'本时期事件'}</button><button type="button" data-scope="life" data-focus-key="scope-life" aria-pressed="${state.timeScope==='life'}">${en?'Full lives':'完整生平'}</button></div><p class="scope-note">${en?(state.timeScope==='period'?'The map shows dated events intersecting this period. Undated records remain in the full biography.':'The map shows complete lives of people associated with this period, including events outside it.'):(state.timeScope==='period'?'地图仅显示日期与本时期相交的事件。日期不明的记录保留在完整档案中。':'地图显示与本时期相关人物的完整生平，包含时期以外的事件。')}</p>`;
      controls.querySelectorAll('[data-scope]').forEach(button=>button.addEventListener('click',()=>{state.timeScope=button.dataset.scope;state.placeKey=null;syncUI();}));
    }
    function renderLayers() {
      const labels=[['all',state.lang==='en'?'All event types':'全部事件类型'],...eventLayers.map(layer=>[layer.id,layer[state.lang==='en'?'en':'zh']])];
      layerList.innerHTML=labels.map(([id,label])=>`<button class="${state.layer===id?'active':''}" data-layer="${id}" data-focus-key="layer-${id}" aria-pressed="${state.layer===id}">${label}</button>`).join('');
      layerList.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{state.layer=button.dataset.layer;state.placeKey=null;syncUI();}));
    }
    function renderPeopleList() {
      const list=currentPeople(); const noMatch=state.lang==='en'?'No matching people':'没有匹配人物';
      miniList.innerHTML=list.length?list.map(person=>`<button class="mini-person ${person.id===state.selectedId?'active':''}" data-person="${person.id}" data-focus-key="person-${person.id}" aria-pressed="${person.id===state.selectedId}"><span>${escapeHTML(displayName(person))}<small>${escapeHTML(secondaryName(person))}</small></span><small>${escapeHTML(person.layer)}</small></button>`).join(''):`<span style="color:var(--muted);font-size:11px;padding:8px">${noMatch}</span>`;
      miniList.querySelectorAll('[data-person]').forEach(button=>button.addEventListener('click',()=>{state.selectedId=button.dataset.person;state.placeKey=null;syncUI();if(compactFilters.matches&&disclosure){disclosure.open=false;window.atlasScrollMap();}}));
    }
    function renderEvent(item) {
      const en = state.lang === 'en';
      const verified = isVerified(item);
      const date = eventYear(item) === null ? (en ? 'Date not established' : '日期未核定') : ((en ? item.dateTextEn : item.dateTextZh) || item.dateText || String(eventYear(item))); 
      const title = (en ? item.titleEn : item.titleZh) || item.placeText || item.raw || mapPlaceLabel(item.place);
      const refs = verified ? uniqueEventSources(item) : [];
      const links = refs.map((ref, index) => `<a href="${escapeHTML(ref.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHTML(ref.title)}"><span class="source-number">${en ? 'Source' : '来源'} ${index + 1}</span><span class="source-title">${escapeHTML(ref.title)} ↗</span></a>`).join('');
      const notes = [...new Set(refs.map(ref => en ? ref.evidenceNoteEn : ref.evidenceNoteZh).filter(Boolean))];
      const evidence = notes.length ? `<details class="event-evidence"><summary>${en ? 'What the source supports' : '来源支持的内容'}</summary><p>${notes.filter(note=>!notes.some(other=>other!==note&&other.includes(note))).map(escapeHTML).join(' ')}</p></details>` : '';
      const strength = refs.length ? `<span class="evidence-strength">${refs.length === 1 ? (en ? '1 cited source' : '1 条引用来源') : (en ? `${refs.length} cited source URLs` : `${refs.length} 条引用来源`)}</span>` : '';
      const unavailable = verified && !verifiedEvents({placeLeads:[item]}).length ? (en ? 'Shown in the record; excluded from route connections.' : '保留于档案，不参与路径连线。') : '';
      return `<div id="event-${escapeHTML(item.id)}" class="path-item ${pathClass(item.type)} ${verified ? 'verified-event' : 'pending-event'}"><small>${escapeHTML(date)} · ${escapeHTML(pathLabel(item))}</small><strong>${escapeHTML(title)}</strong><span>${escapeHTML(verified ? ((en ? item.placeEn : item.placeText) || item.placeText || '') + ' · ' + (item.spatialRelation==='jurisdiction' ? (en?'Jurisdiction; presence not inferred':'任职辖区，不推断到场') : item.spatialRelation==='ancestral_origin' ? (en?'Native place; not a travel event':'籍贯，不代表迁移事件') : pathNote(item)) : (en ? 'Event details awaiting source review.' : '事件细节待逐项核验。'))} ${escapeHTML(unavailable)}</span>${links ? `<div class="event-sources">${links}</div>` : ''}${strength}${evidence}</div>`;
    }
    function renderDossier() {
      const person=selectedPerson(); const en=state.lang==='en';
      if(!person){dossier.innerHTML=en?'<div class="empty-dossier"><strong>Select a person</strong><span>Open a profile from the map or the people list.</span></div>':'<div class="empty-dossier"><strong>选择一位人物</strong><span>从地图或左侧人物列表进入档案。</span></div>';return;}
      const refs=[...new Map([...(person.sourceRefs||[]), ...person.placeLeads.flatMap(item=>item.sourceRefs||[])].map(sourceRecord).filter(Boolean).map(ref=>[ref.url,ref])).values()];
      const claims=(person.claims||[]).filter(claim=>claim.textEn||claim.textZh);
      const zhClaims=claims.filter(claim=>claim.textZh);
      const placeLeads=person.placeLeads||[];
      const entityText=(en ? person.politicalEntitiesEn : person.politicalEntitiesZh)?.length ? (en ? person.politicalEntitiesEn : person.politicalEntitiesZh).join(' · ') : (person.entities||[]).length?person.entities.join(' · '):(person.coverage?`${en?'Coverage scope':'覆盖范围'}: ${person.coverage}`:(en?'Entity pending':'政治实体待核'));
      const status=en ? `Collection reviewed · ${atlasData.meta?.asOf || '2026-10-05'}` : `样本整理日 · ${atlasData.meta?.asOf || '2026-10-05'}`;
      const periodText=en?`${person.periods.length} linked ${person.periods.length===1?'period':'periods'}`:`${person.periods.length} 个关联时期`;
      const sourceHtml=refs.length?refs.map(ref=>`<li><a href="${escapeHTML(ref.url||'#')}" target="_blank" rel="noreferrer">${escapeHTML(ref.title||ref.source_id||'Source')}</a><span>${escapeHTML(ref.tier||'')} ${ref.scope?`· ${escapeHTML(ref.scope)}`:''}</span></li>`).join(''):`<li>${en?'No normalized source link attached yet.':'尚未挂接规范化来源链接。'}</li>`;
      const claimHtml=`<p>${escapeHTML(en ? (person.summaryEn || person.claim) : (person.summaryZh || person.claimZh))}</p>`;
      const fieldSources=key=>(person.fieldEvidence?.[key] || []).map(sid=>sourceRecord({sourceId:sid})).filter(ref=>ref?.url).map((ref,i)=>`<a href="${escapeHTML(ref.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(ref.title)}">[${i+1}]</a>`).join(' ');
      const lifeHtml=`<div class="life-facts"><div><small>${en?'BORN':'出生日期'}</small><strong>${escapeHTML(person.birthDate || (en?'Unestablished':'尚未核定'))}</strong>${fieldSources('birthDate')}</div><div><small>${en?'DIED / STATUS':'卒日 / 状态'}</small><strong>${escapeHTML(person.deathDate || (person.lifeStatus==='living_as_of_source' ? (en?'Living at source date':'来源时点在世') : (en?'Unestablished':'尚未核定')))}</strong>${fieldSources(person.deathDate?'deathDate':'lifeStatus')}</div></div><p class="status-note">${escapeHTML(en?person.statusNoteEn:person.statusNoteZh)}${person.statusAsOf ? ` · ${escapeHTML(person.statusAsOf)}` : ''}</p>`;
      const gapsHtml=person.gaps?.length ? `<details class="profile-gaps"><summary>${en?'Research gaps & source conflicts':'缺证与史料分歧'} <span>${person.gaps.length}</span></summary>${person.gaps.map(gap=>`<p>${escapeHTML(en?gap.reasonEn:gap.reasonZh)}</p>`).join('')}</details>` : `<p class="coverage-note">${en?'No unresolved issue was logged in this review. This does not establish an exhaustive biography.':'本轮未登记未决项；这不等于已穷尽全部生平史料。'}</p>`;
      const claimEvidenceHtml=claims.length?claims.map(claim=>{ const claimText=en?(claim.textEn||claim.textZh):(claim.textZh||claim.textEn); const sourceCount=(claim.sourceRefs||[]).length; return `<div class="claim-evidence"><p>${escapeHTML(claimText||'—')}</p><span>${(en?'Summary based on cited events':'依据已列来源整理的概述')} · ${sourceCount} ${en?'linked sources':'条关联来源'}</span></div>`; }).join(''):`<div class="claim-evidence"><p>${en?'No structured claim has been entered yet.':'尚未录入结构化主张。'}</p></div>`;
      const missingFields=Array.isArray(person.missingFields)?person.missingFields:[];
      const missingHtml=missingFields.length?`<div class="missing-fields"><strong>${en?'Missing fields':'待补字段'}</strong><span>${escapeHTML(missingFields.join(' · '))}</span></div>`:'';
      const evidence = evidenceCounts(placeLeads);
      const verified = placeLeads.filter(isVerified).sort((a,b)=>(eventYear(a) ?? 9999)-(eventYear(b) ?? 9999));
      const pending = placeLeads.filter(item=>!isVerified(item));
      const leadHtml = verified.length ? verified.map(renderEvent).join('') : `<div class="empty-path">${en?'The profile is indexed. Its event-level evidence is still under review.':'人物已收入索引，事件级证据仍在核验中。'}</div>`;
      const pendingHtml = pending.length ? `<details class="pending-details"><summary>${en?'Leads awaiting review':'待核验线索'} <span>${pending.length}</span></summary><div class="path-list">${pending.map(renderEvent).join('')}</div></details>` : '';
      const noteValue=en?(person.notesEn||person.notes||person.uncertainty||''):(person.notesZh||person.notes||person.uncertainty||'');
      const notes=(Array.isArray(noteValue)?noteValue.join(' · '):String(noteValue)).trim();
      dossier.innerHTML=`<div class="record-context" id="recordContext"><span>${escapeHTML(displayName(person))}<small>${escapeHTML(secondaryName(person))}</small></span><button class="profile-map-return" data-back-map type="button">${en?'↑ Back to map':'↑ 返回地图'}</button></div><div class="dossier-kicker"><span>${en?'BIOGRAPHICAL RECORD':'人物档案'}</span><span class="dossier-badge">${escapeHTML(status)}</span></div>
        <h3>${escapeHTML(displayName(person))}</h3><div class="dossier-name-en">${escapeHTML(secondaryName(person))}</div>
        <div class="tag-row">${(en?(person.rolesEn||[]):(person.roleLabelsZh||person.roles||[])).map(role=>`<span class="tag">${escapeHTML(role)}</span>`).join('')}</div>
        <div class="record-summary">${claimHtml}</div>${lifeHtml}
        <div class="meta-grid"><div class="meta-item"><small>${en?'PERIODS':'时期'}</small><span>${periodText}</span></div><div class="meta-item"><small>${en?'POLITICAL ENTITY':'政治实体'}</small><span>${escapeHTML(entityText)}</span></div><div class="meta-item"><small>${en?'INCLUSION TIER':'纳入层级'}</small><span>${escapeHTML(person.layer||'—')}</span></div><div class="meta-item"><small>${en?'RECORD STATUS':'记录状态'}</small><span>${en?'Sources attached; limits retained':'已关联来源，保留证据边界'}</span></div></div>
        <div class="info-section"><div class="info-label">${en?'EDUCATION & EARLY CAREER':'教育与早期经历'}</div><p>${escapeHTML(en?person.educationSummaryEn:person.educationSummaryZh)}</p></div>
        <div class="info-section"><div class="info-label">${en?'WHY THIS RECORD IS INCLUDED':'纳入理由'}</div><p>${escapeHTML(en?(person.inclusionBasisEn||'Included under the project’s political influence criteria.'):(person.inclusionBasisZh||person.notesZh||'按项目纳入标准记录。'))}</p></div>
        
        <div class="path-block"><div class="path-title"><strong>${en?'Sourced chronology':'有来源履历'}</strong><span>${verified.length} ${en?'EVENTS':'条事件'}</span></div><p class="record-scope-note">${en?'Full biographical record — this section keeps all recorded years, regardless of map filters.':'完整人物档案——此处保留全部已录入年份，不受地图筛选限制。'}</p><p class="evidence-strength">${en?`${evidence.single} single-source events · ${evidence.multiple} with multiple source URLs. Multiple links are not automatically independent corroboration.`:`${evidence.single} 条单一来源事件 · ${evidence.multiple} 条关联多个来源网址。多个链接不自动构成独立交叉核验。`}</p><p class="coverage-note">${en?`${verified.length} sourced events · ${pending.length} unresolved ${pending.length===1?'lead':'leads'}. This chronology covers major life stages; each entry retains its evidence limits.`:`${verified.length} 条有来源事件 · ${pending.length} 条未决线索。年表覆盖主要人生阶段，各项保留证据边界。`}</p><div class="path-list">${leadHtml}</div>${pendingHtml}${gapsHtml}</div>
        <details class="evidence-details"><summary>${en?'Sources & uncertainty':'来源与不确定性'} <span>${refs.length} ${en?'SOURCES':'个来源'}</span></summary><div class="claim-evidence-list"><div class="info-label">${en?'CLAIM EVIDENCE':'主张证据'}</div>${claimEvidenceHtml}</div><ul class="source-list">${sourceHtml}</ul>${notes?`<div class="uncertainty-note"><strong>${en?'Original notes / uncertainty':'原始备注 / 不确定性'}</strong><p>${escapeHTML(notes)}</p></div>`:''}</details>`;
    }
    function renderMap() {
      const list=currentPeople(); const focus=selectedPerson(); const en=state.lang==='en';
      routeLayer.innerHTML=''; placeLayer.innerHTML=''; labelLayer.innerHTML='';
      renderVerifiedRoutes(list);
      const dots=new Map();
      list.forEach(person=>(person.placeLeads||[]).forEach(item=>{
        if(!item.place || !places[item.place] || !layerMatches(item,state.layer) || !eventInTimeScope(item) || (state.verifiedOnly && !(isVerified(item)&&supportedRefs(item).length))) return;
        if(!dots.has(item.place)) dots.set(item.place, []);
        dots.get(item.place).push({item,person});
      }));
      const labels = [];
      dots.forEach((entries,key)=>{
        entries.sort((a,b)=>(Number(b.person.id===state.selectedId)-Number(a.person.id===state.selectedId)) || (Number(isVerified(b.item))-Number(isVerified(a.item))));
        const {item,person}=entries[0], point=places[key], evidence=eventEvidenceState(item);
        const selected=person.id===state.selectedId;
        const atPlace=[...new Set(entries.map(entry=>entry.person.id))];
        const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx',point.x);circle.setAttribute('cy',point.y);circle.setAttribute('r',selected?'7':'4');
        circle.setAttribute('class',`place-dot ${pathClass(item.type)} ${evidence} ${selected?'selected-place':'context-place'}`);
        circle.setAttribute('pointer-events','none');
        const hit=document.createElementNS('http://www.w3.org/2000/svg','circle');
        hit.setAttribute('cx',point.x);hit.setAttribute('cy',point.y);
        hit.setAttribute('r',22*900/Math.max(280,document.getElementById('mapSvg').getBoundingClientRect().width));
        hit.setAttribute('class','place-hit');hit.setAttribute('fill','transparent');hit.setAttribute('pointer-events','all');
        hit.setAttribute('tabindex','0');hit.setAttribute('role','button');hit.dataset.place=key;hit.dataset.focusKey=`place-${key}`;
        const name=`${mapPlaceLabel(key)} · ${atPlace.length}${en?' people; open all matching records':' 位人物；查看所有匹配记录'}`;
        hit.setAttribute('aria-label',name);
        const tip=document.createElementNS('http://www.w3.org/2000/svg','title');tip.textContent=name;hit.appendChild(tip);
        placeLayer.appendChild(circle);placeLayer.appendChild(hit);
        labels.push({key,point,evidence,selected});
      });
      const occupied=[];
      const labelSize=Math.min(42, Math.max(13, 12*900/Math.max(280,document.getElementById('mapSvg').getBoundingClientRect().width)));
      labels.sort((a,b)=>Number(b.selected)-Number(a.selected)).forEach(({key,point,evidence,selected})=>{
        // Guided mode prioritizes one biography; free exploration labels the wider index.
        if(state.mode==='guided' && focus && !selected) return;
        const label=document.createElementNS('http://www.w3.org/2000/svg','text');
        label.setAttribute('class',`place-label ${evidence} ${selected?'selected-label':''}`);label.textContent=mapPlaceLabel(key);labelLayer.appendChild(label);
        label.style.fontSize=`${labelSize}px`;
        const width=label.getComputedTextLength();
        const mapWidth=document.getElementById('mapSvg').getBoundingClientRect().width;
        const unit=900/Math.max(280,mapWidth);
        // Close Pearl River Delta points need more label clearance on small maps.
        const deltaOffsets=mapWidth<600?{
          guangzhou:[20*unit,-10*unit], xiangshan:[-width-10*unit,-2*unit],
          hongkong:[12*unit,18*unit], macau:[-width-10*unit,22*unit]
        }:{};
        const preferred=deltaOffsets[key];
        const candidates=[...(preferred?[preferred]:[]),[10,3],[-width-10,3],[10,-15],[-width-10,-15],[10,20],[-width-10,20],[12,-31],[-width-12,36]];
        let position=null;
        for(const [dx,dy] of candidates){
          const box={x:point.x+dx,y:point.y+dy-labelSize/2,w:width,h:labelSize+3};
          if(box.x<14 || box.x+box.w>886 || box.y<12 || box.y+box.h>(preferred?545:510)) continue;
          if(occupied.some(other=>box.x<other.x+other.w+5 && box.x+box.w+5>other.x && box.y<other.y+other.h+3 && box.y+box.h+3>other.y)) continue;
          position={dx,dy,box};break;
        }
        if(!position){label.remove();return;}
        occupied.push(position.box);label.setAttribute('x',point.x+position.dx);label.setAttribute('y',point.y+position.dy);
        if(preferred||Math.abs(position.dy)>8){const leader=document.createElementNS('http://www.w3.org/2000/svg','line');leader.setAttribute('x1',point.x);leader.setAttribute('y1',point.y);leader.setAttribute('x2',preferred?(position.dx>0?position.box.x-4:position.box.x+position.box.w+4):point.x+(position.dx>0?8:-8));leader.setAttribute('y2',point.y+position.dy);leader.setAttribute('class','label-leader');labelLayer.insertBefore(leader,label);}
      });
      placeLayer.querySelectorAll('[data-place]').forEach(point=>{
        const open=event=>{
          let key=point.dataset.place;
          if(event?.type==='click'&&event.detail!==0){const svg=document.getElementById('mapSvg'),matrix=svg.getScreenCTM();if(matrix){const position=svg.createSVGPoint();position.x=event.clientX;position.y=event.clientY;const at=position.matrixTransform(matrix.inverse());key=[...dots.keys()].sort((a,b)=>Math.hypot(places[a].x-at.x,places[a].y-at.y)-Math.hypot(places[b].x-at.x,places[b].y-at.y))[0]||key;}}
          state.placeKey=key;renderPlaceDetails(dots);scrollToElement(document.getElementById('placeDetails'));
        };
        point.addEventListener('click',open);point.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});
      });
      const period=selectedPeriod();
      document.getElementById('mapTitle').textContent=state.period==='all'?(en?'All recorded years':'全部已录入年份'):`${periodLabel(period)} · ${state.timeScope==='life'?(en?'full lives':'完整生平'):(en?'period events':'本时期事件')}`;
      const entries=[...dots.values()].flat();
      const mappedPeople=new Set(entries.map(entry=>entry.person.id)).size;
      document.getElementById('mapCount').textContent=en?`${mappedPeople} ON MAP / ${list.length} PROFILES`:`地图 ${mappedPeople} 人 / 档案 ${list.length} 人`;
      document.getElementById('timelineReadout').textContent=state.timeScope==='life'&&state.period!=='all'?(en?'Cohort: ':'人物时期：')+period.range:period.range;
      const selectedRouteCount=focus?routeSegments(focus,true).filter(segment=>layerMatches(segment.from,state.layer)&&layerMatches(segment.to,state.layer)).length:0;
      document.getElementById('mapStatus').textContent=en?`${entries.length} mapped records · ${selectedRouteCount} selected schematic links`:`${entries.length} 条地图记录 · 当前人物 ${selectedRouteCount} 段示意连接`;
      document.getElementById('annotationTitle').textContent=focus?`${displayName(focus)} · ${en?'selected life':'当前人物'}`:(en?'A map of records, not a ranking.':'一张档案地图，不是历史排名。');
      document.getElementById('annotationText').textContent=en?'Schematic connections between sourced, dated places — not reconstructed travel. Click any place to see every matching person.':'连线示意有来源、有日期的履历地点，不代表实际行程。点击地点可查看全部匹配人物。';
      document.getElementById('mapDesc').textContent=en?`${entries.length} location records for ${mappedPeople} people match the active filters. The selected life has ${selectedRouteCount} schematic connections. Undated records never enter a period-specific map; jurisdictions and unordered dates do not form routes.`:`当前筛选显示 ${mappedPeople} 位人物的 ${entries.length} 条地点记录。当前人物有 ${selectedRouteCount} 段示意连接。日期不明的记录不进入时期地图，任职辖区和顺序不明的日期不组成路线。`;
      renderSelectionBar();renderPlaceDetails(dots);
    }
    function renderSelectionBar() {
      const bar=document.getElementById('selectionBar');if(!bar)return;
      const person=selectedPerson(),en=state.lang==='en';
      if(!person){bar.innerHTML=`<span>${en?'No matching people. Try clearing a filter.':'没有匹配人物，请清除部分筛选。'}</span>`;return;}
      bar.innerHTML=`<div class="selection-summary"><span class="eyebrow">${en?'SELECTED LIFE':'当前人物'}</span><strong>${escapeHTML(displayName(person))}<small>${escapeHTML(secondaryName(person))}</small></strong><span>${en?`${mappedEvents(person).length} mapped records in this view · ${person.placeLeads.length} in full record`:`本视图 ${mappedEvents(person).length} 条地图记录 · 完整档案 ${person.placeLeads.length} 条记录`}</span></div><div class="selection-actions"><button type="button" id="choosePerson">${en?'Choose person':'更换人物'}</button><button type="button" id="openFullRecord">${en?'Open full record ↓':'查看完整档案 ↓'}</button></div>`;
      document.getElementById('openFullRecord').addEventListener('click',()=>window.atlasShowRecord());
      document.getElementById('choosePerson').addEventListener('click',()=>{if(disclosure)disclosure.open=true;const offset=atlasTopOffset();window.scrollTo({top:window.scrollY+personSearch.getBoundingClientRect().top-offset,behavior:'instant'});personSearch.focus({preventScroll:true});});
    }
    function renderPlaceDetails(dots) {
      const panel=document.getElementById('placeDetails');if(!panel)return;
      const entries=dots.get(state.placeKey)||[],en=state.lang==='en';
      panel.hidden=!entries.length;if(!entries.length){panel.innerHTML='';return;}
      const grouped=new Map();entries.forEach(entry=>{if(!grouped.has(entry.person.id))grouped.set(entry.person.id,{person:entry.person,events:[]});grouped.get(entry.person.id).events.push(entry.item);});
      const naming=placeDisplay[state.placeKey]||{};
      const nameNote=en?naming.noteEn:naming.noteZh;
      panel.innerHTML=`<div class="place-details-head"><div><p class="eyebrow">${en?'SHARED PLACE':'共同地点'}</p><h4 tabindex="-1">${escapeHTML(en?(naming.detailEn||mapPlaceLabel(state.placeKey)):mapPlaceLabel(state.placeKey))}</h4>${en?`<p class="place-original-name" lang="zh-CN">${escapeHTML(mapPlaceLabel(state.placeKey,'zh'))}</p>`:''}${nameNote?`<p class="place-name-note">${escapeHTML(nameNote)}</p>`:''}<p>${en?`${grouped.size} ${grouped.size===1?'person':'people'} · ${entries.length} ${entries.length===1?'record':'records'} within the current filters`:`当前筛选下 ${grouped.size} 位人物 · ${entries.length} 条记录`}</p></div><button type="button" id="closePlaceDetails" aria-label="${en?'Close place records':'关闭地点记录'}">${en?'Close':'关闭'} ×</button></div><div class="place-people">${[...grouped.values()].map(({person,events})=>`<section class="place-person"><h5>${escapeHTML(displayName(person))}<small>${escapeHTML(secondaryName(person))}</small></h5><ul class="place-event-list">${events.sort((a,b)=>(eventYear(a)??9999)-(eventYear(b)??9999)).map(event=>`<li><button type="button" data-open-person="${escapeHTML(person.id)}" data-open-event="${escapeHTML(event.id)}"><strong>${escapeHTML((en?event.dateTextEn:event.dateTextZh)||event.dateText||eventYear(event)||(en?'Undated':'日期未定'))}</strong> ${escapeHTML((en?event.titleEn:event.titleZh)||event.raw||pathLabel(event))}<span class="place-record-location">${escapeHTML(en?(event.placeEn||mapPlaceLabel(event.place)):(event.placeText||mapPlaceLabel(event.place)))}${en&&event.placeText?`<span lang="zh-CN">${escapeHTML(event.placeText)}</span>`:''}</span><span>${en?'Open event & source ↗':'查看事件与来源 ↗'}</span></button></li>`).join('')}</ul></section>`).join('')}</div>`;
      panel.querySelectorAll('[data-open-person]').forEach(button=>button.addEventListener('click',()=>openAtlasRecord(button.dataset.openPerson,[button.dataset.openEvent])));
      document.getElementById('closePlaceDetails').addEventListener('click',()=>{const key=state.placeKey;state.placeKey=null;panel.hidden=true;window.atlasScrollMap();placeLayer.querySelector(`[data-place="${CSS.escape(key)}"]`)?.focus({preventScroll:true});});
    }
    function renderHeroRecord() {
      const container=document.getElementById('heroRecord');if(!container)return;
      const person=peopleById.get('p_sun_yat_sen'),en=state.lang==='en';if(!person)return;
      const ids=['honolulu-school','tongmenghui','president','reorganization'].map(id=>`p_sun_yat_sen:full:${id}`);
      const events=ids.map(id=>person.placeLeads.find(event=>event.id===id)).filter(Boolean);
      container.innerHTML=`<div class="hero-record-head"><span class="eyebrow">${en?'ONE LIFE · FOUR SOURCED RECORDS':'一位人物 · 四条有来源记录'}</span><h2>${escapeHTML(displayName(person))}<small>${escapeHTML(secondaryName(person))}</small></h2></div><ol class="hero-record-timeline">${events.map(event=>`<li class="hero-record-step"><button type="button" data-hero-event="${escapeHTML(event.id)}"><time>${eventYear(event)}</time><strong>${escapeHTML(en?(event.placeEn||mapPlaceLabel(event.place)):mapPlaceLabel(event.place))}<span lang="${en?'zh-CN':'en'}">${escapeHTML(en?mapPlaceLabel(event.place,'zh'):(event.placeEn||mapPlaceLabel(event.place)))}</span></strong><span>${escapeHTML((en?event.titleEn:event.titleZh)||'')}</span><span class="hero-record-source">${en?'Read event & source ↗':'查看事件与来源 ↗'}</span></button></li>`).join('')}</ol><p class="hero-record-note">${en?'Selected biographical records; connecting marks are schematic, not a reconstructed travel route.':'精选履历记录；连接标记为示意，不是实际行程还原。'}</p>`;
      container.querySelectorAll('[data-hero-event]').forEach(button=>button.addEventListener('click',()=>openAtlasRecord(person.id,[button.dataset.heroEvent])));
    }
    function openAtlasRecord(personId,eventIds=[]) {
      if(window.atlasOpenRecord){window.atlasOpenRecord(personId,eventIds);return;}
      state.selectedId=personId;state.period='all';state.layer='all';state.timeScope='period';state.search='';personSearch.value='';state.verifiedOnly=false;state.placeKey=null;syncUI();window.atlasShowRecord(eventIds);
    }
    function atlasTopOffset() {
      return (document.querySelector('.topbar')?.getBoundingClientRect().height||0)+24;
    }
    window.atlasRecordOffset=node=>node&&node!==dossier&&dossier.contains(node)?(document.getElementById('recordContext')?.getBoundingClientRect().height||0)+10:0;
    function scrollToElement(node) {
      if(!node)return;const offset=atlasTopOffset()+window.atlasRecordOffset(node);
      const rect=node.getBoundingClientRect();
      window.scrollTo({top:window.scrollY+rect.top-offset,behavior:'instant'});
      if(!node.matches('button,input,select,textarea,a[href],[tabindex]'))node.setAttribute('tabindex','-1');node.focus({preventScroll:true});
    }
    window.atlasShowRecord=(eventIds=[])=>{const event=eventIds.map(id=>document.getElementById(`event-${id}`)).find(Boolean);if(event){let parent=event.parentElement;while(parent&&parent!==dossier){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}}scrollToElement(event||dossier);};
    window.atlasScrollMap=()=>scrollToElement(document.querySelector('.map-panel'));
    function focusFilterControl() {
      (disclosure?.open ? personSearch : document.getElementById('filterToggle')).focus({preventScroll:true});
    }
    function clearAtlasFilters() {
      state.period='all';state.layer='all';state.search='';state.verifiedOnly=false;state.timeScope='period';state.placeKey=null;
      personSearch.value='';syncUI();focusFilterControl();
    }
    function renderActiveFilters() {
      const node=document.getElementById('activeFilters');
      const en=state.lang==='en',chips=[];
      if(state.search)chips.push(['search',state.search]);
      if(state.period!=='all')chips.push(['period',periodLabel(selectedPeriod())]);
      if(state.layer!=='all')chips.push(['layer',eventLayerById.get(state.layer)?.[en?'en':'zh']||state.layer]);
      if(state.period!=='all'&&state.timeScope==='life')chips.push(['timeScope',en?'Full lives':'完整生平']);
      if(state.verifiedOnly)chips.push(['verifiedOnly',en?'Sourced only':'仅有来源']);
      node.className='active-filter-bar';node.hidden=!chips.length;
      node.setAttribute('role','group');node.setAttribute('aria-label',en?'Current filters':'当前筛选');
      node.innerHTML=chips.map(([key,label])=>`<button class="filter-chip" type="button" data-remove-filter="${key}" data-focus-key="remove-${key}" aria-label="${escapeHTML((en?'Remove filter: ':'移除筛选：')+label)}">${escapeHTML(label)} ×</button>`).join('')+`<button type="button" id="clearFilters">${en?'Clear all':'清除全部'}</button>`;
      node.querySelectorAll('[data-remove-filter]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.removeFilter;state[key]=key==='search'?'':key==='verifiedOnly'?false:key==='timeScope'?'period':'all';if(key==='search')personSearch.value='';if(key==='period')state.timeScope='period';state.placeKey=null;syncUI();if(node.hidden)focusFilterControl();}));
      node.querySelector('#clearFilters')?.addEventListener('click',clearAtlasFilters);
    }
    function syncUI() {
      const active=document.activeElement;
      const focusKey=active?.dataset?.focusKey,focusId=active?.id;
      const listScroll=miniList.scrollTop;
      const visible=currentPeople();if(!visible.some(person=>person.id===state.selectedId))state.selectedId=visible[0]?.id||null;
      renderLanguage();renderPeriods();renderLayers();renderPeopleList();renderDossier();renderMap();renderActiveFilters();
      if(window.researchRefresh)window.researchRefresh();
      miniList.scrollTop=listScroll;
      const target=focusKey?document.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`):focusId?document.getElementById(focusId):null;
      if(target&&target!==document.activeElement)target.focus({preventScroll:true});
      else if(!target&&focusKey?.startsWith('remove-')){const clear=document.getElementById('clearFilters');if(clear&&!clear.closest('[hidden]'))clear.focus({preventScroll:true});else focusFilterControl();}
    }
    const topbar=document.querySelector('.topbar');
    if(topbar){
      const updateHeaderHeight=()=>document.documentElement.style.setProperty('--header-height',`${Math.ceil(topbar.getBoundingClientRect().height)}px`);
      updateHeaderHeight();
      new ResizeObserver(updateHeaderHeight).observe(topbar);
    }
    const disclosure=document.getElementById('filterDisclosure');
    const compactFilters=window.matchMedia('(max-width:1199px)');
    if(disclosure){disclosure.open=!compactFilters.matches;compactFilters.addEventListener('change',event=>{disclosure.open=!event.matches;});}
    document.addEventListener('click',event=>{if(event.target.closest('[data-back-map]'))window.atlasScrollMap();});
    document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{window.researchBeforeLanguageChange?.();state.lang=button.dataset.lang;syncUI();}));
    document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{state.mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(item=>item.classList.toggle('active',item===button));syncUI();}));
    personSearch.addEventListener('input',event=>{state.search=event.target.value.trim();syncUI();});
    coverageFilter.addEventListener('click',()=>{state.verifiedOnly=!state.verifiedOnly;syncUI();});
    let resizeFrame;
    window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(renderMap);});
    document.getElementById('enterAtlas').addEventListener('click',()=>window.atlasScrollMap());

    syncUI();

    const researchData = __RESEARCH_DATA__;
/* Findings, method, stable evidence links and an opt-in four-stop tour. */
