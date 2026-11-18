eval(fs.readFileSync('wf/lib.js','utf8'));
const R={};const CT={kind:'RecordCreated'};
const WH='https://qa-rt19.invalid/hook';
const wh=h=>[{type:'Webhook',method:'POST',url:WH,bodyTemplate:'{"t":"{{ticket.subject}}"}',headers:h,timeoutSeconds:5}];
const H={crlf:{'X-QA':'a\r\nInjected: 1'},lf:{'X-QA':'a\nInjected: 1'},cr:{'X-QA':'a\rInjected: 1'},tab:{'X-QA':'a\tb'},nameNl:{'X-QA\r\nInjected':'1'},host:{Host:'evil.example'},hostLower:{host:'evil.example'},contentLength:{'Content-Length':'5'},transferEnc:{'Transfer-Encoding':'chunked'},connection:{Connection:'close'},nonAscii:{'X-QA':'café'},nul:{'X-QA':'a\u0000b'}};
R.save={};for(const [k,h] of Object.entries(H)){const r=await mkRule('2962 '+k,CT,wh(h));R.save[k]=r.res+(r.id?' id '+r.id:'');}
const ord=await mkRule('2962 ordinary',CT,wh({'X-QA-RT19':'ordinary-1','X-QA-Second':'two'}),{isActive:true});R.ordinary=ord.res+' '+ord.id;
fs.writeFileSync('wf/out/2962-ids.json',JSON.stringify({ord:ord.id}));
const g=(await api('GET','/workflow/rules/'+ord.id)).j?.data;R.storedHeaders=g?.actions?.[0]?.headers;
// edit paths on the saved rule
const b={...g};b.actions=g.actions.map(a=>({...a,headers:{'X-QA':'a\r\nInjected: 1'}}));
R.putCrlf=short(await api('PUT','/workflow/rules/'+ord.id,b));
R.patchCrlf=short(await api('PATCH','/workflow/rules/'+ord.id,{actions:b.actions}));
const t=await mkTicket('2962 ordinary',{},'ticket');R.ticket=t;
await sleep(25000);
const ex=await execsRaw(t.id);R.exec=ex;
save('2962',R);return R;
