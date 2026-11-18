eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const P=`/modules/${T}/records`;
const mk=async(lbl,subjVal,extra=[])=>{const r=await api('POST',P,{data:[{field:'subject',value:subjVal},{field:'status',value:{kind:'string',value:'Open'}},{field:'department',value:{value:D,kind:'string'}},...extra]});const id=r.j?.data?.id;if(id)led(`ticket (2967 ${lbl}) ${id}`);let stored;if(id){const g=await getTicket(id);stored=g.subject;}return r.s+' '+(r.s>=300?r.t.slice(0,250):'stored subject='+JSON.stringify(stored));};
o.valueFirst=await mk('valueFirst',{value:'QA RT19 WF 2967 value first',kind:'string'});
o.kindFirst=await mk('kindFirst',{kind:'string',value:'QA RT19 WF 2967 kind first'});
o.valueFirstNumber=await mk('numberVF',{kind:'string',value:'QA RT19 WF 2967 number field'},[]);
o.unknownKind=await mk('unknown',{value:'QA RT19 WF 2967 unknown',kind:'bogus'});
o.noKind=await mk('noKind',{value:'QA RT19 WF 2967 nokind'});
o.extraKey=await mk('extraKey',{value:'QA RT19 WF 2967 extra key',zzz:1,kind:'string'});
o.nested=await mk('nested',{properties:{},kind:'object'});
// update path (PATCH) with value-first
const first=arr((await api('GET',`${P}?take=5&search=${encodeURIComponent('QA RT19 WF 2967 kind first')}`)).j?.data)[0];
o.findForPatch=!!first;
const tid=(await api('POST',P,{data:[{field:'subject',value:{kind:'string',value:'QA RT19 WF 2967 patch target'}},{field:'department',value:{kind:'string',value:D}}]})).j?.data?.id;if(tid)led(`ticket (2967 patch target) ${tid}`);
const pr=await api('PATCH',`${P}/${tid}`,{data:[{field:'description',value:{value:'patched value-first',kind:'string'}}]});o.patchValueFirst=pr.s+' '+(pr.s>=300?pr.t.slice(0,250):JSON.stringify((await getTicket(tid)).description));
// workflow evaluate path with value-first
const e=await api('POST','/workflow/rules/evaluate',{rule:body('2967 eval',{kind:'RecordCreated'},[{type:'AddTicketComment',commentBody:'x',commentPublic:false}]),fieldValues:[{field:'subject',value:{value:'QA RT19 WF 2967 eval x',kind:'string'}}]});o.evaluateValueFirst=e.s+' '+e.t.slice(0,250);
save('2967',o);return o;
