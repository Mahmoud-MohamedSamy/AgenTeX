eval(fs.readFileSync('cr/lib.js','utf8'));
const f=arr((await api('GET',`/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/fields?take=400`)).j?.data);
return {keys:Object.keys(f[0]||{}),sample:JSON.stringify(f.find(x=>x.key==='subject'||x.apiName==='subject')).slice(0,1500)};
