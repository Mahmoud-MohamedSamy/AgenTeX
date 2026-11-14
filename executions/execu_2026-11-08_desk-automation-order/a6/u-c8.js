const saves = []; page.on('request', r => { if (/blueprints/.test(r.url()) && r.method() !== 'GET') saves.push(r.method() + ' ' + r.url().split('/api/v1')[1]); });
await go('/settings/automation/blueprints/new'); await sleep(8000);
const canvas = page.locator('.react-flow, [data-testid*=canvas]').first(); const cb = await canvas.boundingBox(); log('canvas', cb);
const D = page.locator('[draggable=true]'); const idx = { Open: 0, Escalated: 2, Closed: 3 }; const pal = n => D.nth(idx[n]);
let i = 0; for (const n of ['Open', 'Escalated', 'Closed']) { await pal(n).dragTo(canvas, { targetPosition: { x: 200 + 280 * i, y: 250 } }); await sleep(1200); i++; }
const nodes = await page.locator('.react-flow__node').evaluateAll(a => a.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 40)));
log('nodes', nodes);
log('palette marks', (await page.locator('aside, [class*=palette]').first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0, 400));
log('onCanvasText', (await text()).match(/On the canvas[^\n]{0,40}/g));
await shot('c8-dragged');
// H3: publish with issues (no name, no department, no transitions)
await page.getByRole('button', { name: 'Save and Publish' }).click({ force: true }).catch(e => log('pub click', String(e).slice(0, 80))); await sleep(2500);
log('h3', (await text()).match(/\d+ issues?[^\n]{0,80}/g)); 
const panel = (await page.locator('body').innerText()).split('Email Providers').pop().replace(/\s+/g, ' ');
log('h3panel', panel.slice(panel.search(/issue/i) - 100, panel.search(/issue/i) + 700));
await shot('h3-issues');
log('pubEnabled', await page.getByRole('button', { name: 'Save and Publish' }).isEnabled());
log('saves', saves);
