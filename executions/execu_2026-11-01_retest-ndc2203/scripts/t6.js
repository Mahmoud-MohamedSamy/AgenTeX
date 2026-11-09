// NDC-2203 B13 + B14 — uses the existing skill product_expertise with a TEMPORARY criterion (restored to empty in finally).
// (user approved 1 Nov). QA skill "qa_wf_b13" with criteria subject contains "SKILLQA" (no real ticket matches);
// B13: Recalculate Skills on create → SKILLQA ticket gets the skill, plain ticket doesn't. B14: agent fedelav803 (online) gets the skill;
// Recalculate + Reassign based on Skills → ticket goes to that agent. Restore: QA skill deleted, agent skills back to the original list.
const out = {}; const AGT = '9d182dfa-05f3-4af7-9685-8615a2fbe537'; const KEY = 'product_expertise';
const orig = arr((await api('GET', '/desk/agent-skills')).j?.data?.agents).find(a => a.user_id === AGT)?.skills || []; out.agentSkillsBefore = orig;
const crit = { conditions: [{ field_key: 'subject', operator: 'contains', value: 'SKILLQA' }], pattern: null };
try {
  const SK0 = arr((await api('GET', '/desk/skills')).j?.data?.skills).find(s => s.key === KEY); out.skillBefore = JSON.stringify(SK0?.criteria);
  const sv = await api('PUT', '/desk/skills', { key: KEY, label: SK0.label, description: SK0.description, type_id: SK0.type_id, criteria: crit });
  out.saveSkill = sv.s + (sv.s > 299 ? ' ' + sv.t.slice(0, 250) : '');
  out.skillStored = JSON.stringify(arr((await api('GET', '/desk/skills')).j?.data?.skills).find(s => s.key === KEY)?.criteria);
  if (sv.s > 299) return fin(out);
  // B13
  out.ruleB13 = (await mkRule('B13', { kind: 'RecordCreated' }, [{ type: 'RecalculateTicketSkills' }])).s;
  const m = (await mkTicket('B13', { subject: 'QA WF B13 SKILLQA ticket' })).id; const p = (await mkTicket('B13', { subject: 'QA WF B13 plain ticket' })).id;
  // B14
  out.agentHasSkill = orig.includes(KEY);
  out.ruleB14 = (await mkRule('B14', { kind: 'RecordCreated' }, [{ type: 'RecalculateTicketSkills' }, { type: 'ReassignTicketBySkills' }])).s;
  const r = (await mkTicket('B14', { subject: 'QA WF B14 SKILLQA ticket' })).id;
  await sleep(30000);
  const disp = async id => arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseBodyTruncated || d.errorMessage || '').slice(0, 160)));
  out.B13match = { skills: (await getTicket(m)).skills, run: await disp(m), n: (await getTicket(m)).ticket_number };
  out.B13plain = { skills: (await getTicket(p)).skills, run: await disp(p), n: (await getTicket(p)).ticket_number };
  const tr = await getTicket(r).catch(() => ({})); const rr = await api('GET', `/modules/${T}/records/${r}`);
  out.B14 = { adminRead: rr.s, skills: tr.skills, owner: tr.owner, ownerIsAgent: tr.owner === AGT, run: await disp(r), n: tr.ticket_number, id: r };
} finally {
  const SK1 = arr((await api('GET', '/desk/skills')).j?.data?.skills).find(s => s.key === KEY);
  out.restoreCriteria = (await api('PUT', '/desk/skills', { key: KEY, label: SK1?.label, description: SK1?.description ?? null, type_id: SK1?.type_id ?? null, criteria: { conditions: [], pattern: null } })).s;
  out.agentSkillsAfter = arr((await api('GET', '/desk/agent-skills')).j?.data?.agents).find(a => a.user_id === AGT)?.skills;
  out.skillAfter = JSON.stringify(arr((await api('GET', '/desk/skills')).j?.data?.skills).find(s => s.key === KEY)?.criteria);
}
return fin(out);
