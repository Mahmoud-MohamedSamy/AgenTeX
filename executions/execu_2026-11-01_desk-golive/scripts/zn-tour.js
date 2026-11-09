// READ-ONLY setup tour. Reads ndc-zoho/tour-batch.json = [[name, hashRoute], ...]. For each page: navigate, wait,
// save screenshot + visible text + every supportapi GET JSON response to ndc-zoho/setup/<name>/.
async (page, ctx, blocked) => {
  const fs = require('fs'); const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/ndc-zoho';
  const batch = JSON.parse(fs.readFileSync(D + '/tour-batch.json', 'utf8')); const out = [];
  for (const [name, hash] of batch) {
    const dir = D + '/setup/' + name; fs.mkdirSync(dir, { recursive: true }); const got = []; let k = 0;
    const on = async r => { try { const u = r.url(); const isDwr = /DWRutil\.do/.test(u) || (/\/support\/wondertravel\/[A-Za-z]+\.do/.test(u) && r.request().method() === 'GET');
      if (!isDwr && (r.request().method() !== 'GET' || !/supportapi|\/api\/v1\//.test(u) || /photo|logo|unreadNotification|wms|featureflag/i.test(u))) return;
      const ct = r.headers()['content-type'] || ''; if (!isDwr && !/json/.test(ct)) return;
      const dm = isDwr ? ((r.request().postData() || '').match(/c0-methodName=([^\r\n&]+)/) || [])[1] || 'dwr' : null;
      const b = await r.text(); if (b.length > 3e6) return;
      const slug = String(++k).padStart(2, '0') + '_' + u.replace(/^https:\/\/desk\.zoho\.com\/(supportapi\/zd\/wondertravel\/)?api\/v1\//, '').replace(/[?&=\/]+/g, '_').slice(0, 90) + (dm ? '_' + dm : '');
      fs.writeFileSync(dir + '/' + slug + '.json', b); got.push(r.status() + ' ' + (dm ? 'DWR:' + dm + ' ' : '') + u.replace(/^https:\/\/desk\.zoho\.com/, '').slice(0, 160)); } catch (e) { } };
    page.on('response', on);
    await page.goto('https://desk.zoho.com/agent/wondertravel/all/setup' + hash, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(+process.env.ZW || 14000);
    const nn = page.locator('text=/^Not Now$/').first(); if (await nn.count()) await nn.click().catch(() => {});
    page.off('response', on);
    let t = ''; for (const f of page.frames()) t += ' ' + (await f.innerText('body').catch(() => ''));
    t = t.replace(/\s+/g, ' '); const i = t.indexOf('Need Help'); fs.writeFileSync(dir + '/page.txt', t);
    await page.screenshot({ path: dir + '/page.png' }).catch(() => {});
    fs.writeFileSync(dir + '/requests.txt', got.join('\n'));
    out.push({ name, n: got.length, req: got.map(x => x.split('?')[0].replace(/\/supportapi\/zd\/wondertravel\/api\/v1/, '')).slice(0, 12) });
  }
  return { out, blocked: blocked.length };
}
