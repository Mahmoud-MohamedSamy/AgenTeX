await wiz('QA RT18 WF 2948 probe');
log('url',page.url());
log('main',(await main.innerText()).replace(/\s+/g,' ').slice(0,1500));
await shot('wf-probe-editor.png');
log('buttons',await main.getByRole('button').allInnerTexts());
return {};
