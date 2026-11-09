const st={};
await page.goto(H+'/modules/'+T.LEADS,{waitUntil:'commit',timeout:120000});
for(let i=0;i<100;i++){ await sleep(3000); const t=await text(); if(/records/.test(t) && /Full Name/.test(t) && !/Loading\.\.\./.test(t)) break; } await sleep(4000);
await page.mouse.click(355,165); await sleep(3000); await shot('2122-1-picker.png');
st.pickerBtns=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(x=>x&&x.length<40).slice(-25);
const nv=page.getByText(/(Create|New) (custom )?view/i).first(); st.nv=await nv.count(); if(st.nv){ await nv.click(); await sleep(5000); await shot('2122-2-editor.png');
 await page.getByText('Filter by criteria',{exact:true}).click(); await sleep(2500); await shot('2122-2b-criteria.png'); st.critBtns=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(x=>x&&x.length<30).slice(-20); const addRow=page.getByRole('button',{name:/Add/i}); for(let k=0;k<2 && await addRow.count();k++){ await addRow.first().click(); await sleep(1500); }
 await shot('2122-3-editor-rows.png'); st.editor=(await text()).match(/Criteria[sS]{0,600}/i)?.[0].replace(/s+/g,' ');
 st.patternInputs=await page.locator('input,textarea').evaluateAll(a=>a.filter(x=>/pattern/i.test((x.name||'')+(x.placeholder||'')+(x.getAttribute('aria-label')||''))).map(x=>({ro:x.readOnly,dis:x.disabled,v:x.value})));
 st.andOrBtns=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(x=>/^(and|or|AND|OR)$/.test(x)); }
return st;
