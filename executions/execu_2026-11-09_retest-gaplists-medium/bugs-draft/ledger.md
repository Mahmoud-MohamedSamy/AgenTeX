# Lane E ledger (possible bugs, 10 Nov 2026, NDC-Staging)
- 2026-11-10T08:18:43Z sign-in index 7 (ndc-staging-owner) once → scratchpad laneE-owner.json
- 2026-11-10T08:23:02.890Z CREATED contact daf6afa2-d952-41f6-afbb-f7223e49408a (QA RT BUG Contact, email qa.rt2636@example.com) → 201
- 2026-11-10T08:23:03.839Z CREATED ticket 372b88df-6733-4c61-a774-0202a0148fd5 (QA RT BUG composer check, dept HR, contact daf6afa2-d952-41f6-afbb-f7223e49408a) → 201
- 2026-11-10T08:25:34.183Z UPDATED contact daf6afa2-d952-41f6-afbb-f7223e49408a email → qa.rt.bug@anyware.software (control) → 200
- 2026-11-10T08:27:07.731Z CREATED task d520655a-3a31-4796-bd33-b639e4456e56 (QA RT BUG dept task, dept HR, ticket 372b88df-6733-4c61-a774-0202a0148fd5) → 201
- 2026-11-10T08:27:08.037Z CREATED call 98f86824-ecb2-4a2a-acbe-9fa12435cd27 (QA RT BUG dept call, dept HR, ticket 372b88df-6733-4c61-a774-0202a0148fd5) → 201
- 2026-11-10T08:27:16Z sign-in index 1 (Customer Experience Specialists 2, Desk Agent; depts Customer Support, QA NDC Manual Invoice, QA RT14 2754 Dept A — not HR) once → scratchpad laneE-agent.json
- 2026-11-10T08:38:29.521Z DELETE call 98f86824-ecb2-4a2a-acbe-9fa12435cd27 → 204
- 2026-11-10T08:38:29.770Z DELETE task d520655a-3a31-4796-bd33-b639e4456e56 → 204
- 2026-11-10T08:38:30.117Z DELETE ticket 372b88df-6733-4c61-a774-0202a0148fd5 → 204
- 2026-11-10T08:38:30.530Z DELETE contact daf6afa2-d952-41f6-afbb-f7223e49408a → 204
- 2026-11-10T08:38:34.637Z purge bin ids 89aa8ab9-1efd-4a2a-84cd-c868a0917259,05e85168-af46-4582-aacb-b3a72b8378bb,4c92360a-a337-4d5e-827a-d8012b6d7274,be8cb1de-cf7c-42bb-9b35-33144b8b17e7 → 200
- 2026-11-10T08:38:38.809Z verify call 404, task 404, ticket 404, contact 404; bin matches left 0
- 2026-11-10T08:38:53Z DELETE draft (safety) on ticket → 204; state files laneE-owner.json, laneE-agent.json and bundle copy deleted from scratchpad. Lane E done.

## Filed 10 Nov 2026
- NDC-2830 (fb89a802-703b-4abc-9493-7d75bff891b6) bug B, High: agent sees other departments' activities. Bug state, 4 assignees, labels Activities + Access Control, Desk, Sprint 15, relates to NDC-2635, image attached.
- NDC-2831 (e1f0ce80-c722-46b1-b218-b588e5d1b3c3) bug A, Low: composer refuses reserved-domain address. Labels Tickets + Email Channel, Desk, Sprint 15, relates to NDC-2636, image attached.
