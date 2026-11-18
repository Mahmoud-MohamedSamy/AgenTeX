const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const out = {};
for (const [tag, id, subj] of [['4174', 'c3a5d3af-76ee-4aea-8a3c-ff71d954e03f', 'QA BP RT19 3036 onlyA ticket 3'], ['4165', 'f5955ca9-75d0-460d-8e00-0c50d26f25f8', 'QA BP RT19 3031 A cont devshape ticket'], ['4170', '319bbf9e-14f5-44af-88bc-8f97f5aef084', 'QA BP RT19 3032 fieldupd ticket']]) {
  await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded' });
  await page.getByText(subj).first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(5000);
  const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Steps/);
  out[tag] = { card: i >= 0 ? t.slice(i, i + 260) : 'NO STEPS CARD: ' + t.slice(0, 200) };
  await page.screenshot({ path: RAW + '3056-' + tag + '-card.png' });
  const v = page.getByText('View configured actions').first();
  if (await v.count()) { await v.click(); await sleep(3000); const d = page.getByRole('dialog').first(); out[tag].popup = (await d.innerText().catch(() => text())).replace(/\s+/g, ' ').slice(0, 900); await page.screenshot({ path: RAW + '3056-' + tag + '-popup.png' }); await page.keyboard.press('Escape'); await sleep(800); } else out[tag].popup = 'NO LINK';
}
// agent cannot open Settings blueprints
await page.goto(H + '/settings/automation/blueprints', { waitUntil: 'domcontentloaded' }); await sleep(8000); out.settings = (await text()).replace(/\s+/g, ' ').slice(0, 200);
return out;
