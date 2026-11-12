const L=await modId('leads'); const fp=await api('GET','/modules/'+L+'/field-permissions'); log('fp',fp.s,fp.t.slice(0,900));
const me=await api('GET','/iam/me'); log('me',me.s, (me.t.match(/"profile[^,]{0,120}/)||[''])[0]);
