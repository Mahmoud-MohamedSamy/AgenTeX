const UID='a90969a4-5cdb-46fd-a947-07a3c39813b8';const R={};
const l=await api('GET','/iam/users?limit=200');const L=l.j?.data?.items||l.j?.data?.data||l.j?.data||[];const x=L.find(u=>(u.id||u.user_id)===UID);
R.found=!!x;if(x){R.keys=Object.keys(x);R.status=x.status||x.invitation_status;R.inv=Object.fromEntries(Object.entries(x).filter(([k])=>/invit|pending|expire/i.test(k)).map(([k,v])=>[k,typeof v==='object'?JSON.stringify(v).replace(/"[a-z_]*token[a-z_]*":"[^"]*"/g,'"token":"<m>"').slice(0,200):v]));}
R.listStatus=l.s+' count '+(Array.isArray(L)?L.length:'?');return R;
