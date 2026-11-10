const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4';const o={};
const g=async p=>{const r=await api('GET',p);return {s:r.s,n:arr(r.j).length,keys:r.j&&!Array.isArray(r.j)?Object.keys(r.j).slice(0,12):null,first:arr(r.j)[0]?JSON.stringify(arr(r.j)[0]).slice(0,400):r.t.slice(0,200)};};
for(const p of ['/desk/data/imports','/desk/data/imports?module=contacts','/desk/data/imports/active','/modules/'+CT+'/imports','/data/imports','/desk/data/exports','/desk/data/bulk-actions','/desk/data/bulk-action-logs','/audit/bulk-actions','/desk/bulk-actions','/audit/events?pageSize=5'])o[p]=await g(p);
return o;
