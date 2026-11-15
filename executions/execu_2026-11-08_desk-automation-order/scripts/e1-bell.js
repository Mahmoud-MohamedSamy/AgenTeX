const out=[];let cur='';for(let i=0;i<5;i++){const d=(await api('GET','/notifications?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''))).j?.data;const L=d?.data||[];L.forEach(x=>{if(/#3935b\b/.test(x.title||'')||/3935/.test(JSON.stringify(x)))out.push((x.created_at||'').slice(11,19)+' '+(x.title||'').slice(0,90));});cur=d?.meta?.next_cursor;if(!cur||!L.length)break;}
return out;
