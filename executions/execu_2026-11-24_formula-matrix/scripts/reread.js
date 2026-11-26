const r = JSON.parse(fs.readFileSync(RUN + '/out/records.json', 'utf8'));
for (const k of ['full', 'empty']) r.records[k].values = await getRec(made.mod, r.records[k].id);
fs.writeFileSync(RUN + '/out/records.json', JSON.stringify(r, null, 1)); const e = r.records.empty.values;
log({ emptyUser: e.in_user ? 'set' : 'blank', if: e.fx_if_user, isblank: e.fx_isblank_user });
