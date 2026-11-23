const f=await api('GET',`/modules/b2398920-2914-4836-be53-81bd960effea/fields?take=500`);
const a=arr(f.j?.data).length?arr(f.j?.data):(f.j?.data?.fields||[]);
return {s:f.s,n:a.length,sample:JSON.stringify(a.find(x=>/industry|type/i.test(JSON.stringify(x).slice(0,300)))||a[0]).slice(0,1500), raw: a.length?undefined:f.t.slice(0,800)};
