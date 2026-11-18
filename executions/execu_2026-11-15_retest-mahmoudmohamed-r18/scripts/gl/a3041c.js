const TM='88e8ea44-1658-4df3-9930-d0902b91073d', A='ce1a9907-f037-4465-9148-b17c2e9fc33d', S='6043080b-a704-405f-9f60-ed6762b9b7aa'; const o={};
const run=async()=>{const r=await api('POST','/workflow/custom-actions/'+A+'/run',{runtimeInputs:{ref:'QARTREF',note:'QA RT18 auth check'},context:{app:'desk',moduleId:TM,recordId:'03472fb1-71c7-4ea6-8af8-75b63c8aa601',label:'QA RT18 3025 T1'}}); const st=(r.j&&r.j.data&&r.j.data.steps||[])[0]||{}; return r.s+' outcome='+st.outcome+' headers='+JSON.stringify(st.requestHeaders)+' url='+st.url;};
for (const [k,body] of [['bearer',{authKind:'bearer',config:{},secret:'qa-rt18-dummy-bearer'}],['basic',{authKind:'basic',config:{username:'qa-rt18'},secret:'qa-rt18-dummy-pass'}],['none',{authKind:'none',config:{}}]]) {
  const c=await api('PUT','/workflow/custom-actions/sources/'+S+'/credential',body); o[k+'_cred']=c.s+' '+c.t.slice(0,200);
  if(c.s<300) o[k+'_run']=await run();
}
return o;
