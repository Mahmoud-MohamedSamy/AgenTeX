eval(require('fs').readFileSync('lib.js','utf8'));
const o={};o.seq=(await putRule(IDS.RR_SEQ,{execute_on:['update']})).s;
const pr=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;o.pr=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr,assign_to_offline_agents:false})).s;
const L=(await api('GET','/desk/assignment-rules?type=direct&department_id='+IDS.DA)).j.data;const R=arr(L&&(L.rules||L)).filter(r=>/D14/.test(r.name));
o.d14=[];for(const r of R){o.d14.push(r.name+' '+r.id.slice(0,8)+' '+(await setActive(r.id,false)).s);IDS.DA_D14=r.id;}saveIds();
LED('D-14 8 Nov: restore after failed run — RR_SEQ exec update only, Dept A offline off, D14 direct rule inactive');
o.check={seq:(await getRule(IDS.RR_SEQ)).execute_on,off:(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data.assign_to_offline_agents};
return o;
