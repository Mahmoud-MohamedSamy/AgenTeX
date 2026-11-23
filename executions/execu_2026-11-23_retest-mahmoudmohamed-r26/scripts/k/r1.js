const X=JSON.parse(fs.readFileSync(RUN+'/out/3136b.json','utf8'));const o={};
const c=await api('GET','/modules/'+CON+'/records?page_size=5');
const con=arr(c.j)[0];o.contact=con?.id?.slice(0,8);
const id=await mkT('sla','A2 with contact',{owner:OWNER,contact_id:con.id},X.DD);X.t.A2=id;fs.writeFileSync(RUN+'/out/3136b.json',JSON.stringify(X,null,1));
o.recContact=(await rec(id)).contact_id?.slice?.(0,8);
for(let i=0;i<6;i++){await sleep(10000);const d=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;o['A2_'+i]=d?.state+' '+(d?.policy?.name||'-');if(d?.state&&d.state!=='none')break;}
return o;
