async (page) => {
  const t = await page.innerText('body');
  const i = t.indexOf('Additional Information'); return t.slice(i, i+500).replace(/\n+/g,' | ');
}
