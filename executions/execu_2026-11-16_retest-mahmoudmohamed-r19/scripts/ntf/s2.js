const d=(await api('GET','/notifications?limit=30&apps=desk')).j?.data;return (d?.data||[]).filter(x=>/QA RT19 NTF/.test(x.title||'')).map(x=>x.created_at.slice(11,19)+' '+x.event_type+' '+x.title);
