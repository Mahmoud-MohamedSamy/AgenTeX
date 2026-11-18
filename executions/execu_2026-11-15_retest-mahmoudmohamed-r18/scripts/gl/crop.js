const fs=require('fs'); const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/screenshots/raw/';
const p=await ctx.newPage(); await p.setViewportSize({width:1600,height:900});
for (const [src,dst] of [['3005-1-ar-hosted.png','3005-1v-ar-hosted-view.png'],['3005-2-ar-iframe.png','3005-2v-ar-iframe-view.png']]) {
const b64=fs.readFileSync(R+src).toString('base64');
await p.setContent('<html><body style="margin:0;overflow:hidden"><img src="data:image/png;base64,'+b64+'" style="position:absolute;left:-10000px;top:0"></body></html>'); await p.waitForTimeout(500);
await p.screenshot({path:R+dst}); }
return 'ok';
