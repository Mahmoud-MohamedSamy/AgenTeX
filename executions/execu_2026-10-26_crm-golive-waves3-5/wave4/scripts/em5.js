const a = await call('DELETE', '/mail/drafts/083f7988-c557-4914-91d5-d341892d20aa'); const b = await call('DELETE', '/mail/drafts/f07b7435-ac61-4453-94ee-ca0b8cec9879');
const g = await call('GET', '/mail/drafts/f07b7435-ac61-4453-94ee-ca0b8cec9879');
return { delScheduled: a.s, delDraft: b.s, readAfter: g.s };
