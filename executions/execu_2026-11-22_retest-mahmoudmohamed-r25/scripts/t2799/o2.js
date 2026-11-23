const d=(await api('GET','/iam/me')).j?.data||{};const pick=o=>Object.fromEntries(Object.entries(o).filter(([k,v])=>/id$|name/i.test(k)&&typeof v!=='object'));
return {top:pick(d),user:d.user?pick(d.user):null};
