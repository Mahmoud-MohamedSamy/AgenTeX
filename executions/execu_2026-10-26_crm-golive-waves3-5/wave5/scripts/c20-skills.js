const out = {}, made = {}, ME = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const c = await call('POST', '/iam/skills/categories', { name: 'QA W5 Category' }); out.category = c.s + ' ' + (c.s < 300 ? '' : c.t.slice(0, 200)); const C = c.s < 300 && c.j.data.id; made.category = C;
if (C) { const g = await call('POST', '/iam/skills/groups', { skill_category_id: C, name: 'QA W5 Group' }); out.group = g.s; const G = g.s < 300 && g.j.data.id; made.group = G;
  if (G) { const s = await call('POST', '/iam/skills', { skill_group_id: G, name: 'QA W5 Skill' }); out.skill = s.s + ' ' + (s.s < 300 ? '' : s.t.slice(0, 200)); const S = s.s < 300 && s.j.data.id; made.skill = S;
    if (S) { const u = await call('POST', `/iam/skills/users/${ME}`, { skill_id: S, score: 4 }); out.assignToOwner = u.s + ' ' + u.t.slice(0, 160);
      const bad = await call('POST', `/iam/skills/users/${ME}`, { skill_id: S, score: 99 }); out.scoreOutOfRange = bad.s + ' ' + bad.t.slice(0, 200);
      const mine = await call('GET', '/iam/me/skills'); out.mySkills = mine.t.slice(0, 300);
      const dir = await call('GET', '/iam/skills/directory?q=QA'); out.directory = dir.s + ' ' + dir.t.slice(0, 200); } }
  const dupC = await call('POST', '/iam/skills/categories', { name: 'QA W5 Category' }); out.duplicateCategory = dupC.s + ' ' + dupC.t.slice(0, 160); if (dupC.s < 300) made.category2 = dupC.j.data.id; }
out.made = made; return out;
