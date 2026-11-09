// NDC-2729: designer → QA transition → After → add create-record actions; read the module picker, owner fields, dropdown defaults, related-record field. Nothing is saved (no Publish).
const st = {};
await page.goto(H + '/settings/blueprints/' + T.LEADS + '/482aaf78-ffe9-441f-80f9-a3614e28d3a3', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 40; i++) { await sleep(3000); if ((await text()).includes('QA web to referral')) break; } await sleep(3000);
await page.getByText('QA web to referral', { exact: false }).first().click(); await sleep(3000);
await page.getByRole('tab', { name: 'After' }).click(); await sleep(2500);
const kinds = (process.env.KINDS || 'Create task,Meeting,Call,Create record').split(',');
for (const kind of kinds) {
  const tag = kind.replace(/\s+/g, '-').toLowerCase();
  const before = await page.locator('select').count();
  await page.getByRole('button', { name: kind, exact: true }).click(); await sleep(3000);
  await shot('2729-' + tag + '-a.png');
  const sel = await page.locator('select').evaluateAll(a => a.map(x => {
    let lab = ''; let p = x; for (let i = 0; i < 4 && p && !lab; i++) { p = p.parentElement; const l = p && p.querySelector('label, span, p'); if (l && l.innerText.trim() && l !== x) lab = l.innerText.trim(); }
    return { lab: lab.slice(0, 40), sel: x.options[x.selectedIndex] ? x.options[x.selectedIndex].text : null, n: x.options.length, opts: [...x.options].slice(0, 12).map(o => o.text).join('|').slice(0, 300), disabled: x.disabled };
  }));
  const inputs = await page.locator('input:visible, textarea:visible').evaluateAll(a => a.map(x => (x.getAttribute('aria-label') || x.name || '') + '[' + (x.placeholder || '') + ']/' + x.type));
  const buttons = (await page.getByRole('button').allInnerTexts()).map(x => x.trim()).filter(x => x && x.length < 50);
  const combos = await page.getByRole('combobox').evaluateAll(a => a.map(x => (x.getAttribute('aria-label') || '') + '=' + (x.innerText || x.value || '').trim().slice(0, 40)));
  st[kind] = { newSelects: sel.slice(before), allSelectsN: sel.length, inputs: inputs.slice(-30), combos, buttons: buttons.slice(-45) };
  for (let k = 0; k < 4; k++) { await page.mouse.move(1350, 600); await page.mouse.wheel(0, 500); await sleep(800); await shot('2729-' + tag + '-s' + k + '.png'); }
}
return st;
