const o = JSON.parse(fs.readFileSync(RUN + '/out/rt6.json', 'utf8'));
const raw = (await api('GET', `/modules/${T}/records/${o.TK.AT12}`)).j?.data?.data || [];
const skillish = raw.filter(x => /skill/i.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value).slice(0, 160));
const sk = (await api('GET', '/desk/skills?department_id=' + DEPT2)).j?.data; const list = sk?.skills || arr(sk); const me = list.find(s => s.id === o.SK);
const tsk = await api('GET', `/desk/tickets/${o.TK.AT12}/skills`);
return { skillFields: skillish, skill: me && { name: me.name, key: me.key || me.skill_key, status: me.status, agents: me.agent_ids || me.user_ids || me.agents }, ticketSkillsEndpoint: tsk.s + ' ' + tsk.t.slice(0, 300), hist: arr((await api('GET', `/desk/tickets/${o.TK.AT12}/history`)).j?.data).map(x => x.action + '/' + (x.actor_type || '')) };
