const row = fs.readFileSync(RUN + '/out/p7-results.jsonl', 'utf8').trim().split('\n').map(JSON.parse).filter(x => x.part === 'kb').pop();
const id = (row.big?.create || '').match(/"file_id":"([0-9a-f-]{36})"/)?.[1]; return { id: id?.slice(0, 8), del: id ? (await api('DELETE', `/files/${id}`)).s : null };
