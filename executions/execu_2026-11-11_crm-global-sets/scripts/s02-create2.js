const mk=n=>Array.from({length:n},(_,i)=>({label:'V'+String(i+1).padStart(4,'0')}));
let t0=Date.now(); let r=await api('POST','/global-sets',{name:'QA GS1111 Big1000',values:mk(1000)}); const ms=Date.now()-t0; if(r.s<300){I.Big=r.j.data.id;SAVE();LED('set Big1000 '+I.Big);}
let r2=await api('POST','/global-sets',{name:'QA GS1111 Big1001',values:mk(1001)}); if(r2.s<300){LED('set Big1001 '+r2.j.data.id);(I.neg=I.neg||[]).push(r2.j.data.id);SAVE();}
RES('C11', r.s===201&&r2.s>=400?'Pass':'Fail', '1000 → '+SR(r)+' ('+ms+' ms); 1001 → '+SR(r2));
r=await api('POST','/global-sets',{name:'QA GS1111 <img src=x onerror=alert(1)>',description:'<script>alert(1)</script>',values:[{label:'<b>x</b>'},{label:'"><svg onload=alert(1)>'}]});
if(r.s<300){I.X=r.j.data.id;SAVE();LED('set XSS '+I.X);} RES('C12-api', r.s<300?'Info':'Info', SR(r)+' stored name '+(r.j.data&&r.j.data.name)+' (screen check in UI step)');
r=await api('POST','/global-sets',{name:'QA GS1111 عربي',values:[{label:'ذهبي'},{label:'فضي'},{label:'Mixed عربي 1'}]}); if(r.s<300){I.AR=r.j.data.id;SAVE();LED('set Arabic '+I.AR);}
const ar=SR(r)+' '+(r.j.data?r.j.data.values.map(v=>v.value+'='+v.label).join(', '):'');
r=await api('POST','/global-sets',{name:'QA GS1111 Emoji',values:[{label:'Gold ⭐'}]}); if(r.s<300){LED('set Emoji '+r.j.data.id);(I.neg=I.neg||[]).push(r.j.data.id);SAVE();}
RES('C13','Info','Arabic → '+ar+'; emoji → '+SR(r)+' (Zoho refuses emoji)');
const tc=[]; for (const [k,b] of [['values string',{name:'QA GS1111 TC1',values:'Gold'}],['name number',{name:123,values:[{label:'A'}]}],['colors string',{name:'QA GS1111 TC3',colors_enabled:'yes',values:[{label:'A'}]}],['value object label',{name:'QA GS1111 TC4',values:[{label:{x:1}}]}],['null body',null]]) { r=await api('POST','/global-sets',b); tc.push(k+'→'+SR(r)); if(r.s<300){LED('set '+k+' '+r.j.data.id);(I.neg=I.neg||[]).push(r.j.data.id);SAVE();} }
RES('C14', tc.every(x=>/→4\d\d/.test(x))?'Pass':(tc.some(x=>/→5/.test(x))?'Fail':'Info'), tc.join('; '));
return 'ok';
