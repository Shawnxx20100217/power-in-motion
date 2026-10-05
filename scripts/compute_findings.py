#!/usr/bin/env python3
"""Reproduce three descriptive findings from the reviewed Political Atlas.

Run from any directory. Optional arguments: --input PATH --output PATH.
No network, text geocoding, sampling weights, or causal inference is used.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CENTERS = {"beijing": ("北京", "Beijing"), "nanjing": ("南京", "Nanjing"), "guangzhou": ("广州", "Guangzhou")}
PUBLIC_EVENT_TYPES = {"office", "political_activity", "war", "regional_base", "career"}

# These records concern teaching, leadership or an honorary degree, not the
# person's own learning. They must not silently become student mobility.
NON_LEARNING_EDUCATION_EVENTS = {
    "p_mao_zedong:full:05": "Directed the Peasant Movement Training Institute; teaching/leadership.",
    "p_ye_jianying:full:10": "Presidency of the Academy of Military Sciences; institutional leadership.",
    "p_carrie_lam:full:shanghai": "Honorary doctorate and speech; not attendance as a student.",
}

# Explicit geographic query groups, not a classification of national borders.
# Moscow in 1921 is NOT labeled as being in a Soviet Union that did not yet exist.
# Honolulu in 1879 is NOT classified as being in the United States at that date.
DESTINATION_GROUPS = [
    {"id": "japan", "labelZh": "日本", "labelEn": "Japan", "mapKeys": ["japan_region", "tokyo", "kyoto"]},
    {"id": "europe", "labelZh": "英国、法国、德国", "labelEn": "Britain, France and Germany", "mapKeys": ["gottingen", "france", "marseille", "london", "liverpool", "bristol"]},
    {"id": "moscow_soviet", "labelZh": "莫斯科及其他苏联学习地点", "labelEn": "Moscow and other recorded Soviet study locations", "mapKeys": ["moscow", "苏联"]},
    {"id": "north_america", "labelZh": "北美大陆（美国、加拿大）", "labelEn": "Continental North America (United States and Canada)", "mapKeys": ["macon", "iowa", "cornell", "canada", "york_university"]},
    {"id": "honolulu", "labelZh": "檀香山（单列）", "labelEn": "Honolulu (listed separately)", "mapKeys": ["honolulu"]},
]
EXPLICIT_DESTINATIONS = {
    "p_duan_qirui:full:germany": ["europe"],
    "p_zhou_enlai:full:03": ["japan", "europe"],
}
INSTITUTION_ONLY_TARGET_EVENTS = {
    "p_ma_ying_jeou:full:harvard", "p_ma_ying_jeou:full:nyu",
    "p_lai_ching_te:full:harvard", "p_donald_tsang:full:harvard",
    "p_fernando_chui:full:california", "p_fernando_chui:full:oklahoma",
}


def supported(event):
    return (
        event.get("status") == "verified"
        and not event.get("pending")
        and any(ref.get("evidenceStatus") == "event_supported" for ref in event.get("sourceRefs", []))
    )


def presence(event):
    return supported(event) and event.get("spatialRelation") == "documented_presence"


def learning(event):
    return presence(event) and event.get("type") == "education" and event["id"] not in NON_LEARNING_EDUCATION_EVENTS


def center_event(event):
    return presence(event) and event.get("type") in PUBLIC_EVENT_TYPES and event.get("mapKey") in CENTERS


def dated(event):
    return isinstance(event.get("yearStart"), int) and not isinstance(event.get("yearStart"), bool)


def last_possible_year(event):
    if not dated(event):
        return None
    if isinstance(event.get("yearEnd"), int):
        return event["yearEnd"]
    # Single dated events in the source can omit yearEnd. An explicitly open
    # interval could extend indefinitely and may never be treated as completed.
    if event.get("temporalExtent") == "point":
        return event["yearStart"]
    return None


def destination_groups(event):
    found = {group["id"] for group in DESTINATION_GROUPS if event.get("mapKey") in group["mapKeys"]}
    found.update(EXPLICIT_DESTINATIONS.get(event["id"], []))
    return sorted(found)


def build(data, input_bytes):
    people = data["people"]
    by_person = {p["id"]: p for p in people}
    sources = {s["id"]: s for s in data["sources"]}
    all_events = {e["id"]: e for p in people for e in p["placeLeads"]}
    assert len(people) == len(by_person)
    assert len(all_events) == sum(len(p["placeLeads"]) for p in people)
    for expected in set(NON_LEARNING_EDUCATION_EVENTS) | set(EXPLICIT_DESTINATIONS) | INSTITUTION_ONLY_TARGET_EVENTS:
        assert expected in all_events, f"A manually audited classification is stale: {expected}"

    def proof(event):
        refs = []
        for ref in event.get("sourceRefs", []):
            if ref.get("evidenceStatus") != "event_supported":
                continue
            sid = ref["sourceId"]
            assert sid in sources
            source = sources[sid]
            refs.append({
                "sourceId": sid, "url": ref.get("url") or source["url"],
                "title": (source.get("titles") or [source.get("title") or sid])[0],
            })
        return {
            "id": event["id"], "titleZh": event["titleZh"], "titleEn": event["titleEn"],
            "type": event["type"], "placeZh": event.get("placeText"), "placeEn": event.get("placeEn"),
            "dateZh": event.get("dateTextZh") or event.get("dateText"),
            "dateEn": event.get("dateTextEn") or event.get("dateText"),
            "yearStart": event.get("yearStart"), "yearEnd": event.get("yearEnd"),
            "mapKey": event.get("mapKey"), "spatialRelation": event.get("spatialRelation"),
            "sourceRefs": refs,
        }

    def member(person, events, **extra):
        distinct = list({e["id"]: e for e in events}.values())
        return {
            "personId": person["id"], "nameZh": person["nameZh"], "nameEn": person["nameEn"],
            "eventIds": [e["id"] for e in distinct], "events": [proof(e) for e in distinct], **extra,
        }

    def examples(members, preferred_ids):
        mapping = {m["personId"]: m for m in members}
        return [{"personId": pid, "eventIds": mapping[pid]["eventIds"]} for pid in preferred_ids if pid in mapping]

    # F1: All profiles are the denominator. A non-match is not a negative fact.
    learning_members = []
    institution_only = []
    for person in people:
        selected = [e for e in person["placeLeads"] if learning(e) and destination_groups(e)]
        if selected:
            learning_members.append(member(person, selected, destinationGroupIds=sorted({g for e in selected for g in destination_groups(e)})))
        institution = [e for e in person["placeLeads"] if e["id"] in INSTITUTION_ONLY_TARGET_EVENTS]
        if institution:
            institution_only.append(member(person, institution))
    group_counts = [dict(group, peopleCount=sum(group["id"] in m["destinationGroupIds"] for m in learning_members)) for group in DESTINATION_GROUPS]
    first_n = len(learning_members)
    first = {
        "id": "learning-destinations", "titleZh": "跨地域的学习经历", "titleEn": "Learning across distant places",
        "claimZh": f"现有 {len(people)} 人中，{first_n} 人有本人在日本、英法德、莫斯科或其他苏联学习地点、北美大陆或檀香山学习与受训的来源记录。",
        "claimEn": f"{first_n} of {len(people)} profiles document learning or training in Japan; Britain, France or Germany; Moscow or other recorded Soviet locations; continental North America; or Honolulu.",
        "numerator": first_n, "denominator": len(people),
        "denominatorLabelZh": "全部 72 位入选人物", "denominatorLabelEn": "All 72 indexed people",
        "methodZh": "按人物去重。只纳入有事件级来源、明确本人到场的教育事件；学习包括学校、军事考察、勤工俭学和工厂实习，排除执教、担任院长和名誉学位。地点按这里明示的五组筛选；港澳台不被归为外国，也不纳入这五组。地名不代表当时国界：1921 年莫斯科与 1879 年檀香山分别保留原时空语境。段祺瑞的德国、周恩来的日本与法国按事件正文纳入，无单点坐标要求。",
        "methodEn": "Count unique people, using event-level sources and documented personal presence. Learning includes schooling, military study visits, work-study and factory training; teaching, institutional leadership and honorary degrees are excluded. The five named destination groups are an explicit geographic query, not a national-border classification. Hong Kong, Macao and Taiwan are neither labeled foreign nor included in these groups. Moscow in 1921 and Honolulu in 1879 retain their historical context. Duan Qirui’s German and Zhou Enlai’s Japanese/French study are classified from explicit event wording without assigning a single map point.",
        "limitationsZh": "这不是完整的留学率或国境流动统计。未命中可能是未记录、无本人到场依据，或地点不属于预设组；不代表从未在外求学。仅记授予学位的机构、未证实本人到场的 4 人另列。事件可无年份，因此本卡不排列旅行先后；各地点组人数可重叠，不能相加。",
        "limitationsEn": "This is neither a complete study-abroad rate nor a border-crossing statistic. A non-match may reflect incomplete records, missing personal-presence evidence or a destination outside the selected groups; it does not establish that a person never studied elsewhere. Four additional profiles have institution-only qualifications in these groups and are listed separately. Undated learning can count here, so this card does not establish travel order. Group counts overlap and must not be added.",
        "destinationGroups": group_counts, "matches": learning_members,
        "denominatorPersonIds": list(by_person),
        "nonMatchingPersonIds": [p["id"] for p in people if p["id"] not in {m["personId"] for m in learning_members}],
        "institutionOnlyEvidence": institution_only,
        "coverage": {
            "notMatchedCount": len(people) - first_n,
            "institutionOnlyAdditionalPeopleCount": len(institution_only),
            "matchedPeopleWithUndatedLearning": sum(any(not dated(e) for e in m["events"]) for m in learning_members),
        },
        "examples": examples(learning_members, ["p_sun_yat_sen", "p_deng_xiaoping", "p_tsai_ing_wen"]),
    }

    # F2: No chronology is inferred, so undated but evidenced presence can count.
    center_members = []
    multi_members = []
    for person in people:
        selected = [e for e in person["placeLeads"] if center_event(e)]
        if selected:
            centers = sorted({e["mapKey"] for e in selected})
            entry = member(person, selected, centerIds=centers)
            center_members.append(entry)
            if len(centers) >= 2:
                multi_members.append(entry)
    second_n, second_d = len(multi_members), len(center_members)
    second = {
        "id": "multiple-centers", "titleZh": "不止一个政治中心", "titleEn": "More than one political center",
        "claimZh": f"{second_d} 人有本人在北京、南京或广州发生政治、军政或职业事件的记录；其中 {second_n} 人在至少两座城市留下这类记录。",
        "claimEn": f"{second_d} people have documented political, military or career presence in Beijing, Nanjing or Guangzhou; {second_n} appear in at least two of these cities.",
        "numerator": second_n, "denominator": second_d,
        "denominatorLabelZh": "至少一座所选中心有本人活动记录的人物", "denominatorLabelEn": "People with documented presence in at least one selected center",
        "methodZh": "先筛北京、南京、广州，再筛有事件级来源且标为本人到场的任职、政治活动、战争、职业或区域活动事件，最后按人物与城市去重。出生、籍贯、求学和死亡均排除；仅有职权辖区或组织关联也排除。无年份的到场记录可计入城市覆盖，但不用于证明先后。",
        "methodEn": "Select Beijing, Nanjing and Guangzhou, then sourced events classified as personal presence and as office, political activity, war, career or regional activity. Deduplicate by person and city. Birth, ancestral origin, learning and death are excluded, as are jurisdiction-only and organizational-affiliation records. Undated presence may establish city coverage but never a sequence.",
        "limitationsZh": "三座城市是预先选定的观察窗口，不代表全部权力中心，也不能据此比较其历史重要性。到场包括任职、活动、被拘押或被迫迁居，不等同于掌权。{n} 人目前未有合格记录，不代表没有到过这些城市。样本选择与资料密度会影响结果。".format(n=len(people)-second_d),
        "limitationsEn": "These three cities are a preselected lens, not a complete list or a ranking of political centers. Presence includes office-holding, activity, detention or enforced residence, and does not imply holding power. The {n} people without qualifying records are not demonstrated never-visitors. Selection and uneven source coverage shape the result.".format(n=len(people)-second_d),
        "matches": multi_members, "denominatorPeople": center_members,
        "denominatorPersonIds": [m["personId"] for m in center_members],
        "coverage": {"allIndexedPeople": len(people), "noQualifyingCenterEvidenceCount": len(people)-second_d, "onlyOneCenterCount": second_d-second_n},
        "noQualifyingCenterEvidencePersonIds": [p["id"] for p in people if p["id"] not in {m["personId"] for m in center_members}],
        "centerCounts": [{"id": key, "labelZh": labels[0], "labelEn": labels[1], "peopleCount": sum(key in m["centerIds"] for m in center_members)} for key, labels in CENTERS.items()],
        "examples": examples(multi_members, ["p_sun_yat_sen", "p_chen_duxiu", "p_ye_jianying"]),
    }

    # F3: Compare all pairs, not just a visually convenient single route.
    # Strictly earlier years avoid ordering same-year or overlapping records.
    pair_members, eligible_members, unassessable = [], [], []
    no_pair_members = []
    for person in people:
        edu = [e for e in person["placeLeads"] if learning(e) and e.get("mapKey") and dated(e) and last_possible_year(e) is not None]
        public = [e for e in person["placeLeads"] if center_event(e) and dated(e)]
        if not edu or not public:
            unassessable.append({"personId": person["id"], "nameZh": person["nameZh"], "nameEn": person["nameEn"], "hasDatedLocatedLearning": bool(edu), "hasDatedCenterEvent": bool(public)})
            continue
        entry = member(person, edu+public, learningEventIds=[e["id"] for e in edu], centerEventIds=[e["id"] for e in public])
        eligible_members.append(entry)
        pairs = [{"learningEventId": a["id"], "centerEventId": b["id"], "learningLatestYear": last_possible_year(a), "centerEarliestYear": b["yearStart"], "fromMapKey": a["mapKey"], "toMapKey": b["mapKey"]} for a in edu for b in public if a["mapKey"] != b["mapKey"] and last_possible_year(a) < b["yearStart"]]
        if pairs:
            pair_ids = {pair[key] for pair in pairs for key in ["learningEventId", "centerEventId"]}
            entry = member(person, [e for e in edu+public if e["id"] in pair_ids], pairs=pairs)
            pair_members.append(entry)
        else:
            same_place = sum(a["mapKey"] == b["mapKey"] for a in edu for b in public)
            not_earlier = sum(last_possible_year(a) >= b["yearStart"] for a in edu for b in public)
            no_pair_members.append(dict(entry, samePlacePairCount=same_place, notStrictlyEarlierPairCount=not_earlier))
    third_n, third_d = len(pair_members), len(eligible_members)
    third = {
        "id": "learning-before-center", "titleZh": "何时可以建立先后关系", "titleEn": "When chronology supports a sequence",
        "claimZh": f"{third_d} 人同时具备可定位、可定年的本人学习与中心活动记录；其中 {third_n} 人至少有一项异地学习事件，发生年份严格早于其后在所选中心的活动。",
        "claimEn": f"{third_d} profiles contain both dated, located learning and a dated center event. In {third_n}, at least one learning event elsewhere falls strictly before a later event in a selected center.",
        "numerator": third_n, "denominator": third_d,
        "denominatorLabelZh": "具备两类可定年、可定位证据的人物", "denominatorLabelEn": "People with both kinds of dated, located evidence",
        "methodZh": "仅比较有事件级来源且明确本人到场的学习事件，以及北京、南京、广州的政治、军政或职业事件。两地地图键必须不同；学习区间的最晚年必须早于中心事件的最早年。单年入学或毕业只作为该年发生的事件，并不表示整个学段；同年、重叠区间和不明终点区间不建立先后。穷举所有合格配对，再按人物去重。",
        "methodEn": "Compare sourced personal learning with sourced personal political, military or career events in Beijing, Nanjing or Guangzhou. Map keys must differ, and the latest year of the learning event or interval must precede the earliest center year. A one-year enrollment or graduation is an event in that year, not a complete course of study. Same-year, overlapping and open-ended intervals are not ordered. Evaluate all qualifying pairs, then count unique people.",
        "limitationsZh": "这只证明两项记录可按年份排序，不证明学习导致从政、首次进入政治中心、直接迁移路线或中间没有其他经历。{n} 人缺少本查询所需的一类或两类证据，因此不进入分母；另 {m} 人虽然两类记录都有，但未满足严格先后与异地条件。地图位置仍为示意点。".format(n=len(unassessable),m=len(no_pair_members)),
        "limitationsEn": "This establishes an order between two recorded events, not a causal effect of education, first entry into politics, a direct journey or the absence of intervening activity. {n} people lack one or both kinds of evidence needed for this query and are outside the denominator. Another {m} have both kinds but no qualifying different-place, strictly ordered pair. Map positions remain schematic.".format(n=len(unassessable),m=len(no_pair_members)),
        "matches": pair_members, "denominatorPeople": eligible_members,
        "denominatorPersonIds": [m["personId"] for m in eligible_members],
        "unassessablePeople": unassessable, "noQualifyingPairPeople": no_pair_members,
        "coverage": {"allIndexedPeople": len(people), "unassessableCount": len(unassessable), "assessableWithoutQualifyingPairCount": len(no_pair_members), "qualifyingPairCount": sum(len(m["pairs"]) for m in pair_members)},
        "examples": examples(pair_members, ["p_liang_qichao", "p_chen_duxiu", "p_zhou_enlai"]),
    }

    findings = [first, second, third]
    for finding in findings:
        assert finding["numerator"] == len(finding["matches"])
        assert finding["denominator"] == len(finding["denominatorPersonIds"])
        assert len(set(finding["denominatorPersonIds"])) == finding["denominator"]
        for match in finding["matches"]:
            assert match["personId"] in finding["denominatorPersonIds"]
            assert match["eventIds"]
            for event in match["events"]:
                assert event["sourceRefs"] and event["spatialRelation"] == "documented_presence"
                assert all_events[event["id"]] in by_person[match["personId"]]["placeLeads"]
    referenced_source_ids = sorted({r["sourceId"] for finding in findings for match in finding["matches"] for event in match["events"] for r in event["sourceRefs"]})
    return {
        "meta": {
            "version": "findings.v1", "computedFromVersion": data["meta"].get("version"),
            "dataAsOf": data["meta"].get("asOf"), "inputSha256": hashlib.sha256(input_bytes).hexdigest(),
            "peopleCount": len(people), "eventCount": sum(supported(e) for e in all_events.values()),
            "unit": "unique people", "sampling": "curated purposive sample; not representative",
            "coordinatePolicy": "Schematic positions; no distances or direct travel inferred.",
            "reproduce": "python3 compute_findings.py --input atlas-data.json --output findings.json",
        },
        "introZh": "以下发现只描述这 72 位入选人物的现有来源记录。每个数字都能展开到全部贡献人物、事件与原始链接；未命中记录不视为否定证据。",
        "introEn": "These findings describe the current source records for 72 selected people. Every count can be expanded to all contributing people, events and source links. Missing records are never treated as negative evidence.",
        "findings": findings,
        "audit": {
            "nonLearningEducationEvents": NON_LEARNING_EDUCATION_EVENTS,
            "explicitTextDestinationAssignments": EXPLICIT_DESTINATIONS,
            "referencedSourceIds": referenced_source_ids,
            "referencedSourceCount": len(referenced_source_ids),
            "crossPeriodPolicy": "No period comparison is claimed. Person-period memberships overlap; lifetime records may precede 1840. Records are not reweighted by period or political entity.",
            "sourcePolicy": "This script audits structure and computes existing reviewed data. It does not independently re-read or corroborate each historical source.",
        },
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=ROOT / "data/atlas-data.json")
    parser.add_argument("--output", type=Path, default=ROOT / "data/findings.json")
    args = parser.parse_args()
    raw = args.input.read_bytes()
    result = build(json.loads(raw), raw)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    for finding in result["findings"]:
        print(f'{finding["id"]}: {finding["numerator"]}/{finding["denominator"]}')
    print(f'Input SHA256: {result["meta"]["inputSha256"]}')


if __name__ == "__main__":
    main()
