page.on('dialog', d => d.accept().catch(() => {}));
const id = '70c80b92-d7ac-4c15-b0f6-4e76d8a9139c';
const rule = (await api('GET', '/workflow/rules/75055fb1-458b-4201-b50a-567810f69cab')).j?.data;
const ex = await api('GET', `/workflow/executions?recordId=${id}`);
const exAll = arr((await api('GET', `/workflow/executions?ruleId=75055fb1-458b-4201-b50a-567810f69cab`)).j?.data).map(e => e.recordId.slice(0, 8) + ' ' + e.outcome + ' ' + e.evaluatedAt.slice(11, 19));
return fin({ rule: { active: rule?.isActive, trigger: rule?.trigger?.ticketEvents, criteria: rule?.criteria, depts: rule?.departmentIds, layout: rule?.layoutId }, ex: ex.s + ' ' + arr(ex.j?.data).map(e => e.ruleId.slice(0, 8) + ' ' + e.triggerKind + ' ' + e.outcome + ' ' + e.evaluatedAt.slice(11, 19)).join(' | '), exAll });
