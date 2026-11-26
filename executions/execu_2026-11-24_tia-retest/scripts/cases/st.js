const s=await api('GET','/agents/tia/status?app=desk');return s.s+' '+s.j?.data?.available;
