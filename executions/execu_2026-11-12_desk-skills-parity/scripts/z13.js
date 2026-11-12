async (page) => { const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 const inputs = await f.$$eval('input[type=text], input:not([type]), textarea', es => es.filter(e=>e.offsetParent).map(e => [e.tagName, e.name, e.id, e.placeholder, e.className.slice(0,40)]));
 return inputs; }
