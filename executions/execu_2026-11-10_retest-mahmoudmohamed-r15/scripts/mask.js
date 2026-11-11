// node mask.js <in.png> <out.png> '[[x1,y1,x2,y2],...]'  — paints grey boxes over private text (emails) in screenshots/raw
const path=require('path'),fs=require('fs');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const RAW=path.join(__dirname,'..','screenshots','raw');
const [inp,out,m]=process.argv.slice(2);const boxes=JSON.parse(m);
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge',args:['--disable-gpu']});const pg=await b.newPage({viewport:{width:1600,height:900}});
const src='data:image/png;base64,'+fs.readFileSync(path.join(RAW,inp)).toString('base64');
await pg.setContent(`<body style="margin:0"><div style="position:relative"><img src="${src}">${boxes.map(([a,c,d,e])=>`<div style="position:absolute;left:${a}px;top:${c}px;width:${d-a}px;height:${e-c}px;background:#d1d5db"></div>`).join('')}</div></body>`);
await pg.screenshot({path:path.join(RAW,out)});await b.close();console.log('masked',out);})();
