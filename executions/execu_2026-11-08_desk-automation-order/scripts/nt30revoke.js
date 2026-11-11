// Revoke the NT-30 invite whose token was printed, then re-invite. Prints status codes only.
const IID='866b9267-060c-4c48-969a-fcf3a414e711',UID='a90969a4-5cdb-46fd-a947-07a3c39813b8';const R={};
for(const [m,p] of [['DELETE','/iam/invitations/'+IID],['POST','/iam/invitations/'+IID+'/revoke'],['DELETE','/iam/users/invitations/'+IID],['DELETE','/iam/users/'+UID]]){const r=await api(m,p);R[m+' '+p.replace(/[0-9a-f-]{36}/,'{id}')]=r.s;if(r.s<300)break;}
return R;
