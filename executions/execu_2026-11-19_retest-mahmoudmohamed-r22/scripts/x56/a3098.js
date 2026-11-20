const T=JSON.parse(fs.readFileSync(RUN+'/out/3098.json','utf8'));const o={};
for(const k of ['a','b','c','d']){o['get_'+k+'_'+T[k].n]=(await api('GET','/desk/tickets/'+T[k].id)).s;}
o.edit_a=(await api('PATCH','/modules/'+TK+'/records/'+T.a.id,{data:fields({priority:'medium'})})).s;
o.comment_d=(await api('POST','/desk/tickets/'+T.d.id+'/comments',{body_html:'<p>QA RT22 3098 comment</p>',is_public:false})).s;
const l=await api('GET','/desk/tickets?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158&limit=200&search=QA%20RT22%20BS%203098');const ns=(l.j?.data?.items||l.j?.data||[]).map(x=>x.ticket_number).filter(Boolean);o.list=l.s+' '+JSON.stringify(ns);
return o;
