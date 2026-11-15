eval(fs.readFileSync('lib-as.js','utf8'));const x=JSON.parse(fs.readFileSync('../pc-or22.json','utf8'));const f=await feed(x.id);
return {keys:Object.keys(f[0]||{}).join(','),rows:f.slice().reverse().map(e=>JSON.stringify(e).match(/"(created_at|occurred_at|at|timestamp)":"([^"]+)"/)?.[2]?.slice(11,23)+' '+e.action+' '+JSON.stringify(e.summary||{}).slice(0,120))};
