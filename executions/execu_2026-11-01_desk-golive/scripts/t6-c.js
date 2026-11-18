await go('/views/all/tickets/' + T1, 9000);
for (const it of ['Move', 'Share', 'Merge', 'Apply Macro', 'Change Layout', 'Put on legal hold', 'Delete']) {
  try { await clickItem(it); out[it] = await dlg(); await shot('tm/tavi-dlg-' + it.replace(/\s+/g, '-')); } catch (e) { out[it] = 'ERR ' + e.message.slice(0, 150); }
  await page.keyboard.press('Escape'); await sleep(1200); if (!page.url().includes(T1)) await go('/views/all/tickets/' + T1, 8000);
}
return fin({ out });
