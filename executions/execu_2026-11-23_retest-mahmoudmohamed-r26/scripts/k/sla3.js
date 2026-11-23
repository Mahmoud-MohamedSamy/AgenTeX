const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={};
const s=async id=>{const d=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return d?.state+' '+(d?.policy?.name||'-')+' '+JSON.stringify((d?.obligations||[]).map(x=>x.kind+':'+x.state+':'+x.remaining_seconds));};
for(const k of ['C1','C3'])o['old_'+k]=await s(X.t[k]);
const id=await mkT('sla','C4 recheck',{owner:OWNER},X.DD);X.t.C4=id;fs.writeFileSync(RUN+'/out/3136.json',JSON.stringify(X,null,1));
for(let i=0;i<6;i++){await sleep(10000);o['C4_'+i]=await s(id);if(!/^none/.test(o['C4_'+i]))break;}return o;
