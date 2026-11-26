const fl = L((await api('GET', `/modules/${made.matrix.mod}/fields`)).j?.data);
fs.writeFileSync(RUN + '/out/fieldmeta-desk.json', JSON.stringify(fl.map(f => ({ n: f.fieldName, label: f.labels?.en, dt: f.datatypeKey })), null, 1)); log(fl.length, made.matrix.mod);
