const o={};
const c=await api('POST','/desk/kb/categories',{name:'QA RT18 KB',description:null}); o.cat=c.s+' '+c.t.slice(0,300); const cid=c.j&&c.j.data&&(c.j.data.id||(c.j.data.category&&c.j.data.category.id)); o.cid=cid; if(!cid) return o;
fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} KB category "QA RT18 KB" ${cid} (Desk)\n`);
const a=await api('POST','/desk/kb/articles',{title:'QA RT18 KB article',body_html:'<p>QA RT18 article body.</p>',summary:null,category_id:cid,visibility:'public'}); o.art=a.s+' '+a.t.slice(0,300); const aid=a.j&&a.j.data&&a.j.data.id; o.aid=aid;
if(aid){ fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} KB article "QA RT18 KB article" ${aid} (Desk)\n`); o.pub=(await api('POST','/desk/kb/articles/'+aid+'/publish',{})).t.slice(0,200); }
return o;
