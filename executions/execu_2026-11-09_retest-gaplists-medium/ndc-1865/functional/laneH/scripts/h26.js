let step='nav';try{
await page.goto(H+'/team-feeds/08fd8684-c5c0-4d4d-86f9-2be70cf61e53/all',{waitUntil:'load',timeout:120000});await wt(/QA FT 1865 H feed post/);await page.waitForTimeout(2000);
step='menu';const post=page.locator('article, li, div').filter({hasText:/^[\s\S]*QA FT 1865 H feed post/}).filter({has:page.locator('button')}).last();
const card=page.getByText('QA FT 1865 H feed post, please ignore.').first();const cb=await card.boundingBox();
const btns=await page.locator('button').evaluateAll((bs,y)=>bs.map(b=>({a:b.getAttribute('aria-label'),t:b.innerText.trim().slice(0,20),r:b.getBoundingClientRect().toJSON()})).filter(x=>x.r.y>y-90&&x.r.y<y+120),cb.y);out.btns=btns.map(x=>x.t+'|'+x.a+'|'+Math.round(x.r.x)+','+Math.round(x.r.y));
const more=btns.find(x=>/more|actions|options/i.test(x.a||''));if(!more)throw new Error('no more btn');
await page.mouse.click(more.r.x+more.r.width/2,more.r.y+more.r.height/2);await page.waitForTimeout(1200);
out.menu=(await page.locator('[role=menu]').allInnerTexts()).slice(0,2);await shot('f4-post-menu');
step='delete';await page.locator('[role=menuitem]').filter({hasText:/delete/i}).first().click({timeout:8000});await page.waitForTimeout(1500);
const dlg=page.locator('[role=dialog], [role=alertdialog]').last();if(await dlg.count()){out.confirm=(await dlg.innerText()).replace(/\n/g,' | ').slice(0,200);await dlg.getByRole('button').filter({hasText:/delete/i}).last().click();}
await page.waitForTimeout(5000);out.stillThere=/QA FT 1865 H feed post/.test(await body());await shot('f5-post-deleted');
log('DELETE Team Feeds post (QA FT 1865 H feed post) via UI; still visible='+out.stillThere);
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('f-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
