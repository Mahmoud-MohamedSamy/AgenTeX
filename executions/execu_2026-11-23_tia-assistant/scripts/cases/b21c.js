result('B-19', 'Pass', 'Recycle Bin restore 200 (succeeded 1) → Tia back deployed v15, same definition as baseline, 28 tools; RST available again and both past chats listed');
result('B-21', 'Fail', 'Audit log (/audit/events, 100 latest + app_key=agents) has NO entry for the 9 draft saves, 7 deploys, deactivate, delete or restore of Tia done 14:15–14:48 by ndc-staging-owner. The only agent entry is "iam audit.entity.agent_principal created Tia" by ai-agents at 14:48:22 (the restore). Setup changes to Tia leave no trace.');
result('B-20', 'Blocked', 'Create screen while Tia was in the Recycle Bin not looked at in the UI (delete window was API only, 14:47:55–14:48:22). API: GET /agents returned no agent during that window.');
return 'ok';
