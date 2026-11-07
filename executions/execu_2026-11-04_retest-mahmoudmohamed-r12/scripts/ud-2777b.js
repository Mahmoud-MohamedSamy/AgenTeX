// NDC-2777 r12: two tabs on QA RT11 Dept A. A: CC off → Save. B (opened before A saved): Help Center display name → Save. Then reload; restore CC on + display name blank.
const st = {}; const reqs = []; const U = H + '/settings/organization/departments/b8941829-5e08-43e1-b8e0-89c33bb9903c';
const hook = require(require('path').join(process.cwd(), 'hook.js'));
const open = async (p) => { await p.goto(U, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await p.waitForTimeout(2000); if (/Allow copied addresses/.test(await p.innerText('body').catch(() => ''))) break; } await p.waitForTimeout(3000); };
const cc = p => p.getByRole('checkbox', { name: /Allow copied addresses/ });
const A = page; hook(A, reqs); const B = await ctx.newPage(); await B.setViewportSize({ width: 1600, height: 900 }); hook(B, reqs);
await open(A); await open(B);
st.ccA0 = await cc(A).isChecked(); st.ccB0 = await cc(B).isChecked();
await cc(A).uncheck(); await A.getByRole('button', { name: 'Save', exact: true }).click(); await A.waitForTimeout(5000);
st.A_msg = ((await A.innerText('body')).match(/(saved|updated|changed since|reload|conflict)[^\n]*/i) || [''])[0]; await A.screenshot({ path: require('path').join(process.cwd(), '..', 'screenshots', 'raw', '2777-b1-tabA-saved.png') });
await B.getByLabel('Display Name in Help Center').fill('QA RT12 2777 B'); await B.getByRole('button', { name: 'Save', exact: true }).click(); await B.waitForTimeout(6000);
await B.screenshot({ path: require('path').join(process.cwd(), '..', 'screenshots', 'raw', '2777-b2-tabB-save.png') });
st.B_text = ((await B.innerText('body')).match(/[^\n]*(changed since|reload|conflict|another|out of date|newer|saved|updated)[^\n]*/gi) || []).slice(0, 4);
await open(A); st.afterReload = { cc: await cc(A).isChecked(), display: await A.getByLabel('Display Name in Help Center').inputValue() }; await A.screenshot({ path: require('path').join(process.cwd(), '..', 'screenshots', 'raw', '2777-b3-reload.png') });
st.saves = reqs.filter(x => /^(PUT|PATCH|POST) .*departments/.test(x)).map(x => x.slice(0, 500));
// restore
if (!st.afterReload.cc || st.afterReload.display) { if (!st.afterReload.cc) await cc(A).check(); await A.getByLabel('Display Name in Help Center').fill(''); await A.getByRole('button', { name: 'Save', exact: true }).click(); await A.waitForTimeout(5000); await open(A); st.restored = { cc: await cc(A).isChecked(), display: await A.getByLabel('Display Name in Help Center').inputValue() }; }
return st;
