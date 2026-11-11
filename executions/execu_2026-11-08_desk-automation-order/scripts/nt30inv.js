// NT-30: invite a throwaway Desk Agent to the user's Gmail alias (user OK "NT-30 go ahead", 11 Nov). Delete after.
const r=await api('POST','/iam/users/invite',{email:'mahmoud.mmohamedsamy+nt30@gmail.com',profile_id:'44444444-4444-4444-4444-444444444402',display_name:'QA AO NT30 Throwaway'});
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-30: invited "QA AO NT30 Throwaway" (Gmail +nt30), Desk Agent — delete after the test (resend 11 Nov; old leaked invite cancelled). '+r.s+'\n');
const d=r.j?.data||{};fs.writeFileSync('../nt30.json',JSON.stringify({uid:d.user_id,inv:d.invitation_id}));return {status:r.s,error:r.j?.error?.code,invitation_id:d.invitation_id,user_id:d.user_id,granted_existing_user:d.granted_existing_user};
