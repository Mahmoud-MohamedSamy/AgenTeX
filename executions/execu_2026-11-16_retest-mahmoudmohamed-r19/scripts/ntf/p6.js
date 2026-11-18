const R={};
for(const [k,id] of Object.entries({C4629:'8ae64a31-97f1-4a97-b8e5-605c98929d92',bp4178:'d55bb4d8-e046-483b-89d3-45f89ececc37',B2_4631:'1537c932-2dd2-4a84-8255-e5f113addc56'})){const r=await rec(id);R[k]=Object.fromEntries(Object.entries(r).filter(([a])=>/happi|rating/.test(a)));const h=await api('GET','/desk/tickets/'+id+'/history');R[k].h=h.s+' '+(Ls(h.j?.data).length)+' '+MASK(h.t).slice(0,200);
R[k].feed=(await feedS(id)).filter(x=>/happi|rating|reply/.test(x));}
const x=await api('GET','/desk/happiness/ratings?limit=5');R.ratings=x.s+' '+MASK(x.t).slice(0,600);
return R;
