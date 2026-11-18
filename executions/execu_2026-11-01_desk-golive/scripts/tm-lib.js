const T1 = 'd72d5704-6602-48b8-8a55-2943dbb62762', T2 = '9467ee7b-41f7-45c6-8476-9fab49e502c6';
const openMore = async () => { await page.keyboard.press('Escape').catch(() => {}); await sleep(400); const bs = page.getByRole('button', { name: 'More ticket actions' }); const n = await bs.count(); let bi = 0, by = 1e9; for (let i = 0; i < n; i++) { const b = await bs.nth(i).boundingBox().catch(() => null); if (b && b.y < by) { by = b.y; bi = i; } } await bs.nth(bi).click(); await sleep(1200); return page.locator('[role=menu]').last(); };
const clickItem = async name => { const m = await openMore(); await m.getByRole('menuitem', { name, exact: true }).first().click(); await sleep(2500); };
const dlg = async () => (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
const toasts = async () => (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' / ').replace(/\s+/g, ' ').slice(0, 400);
const head = async () => (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
const flt = () => NET.filter(n => !/iam\/|auth|heartbeat|summaries|realtime|resolved-batch|\/read$|lookups/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.b.slice(0, 140) + ' => ' + n.t.slice(0, 160));
