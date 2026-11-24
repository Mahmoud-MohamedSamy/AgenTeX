const r = await ask('Find the contact with email qa.tia.xss@example.com and tell me its full name exactly.');
const refs = r.final?.refs || [];
fs.writeFileSync(RUN + '/out/k16.json', JSON.stringify(r.final, null, 1));
const t = r.text || '';
return { text: t.slice(0, 300), rawHtmlInText: /<img/i.test(t), escaped: /&lt;img/.test(t), refs: refs.map(x => JSON.stringify(x).slice(0, 200)), cards: JSON.stringify(r.final?.cards || '').slice(0, 400) };
