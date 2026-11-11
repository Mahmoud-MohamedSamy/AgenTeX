const r=(await api('GET','/desk/notification-rules/departments/b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6')).j?.data?.rules||[];
return r.filter(x=>/assign/.test(x.key)).map(x=>x.key+'='+x.is_enabled);
