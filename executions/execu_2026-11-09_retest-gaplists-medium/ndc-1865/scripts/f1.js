const out={};
for (const u of ['/desk/settings','/settings','/desk/setup']) {
  await page.goto(H+u,{waitUntil:'commit',timeout:120000}); await sleep(12000);
  out[u]={url:page.url(), text:(await page.innerText('body').catch(()=>'')).slice(0,2500)};
  if (/setup|settings/i.test(out[u].text)) break;
}
out.links = await page.$$eval('a[href]', as=>[...new Set(as.map(a=>a.getAttribute('href')))].filter(h=>/setting|setup/i.test(h)).slice(0,200));
await page.screenshot({path:'../evidence/raw/00-setup-home.png'});
return out;
