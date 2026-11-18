await wiz('QA RT18 WF 2948 probe');
log('depts',(await main.innerText()).match(/Departments[^\n]*\n?[^\n]*/)?.[0]);
await clk(main.getByText(/No conditions — actions run/).first());await sleep(800);
await clk(main.getByText('Tickets matching certain conditions',{exact:true}).first());await sleep(800);
log('c',(await main.innerText()).split('CONDITION')[1]?.slice(0,800).replace(/\s+/g,' '));
log('btns',(await main.getByRole('button').allInnerTexts()).slice(0,40));
await shot('wf-probe-cond.png');
return {};
