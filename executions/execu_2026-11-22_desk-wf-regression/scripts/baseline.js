const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const out={};
const g=async(k,p)=>{const r=await api('GET',p);out[k]={s:r.s,d:r.j&&r.j.data!==undefined?r.j.data:r.t.slice(0,300)};};
await g('rules','/workflow/rules?moduleId='+T+'&take=200');
await g('rulesInactive','/workflow/rules?moduleId='+T+'&isActive=false&take=200');
await g('actions','/workflow/actions');
await g('fields','/modules/'+T+'/fields');
await g('layouts','/modules/'+T+'/layouts');
await g('departments','/desk/departments');
await g('switches','/desk/assignment/notification-settings');
await g('customActions','/workflow/custom-actions');
await g('connections','/integrations/connections');
await g('happiness','/desk/settings/customer-happiness');
await g('bh','/iam/company/business-hours');
await g('wfsettings','/workflow/settings');
fs.writeFileSync(process.env.OUT,JSON.stringify(out,null,1));
const sum={};for(const[k,v]of Object.entries(out)){const d=v.d;sum[k]=v.s+' '+(Array.isArray(d)?'n='+d.length:(d&&typeof d==='object'?'keys='+Object.keys(d).slice(0,8).join(','):String(d).slice(0,80)))}
return sum;
