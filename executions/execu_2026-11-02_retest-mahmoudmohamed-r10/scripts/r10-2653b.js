const out={}; const D=T.DEALS; const LAY='243becce';
const lays=arr((await api('o','GET',`/modules/${D}/layouts`)).j?.data); const lid=lays[0].id;
const pl=await api('o','GET',`/modules/${D}/pipelines?layout_id=${lid}`); const ps=arr(pl.j?.data); out.pipes=ps.map(p=>({id:p.id,name:p.name,def:p.isDefault??p.is_default,stages:(p.stages||[]).map(s=>s.stageValue).slice(0,6)})); if(!ps.length) out.raw=pl.t.slice(0,400);
const nd=ps.find(p=>!(p.isDefault??p.is_default)); out.nonDefault=nd?.name;
if(nd){ const st=(nd.stages||[])[0]; const sv=st?.stageValue;
  const c=await api('o','POST',`/modules/${D}/records`,{layout_id:lid,data:rec({deal_name:'QA RT r10 2653 deal',pipeline:nd.id,stage:sv})}); out.create=c.s+' '+(c.s>299?c.t.slice(0,300):c.j.data.id);
  if(c.s<300){ ledger(`deal ${c.j.data.id} "QA RT r10 2653 deal"`); const g=(await api('o','GET',`/modules/${D}/records/${c.j.data.id}`)).j?.data; out.stored={pipeline:(g.data||[]).find(f=>f.field==='pipeline')?.value?.value, top:g.pipeline_id||g.pipelineId, stage:(g.data||[]).find(f=>f.field==='stage')?.value?.value};
    const df=ps.find(p=>(p.isDefault??p.is_default)); if(df){ const s2=(df.stages||[])[0]; const m=await api('o','PATCH',`/modules/${D}/records/${c.j.data.id}`,{data:rec({pipeline:df.id,stage:s2.stageValue})}); out.moveToDefault=m.s+' '+(m.s>299?m.t.slice(0,200):''); const back=await api('o','PATCH',`/modules/${D}/records/${c.j.data.id}`,{data:rec({pipeline:nd.id,stage:sv})}); out.moveBack=back.s+' '+(back.s>299?back.t.slice(0,200):'');
      const bad=await api('o','PATCH',`/modules/${D}/records/${c.j.data.id}`,{data:rec({stage:'proposal'})}); out.badStage=bad.s+' '+bad.t.slice(0,200); } } }
return out;
