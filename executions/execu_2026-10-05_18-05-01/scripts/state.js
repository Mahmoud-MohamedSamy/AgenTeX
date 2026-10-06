// Read-only: current modules (flag QA ones) and auth health.
const r = await api('GET', '/modules');
page.off('request', onReq);
return JSON.stringify({ status: r.s, url: page.url(), body: r.j ? arr(r.j.data).map(m => `${m.pluralForm}|${m.id}|${m.status}|${m.storageScope}`) : r.t.slice(0, 300) });
