eval(fs.readFileSync('sla/lib.js','utf8'));const E=CFG.e1;const R={};
for(const k of ['A','B','C']){const id=E[k].id;const g=(await api('GET','/modules/'+T+'/records/'+id)).j?.data;const num=(g?.data||[]).find(x=>x.field==='ticket_number')?.value?.value;const own=(g?.data||[]).find(x=>x.field==='owner')?.value?.value;
const s=await sla(id);const fd=await feed(id);const items=arr(fd?.data||fd);
R[k]={num,owner:own===SAMY?'Samy':own===OWNER?'owner':own,created:g?.created_at,sla:s,feed:items.filter(x=>/sla|escal|notif|mail/i.test(JSON.stringify(x))).map(x=>JSON.stringify(x).slice(0,900))};}
save('e1c',R);return R;
