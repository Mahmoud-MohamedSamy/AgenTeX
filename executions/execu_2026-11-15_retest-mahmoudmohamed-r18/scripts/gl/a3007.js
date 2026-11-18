const o={}; const r=await api('POST','/desk/community/topics',{category_id:'a74c1014-7d99-4845-8409-2c7973cafdb6',title:'QA RT18 3007 agent question',body_html:'<p>QA RT18 question posted by an agent from Desk.</p>',type:'question'});
o.create=r.s+' '+r.t.slice(0,400); const id=r.j&&r.j.data&&r.j.data.id; if(!id) return o;
fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} community topic "QA RT18 3007 agent question" (Marketing, question, by owner) ${id} (Desk)\n`);
await sleep(8000); const g=await api('GET','/desk/community/topics/'+id); o.ticket=g.j.data.ticket; o.can=g.j.data.can; o.author=JSON.stringify(g.j.data.author).slice(0,200);
return o;
