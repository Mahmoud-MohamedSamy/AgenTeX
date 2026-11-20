const L=x=>Array.isArray(x)?x:(x?.items||[]);const o={};
for(const id of ['43102d58-3541-4d5e-a92d-1cbc4852197b','da96e91b-3f0c-4c56-a4ba-7fb13a52055a']){const h=L((await api('GET',`/desk/tickets/${id}/history`)).j?.data);
o[id.slice(0,8)]=h.map(x=>(x.occurredAt||x.createdAt||'').slice(11,19)+' '+x.action+' '+JSON.stringify(x.changes||x.details||x.payload||'').slice(0,160)+' by '+(x.actorName||x.actorType||''));}
return o;
