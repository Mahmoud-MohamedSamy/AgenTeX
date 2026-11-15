const out = {};
await go('/modules/' + MID + '/records/' + I.k1.rec, 9000);
const t = await bodyText(); out.hasScoreWord = (t.match(/.{0,60}Scor(e|ing).{0,80}/g) || []).slice(0, 5);
await shot('2934-8-record-page.png');
const tabs = await page.getByRole('tab').allInnerTexts(); out.tabs = tabs;
return out;
