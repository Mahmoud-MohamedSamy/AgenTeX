const E='b2e00603-6788-4c55-9bfe-b1efab48a4f6', DI='3ec7892a-7016-4598-ba04-9cdeff62237a', RU='1effb0a3-74a1-4551-9ad1-10e55c392be3';
const o={};
for(const p of ['/workflow/executions/'+E,'/workflow/executions/'+E+'/dispatches','/workflow/dispatches/'+DI,'/workflow/executions/dispatches/'+DI,'/workflow/dispatches/'+DI+'/attempts','/workflow/executions/'+E+'/dispatches/'+DI,'/workflow/rules/'+RU+'/executions','/workflow/webhooks/test','/workflow/rules/'+RU+'/test']){const x=await api('GET',p);o[p]=x.s+' '+x.t.slice(0,1200);}
return o;
