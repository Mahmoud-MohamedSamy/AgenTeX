const R={};
for(const [k,id] of Object.entries({C4629:'8ae64a31-97f1-4a97-b8e5-605c98929d92',bp4177:'caf13024-c4e6-45b1-9094-93a4f235dfad',bp4178:'d55bb4d8-e046-483b-89d3-45f89ececc37',B4628:'f2219c2f-0f2b-4c8b-9ff5-0846b858f1d9'})){
const rp=Ls((await api('GET','/desk/tickets/'+id+'/replies')).j?.data);
R[k]={hist:(await histRaw(id)).map(h=>(h.occurred_at||'').slice(11,19)+' '+h.action+(h.field_key?':'+h.field_key:'')+' '+MASK(JSON.stringify(h.summary||{})).slice(0,100)).reverse().filter(x=>!/department|blueprint_entered/.test(x)),replies:rp.map(x=>MASK((x.body_html||'')).slice(0,700)),rkeys:rp[0]?Object.keys(rp[0]):[]};}
return R;
