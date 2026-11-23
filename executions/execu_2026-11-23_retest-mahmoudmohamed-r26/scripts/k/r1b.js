const ms=arr((await api('GET','/modules')).j);return ms.map(m=>(m.api_name||m.key||'')+'|'+(m.name||m.label||m.plural_label)+'|'+m.id.slice(0,8));
