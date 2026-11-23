const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={};
const s=async id=>{const d=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return d?.state+' '+(d?.policy?.name||'-')+' '+JSON.stringify((d?.obligations||[]).map(x=>x.kind+':'+x.state));};
const AO='93949fbd';const ds=arr((await api('GET','/desk/departments?limit=100')).j);const ao=ds.find(d=>d.name==='QA AO Dept A').id,acc=ds.find(d=>d.name==='QA NDC Accounting').id;
const a=await api('POST','/modules/'+TK+'/records',{data:fields({subject:'QA RT26 sla AO probe',description:'QA RT26 SL40d01ql probe',status:'Open',department:ao})});const b=await api('POST','/modules/'+TK+'/records',{data:fields({subject:'QA RT26 sla ACC probe',description:'QA RT26',status:'Open',priority:'high',department:acc})});
const ia=a.j?.data?.id,ib=b.j?.data?.id;made.tickets.push(ia,ib);keep();LED('tickets QA RT26 sla AO probe '+ia+', ACC probe '+ib);
for(let i=0;i<5;i++){await sleep(10000);o['ao'+i]=await s(ia);o['acc'+i]=await s(ib);if(!/^none/.test(o['ao'+i]))break;}
X.t.AO=ia;X.t.ACC=ib;fs.writeFileSync(RUN+'/out/3136.json',JSON.stringify(X,null,1));return o;
