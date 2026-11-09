const DL = '924f2fa3-5d1c-44ec-86cd-9082a7544789', DA = '68384f10-598d-418e-b049-4ec7684a4890';
const ex = async id => arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => [e.ruleId.slice(0, 8), e.triggerKind, e.criteriaMatched, e.outcome, e.errorMessage, JSON.stringify(e.details || '').slice(0, 160), e.evaluatedAt.slice(11, 19)].join(' | '));
const t = await getTicket(DL);
const rule = (await api('GET', '/workflow/rules/29db5b01-fea5-4e8c-8ead-b414932b222c')).j?.data;
return fin({ DL: await ex(DL), DA: await ex(DA), now: { description: t.description, resolution: t.resolution, language: t.language }, trig: rule?.trigger });
