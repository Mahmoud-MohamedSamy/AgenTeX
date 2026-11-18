eval(fs.readFileSync('wf/lib.js','utf8'));
const LOCK='../locks/happiness.lock';if(fs.existsSync(LOCK))return {err:'happiness.lock exists'};
fs.writeFileSync(LOCK,'WF lane NDC-2966 '+new Date().toISOString());
const o={};const ids=JSON.parse(fs.readFileSync(OUTD+'2966-ids.json'));const CT='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const strip=x=>{const y={...x};for(const k of Object.keys(y))if(/_max$|_min$|^option_icons$|^public_page_configured$|^updated_/.test(k))delete y[k];return y;};
const hs=(await api('GET','/desk/happiness/settings')).j.data;fs.writeFileSync(OUTD+'2966-happiness-orig.json',JSON.stringify(hs,null,1));
try{
 if(hs.is_enabled){o.err='already on';return o;}
 const p=await api('PUT','/desk/happiness/settings',strip({...hs,is_enabled:true,department_scope_enabled:true,department_ids:[CFG.DB]}));o.on=p.s+' '+(p.s>=300?p.t.slice(0,300):'');led(`Customer Happiness turned ON scoped to QA RT19 WF Dept B only for NDC-2966 (${p.s}); original wf/out/2966-happiness-orig.json`);
 if(p.s<300){await sleep(3000);const t=await mkTicket('2966',{contact_id:CT},'ratings on but dept not scoped');await sleep(20000);
  o.ex=(await execsRaw(t.id)).filter(e=>e.ruleId===ids.rule).map(e=>({out:e.outcome,d:e.dispatches.map(d=>[d.actionType,d.status,d.lastError])}));o.t=t.id;}
}finally{
 const cur=(await api('GET','/desk/happiness/settings')).j.data;const back=strip(hs);for(const q of ['row_version','version'])if(q in cur)back[q]=cur[q];
 const b=await api('PUT','/desk/happiness/settings',back);o.restore=b.s+' '+(b.s>=300?b.t.slice(0,300):'');
 const n=(await api('GET','/desk/happiness/settings')).j.data;o.diff=Object.keys(hs).filter(q=>!['updated_at','row_version','version','updated_by'].includes(q)&&JSON.stringify(hs[q])!==JSON.stringify(n[q]));
 led(`Customer Happiness restored (${b.s}, diff ${JSON.stringify(o.diff)})`);
 if(b.s<300&&o.diff.length===0)fs.unlinkSync(LOCK);
}
o.deact=await deact(ids.rule);
save('2966b',o);return o;
