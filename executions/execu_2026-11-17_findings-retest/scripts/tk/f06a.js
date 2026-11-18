const CON2='0924eb24-e42a-4eab-8efd-e3428f19e882',DA='6edaf8a3-7e99-4213-bd90-451802d63be6',DB='09b9df1d-2345-44c5-9e4e-6778e219fd7e';
const planA='68789c8d-569f-44d7-8683-de4991d2c717',planB='6863c25d-e7e6-4062-ba45-27003d13854b',acc='217f16bf-3be7-4a1d-9fdb-12e372f7ff34';
for(const p of [planA,planB]){const r=await api('GET','/desk/sla/plans/'+p);log('plan',r.s,JSON.stringify(r.j?.data||r.t).slice(0,300));}
const a=await api('GET','/modules/'+'d'+'/records/'+acc);
const ac=await api('GET','/desk/sla/contracts/'+'562e9bee-fdac-4b80-8d76-821f963858b6'+'/coverage');log('cov ex',ac.s,JSON.stringify(ac.j?.data).slice(0,300));
const L=await api('GET','/modules/'+CON2+'/records?limit=5&q='+encodeURIComponent('QA RT20'));log('contracts list',L.s,arr(L.j?.data).length);
