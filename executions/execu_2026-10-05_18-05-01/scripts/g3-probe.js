// Read-only probe of the Create module dialog structure.
await go('/settings/modules-and-fields', 5000);
await page.getByRole('button', { name: /Create New Module/ }).click(); await sleep(1500);
const info = await page.evaluate(() => {
  const ins = [...document.querySelectorAll('input,textarea,select,button')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.y > 0; });
  const modal = document.querySelector('[role=dialog],[aria-modal=true],.modal,[class*=modal],[class*=Modal]');
  return { modal: modal ? modal.tagName + ' ' + modal.className.toString().slice(0, 80) + ' role=' + modal.getAttribute('role') : null, els: ins.slice(-25).map(e => `${e.tagName}|type=${e.type}|ph=${e.placeholder || ''}|aria=${e.getAttribute('aria-label') || ''}|txt=${(e.innerText || '').slice(0, 30)}|name=${e.name || ''}`) };
});
await page.getByRole('button', { name: /^Create$/ }).last().click(); await sleep(800);
const errs = (await txt()).match(/Enter the [^\n]*/g);
await page.keyboard.press('Escape');
page.off('request', onReq);
return JSON.stringify({ ...info, errs });
