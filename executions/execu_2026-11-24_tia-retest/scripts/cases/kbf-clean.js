const row = fs.readFileSync(RUN + '/out/p7-results.jsonl', 'utf8').trim().split('\n').map(JSON.parse).filter(x => x.part === 'kb').pop();
const FIDS = [...Object.values(row.files).map(f => f.upload?.file_id), row.csv?.upload?.file_id].filter(Boolean); const o = {};
for (const id of FIDS) o[id.slice(0, 8)] = (await api('DELETE', `/files/${id}`)).s;
ledger('P7 KB storage files delete ' + JSON.stringify(o)); return o;
