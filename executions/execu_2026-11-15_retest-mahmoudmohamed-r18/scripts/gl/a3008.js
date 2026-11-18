const o={};
for (const v of ['*@qa-rt18.example.com','@qa-rt18.example.com','qa-rt18.example.com']) { const r=await api('POST','/desk/channels/spam-contacts',{address:v}); o[v]=r.s+' '+r.t.slice(0,260); }
o.list=(await api('GET','/desk/channels/spam-contacts?limit=200')).t.slice(0,400);
return o;
