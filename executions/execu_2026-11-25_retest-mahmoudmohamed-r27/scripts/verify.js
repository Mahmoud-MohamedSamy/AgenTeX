const fs = require('fs');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3'; const H = { 'X-API-Key': KEY };
const get = async p => { for (let i = 0; i < 4; i++) { try { return await (await fetch(B + p, { headers: H })).json(); } catch (e) { await new Promise(s => setTimeout(s, 3000)); } } };
(async () => { const d = JSON.parse(fs.readFileSync('plane-draft.json', 'utf8'));
  for (const it of d.items.filter(x => x.verdict === 'PASS')) { const w = await get(`/work-items/${it.workitem_id}/`); const a = await get(`/work-items/${it.workitem_id}/attachments/`); const arrA = Array.isArray(a) ? a : (a.results || []);
    const names = arrA.filter(x => /retest|editor-remove/.test(x.attributes?.name || '')).map(x => (x.attributes?.name) + (x.is_uploaded ? '' : ' (NOT uploaded)'));
    console.log(it.ticket, w.state === '11f2d31f-9d01-4463-a1de-ce99521b97aa' ? 'Done' : w.state, names.join(', ')); } })();
