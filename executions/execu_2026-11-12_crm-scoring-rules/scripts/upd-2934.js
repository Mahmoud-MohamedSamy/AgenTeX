const fs=require('fs');
const KEY=fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'').trim();
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3'; const H={'X-API-Key':KEY,'Content-Type':'application/json'};
const ID='71bdfe80-f41e-433e-b91d-525b7110b096';
(async()=>{const g=await (await fetch(`${B}/work-items/${ID}/`,{headers:H})).json(); let h=g.description_html;
 if(/Selective Scoring Rules/.test(h)){console.log('already there');return;}
 const marker=/(<p[^>]*><strong>Additional notes<\/strong><\/p>)/; if(!marker.test(h)){console.log('marker not found');return;}
 const add='<p><strong>Missing — automation</strong></p><ol start="17"><li><p>Score workflow for selected scoring rules only. Zoho\'s "Record Score" trigger has "This rule should be applied for: All Scoring Rules / Selective Scoring Rules". Today a TAVI "On Score Change" workflow always reacts to the one combined score of all rules. Not in NDC-2030.</p></li></ol>';
 h=h.replace(marker,add+'$1');
 const u=await fetch(`${B}/work-items/${ID}/`,{method:'PATCH',headers:H,body:JSON.stringify({description_html:h})}); console.log('patch',u.status);
 const g2=await (await fetch(`${B}/work-items/${ID}/`,{headers:H})).json(); console.log('has item 17:',/Selective Scoring Rules/.test(g2.description_html), 'items 1-16 kept:',/Clone, run scoring rules/.test(g2.description_html));})().catch(e=>console.log('ERR',e.message));
