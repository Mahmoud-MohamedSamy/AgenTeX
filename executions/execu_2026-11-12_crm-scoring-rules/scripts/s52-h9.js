const L=await modId('leads'); return arr((await api('GET','/scoring-rules?module_id='+L)).j.data).map(x=>x.name);
