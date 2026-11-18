// Long-lived Edge on a COPY of r19-zd.json (never written back). POST 127.0.0.1:8896/run {code: "async (page, ctx) => ..."}
const http=require('http'),fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const SP='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad';const cp=SP+'/r20-az-zd-srv.json';fs.copyFileSync(SP+'/r19-zd.json',cp);
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge',args:['--disable-http2']});const ctx=await b.newContext({storageState:cp,viewport:{width:1600,height:900}});let page=await ctx.newPage();
http.createServer((req,res)=>{let s='';req.on('data',d=>s+=d);req.on('end',async()=>{try{const {code}=JSON.parse(s);if(page.isClosed())page=await ctx.newPage();const fn=eval(code);const out=await fn(page,ctx);res.end(JSON.stringify({ok:true,out}));}catch(e){res.end(JSON.stringify({ok:false,err:String(e.message).slice(0,400)}));}});}).listen(8896,'127.0.0.1',()=>console.log('listening'));})();
