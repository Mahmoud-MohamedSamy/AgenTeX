capOn(); await sleep(8000);
await shot('wq-landing');
const q = await api('GET', '/workqueue/queues');
return done({ url: page.url(), body: (await txt()).slice(300, 3500), queues: q.s + ' ' + q.t.slice(0, 1500), calls: cap.filter(c => !/notifications|telephony|unread/.test(c)).slice(0, 20) });
