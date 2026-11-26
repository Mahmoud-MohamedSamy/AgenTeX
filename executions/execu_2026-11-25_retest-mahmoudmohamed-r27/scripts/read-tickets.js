const fs = require('fs');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY };
const strip = h => String(h || '').replace(/<\/(p|li|h\d|tr)>/g, '\n').replace(/<li[^>]*>/g, '- ').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\n{2,}/g, '\n').trim();
const get = async u => { for (let i = 0; i < 4; i++) { try { const r = await fetch(B + u, { headers: H }); return await r.json(); } catch (e) { await new Promise(s => setTimeout(s, 3000)); } } };
(async () => {
  const ids = { 2863: 'ba84b2e5-c590-40d0-8bdd-325b077f5d35', 3207: '05ebfbb9-8ea8-4f72-9df4-7ffae5cc46a1', 3230: '5ad5157c-946f-43ce-96a1-9890be79783d', 3231: '5e4324ab-2a7e-47a1-80a3-a40912bf0345', 3136: '76736d0c-8398-4462-9426-313a0338b2a3', 3232: '7b3f49ca-2aed-4c5f-b367-a1a304367fc5', 3051: '4cc288d6-9126-4bbb-9ef9-9e143964a755' };
  let out = '';
  for (const [n, id] of Object.entries(ids)) {
    const w = await get(`/work-items/${id}/`); const c = await get(`/work-items/${id}/comments/`);
    const cm = (c.results || c || []).map(x => `  [${(x.created_at || '').slice(0, 16)}] ${strip(x.comment_html).slice(0, 1500)}`).join('\n');
    out += `\n===== NDC-${n} ${w.name}\n${strip(w.description_html).slice(0, 3500)}\n--- comments:\n${cm}\n`;
  }
  fs.writeFileSync(process.argv[2], out); console.log(out.length);
})();
