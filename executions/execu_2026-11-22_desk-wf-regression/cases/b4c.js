const j = JSON.parse(fs.readFileSync(RUN + '/out/b4.json', 'utf8')); const o = {};
for (const k of ['TE07g', 'TE07o', 'TE07b']) o[k] = { ratedBad: (await execs(j.TK[k], j.R.CF12r)).map(outcome), link: (await execs(j.TK[k], j.R.CF12l)).map(outcome) };
return o;
