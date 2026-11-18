const fs=require('fs'); const os=require('os'); const path=require('path');
await page.goto(H+'/settings/data/export',{waitUntil:'domcontentloaded'}); await sleep(12000);
const m=page.locator('main').last();
await m.getByRole('button',{name:'Module',exact:true}).first().click(); await sleep(1200); await page.getByRole('option',{name:/^Contacts$/}).first().click(); await sleep(2000);
await m.getByRole('button',{name:'Records',exact:true}).click(); await sleep(1500);
await page.getByRole('option',{name:/Today's Contacts/}).first().click(); await sleep(1500);
const dl=page.waitForEvent('download',{timeout:90000}).catch(()=>null);
await m.getByRole('button',{name:/^Export$/}).last().click(); const f=await dl;
if(!f) { await shot('3026-x-nodownload.png'); return {err:'no download', t:(await m.innerText()).slice(-800)}; }
const tmp=path.join('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad','r18-3026.csv'); await f.saveAs(tmp);
let s=fs.readFileSync(tmp,'utf8').replace(/^\uFEFF/,'');
const parse=s=>{const rows=[];let row=[],q=false,c='';for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch=='"'&&s[i+1]=='"'){c+='"';i++;}else if(ch=='"')q=false;else c+=ch;}else if(ch=='"')q=true;else if(ch==','){row.push(c);c='';}else if(ch=='\n'||ch=='\r'){if(ch=='\r'&&s[i+1]=='\n')i++;row.push(c);rows.push(row);row=[];c='';}else c+=ch;}if(c||row.length){row.push(c);rows.push(row);}return rows;};
const rows=parse(s).filter(r=>r.length>1); const hdr=rows[0];
fs.unlinkSync(tmp);
const iName=hdr.findIndex(h=>/^(Contact )?Name$/i.test(h.trim())), iF=hdr.findIndex(h=>/^First Name$/i.test(h)), iL=hdr.findIndex(h=>/^Last Name$/i.test(h));
const data=rows.slice(1); const emptyName=data.filter(r=>!(r[iName]||'').trim()).length;
const mine=data.filter(r=>/QA RT18/.test(r[iL]||''));
// render a small table with only safe columns
const cols=[iName,iF,iL].filter(i=>i>=0);
const html='<html><body style="font:15px Inter,Arial;padding:24px;background:#fff"><h3>Contacts export (Today\'s Contacts, CSV) — '+f.suggestedFilename().replace(/[<>]/g,'')+' — '+data.length+' rows</h3><p>Header has '+hdr.length+' columns; shown: Name, First Name, Last Name (rows created by QA RT18; other rows counted only)</p><table border=1 cellpadding=8 style="border-collapse:collapse"><tr>'+cols.map(i=>'<th>'+hdr[i]+'</th>').join('')+'</tr>'+mine.map(r=>'<tr>'+cols.map(i=>'<td>'+(r[i]||'<i style=color:#c00>(empty)</i>')+'</td>').join('')+'</tr>').join('')+'</table><p>Rows with an empty Name column: '+emptyName+' of '+data.length+'</p></body></html>';
const p2=await ctx.newPage(); await p2.setViewportSize({width:1600,height:900}); await p2.setContent(html); await p2.screenshot({path:'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/screenshots/raw/3026-1-csv-name.png'}); await p2.close();
await sleep(3000); await page.reload({waitUntil:'domcontentloaded'}); await sleep(10000); await shot('3026-2-export-history.png');
return {file:f.suggestedFilename(), hdrN:hdr.length, nameCol:hdr[iName], iName, rows:data.length, emptyName, mine:mine.map(r=>cols.map(i=>r[i]))};
