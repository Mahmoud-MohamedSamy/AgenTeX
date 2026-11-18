const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 140) : ''); };
const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
const C = '1499272000000451979';
const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
const ct = await api(page, 'GET', 'contacts/' + C + '/tickets?limit=50'); out.contactTickets = ct.s + ' ' + ((ct.j && ct.j.data) || []).map(x => x.subject).join(',');
const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
out.Y6 = await pr('GET', 'tickets/' + YS.Y6);
const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
out.follow = []; for (const [m, p, b] of [['POST', 'tickets/' + YS.Y3 + '/addFollowers', { followerIds: ['1499272000000432034'] }], ['POST', 'tickets/' + YS.Y3 + '/follow', {}]]) { const s = await pr(m, p, b); out.follow.push(p.split('/').pop() + ' ' + s); if (/^2/.test(s)) break; }
const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
await openT(page, YS.Y4); const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
out.y4 = (await body(page)).replace(/\s+/g, ' ').slice(0, 500); await shotZ(page, 'ac2-y4-restricted');
const YS={"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178"};
const dd = page.locator('[data-title*="Reply" i] + *, [data-id*="replyAllDropdown" i]'); out.dd = await dd.count();
