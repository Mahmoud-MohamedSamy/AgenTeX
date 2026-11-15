// Step 7b control (owner creates, owner A2 preset; no E1 key so no chain rules/blueprint). Close is done by A2 in e1-7bc.js.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));const F='../e1.json';const M=JSON.parse(fs.readFileSync(F,'utf8'));
const NEW='mahmoud.mmohamedsamy+qae1@gmail.com';
const r=await api('POST','/modules/'+T+'/records',{data:fields({subject:'QA AO E1 control close '+U,description:'QA E2E-1 step 7b control: closed with the normal Close action',department:DA,status:'Open',priority:'medium',owner:A2,contact_id:M.contact,email:NEW,channel:'web'})});
const id=r.j?.data?.id;if(!id)return {err:E(r).slice(0,300)};pbm.tickets.push(id);pbSave();M.ctl=id;fs.writeFileSync(F,JSON.stringify(M,null,1));await sleep(4000);const o=await rec(id);
const bs=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];
return {num:o.ticket_number,owner:nm(o.owner),contact:o.contact_id===M.contact,email:String(o.email).replace(/mahmoud\.mmohamedsamy/g,'G'),blueprint:bs?bs.activeStates:null};
