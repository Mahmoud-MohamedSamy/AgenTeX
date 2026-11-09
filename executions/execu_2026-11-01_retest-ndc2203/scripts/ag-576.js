const id = 'c1dbba57-63ae-4cf3-a645-003bb418c43e';
const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').slice(0, 160));
const t = (await api('GET', `/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/70c80b92-d7ac-4c15-b0f6-4e76d8a9139c`)).j?.data?.data || [];
return { h576: h.slice(0, 6), t577: t.filter(x => /customer_responded|status/.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value?.value)) };
