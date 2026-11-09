const l = 'bb321a59-12a4-429f-b666-374ad99a4702'; ledger(`lead ${l} "QA RT 1950 A u1 own" by u1`);
return { state: (await X.approvalState('o', T.LEADS, l)).j?.data?.state };
