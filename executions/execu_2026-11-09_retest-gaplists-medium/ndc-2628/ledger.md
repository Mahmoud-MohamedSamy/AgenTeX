# NDC-2628 ledger (Lane D, 9 Nov 2026, NDC-Staging, ndc-staging-owner idx 7)
- 2026-11-09T16:06:07.254Z CREATE lead QA RT 2628 Lead gdyfh b15abd2b-8e98-4456-9ab7-047e29914a04
- 2026-11-09T16:06:08.535Z CREATE tag QA RT 2628 tag gdyfh 6b5aac19-8ca3-47ea-8d06-92965c5f5d14
- 2026-11-09T16:06:41.177Z note id ba0975e3-333f-4c27-8d3e-bdfc59991aba on b15abd2b-8e98-4456-9ab7-047e29914a04
- 2026-11-09T16:06:53.305Z DELETE note ba0975e3-333f-4c27-8d3e-bdfc59991aba → 204
- 2026-11-09T16:06:55.749Z CREATE tag QA RT 2628 quokkatag fd0e9592-1e39-4597-87a7-17dd4d6e158c
- 2026-11-09T16:06:56.947Z CREATE note 2 (platypusnote) on b15abd2b-8e98-4456-9ab7-047e29914a04
- 2026-11-09T16:10:18.038Z UI write: POST /files → 201 {"success":true,"data":{"file_id":"30084b09-79d4-49c8-8cdd-99ca04f45bbf","upload_url":"https://staging-crm.taviportal.com/s3/anyware-files/t/a7a7a7a7000000000000000000000004/attachme
- 2026-11-09T16:10:18.050Z UI write: POST /files/30084b09-79d4-49c8-8cdd-99ca04f45bbf/confirm → 200 {"success":true,"data":{"file_id":"30084b09-79d4-49c8-8cdd-99ca04f45bbf","owner_user_id":null,"app_key":"crm","ownership_class":"tenant_f
- 2026-11-09T16:10:18.060Z UI write: POST /modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/b15abd2b-8e98-4456-9ab7-047e29914a04/attachments → 201 {"success":true,"data":{"id":"05668246-d3a4-4482-910e-2ac4b9416dac","file_id":"30084b0
- 2026-11-09T16:10:58.769Z CREATE clone lead (UI Clone → Save) f15893b5-4ec2-4d44-8ea8-fe7363c0bd6b
- 2026-11-09T16:20:01.904Z import wizard write: POST /modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/import → 201 {"success":true,"data":{"session_id":"e122c27a-14a9-48b4-864f-c824d5438f80","status":"pending_mapping","headers":["F
- 2026-11-09T16:24:59.153Z CLEANUP DELETE attachment 05668246-d3a4-4482-910e-2ac4b9416dac → 204
- 2026-11-09T16:24:59.270Z CLEANUP DELETE note 74085165-0d90-472f-a6d7-416001eecf4a → 204
- 2026-11-09T16:24:59.596Z CLEANUP DELETE tag 6b5aac19-8ca3-47ea-8d06-92965c5f5d14 → 204
- 2026-11-09T16:24:59.700Z CLEANUP DELETE tag fd0e9592-1e39-4597-87a7-17dd4d6e158c → 204
- 2026-11-09T16:25:00.498Z CLEANUP DELETE lead f15893b5-4ec2-4d44-8ea8-fe7363c0bd6b → 204
- 2026-11-09T16:25:00.681Z CLEANUP DELETE lead b15abd2b-8e98-4456-9ab7-047e29914a04 → 204
- 2026-11-09T16:25:05.194Z CLEANUP PURGE bin ids 74dab9ce-3fa9-43dc-8a33-d91c5cbfb00a,da9317cc-65ec-4f63-a1e5-6aad7abb43c8 → 200
- 2026-11-09T16:25:08.895Z VERIFY {"b15abd2b":404,"f15893b5":404,"tagsLeft":0,"binLeft":0,"searchHits":0}
- 2026-11-09T16:25:27.302Z CLEANUP DELETE file object 30084b09 (txt) → 204
- 2026-11-09T16:26:11Z Import session e122c27a (qa-rt-2628.csv, status pending_mapping, 0 records created) cannot be removed: DELETE → 405, cancel → 404. It isn't in Import History. Left as is.
- 2026-11-09T16:26:19Z Removed laneD-ndc.json and temp files from the scratchpad.

## Posted 10 Nov 2026
Comment 88aa05a8-07d9-42b7-a4d6-89efb4e0ea2f + 1 image (01). State unchanged (Backlog).

## Narrowed 10 Nov 2026
Title → "Daily record work: \"#tag\" search returns no results (rest of the Zoho gap list is built)". Description: new "Narrowed" section on top (open: item 8 #tag; out of scope: item 5 Campaigns/Cadences; built: 1,2,3,4,6,7,9), original list kept below. Priority/state/assignees unchanged.
