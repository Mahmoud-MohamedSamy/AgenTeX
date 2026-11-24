result('R-01', 'Pass', 'Tia definition + description equal to baseline; deployed, no undeployed changes; version 7→36 (one per deploy in the run)');
result('R-02', 'Pass', 'Deleted: CRM 4 leads, 3 deals, 5 contacts, 1 account, workflow rule b4170de0; Desk 7 tickets, 2 KB drafts; RST removed from QA AO Dept A (members equal to before); Tia chats of RST (61), ADM (28), CRA (44), RSC (3), OWN (27) deleted — OWN Arabic chat e282805d kept. Search for QA TIA: 0 left in each module.');
result('R-03', 'Pass', 'ai:tia:use removed from Desk Agent; profile permissions equal to P-03');
result('R-04', 'Pass', 'AI policy descriptor equal to baseline (version 1→13); runtime settings equal (version 0→8)');
result('R-05', 'Pass', 'Final GET of all chat/setup routes 200; differences only in version numbers and wallet: lifetime debited +100,600 raw (≈50.3 credits on screen, includes any other Tia use on the tenant)');
return 'ok';
