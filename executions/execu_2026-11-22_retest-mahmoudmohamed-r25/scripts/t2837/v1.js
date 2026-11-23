const calls=[];page.on('response',async r=>{const u=r.url();if(/inbound-health/.test(u)){let b='';try{b=(await r.text()).slice(0,500)}catch(e){};calls.push(r.status()+' '+u.replace(H,'')+' '+b);}});
await page.goto(H+'/settings/channels/email/overview',{waitUntil:'commit'});await page.getByText(/Mail is arriving|could not check/).first().waitFor({timeout:90000}).catch(()=>log('no headline'));await sleep(8000);
const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');const i=t.search(/Mail is arriving|could not check|Last email/);
await shot(process.env.SHOT||'2837-r25b-overview-before.png');return {calls,last:/last email received/i.test(t),snip:t.slice(Math.max(0,i-200),i+600)};
