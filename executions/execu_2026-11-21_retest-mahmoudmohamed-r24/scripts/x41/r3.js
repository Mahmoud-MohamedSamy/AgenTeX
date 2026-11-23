const CON='0924eb24-e42a-4eab-8efd-e3428f19e882',D='6edaf8a3-7e99-4213-bd90-451802d63be6',DB='09b9df1d-2345-44c5-9e4e-6778e219fd7e';
const R={};const all=[];let c='';for(let i=0;i<10;i++){const r=await api('GET','/modules/'+CON+'/records?page_size=200'+(c?'&cursor='+c:''));const L=arr(r.j?.data);all.push(...L);c=r.j?.meta?.next_cursor;if(!c)break;}
const v=(x,k)=>{const d=x.data||x.fields||[];if(Array.isArray(d))return d.find(z=>z.field===k)?.value?.value;return x[k];};
R.total=all.length;R.noplan=all.filter(x=>!v(x,'support_plan')).map(x=>({id:x.id,name:v(x,'contract_name'),dept:v(x,'department')===D?'A':v(x,'department')===DB?'B':'other'})).slice(0,8);R.sample=JSON.stringify(all[0]).slice(0,400);
return R;
