async (page) => {
  return await page.evaluate(() => {
    const m = document.querySelector('lyte-modal, .lyteModal, [role=dialog]');
    const root = document.querySelector('.lyteModalWrapper') || document.body;
    const els = [...document.querySelectorAll('lyte-dropbutton, lyte-dropdown, .lyteDummyEventContainer, [class*=dropbutton], input[type=radio], input')].filter(e => e.offsetParent).slice(0, 30);
    return els.map(e => { const r = e.getBoundingClientRect(); return e.tagName + '|' + (e.className||'').toString().slice(0,40) + '|' + (e.innerText||e.value||'').slice(0,30) + '|' + Math.round(r.x+r.width/2) + ',' + Math.round(r.y+r.height/2); });
  });
}
