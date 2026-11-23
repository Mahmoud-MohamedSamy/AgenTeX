const fs=require('fs');let s=fs.readFileSync('api.js','utf8');
if(s.includes('const stream =')){console.log('already');process.exit(0);}
const add=fs.readFileSync('stream-snippet.txt','utf8');
s=s.replace("const sleep = ms =>", add+"\nconst sleep = ms =>");
s=s.replace("new AF('api', 'sleep', 'arr', 'fs', 'log',","new AF('api', 'sleep', 'arr', 'fs', 'log', 'stream',").replace("(api, sleep, arr, fs, log)","(api, sleep, arr, fs, log, stream)");
fs.writeFileSync('api.js',s);console.log('patched');
