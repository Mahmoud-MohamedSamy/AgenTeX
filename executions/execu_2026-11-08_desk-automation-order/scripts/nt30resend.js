const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const r=await api('POST','/iam/users/invitations/'+n.inv+'/resend',{});
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-30: invitation '+n.inv+' resent '+r.s+'\n');
return {status:r.s,error:r.j?.error?.code,message:r.j?.error?.message,at:new Date().toISOString().slice(11,19)+' UTC'};
