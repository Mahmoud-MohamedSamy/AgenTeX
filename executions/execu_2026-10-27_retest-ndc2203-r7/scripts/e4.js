const A3 = '1a696e04-600e-4ca9-9cdf-22cd8aa78257', DL = '924f2fa3-5d1c-44ec-86cd-9082a7544789';
const all = await patchTicket(DL, { description: 'QA WF D3all changed all', resolution: 'QA WF resolution', language: 'arabic' });
await sleep(15000);
const c = async id => arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).map(c => (c.is_public ? 'PUB ' : 'prv ') + c.body_html.replace(/<[^>]+>/g, '') + ' @' + c.created_at.slice(11, 19));
return fin({ all, A3: await c(A3), DL: await c(DL) });
