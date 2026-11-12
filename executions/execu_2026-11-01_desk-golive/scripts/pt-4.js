await page.goto(HC + 'community/topic/qa-gl-w4-agent-topic-4e268c', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(7000);
out.topicPage = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 500);
out.buttons = (await page.locator('main button, main [role=button], main a').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 40);
const rep = page.getByText('QA GL W4 staff reply').first();
const card = rep.locator('xpath=ancestor::*[self::article or self::li or contains(@class,"reply")][1]');
const more = card.getByRole('button', { name: /more|report|options|actions/i }).first();
if (await more.count()) { await more.click(); await page.waitForTimeout(1500); }
out.menu = (await page.locator('[role=menu], [role=dialog]').allInnerTexts()).join(' / ').replace(/\s+/g, ' ').slice(0, 300);
const rp = { count: async () => await page.locator('[role=dialog]').count(), click: async () => {} };
if (await rp.count()) { await rp.click(); await page.waitForTimeout(2000);
  const dlg = page.locator('[role=dialog]').last(); out.reportDlg = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  await shot('w4/W4-57-report-dialog');
  const reason = dlg.locator('input[type=radio], [role=radio]').first(); if (await reason.count()) await reason.click().catch(() => {});
  const ta = dlg.locator('textarea').first(); if (await ta.count()) await ta.fill('QA GL W4 report test');
  const n0 = NET.length; await dlg.getByRole('button', { name: /report|submit|send/i }).last().click().catch(e => out.rErr = e.message.slice(0, 80)); await page.waitForTimeout(4000);
  out.reportNet = NET.slice(n0).filter(x => x.m !== 'GET').map(x => x.m + ' ' + x.u.split('/').slice(-3).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 120));
} else out.noReport = true;
await shot('w4/W4-57-after-report');
// W4-59 Arabic topic
await page.goto(HC + 'community', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
const nt = page.getByRole('link', { name: /new topic|start a topic|ask|post/i }).or(page.getByRole('button', { name: /new topic|start a topic|ask/i })).first();
out.ntLabel = await nt.innerText().catch(() => 'none');
if (await nt.count()) { await nt.click(); await page.waitForTimeout(5000);
  out.formUrl = page.url().replace(HC, '~/'); out.form = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 400);
  const title = page.getByLabel(/title|subject/i).first(); await title.fill('QA GL W4 موضوع عربي ٠١');
  const bd = page.locator('main [contenteditable=true], main textarea').first(); await bd.click(); await page.keyboard.insertText('هذا موضوع اختبار باللغة العربية. السطر الثاني: ١٢٣ abc.');
  const cat = page.getByLabel(/category/i).first(); if (await cat.count()) { const tag = await cat.evaluate(e => e.tagName); if (tag === 'SELECT') await cat.selectOption({ label: 'QA GL W4 cat' }); else { await cat.click(); await page.getByRole('option', { name: 'QA GL W4 cat' }).click().catch(() => {}); } }
  await shot('w4/W4-59-arabic-form');
  const n1 = NET.length; await page.getByRole('button', { name: /^(Post|Publish|Submit|Create)/i }).last().click().catch(e => out.pErr = e.message.slice(0, 80)); await page.waitForTimeout(7000);
  out.postNet = NET.slice(n1).filter(x => x.m !== 'GET').map(x => x.m + ' ' + x.u.split('/').slice(-2).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 150));
  out.after = page.url().replace(HC, '~/');
  out.dir = await page.locator('h1').first().evaluate(e => getComputedStyle(e).direction + ' / dir attr ' + (e.closest('[dir]') ? e.closest('[dir]').getAttribute('dir') : 'none')).catch(() => '?');
  out.afterText = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 300);
  await shot('w4/W4-59-arabic-topic');
}
