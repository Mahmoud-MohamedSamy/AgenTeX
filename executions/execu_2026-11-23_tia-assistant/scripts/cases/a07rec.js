result('A-07', 'Finding', 'Removing "Chat with Tia" from RST\'s profile: the same signed-in session still chatted at once (t+0 OK); after the token refresh (≤2.5 min) status and turn are 403 forbidden. Removal is not immediate. Permission granted back for the rest of the run.');
for (const [id, n] of [['A-01','Owner launcher seen bottom-right on Desk setup page (B01 screenshot); CRM not checked (sign-in blocked)'], ['A-02','ADM status/turn OK through API (chk); UI not opened as ADM'], ['A-06','RST launcher "Ask Tia" shown in Desk (H-01); RST has no CRM app']]) result(id, 'Pass', n);
for (const id of ['A-03','A-10','A-12','A-13','A-20','A-21','B-08','G-14','G-04b','H-25','I-15b']) {}
result('A-03', 'Inconclusive', 'NOP UI not opened (API 403 on every Tia route, A-04)');
result('A-10', 'Blocked', 'No user with Manage AI agents but not Manage AI policy');
result('A-12', 'Inconclusive', 'NOP direct URL not opened in UI (API 403)');
result('A-13', 'Inconclusive', 'Audience picker with a user lacking profile rights not opened');
result('A-20', 'Inconclusive', 'No-credits screen (G-14) not shown in UI');
result('A-21', 'Inconclusive', 'Profiles page permission toggle not driven in UI (done by API in P-06/A-07)');
result('B-08', 'Inconclusive', 'Deploy with a write tool but no write modules not tried');
result('G-14', 'Inconclusive', 'No-credits launcher state not shown in UI (caps tested by API)');
result('J-10', 'Fail', 'Blueprint proposal never produced a card (see E-08)');
result('K-17', 'Pass', 'Reference links are app routes (/modules/…/records/…, tia://record/…) on the TAVI host; no javascript: links');
return 'ok';
