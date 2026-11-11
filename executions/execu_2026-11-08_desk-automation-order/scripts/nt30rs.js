// NT-30: cancel the first invite (token was printed) if still pending, resend the current one (user 11 Nov: "resend invitation again"). Prints ids/status only.
const OLD='866b9267-060c-4c48-969a-fcf3a414e711',UID='a90969a4-5cdb-46fd-a947-07a3c39813b8';const R={};
const pick=x=>({id:x.id||x.invitation_id,status:x.status,user:x.user_id,created:(x.created_at||'').slice(0,19),expires:(x.expires_at||'').slice(0,19)});
for(const p of ['/iam/users/invitations','/iam/invitations','/iam/users?status=invited&limit=200']){const r=await api('GET',p);const L=r.j?.data?.items||r.j?.data?.data||r.j?.data||[];R[p]=r.s+' '+(Array.isArray(L)?JSON.stringify(L.filter(x=>JSON.stringify(x).includes(UID)||(x.id||x.invitation_id)===OLD).map(pick)):'');if(r.s<300&&Array.isArray(L))break;}
R.cancelOld=(await api('POST','/iam/users/invitations/'+OLD+'/cancel',{})).s;
const u=await api('GET','/iam/users/'+UID);R.userGet=u.s;
return R;
