const f = arr((await api('GET', '/web-forms?app=desk')).j).find(x => x.name === 'Customer Support Webform');
fs.writeFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad/wf-key.txt', f.embed_key); log('saved');
