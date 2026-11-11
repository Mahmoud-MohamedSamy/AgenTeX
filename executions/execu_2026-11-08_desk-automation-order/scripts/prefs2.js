const d=(await api('GET','/notifications/preferences/me')).j.data;const ch=d.channels.map(c=>c.channel+(c.muted?':MUTED':':on')).join(' ');
const desk=(d.signals||[]).filter(s=>/^desk\./.test(s.event_type)).map(s=>s.event_type+' email='+(s.channels.find(c=>c.channel==='email')?.muted?'MUTED':'on'));
return {global:ch,deskSignals:desk,keys:Object.keys(d)};
