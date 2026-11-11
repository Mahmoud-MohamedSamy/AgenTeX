const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='800057b7-6125-4d18-9fb7-1c295d98e5b7';
const c = await api('GET','/modules/'+L+'/records?page=1&per_page=1&view_id='+V);
const out = { liveCount: c.j&&c.j.meta&&c.j.meta.total_count };
let items=[]; let cur='';
for (let i=0;i<20;i++){ const r = await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):'')); items = items.concat(arr(r.j&&r.j.data)); cur = r.j&&r.j.meta&&r.j.meta.next_cursor; if(!cur) break; }
const qa = items.filter(x => /^QA RT15 2807/.test(x.record_label||'') || (x.deletion_group_id==='cd9bb581-0f7c-4757-b7ea-5c36eef080fc'));
out.binTotal = items.length; out.qa2807 = qa.length; out.sampleKeys = Object.keys(items[0]||{}); out.sample = JSON.stringify(qa[0]||{}).slice(0,400);
const groups = await api('GET','/audit/recycle-bin/groups?app_key=crm'); out.groups = groups.s+' '+groups.t.slice(0,300);
return out;
