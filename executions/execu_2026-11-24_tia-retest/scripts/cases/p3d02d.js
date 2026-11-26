const r=await ask('What is the QA TIA P3 code word?',{page:{app:'desk'}});p3rec('D-02-draft','?','draft only (not deployed): '+tiaText(r).slice(0,250));return tiaText(r).slice(0,250);
