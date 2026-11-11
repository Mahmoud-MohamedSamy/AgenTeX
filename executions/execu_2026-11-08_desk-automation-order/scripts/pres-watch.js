eval(fs.readFileSync('lib-as.js','utf8'));const o=[];for(let i=0;i<8;i++){o.push(new Date().toISOString().slice(11,19)+' '+await presence());await sleep(15000);}return o;
