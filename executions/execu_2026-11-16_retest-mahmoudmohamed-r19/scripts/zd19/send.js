// node send.js <file with async (page,ctx)=>...>
const fs=require('fs'),http=require('http');const code=fs.readFileSync(process.argv[2],'utf8');
const r=http.request({host:'127.0.0.1',port:8895,path:'/run',method:'POST',headers:{'Content-Type':'application/json'}},res=>{let s='';res.on('data',d=>s+=d);res.on('end',()=>{const j=JSON.parse(s);console.log(j.ok?(typeof j.out==='string'?j.out:JSON.stringify(j.out,null,1)):'ERR '+j.err);});});r.setTimeout(590000);r.end(JSON.stringify({code}));
