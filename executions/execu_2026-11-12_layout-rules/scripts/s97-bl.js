const mid = await modId(); const g = (await getRule(mid, I.c1)).j.data; const last = g.branches[3];
last.actions = [show(['qa_lr_vip']), { type: 'show_buttons', buttonIds: [I.fx_btn] }, { type: 'show_links', linkIds: [I.fx_link] }];
return SR(await putRule(mid, I.c1, g)).slice(0, 400);
