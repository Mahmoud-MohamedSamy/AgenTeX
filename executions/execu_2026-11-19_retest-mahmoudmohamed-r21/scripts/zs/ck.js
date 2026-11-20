module.exports=async(page,z)=>{const a=await z('GET','/api/v1/tickets/search?subject='+encodeURIComponent('*QA RT20 ZS*')+'&limit=50');const c=await z('GET','/api/v1/contacts/search?lastName='+encodeURIComponent('QA RT20 ZS')+'&limit=20');
const ids=(a.j?.data||[]).map(x=>x.id);const st=[];for(const id of ids)st.push((await z('GET','/api/v1/tickets/'+id)).s);const cs=[];for(const x of (c.j?.data||[]))cs.push((await z('GET','/api/v1/contacts/'+x.id)).s);
return {tickets:(a.j?.data||[]).map(x=>x.ticketNumber+' '+x.subject),ticketGet:st,contacts:(c.j?.data||[]).length,contactGet:cs};};
