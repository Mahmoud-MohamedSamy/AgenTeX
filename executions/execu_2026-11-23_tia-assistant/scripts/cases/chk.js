const st = await api('GET', '/agents/tia/status'); const r = await ask('Reply with OK');
return `${process.env.WHO}: available=${st.j?.data?.available ?? st.s} reason=${st.j?.data?.reason ?? st.j?.error?.code} turn=${r.error || r.j?.error?.code || ''} text="${(r.text||'').slice(0,30)}"`;
