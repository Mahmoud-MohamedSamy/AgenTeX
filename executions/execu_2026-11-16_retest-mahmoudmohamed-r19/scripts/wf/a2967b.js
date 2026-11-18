eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const P=`/modules/${T}/records`;
const r1=await api('POST',P,{data:[{field:'subject',value:{value:'QA RT19 WF 2967 nokind again'}},{field:'department',value:{kind:'string',value:D}}]});o.noKindAgain=r1.s+' '+r1.t.slice(0,160);
const r0=await api('POST',P,{data:[{field:'subject',value:{kind:'string',value:'QA RT19 WF 2967 patch target'}},{field:'status',value:{kind:'string',value:'Open'}},{field:'department',value:{kind:'string',value:D}}]});const tid=r0.j?.data?.id;o.create=r0.s;if(tid)led(`ticket (2967 patch target 2) ${tid}`);
for(const m of ['PATCH','PUT']){const pr=await api(m,`${P}/${tid}`,{data:[{field:'description',value:{value:'patched value-first '+m,kind:'string'}}]});o[m]=pr.s+' '+(pr.s>=300?pr.t.slice(0,200):JSON.stringify((await getTicket(tid)).description));}
const nums=await api('POST',P,{data:[{field:'subject',value:{value:'QA RT19 WF 2967 kinds',kind:'string'}},{field:'status',value:{value:'Open',kind:'string'}},{field:'department',value:{value:D,kind:'string'}},{field:'priority',value:{value:'High',kind:'string'}}]});o.allValueFirst=nums.s+' '+(nums.s>=300?nums.t.slice(0,200):'');if(nums.j?.data?.id){led(`ticket (2967 kinds) ${nums.j.data.id}`);const g=await getTicket(nums.j.data.id);o.allValueFirstStored=[g.subject,g.status,g.priority,g.department===D];}
return o;
