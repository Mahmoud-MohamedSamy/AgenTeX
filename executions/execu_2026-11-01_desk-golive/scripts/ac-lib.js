const TK = { MK1: '43d637c7-140c-4e70-8033-16bd2a4f4cf9', MK2: '0f728e32-c972-4721-b3c4-05f407ab7f59', SA1: 'baf2d764-f0e3-4fbd-b3f6-75290ca610ef', HR1: 'fc755356-fb4e-4530-887a-7a1aa4029836', CSC: '5c506322-6ae7-4334-ba9d-e5790ee5c3cc', CSD: '27146cf7-5d12-4fb4-b118-87d7b06c31e3', CSE: 'f3951970-a98c-48af-89b9-60eb11e662f5', CSU: 'd2dcb7fb-faf9-4d59-97cb-3edb5ccc2715', CST: '51010fcc-7f0f-4c31-8906-c336abc18841', SH1: '95a9a126-cf36-479e-b30e-b258d804283f', SH2: '3fb6237c-835a-4d41-a9f2-053d7e3af501', MV1: 'c9f443d4-7639-400b-b3c1-8c9272ddbd2c', MV2: 'b70ac88f-5264-453a-880a-c79bd037cac7', MV3: '74eaccf2-9426-4148-8123-7f750be8bbc5' };
const DEP = { CS: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', MKT: '2a73bbc0-efb3-4250-bf9b-2fdc98236794', SAL: 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94', HR: '08fd8684-c5c0-4d4d-86f9-2be70cf61e53' };
const US = { O: '97be04b6-0a08-4883-aa51-e1650b11cab7', B: '3445ec4a-020e-4f12-b156-dd2de7610164', C: '9d182dfa-05f3-4af7-9685-8615a2fbe537', D: '876ce871-2b02-4854-89a7-68050391c62b', E: '23f0f9d7-2fc0-429b-9334-9933fe5c429b' };
const TEAM = '9e444340-ef59-455b-80a1-16b321592447';
const nameOf = id => (Object.entries(TK).find(([k, v]) => v === id) || [id.slice(0, 8)])[0];
// visible list of QA AC tickets via records API
const listQA = async () => { const r = await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent('QA AC')); return { s: r.s, ids: arr(D(r.j)).map(x => nameOf(x.id)).sort() }; };
const probe = async (k, deep) => { const id = TK[k]; const o = {}; o.rec = (await api('GET', '/modules/' + TM + '/records/' + id)).s; o.tkt = (await api('GET', '/desk/tickets/' + id)).s;
  if (deep) { for (const sub of ['comments', 'threads', 'attachments', 'history', 'shares', 'followers', 'time-entries', 'activities']) o[sub] = (await api('GET', '/desk/tickets/' + id + '/' + sub)).s; }
  return o; };
const st = o => Object.entries(o).map(([k, v]) => k + ':' + v).join(' ');
Object.assign(TK, { R1: 'd1d6ccba-03a7-49aa-88c4-2b91296cc9cb', R2: 'd6a2e416-b764-40bd-97bb-cbf9501f014f', R3: '0e5c44e2-3b6e-4cad-91f3-d6690f0cb63b', R4: '6c305f58-fc4d-435a-a59b-9931d7b4829d', R5: '26267d96-4b90-496c-8734-140f9b136c36', R4b: 'b0acbfc3-582b-424d-9c9e-8a4ff8b280c6' });
const CON2 = 'b86e9c22-d369-4a97-9f92-47db7e0cc0bc';
const prr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 110) : ''); };
