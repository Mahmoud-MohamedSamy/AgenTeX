const fl = L((await api('GET', `/modules/${made.mod}/fields`)).j?.data);
fs.writeFileSync(RUN + '/out/fieldmeta.json', JSON.stringify(fl.map(f => ({ n: f.fieldName, label: f.labels?.en, dt: f.datatypeKey, ro: f.datatypeOptions?.read_only })), null, 1)); log(fl.length);
