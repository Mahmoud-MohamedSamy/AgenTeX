// SL-51 delete case: invite a throwaway Desk Agent to the user's Gmail alias (user OK "SL-51 => go ahead", 10 Nov).
const r=await api('POST','/iam/users/invite',{email:'mahmoud.mmohamedsamy+sl51@gmail.com',profile_id:'44444444-4444-4444-4444-444444444402',display_name:'QA AO SL51 Throwaway'});
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' SL-51: invited "QA AO SL51 Throwaway" (Gmail +sl51), Desk Agent — delete after the test. '+r.s+'\n');
return r.s+' '+r.t.replace(/mahmoud\.mmohamedsamy\+sl51@gmail\.com/g,'<gmail+sl51>').slice(0,400);
