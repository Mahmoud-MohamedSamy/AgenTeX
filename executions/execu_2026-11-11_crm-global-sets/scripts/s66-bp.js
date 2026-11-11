const o={}; const B='/modules/'+L+'/blueprints/'+I.BP;
let g=await gs(I.BSET); await api('PUT','/global-sets/'+I.BSET,{name:g.name,description:g.description,colors_enabled:false,values:g.values.concat([{label:'New'}]),row_version:g.row_version});
const tries=[]; for(const [m,p,b] of [['PATCH',B,{isActive:true}],['POST',B+'/activate',{}],['PUT',B+'/active',{isActive:true}],['POST',B+'/publish',{}]]){ const r=await api(m,p,b); const a=(await api('GET',B)).j.data.isActive; tries.push(m+' '+p.replace(B,'{bp}')+' '+r.s+' active='+a); if(a) break; }
o.activate=tries; LED('blueprint '+I.BP+' activation attempts: '+tries.join('; '));
const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'BP 1',qa_gs1111_bp:'Open'})); const lid=x.j&&x.j.data&&(x.j.data.id||x.j.data.record.id); I.BPL=lid; SAVE(); LED('record BP 1 '+lid);
await sleep(3000); const s1=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-state'); o.state1=SR(s1)+' '+JSON.stringify(s1.j&&s1.j.data).slice(0,300);
o.replaceActive=SR(await api('POST','/global-sets/'+I.BSET+'/values/replace',{replacements:{Open:'New'}})); await sleep(2000);
o.leadVal=await recVal(L,lid,'qa_gs1111_bp'); const s2=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-state'); o.state2=SR(s2)+' '+JSON.stringify(s2.j&&s2.j.data).slice(0,300);
const b=(await api('GET',B)).j.data; o.bpAfter=JSON.stringify((b.definition||b).states.map(s=>s.id))+' '+JSON.stringify((b.definition||b).transitions.map(t=>t.fromStateId+'>'+t.toStateId));
o.removeDone=SR(await api('POST','/global-sets/'+I.BSET+'/values/remove',{values:['Done']})); const b2=(await api('GET',B)).j.data; o.bpAfterRemove=JSON.stringify((b2.definition||b2).states.map(s=>s.id));
const tr=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-transitions'); o.transitions=SR(tr)+' '+JSON.stringify(tr.j&&tr.j.data).slice(0,300);
fs.writeFileSync(RUN+'/out/bp-2.json',JSON.stringify(o,null,1)); return o;
