const o={}; const r = await api('POST','/desk/community/topics',{category_id:'3505c6d7-f23f-4bad-8a68-00277fe78257',title:'QA RT19 HC 3007 agent question',body_html:'<p>QA RT19 HC question posted by an agent from Desk.</p>',type:'question'});
o.create=E(r); const id=r.j?.data?.id; o.id=id; if(!id) return o; made.other.push('topic '+id); keep(); LED('community topic created '+id+' "QA RT19 HC 3007 agent question" (owner, question, cat 3505c6d7)');
await sleep(10000); const g=(await api('GET','/desk/community/topics/'+id)).j.data; o.ticket=g.ticket; o.can=g.can; o.status=g.status;
const old=(await api('GET','/desk/community/topics/947924a8-8ccb-4aa4-bcde-e2be2f489866')).j.data; o.oldCan=old.can.convert; 
return o;
