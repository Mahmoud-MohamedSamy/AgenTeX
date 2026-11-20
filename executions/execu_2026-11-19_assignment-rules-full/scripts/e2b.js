const ids = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => /QA AR E09 skip/.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0]);
const o = []; for (const id of ids) o.push({ owner: await ownN(id), h: (await hist(id)).filter(y => /auto_assigned/.test(y)).map(y => y.replace(/.*"skipped_user_ids":/, 'skipped=')) });
return o;
