const TM='88e8ea44-1658-4df3-9930-d0902b91073d', A='ce1a9907-f037-4465-9148-b17c2e9fc33d'; const o={};
o.act=(await api('GET','/workflow/custom-actions/'+A)).t.slice(0,3000);
const r=await api('POST','/workflow/custom-actions/'+A+'/run',{runtimeInputs:{ref:'QARTREF',note:'QA RT18 auth check'},context:{app:'desk',moduleId:TM,recordId:'03472fb1-71c7-4ea6-8af8-75b63c8aa601',label:'QA RT18 3025 T1'}}); o.run=r.s+' '+r.t.slice(0,2500);
for (const p of ['/workflow/custom-actions/'+A+'/runs','/workflow/custom-actions/runs?actionId='+A,'/workflow/custom-actions/'+A+'/logs','/workflow/custom-actions/'+A+'/preview']) { const x=await api('GET',p); o[p]=x.s+' '+x.t.slice(0,1500); }
return o;
