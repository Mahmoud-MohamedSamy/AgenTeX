const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c', AG = '2765f377-5030-4512-8c29-43b133395d11', ADM = '5d6fb69e-f710-4e3d-813c-d610f46073d4';
const enc = v => ({ kind: 'string', value: v });
const L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data).map(l => l.name);
const ca = await api('POST', `/modules/${OPEN}/records`, { data: [{ field: 'name', value: enc('QA MF agent via L-Agent') }], layout_id: AG });
const cd = await api('POST', `/modules/${OPEN}/records`, { data: [{ field: 'name', value: enc('QA MF agent via L-Admin') }], layout_id: ADM });
const ga = await api('GET', `/modules/${OPEN}/layouts/${ADM}`);
await go(`/modules/${OPEN}`, 7000);
const nb = page.getByRole('button', { name: /^(New|Create|\+ New)/ }).first(); if (await nb.count()) { await nb.click(); await sleep(2500); }
const formTxt = (await txt()).replace(/\s+/g, ' ');
const pick = ['QA MF L-Admin', 'QA MF L-Agent', 'Default'].map(n => `${n}:${formTxt.includes(n)}`).join(' ');
const s = await shot('G10-agent-create-form');
const lsel = await page.locator('select, [role=combobox]').evaluateAll(es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 120)));
await page.keyboard.press('Escape');
const pass = !L.includes('QA MF L-Admin') && cd.s >= 400 && ca.s < 300;
rec('G10', pass ? 'PASS' : 'FAIL', `agent GET layouts lists [${L.join(', ')}]; GET L-Admin by id → ${ga.s}; create with L-Agent (Desk Agent) → ${ca.s}; create with L-Admin (owner only) → ${cd.s}${cd.s < 300 ? ' (CREATED)' : ''}; create form mentions ${pick}; selects ${JSON.stringify(lsel).slice(0, 200)}`, { shot: s, severity: 'High' });
return done();
