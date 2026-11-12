const G = []; const onG = async r => { if (r.url().includes('/api/v1/') && r.request().method() === 'GET' && !/notifications|presence|me\/|resolved|tab-settings|hub|modules$/.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 200); } catch (e) {} G.push(r.status() + ' ' + r.url().replace(API, '').slice(0, 110) + ' ' + t); } }; page.on('response', onG);
await go('/knowledge-base/gallery', 15000);
page.off('response', onG); out.G = G;
return fin({ out });
