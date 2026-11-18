const SRC=fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-08_desk-automation-order/scripts/e1-ev.js','utf8');
const NEW=SRC.match(/const NEW='([^']+)'/)[1];const [lp,d]=NEW.toLowerCase().split('@');const u=lp.replace(/\+.*/,'');
let all=[];for(let p=1;p<=5;p++){const r=await api('GET','/iam/users?page_size=200&page='+p);const a=arr(r.j?.data);all=all.concat(a);if(a.length<200)break;}
const mine=all.filter(a=>{const e=(a.email||'').toLowerCase();return e.split('@')[1]===d&&e.split('@')[0].replace(/\+.*/,'').replace(/\./g,'')===u.replace(/\./g,'');}).map(a=>({name:a.displayName,email:a.email,status:a.status,profiles:a.profileNames,inv:a.invitationStatus}));
return {total:all.length,mine};
