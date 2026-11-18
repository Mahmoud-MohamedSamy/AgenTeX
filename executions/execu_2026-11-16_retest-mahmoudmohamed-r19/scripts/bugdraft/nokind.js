const T='88e8ea44-1658-4df3-9930-d0902b91073d', P=`/modules/${T}/records`;
const dl=await api('GET','/desk/departments?take=100');const D=(arr(dl.j?.data).find(d=>/QA RT19 WF Dept$/.test(d.name))||{}).id;
const o={dept:!!D};
const r1=await api('POST',P,{data:[{field:'subject',value:{value:'QA RT19 BUG nokind subject'}},{field:'department',value:{kind:'string',value:D}}]});
o.noKindSubject=[r1.s,r1.t.slice(0,300)];
const r2=await api('POST',P,{data:[{field:'subject',value:{kind:'string',value:'QA RT19 BUG nokind priority'}},{field:'department',value:{kind:'string',value:D}},{field:'priority',value:{value:'High'}}]});
o.noKindPriority=[r2.s,r2.t.slice(0,300)];
const r3=await api('POST',P,{data:[{field:'subject',value:{kind:'bogus',value:'QA RT19 BUG unknown kind'}},{field:'department',value:{kind:'string',value:D}}]});
o.unknownKind=[r3.s,r3.t.slice(0,300)];
for(const r of [r1,r2,r3]){const id=r.j?.data?.id;if(id){o.created=(o.created||[]).concat(id);fs.appendFileSync('../ledger.md',`- r19 bug draft: ticket record ${id} (QA RT19 BUG …)\n`);}}
return o;
