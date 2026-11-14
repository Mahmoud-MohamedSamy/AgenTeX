const t = '889df39a-72cc-4264-8e03-244da36bd168'; log('state', JSON.stringify((await bstate(t))?.activeStates)); log('hist', (await hist(t)).filter(h => /blueprint|status|comment/.test(h)));
const cm = await api('GET', '/desk/tickets/' + t + '/comments'); log('comments', cm.s, JSON.stringify(cm.j?.data || '').slice(0, 300));
