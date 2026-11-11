// Debug D-12a and E-12 step by step.
eval(fs.readFileSync('lib-as.js','utf8'));const R={steps:[]};const S=async(n,fn)=>{try{const v=await fn();R.steps.push(n+' ok '+(typeof v==='string'?v:JSON.stringify(v)).slice(0,160));return v;}catch(e){R.steps.push(n+' FAIL '+e.message.slice(0,80)+' '+String(e.cause||'').slice(0,120));return null;}};
await S('off leftovers',async()=>{const rr=(await api('GET','/desk/assignment-rules?type=direct')).j?.data?.rules||[];let n=0;for(const r of rr.filter(x=>/^QA AO /.test(x.name)&&x.is_active)){await api('PUT','/desk/assignment-rules/'+r.id+'/active',{is_active:false,version:r.version});n++;}return n;});
const k='AOD12z'+U;
const r=await S('create direct rule (switch off)',async()=>{const x=await rule('direct','D12z',[daT(k,ag(A1))]);return x.s+' '+(x.j?.data?.id||x.t.slice(0,100));});
const t=await S('create ticket',async()=>await tk(k+' a'));
await sleep(4000);
await S('owner',async()=>await own(t));
const id=made.rules[made.rules.length-1];
await S('deactivate',async()=>await setA(id,false));
await S('presence',async()=>await presence());
return R;
