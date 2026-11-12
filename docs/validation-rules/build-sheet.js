// node build-sheet.js → validation-rules-test-sheet.html (style + body parts, cases.js injected)
const fs=require('fs'),p=require('path'),d=__dirname;
delete require.cache[require.resolve('./cases.js')];
const data=require('./cases.js');
const html=fs.readFileSync(p.join(d,'_style.part'),'utf8')+fs.readFileSync(p.join(d,'_body.part'),'utf8').replace('/*DATA*/null',JSON.stringify(data).replace(/</g,'\u003c'));
fs.writeFileSync(p.join(d,'validation-rules-test-sheet.html'),html);
console.log('cases',data.cases.length,'bytes',html.length);
