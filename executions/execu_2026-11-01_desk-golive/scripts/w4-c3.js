const HOME = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
const CID = 'c857d003-b625-4a8d-b9bd-44500ad30f0a';
const cat = arr(D((await api('GET', '/desk/community/categories')).j)).find(c => c.id === CID);
let r = await api('POST', '/desk/community/categories/' + CID + '/disable', {}); out.dis = r.s + ' ' + r.t.slice(0, 150);
if (r.s >= 400) { r = await api('PATCH', '/desk/community/categories/' + CID, { disabled: true }); out.dis2 = r.s + ' ' + r.t.slice(0, 150); }
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
await p.goto(HOME + 'community', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); out.portalDisabled = /QA GL W4 cat/.test(await p.innerText('body'));
r = await api('POST', '/desk/community/categories/' + CID + '/enable', {}); out.en = r.s; if (r.s >= 400) { r = await api('PATCH', '/desk/community/categories/' + CID, { disabled: false }); out.en2 = r.s; }
out.stateAfter = arr(D((await api('GET', '/desk/community/categories')).j)).find(c => c.id === CID).disabled;
// agent topic
r = await api('POST', '/desk/community/topics', { category_id: CID, title: 'QA GL W4 agent topic', body_html: '<p>QA GL W4 topic posted by the owner as staff.</p>', type: 'question' });
out.topic = r.s + ' ' + r.t.slice(0, 300); const tid = r.j && r.j.data && r.j.data.id; if (tid) CREATED.push({ kind: 'community-topic', id: tid, name: 'QA GL W4 agent topic' });
r = await api('POST', '/desk/community/topics', { category_id: CID, title: '', body_html: '<p>x</p>', type: 'question' }); out.emptyTitle = r.s + ' ' + r.t.slice(0, 200);
if (tid) { r = await api('POST', '/desk/community/topics/' + tid + '/replies', { body_html: '<p>QA GL W4 staff reply.</p>' }); out.reply = r.s + ' ' + r.t.slice(0, 200); }
await p.goto(HOME + 'community', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); out.portalTopic = ((await p.innerText('body')).replace(/\s+/g, ' ').match(/QA GL W4 agent topic.{0,120}/) || ['not shown'])[0];
await p.screenshot({ path: SHOT + '/w4/W4-55-portal-topic.png' });
await ctx.close();
return fin({ out });
