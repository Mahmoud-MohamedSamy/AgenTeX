(async (page) => { const t = (await page.innerText('body')).replace(/\s+/g, ' '); const i = t.indexOf('DEPARTMENTS') >= 0 ? t.lastIndexOf('Departments') : 0;
  return { tail: t.slice(t.indexOf('Mobile Extensions') > 0 ? t.indexOf('Mobile Extensions') : -1500).slice(0, 1500), url: page.url() }; })
