const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430',EUR='dd6a0be9-be64-457e-b256-688877616efb';const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: '+m+'\n');
const E=r=>r.s+' '+(r.s>=300?String(r.j?.error?.message||r.t).slice(0,200):'');const cur=async()=>(await api('GET','/currencies')).j?.data;
const C=JSON.parse(fs.readFileSync('../out/crm-c1.json','utf8'));
o.delDeal=E(await api('DELETE','/modules/'+D+'/records/'+C.did));LED('deal '+C.did+' deleted (Recycle Bin)');
// purge from recycle bin so the currency is no longer used
const rb=arr((await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200')).j?.data?.items||(await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200')).j?.data);const it=rb.find(x=>(x.record_label||'').includes('3106 Deal EUR'));if(it){o.purge=E(await api('POST','/audit/recycle-bin/delete',{ids:[it.id]}));}
o.delEUR=E(await api('DELETE','/currencies/'+EUR));LED('currency EUR deleted');const c0=await cur();o.currencies=c0.currencies.length;
const prof=(await api('GET','/iam/tenant/company-profile')).j?.data;
try{o.putAED=E(await api('PUT','/iam/tenant/company-profile',{...prof,currency:'AED'}));LED('company currency EGP → AED (3101) — revert');o.homeAfterAED=(await cur()).home_currency;o.profileAfter=(await api('GET','/iam/tenant/company-profile')).j?.data?.currency;}
finally{const p2=(await api('GET','/iam/tenant/company-profile')).j?.data;o.revert=E(await api('PUT','/iam/tenant/company-profile',{...p2,currency:'EGP'}));o.homeFinal=(await cur()).home_currency;LED('company currency reverted to EGP ('+o.homeFinal+')');}
return o;
