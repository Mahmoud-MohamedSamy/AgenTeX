const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={};
const s=async id=>{const d=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return d?.state+' '+(d?.policy?.name||'-')+' '+JSON.stringify((d?.obligations||[]).map(x=>x.kind+':'+x.state));};
o.C1=await s(X.t.C1);o.C2=await s(X.t.C2);
const id=await mkT('sla','C3 fresh',{},X.DD);for(let i=0;i<6;i++){await sleep(10000);o['C3_'+i]=await s(id);if(!/^none/.test(o['C3_'+i]))break;}
X.t.C3=id;fs.writeFileSync(RUN+'/out/3136.json',JSON.stringify(X,null,1));
const h=(await api('GET','/desk/tickets/'+id+'/history')).j?.data;o.hist=JSON.stringify(h).slice(0,600);return o;
