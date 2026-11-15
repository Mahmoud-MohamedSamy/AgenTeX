eval(fs.readFileSync('lib-as.js','utf8'));const HC='e74f2abb-e28d-400e-908c-f2c54862e389';const h=(await api('GET','/help-centers/'+HC)).j?.data||{};
return Object.fromEntries(Object.entries(h).filter(([k,v])=>/url|domain|slug|host|link|path/i.test(k)));
