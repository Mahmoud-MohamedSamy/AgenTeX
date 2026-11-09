await page.setViewportSize({width:1600,height:1000});
const out={};
const visit=async(label,key)=>{try{await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await page.waitForTimeout(6000);
 await page.getByText(label,{exact:true}).first().click();await page.waitForTimeout(7000);
 out[key]={url:page.url(),text:(await page.locator('main').first().innerText().catch(()=>page.locator('body').innerText())).slice(0,2500)};
 await page.screenshot({path:'evidence/raw/set-'+key+'.png'});}catch(e){out[key]={err:String(e.message).slice(0,200)}}};
for(const [l,k] of [['Help widgets','widgets'],['Collaboration Tools','collab'],['Data Retention','retention'],['AI Tagging','aitag'],['Assignment Rules','assign'],['General','general'],['Channels','channels'],['Email','email']]) await visit(l,k);
return out;
