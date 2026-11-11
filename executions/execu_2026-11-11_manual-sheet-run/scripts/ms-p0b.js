module.exports=async()=>{const R={};const u=await api('GET','/iam/users?per_page=500');
R.users=arr(u.j&&u.j.data).map(x=>({id:x.userId,name:x.displayName,email:String(x.email||'').replace(/^(.{2}).*@/,'$1***@'),status:x.status,profiles:x.profileNames,owner:x.isOwner}));
const q=await api('GET','/desk/queues/agents');R.qs=q.s;const ql=arr(q.j&&q.j.data);R.qKeys=ql[0]?Object.keys(ql[0]):[];R.q=ql.slice(0,40).map(x=>JSON.stringify(x).slice(0,300));
return R;};
