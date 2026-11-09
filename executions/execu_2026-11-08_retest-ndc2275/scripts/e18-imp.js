module.exports=async()=>{const R={};const S=OUT+'/../screenshots/raw/';const W2=ms=>pg.waitForTimeout(ms);const body=async()=>(await pg.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
 await pg.setViewportSize({width:1600,height:1100});
 await pg.goto(H+'/settings/data/import?module='+T,{waitUntil:'commit',timeout:120000});for(let i=0;i<30;i++){await W2(3000);if(/Start import/i.test(await body()))break;}
 await pg.locator('input[type=file]').nth(1).setInputFiles(path.join(OUT,'../evidence/e18-import.csv'),{timeout:20000});await W2(6000);
 const so=pg.getByRole('button',{name:/^Start over$/});if(await so.count()){R.startOver=true;await so.first().click({timeout:8000});await W2(5000);await pg.locator('input[type=file]').last().setInputFiles(path.join(OUT,'../evidence/e18-import.csv'));await W2(6000);}
 for(let i=0;i<2;i++){await pg.getByRole('button',{name:/^Next$/}).last().click({timeout:15000});await W2(5000);}
 await pg.screenshot({path:S+'e18-imp-map.png',fullPage:true}); const t=await body(); R.map=t.slice(t.indexOf('Map fields'),t.indexOf('Map fields')+1500);
 R.selects=await pg.$$eval('select',ss=>ss.map(s=>({val:s.options[s.selectedIndex]&&s.options[s.selectedIndex].text,n:s.options.length,hit:[...s.options].map(o=>o.text).filter(x=>/creat|respon|customer|closed|first/i.test(x))})));
 R.combos=await pg.$$eval('[role=combobox],button[aria-haspopup]',ss=>ss.map(s=>s.innerText.trim().slice(0,40)));
 // leave the session: Start over to clear
 await pg.goto(H+'/settings/data/import?module='+T,{waitUntil:'commit'});for(let i=0;i<20;i++){await W2(3000);if(/Start over|Start import/i.test(await body()))break;}const so2=pg.getByRole('button',{name:/^Start over$/});if(await so2.count()){await so2.first().click();await W2(3000);R.cleared=true;}
 return R;};
