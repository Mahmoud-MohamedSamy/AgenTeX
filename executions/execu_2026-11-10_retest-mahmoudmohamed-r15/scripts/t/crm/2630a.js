const red = s => String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
const out={};
for (const p of ['/mail/connections','/mail/connections/health','/emails/sendability']) { const r = await api('GET',p); out[p]= r.s+' '+red(r.t).slice(0,900); }
return out;
