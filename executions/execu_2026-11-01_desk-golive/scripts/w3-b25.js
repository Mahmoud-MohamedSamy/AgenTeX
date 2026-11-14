const T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
await go('/views/all/tickets/' + T1, 12000);
const cea = page.locator('#main-content').getByRole('button', { name: 'Conversation entry actions' }).first(); if (await cea.count()) { await cea.click(); await sleep(1500); out.convMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w3/W3-14-conversation-menu'); await page.keyboard.press('Escape'); }
const mta = page.locator('#main-content').getByRole('button', { name: 'More ticket actions' }).first(); if (await mta.count()) { await mta.click(); await sleep(1500); out.moreMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.keyboard.press('Escape'); }
await page.locator('#main-content').getByRole('button', { name: 'Actions', exact: true }).click(); await sleep(1200); const pr = page.getByRole('menuitem', { name: /Previous results/ }); if (await pr.count()) { await pr.click(); await sleep(2500); out.prev = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').replace(/qa-gl-w3-dummy-[a-z]+-\d+/g, '<SECRET>').slice(0, 700); await shot('w3/W3-14-previous-results'); await page.keyboard.press('Escape'); }
// W3-21 AI switch
await go('/settings/developer/custom-actions', 10000); await page.getByRole('button', { name: 'Actions for QA GL W3 echo', exact: true }).click(); await sleep(1000); out.aiItem = (await page.getByRole('menuitem', { name: /AI access/ }).first().getAttribute('title').catch(() => '')) || ''; await page.keyboard.press('Escape');
// W3-22/23 AI tagging
await go('/settings/automation/ai-tagging', 10000); const MC = page.locator('#main-content');
out.ai = (await MC.innerText()).replace(/\s+/g, ' ').match(/AI Tagging Let AI.*/)?.[0]?.slice(0, 900);
out.aiCtrls = await MC.locator('input,button[role=switch],[role=switch],button').evaluateAll(es => es.filter(e => e.offsetParent).slice(-14).map(e => [e.tagName, e.type, e.getAttribute('role'), e.getAttribute('aria-label'), e.disabled ? 'DISABLED' : '', (e.value || '').slice(0, 10), (e.innerText || '').trim().slice(0, 20)].join('|')));
await shot('w3/W3-22-ai-tagging');
const nums = MC.locator('input[type=number]:visible'); out.nNums = await nums.count();
if (out.nNums) { for (const [i, v] of [[0, '0'], [0, '6'], [1, '101']]) { if (i >= out.nNums) continue; await nums.nth(i).fill(v); await nums.nth(i).blur(); await sleep(800); out['v' + i + '_' + v] = { val: await nums.nth(i).inputValue(), msg: ((await MC.innerText()).match(/[^.\n]*(between|from 1|1–5|0–100|at most|at least|must)[^.\n]*/gi) || []).slice(0, 3) }; } await shot('w3/W3-23-ai-invalid'); }
return fin({ out });
