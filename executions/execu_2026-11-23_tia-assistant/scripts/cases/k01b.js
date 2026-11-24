const a = short(await ask('How many leads are there in CRM, and what is the email of QA TIA Contact A?'));
const b = short(await ask('Read the CRM contact QA TIA Contact A and tell me its email.'));
return { a: (a.err || '') + ' ' + a.text.slice(0, 300) + ' refs ' + a.refs, b: (b.err || '') + ' ' + b.text.slice(0, 300) + ' refs ' + b.refs };
