const CC=await crmMod('contacts');const CA=await crmMod('accounts');const DA='784400e1-4a2a-42c2-b4f3-7ca56e79828a';const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const DESK={contacts:['9f84ca2d-3086-417f-9c65-3aeb473daa73','705d3699-8056-42a7-9098-92adf1aba932','0b017f5c-a76c-4855-836b-a1cd95b8a27a','ce2ee902-0ba9-41d4-9a2c-1334025171e4','a9bfaf0e-3c85-45e4-872e-bf0bfd5c6197','aa5e7a60-6bdc-4b1d-97d9-a77b3361d2ae','8e73939d-ae72-4d9b-97d7-eca6c4047a80','8621d252-cef7-44c7-ad8c-a9a3a4e3a2af'],accounts:['30bdf867-41d4-4d86-a901-9b7dd1cbc837','73365e7d-6d54-4563-bab4-d654dcb095da'],tickets:['12c99d24-907a-418f-a498-6977a8768ad3']};
const CRM={contacts:['320cbf4d-5da2-40c9-8cd7-2f221aa815db','30f3c97d-3fbd-4365-8730-649ec711ee84','640f903a-76b1-4eb0-89a7-cff626bf5012','dcf942b1-72a8-4ac9-95f3-a2de2f665fde','9d28ab44-eac3-46f3-9126-33df1b704e66','5f20fd89-30b3-4164-a1c2-330ce1c7d181','2743418f-373d-4ffd-8ff9-64a5f2425c52','60874f09-20d4-41be-89a4-1c4eb7769cf9'],accounts:['93333eb7-e918-4332-bb83-4fed0bafdf37','1478261b-213f-4839-930b-fd2f47b02080']};
const dm={contacts:CT,accounts:DA,tickets:TK},cm={contacts:CC,accounts:CA};
out.prefsBefore=await prefs();
// delete live records
for(const [k,ids] of Object.entries(DESK))for(const id of ids){const g=await api('GET',`/modules/${dm[k]}/records/${id}`);if(g.s===200){const d=await api('DELETE',`/modules/${dm[k]}/records/${id}`);log(`CLEANUP DELETE Desk ${k} ${id} → ${d.s}`);}}
for(const [k,ids] of Object.entries(CRM))for(const id of ids){const g=await crm('GET',`/modules/${cm[k]}/records/${id}`);if(g.s===200){const d=await crm('DELETE',`/modules/${cm[k]}/records/${id}`);log(`CLEANUP DELETE CRM ${k} ${id} → ${d.s}`);}}
await sleep(8000);
const allDesk=Object.values(DESK).flat(),allCrm=Object.values(CRM).flat();
const db=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>allDesk.includes(i.record_id));
if(db.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:db.map(i=>i.id)});log(`PURGE Desk bin ${db.map(i=>i.id).join(',')} → ${p.s}`);out.purgeDesk=db.length+' → '+p.s;}
const cb=carr((await crm('GET','/audit/recycle-bin/items')).j).filter(i=>allCrm.includes(i.record_id));
if(cb.length){const p=await crm('POST','/audit/recycle-bin/delete',{ids:cb.map(i=>i.id)});log(`PURGE CRM bin ${cb.map(i=>i.id).join(',')} → ${p.s}`);out.purgeCrm=cb.length+' → '+p.s;}
await sleep(4000);
out.verify={desk:{},crm:{}};for(const [k,ids] of Object.entries(DESK))for(const id of ids)out.verify.desk[id.slice(0,8)]=(await api('GET',`/modules/${dm[k]}/records/${id}`)).s;
for(const [k,ids] of Object.entries(CRM))for(const id of ids)out.verify.crm[id.slice(0,8)]=(await crm('GET',`/modules/${cm[k]}/records/${id}`)).s;
out.deskBinLeft=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>allDesk.includes(i.record_id)||/QA PREF/.test(JSON.stringify(i))).length;
out.crmBinLeft=carr((await crm('GET','/audit/recycle-bin/items')).j).filter(i=>allCrm.includes(i.record_id)||/QA PREF/.test(JSON.stringify(i))).length;
out.prefsAfter=await prefs();
log(`VERIFY cleanup: desk ${JSON.stringify(out.verify.desk)} crm ${JSON.stringify(out.verify.crm)}; desk bin left ${out.deskBinLeft}; crm bin left ${out.crmBinLeft}; prefs ${JSON.stringify(out.prefsAfter)}`);
return out;
