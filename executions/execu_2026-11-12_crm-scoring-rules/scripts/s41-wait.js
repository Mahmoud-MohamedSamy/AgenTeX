for(let i=0;i<50;i++){const r=await api('GET','/modules'); if(r.s===200) return 'up after '+(i*10)+'s'; await sleep(10000);} return 'still down';
