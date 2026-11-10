const out={};
// 1 approval process
if(ids.proc&&!ids.procDeleted){const r=await api('DELETE',`/workflow/approval-processes/${ids.proc}`);out.proc=r.s+' '+r.t.slice(0,150);if(r.s<300){ids.procDeleted=true;save();log(`DELETED approval process ${ids.proc} (${r.s})`);}}
// 2 leads
const LK=['LA','LB','LC','LO','LD','LE','LF','AP1','AP2'];out.del={};
for(const k of LK){if(!ids[k]||ids['del'+k])continue;const r=await api('DELETE',`/modules/${LEADS}/records/${ids[k]}`);out.del[k]=r.s;if(r.s<300){ids['del'+k]=true;save();log(`DELETED lead ${k} ${ids[k]} (${r.s})`);}else out.del[k]+=' '+r.t.slice(0,150);}
await sleep(3000);
const recIds=LK.map(k=>ids[k]).filter(Boolean);
const bin=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>recIds.includes(i.record_id));out.binFound=bin.length;
if(bin.length){const r=await api('POST','/audit/recycle-bin/delete',{ids:bin.map(i=>i.id)});out.purge=r.s+' '+r.t.slice(0,150);if(r.s<300)log(`PURGED ${bin.length} recycle-bin items by id (${bin.map(i=>i.id.slice(0,8)).join(',')})`);}
// 3 throwaway users: reset C manager, cancel invitations
if(ids.mgrC&&!ids.mgrCReset){const r=await api('PATCH',`/iam/users/${ids.userC}/reporting-manager`,{reporting_manager_id:null});if(r.s<300){ids.mgrCReset=true;save();log(`RESET reporting manager of QA SS C → none (${r.s})`);}}
out.cancel={};for(const k of ['A','B','C','D','E','F']){const inv=ids['inv'+k];if(!inv||ids['cancel'+k])continue;const r=await api('POST',`/iam/users/invitations/${inv}/cancel`,{});out.cancel[k]=r.s+' '+r.t.slice(0,120);if(r.s<300){ids['cancel'+k]=true;save();log(`CANCELLED invitation QA SS ${k} ${inv} (${r.s})`);}}
return out;
