eval(fs.readFileSync('w2/lib.js','utf8'));
const deps=arr((await api('GET','/desk/departments?take=200')).j?.data);
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);
return {deps:deps.map(d=>d.id.slice(0,8)+' '+d.name).filter(x=>/QA|Customer/.test(x)), users:us.length};
