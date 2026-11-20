const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430',EUR='dd6a0be9-be64-457e-b256-688877616efb';const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: '+m+'\n');
const E=r=>r.s+' '+(r.s>=300?String(r.j?.error?.message||r.t).slice(0,240)+' '+JSON.stringify(r.j?.error?.details||'').slice(0,200):'');
const cur=async()=>(await api('GET','/currencies')).j?.data;
// 3108 delete a currency used by a deal
o.deleteUsedEUR=E(await api('DELETE','/currencies/'+EUR));o.eurStill=!!(await cur()).currencies.find(c=>c.code==='EUR');
o.deactivateUsedEUR=E(await api('PUT','/currencies/'+EUR,{code:'EUR',symbol:'€',exchange_rate:50,is_active:false}));o.eurActive=(await cur()).currencies.find(c=>c.code==='EUR')?.is_active;
if(o.eurActive===false){o.reactivate=E(await api('PUT','/currencies/'+EUR,{code:'EUR',symbol:'€',exchange_rate:50,is_active:true}));}
// 3101 change home currency while EUR exists
const prof=(await api('GET','/iam/tenant/company-profile')).j?.data;o.homeBefore=(await cur()).home_currency;
const u=await api('PUT','/iam/tenant/company-profile',{...prof,currency:'AED'});o.putAED=E(u);o.profileCurrency=(await api('GET','/iam/tenant/company-profile')).j?.data?.currency;o.homeAfter=(await cur()).home_currency;
if(o.profileCurrency!=='EGP'){LED('company currency changed to '+o.profileCurrency+' (3101) — revert to EGP');}
return o;
