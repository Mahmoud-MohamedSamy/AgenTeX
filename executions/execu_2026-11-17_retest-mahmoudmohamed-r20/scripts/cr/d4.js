eval(fs.readFileSync('cr/lib.js','utf8'));const o={};
const b=body('probe',{kind:'RecordCreated'},[{type:'CreateConnectedRecord',targetModuleId:'f7e488b5-0232-42fd-811c-1f24356af653',fieldMappings:{}}]);
const v=await api('POST','/workflow/rules/validate',b);o.validate=v.s+' '+v.t.slice(0,800);
const tf=arr((await api('GET',`/modules/${T}/fields?take=400`)).j?.data);o.ticketCustom=tf.filter(x=>x.isCustomField&&x.status==='active').map(x=>[x.apiName,x.labels?.en,x.datatypeKey,x.required]).slice(0,60);
o.ticketLookups=tf.filter(x=>/lookup|user/.test(x.datatypeKey)).map(x=>[x.apiName,x.labels?.en,x.datatypeKey]);
return o;
