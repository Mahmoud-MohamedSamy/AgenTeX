const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f04.json', 'utf8')); const o = { t: new Date().toISOString() };
const bp = await getBp(J.bpId); o.ownerIssues = bp.ownerIssues; o.noActive = bp.transitionsWithoutActiveOwner;
o.ownerTrans = (await api('GET', `/modules/${TK}/records/${J.k1}/blueprint-transitions`)).t.slice(0, 300);
o.ownerRun = E(await runT(J.k1, 'onlyA')); o.tRun = new Date().toISOString(); if (/^2/.test(o.ownerRun)) LED('owner ran QA onlyA on #4997 (8efcd904) Open->Escalated (F04 follow-up)');
await sleep(4000); o.st = (await api('GET', '/desk/tickets/' + J.k1)).j?.data?.status; return o;
