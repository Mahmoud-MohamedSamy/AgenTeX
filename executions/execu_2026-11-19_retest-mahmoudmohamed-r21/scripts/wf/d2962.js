eval(fs.readFileSync('wf/lib.js','utf8'));
return {d:await deact('1effb0a3-74a1-4551-9ad1-10e55c392be3'), act:arr((await api('GET','/workflow/rules?take=300')).j?.data).filter(x=>x.isActive&&/RT19 WF/.test(x.name)).map(x=>x.name)};
