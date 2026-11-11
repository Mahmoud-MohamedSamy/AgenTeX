const rows=fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/Credentials/TAVI Desk Credentials.csv','utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l=>l.split(','));
const us=arr((await api('GET','/iam/users?limit=200')).j.data); const out=[];
for (const r of rows){ const em=(r[1]||'').trim().toLowerCase(); const u=us.find(x=>(x.email||'').toLowerCase()===em); out.push(r[0]+' → '+(u?u.profileNames+' status '+(u.status||''):'not in tenant')); }
return out;
