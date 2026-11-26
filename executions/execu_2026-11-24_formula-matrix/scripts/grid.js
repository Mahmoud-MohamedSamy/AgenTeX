const r = require('../out/records.json'); const fs = require('fs');
const F = ['if','concat','coalesce','min','max','sum','avg','count','upper','lower','trim','len','abs','round','isblank','number','text','daysbetween','hoursbetween'];
const T = ['single_line','multi_line','rich_text','email','phone','url','number','decimal','currency','percent','long_integer','auto_number','checkbox','pick_list','radio_button','status','multi_select','date','date_time','lookup','user','address','location','file_upload','camera','image_upload','map','multi_select_lookup','department','team','support_plan','email_template','subform'];
const sh = v => v === null || v === undefined ? '∅' : typeof v === 'object' ? JSON.stringify(v) : String(v);
const cell = v => sh(v).replace(/\|/g, '\|').replace(/\n/g, '⏎').slice(0, 40);
let md = '';
for (const k of ['full', 'empty']) { const V = r.records[k].values;
  md += `\n## Record: ${V.name} (${r.records[k].id})\n\n| Type | Input | ${F.join(' | ')} |\n|${'---|'.repeat(F.length + 2)}\n`;
  for (const t of T) md += `| ${t} | ${cell(V['in_' + t])} | ${F.map(f => cell(V[`fx_${f}_${t}`])).join(' | ')} |\n`; }
fs.writeFileSync(__dirname + '/../out/values.md', md); console.log(md);
