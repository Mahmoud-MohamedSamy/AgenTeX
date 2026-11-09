const out = {};
for (const [k, id] of [['desc', '04011130-b0f0-48f7-bbfe-c603a9b71da7'], ['od', '412fcd4a-5dd6-4e8a-9461-b33f5d7658fc'], ['exec', '1acda13b-ec79-4ec9-b8a6-59cabb20c7e9']]) {
  const e = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data)[0] || {};
  out[k] = Object.fromEntries(Object.entries(e).map(([a, b]) => [a, typeof b === 'object' ? JSON.stringify(b).slice(0, 260) : b]));
}
return done(out);
