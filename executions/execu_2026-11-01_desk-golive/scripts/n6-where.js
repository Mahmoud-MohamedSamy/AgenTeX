return JSON.stringify({u:page.url(),t:(await txt()).replace(/\s+/g,' ').slice(0,200)});
