const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', o = {};
const rl = await api('GET', `/workflow/rules?moduleId=${TK}&limit=50`); o.rules = [rl.s, (arr(rl.j)||[]).length];
const withSkill = (arr(rl.j)||[]).find(r => JSON.stringify(r).includes('TicketSkills'));
o.sample = withSkill ? JSON.stringify(withSkill).slice(0, 1500) : JSON.stringify((arr(rl.j)||[])[0] || rl.j).slice(0, 1500);
o.limits = (await api('GET', `/workflow/rules/limits?moduleId=${TK}`)).t.slice(0, 400);
return o;
