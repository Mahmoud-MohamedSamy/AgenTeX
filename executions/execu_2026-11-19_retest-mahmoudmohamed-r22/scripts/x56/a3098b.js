const T=JSON.parse(fs.readFileSync(RUN+'/out/3098.json','utf8'));const o={};
const g=await api('GET','/desk/tickets/'+T.a.id);o.getDesk_a=g.s;o.getRecord_a=(await api('GET','/modules/'+TK+'/records/'+T.a.id)).s;
o.editRecord_a=(await api('PATCH','/modules/'+TK+'/records/'+T.a.id,{data:fields({priority:'high'})})).s;o.comment_a=(await api('POST','/desk/tickets/'+T.a.id+'/comments',{body_html:'<p>QA RT22 3098 owner-ticket comment</p>',is_public:false})).s;
o.getDesk_d=(await api('GET','/desk/tickets/'+T.d.id)).s;return o;
