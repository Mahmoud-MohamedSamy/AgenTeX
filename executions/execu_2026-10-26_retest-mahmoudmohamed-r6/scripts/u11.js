// NDC-1823: convert a QA lead, tick Create a new Deal, inspect Probability / Expected Revenue.
page.on('dialog', d => d.accept().catch(() => {}));
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const s = v => ({ kind: 'string', value: v });
const r = await api('POST', `/modules/${L}/records`, { layout_id: '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1', data: [{ field: 'first_name', value: s('QA RT 1823') }, { field: 'last_name', value: s('convert') }, { field: 'phone', value: s('01012345671') }, { field: 'email', value: s('qa.rt.1823@example.com') }, { field: 'company', value: s('QA RT 1823 Co') }] });
const id = r.j?.data?.id; if (!id) return done({ err: r.t.slice(0, 300) });
await go(`/modules/${L}/records/${id}`, 20000);
await page.getByRole('button', { name: /^Convert/ }).first().click({ force: true }); await sleep(8000); await shot('1823-01-convert-page');
const t = (await txt()).split('\n').filter(l => l.trim()); return done({ id, url: page.url(), deal: t.filter(l => /deal|transaction|probability|expected|stage|amount/i.test(l)).slice(0, 20) });
