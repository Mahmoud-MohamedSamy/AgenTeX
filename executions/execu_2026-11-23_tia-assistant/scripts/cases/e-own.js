const r10 = await ask('Explain our SLA policies: who they apply to and their targets.');
const r11 = await ask('Change our macros: create a new macro named QA TIA macro that sets the ticket status to Closed.');
const r12 = await ask('Create a new ticket tag named QA TIA Tag.');
const r11b = await ask('Explain what our macros do.');
fs.writeFileSync(RUN + '/out/e-own.json', JSON.stringify({ r10, r11, r11b, r12 }, null, 1));
return { r10: short(r10), r11: short(r11), r11b: short(r11b), r12: short(r12), p12: JSON.stringify((r12.final?.pending_actions || [])[0] || {}).slice(0, 700) };
