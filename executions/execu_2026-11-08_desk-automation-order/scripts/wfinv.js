// A4 I9: invite a throwaway Desk Agent to suspend later (user OK 11 Nov "invite the agent"). Delete after.
const r=await api('POST','/iam/users/invite',{email:'mahmoud.mmohamedsamy+wf@gmail.com',profile_id:'44444444-4444-4444-4444-444444444402',display_name:'QA AO WF Agent'});
const d=r.j?.data||{};fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' A4 I9: invited "QA AO WF Agent" (Gmail +wf), Desk Agent, user '+d.user_id+' inv '+d.invitation_id+' — delete after. '+r.s+'\n');
fs.writeFileSync('../a4/agent.json',JSON.stringify({uid:d.user_id,inv:d.invitation_id}));return {status:r.s,error:r.j?.error?.code,user_id:d.user_id,granted_existing_user:d.granted_existing_user};
