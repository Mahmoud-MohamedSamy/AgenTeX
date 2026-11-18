const o={}; const cid='6955e0a8-8f55-48b1-a5a1-3b08ab53e622';
const a=await api('POST','/desk/kb/articles',{title:'QA RT18 KB article',body_html:'<p>QA RT18 article body.</p>',summary:null,category_id:cid,visibility:'agents_only'}); o.art=a.s+' '+a.t.slice(0,200); const aid=a.j&&a.j.data&&a.j.data.id; o.aid=aid;
if(aid){ fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} KB article "QA RT18 KB article" (agents only) ${aid} (Desk)\n`); o.pub=(await api('POST','/desk/kb/articles/'+aid+'/publish',{})).t.slice(0,200); }
return o;
