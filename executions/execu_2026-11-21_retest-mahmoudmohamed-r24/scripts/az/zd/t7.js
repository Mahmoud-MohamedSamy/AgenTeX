async (page) => { EVAL
const g=async n=>{const r=await z('GET','/api/v1/tickets/search?subject='+encodeURIComponent('QA RT20 AZ*')+'&limit=50');return (r.j?.data||[]).map(x=>x.ticketNumber+':'+x.status+':'+(x.assigneeId===ME?'ADMIN':x.assigneeId===TA1?'TA1':x.assigneeId||'none')+':'+x.departmentId.slice(-4)).sort().join(' ');};
return {all:await g()};}
