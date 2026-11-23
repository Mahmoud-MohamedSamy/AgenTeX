const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const M=JSON.parse(fs.readFileSync('../out/2799-made.json','utf8'));
const d=(await api('GET','/modules/'+TK+'/records/'+M.t.CPRIV.id)).j?.data?.data||[];
const me=await api('GET','/iam/me');const me2=me.s===200?me:await api('GET','/users/me');
return {fields:d.filter(x=>/owner|assign|agent/i.test(x.field)).map(x=>[x.field,JSON.stringify(x.value).slice(0,120)]),me:me2.s,meid:me2.j?.data?.id||me2.j?.data?.user?.id,mename:me2.j?.data?.name||me2.j?.data?.user?.name||me2.j?.data?.display_name};
