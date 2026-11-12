const mid = await modId(); const g = (await getRule(mid, I.ruser)).j.data; g.branches[0].actions = [show(['qa_lr_order'])]; return SR(await putRule(mid, I.ruser, g));
