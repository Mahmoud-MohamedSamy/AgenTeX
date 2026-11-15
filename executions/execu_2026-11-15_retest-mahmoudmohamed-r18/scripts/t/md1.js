let live=0; for(const id of I.R07){ const r=await api('GET','/modules/'+L+'/records/'+id); if(r.s===200) live++; } return {live};
