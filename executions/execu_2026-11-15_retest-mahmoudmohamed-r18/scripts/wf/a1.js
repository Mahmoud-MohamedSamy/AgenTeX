// API validation: 2962 (headers), 2953 (FU system fields), 2998 (date trigger), 2999 (owner target). Saved rules stay inactive.
const R={};const CT={kind:'RecordCreated'};
const WH='https://example.invalid/qa-rt18';   // never called: rules stay inactive
const wh=h=>[{type:'Webhook',method:'POST',url:WH,bodyTemplate:'{}',headers:h,timeoutSeconds:5}];
const H={crlf:{'X-QA':'a\r\nInjected: 1'},lf:{'X-QA':'a\nInjected: 1'},nameNl:{'X-QA\r\nInjected':'1'},host:{Host:'evil.example'},contentLength:{'Content-Length':'5'},transferEnc:{'Transfer-Encoding':'chunked'},connection:{Connection:'close'},nonAscii:{'X-QA':'café'},ordinary:{'X-QA-Ordinary':'rt18'}};
R['2962']={};for(const [k,h] of Object.entries(H)){const r=await mkRule('2962'+k,CT,wh(h));R['2962'][k]=r.res+(r.id?' id '+r.id:'');}
const ordId=(R['2962'].ordinary.match(/id (\S+)/)||[])[1];
if(ordId){const g=(await api('GET','/workflow/rules/'+ordId)).j?.data;R['2962'].ordinaryStoredHeaders=g?.actions?.[0]?.headers;}
// edit path: PUT an existing saved rule with an injected header
if(ordId){const g=(await api('GET','/workflow/rules/'+ordId)).j?.data;const b={...g};b.actions=g.actions.map(a=>({...a,headers:{'X-QA':'a\r\nInjected: 1'}}));const p=await api('PUT','/workflow/rules/'+ordId,b);R['2962'].putCrlf=short(p);}
const FU=(f,v)=>[{type:'FieldUpdate',fieldUpdates:{[f]:S(v)}}];
R['2953']={};for(const f of ['created_by','modified_by','created_at','modified_at','ticket_number','subject']){const r=await mkRule('2953'+f,CT,FU(f,f.includes('_at')?'2026-01-01T00:00:00Z':f.includes('_by')?OWNER:f==='ticket_number'?'1':'QA RT18 subject'));R['2953'][f]=r.res+(r.id?' id '+r.id:'');}
const cm=[{type:'AddTicketComment',commentBody:'QA RT18',commentPublic:false}];
R['2998']={};for(const f of ['subject','priority','due_date','nope_field']){const r=await mkRule('2998'+f,{kind:'DateFieldRelative',dateFieldName:f,offsetSeconds:-3600,offsetMode:'wall_clock'},cm);R['2998'][f]=r.res+(r.id?' id '+r.id:'');}
const teams=arr((await api('GET','/desk/teams')).j?.data);const TEAM=teams[0]?.id;R.team=TEAM&&[TEAM,teams[0].name];
const ow=(k,v)=>[{type:'OwnerAssignment',ownerTargetKind:k,ownerValue:v}];
R['2999']={};for(const [n,k,v] of [['rrX','RoleRoundRobin','x'],['rrUuid','RoleRoundRobin','11111111-2222-3333-4444-555555555555'],['userX','SpecificUser','x'],['userUuid','SpecificUser','11111111-2222-3333-4444-555555555555'],['userReal','SpecificUser',OWNER],['team','Team',TEAM||'none']]){const r=await mkRule('2999'+n,CT,ow(k,v));R['2999'][n]=r.res+(r.id?' id '+r.id:'');}
save('a1',R);return R;
