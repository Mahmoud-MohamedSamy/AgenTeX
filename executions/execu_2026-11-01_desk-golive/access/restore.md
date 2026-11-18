# Restore list (access run 17 Nov)
- Customer Support agent_user_ids original: 2a7c1bc4-f6d4-4bd3-805e-0496ece13987, 5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1, 7e5e7c27-46e4-4bf6-b021-7bd219d34472, 97be04b6-0a08-4883-aa51-e1650b11cab7, 9d182dfa-05f3-4af7-9685-8615a2fbe537; view-only: 7e5e7c27-46e4-4bf6-b021-7bd219d34472. Added D 876ce871, E 23f0f9d7 → remove.
- Team QA AC Team 9e444340-ef59-455b-80a1-16b321592447 → delete.
- D (Test User 1 876ce871) profile original: Desk Supervisor (…404), org unit Manager d46e0424.
- Ticket access original: record_visibility hierarchy (Private), public_scope departments, peer_sharing_role_ids [].
- D profile set with POST /iam/users/D/profiles {profile_id, scope_id: MGR, replace:true}; restore same call with Supervisor …404.
- Override GRANT desk:ticket:share on C (9d182dfa) → DELETE /iam/users/C/overrides/desk%3Aticket%3Ashare?app_key=desk
- Overrides on D: DENY view_unassigned, GRANT all_departments, DENY move → delete all 3. Set 12:03:48.
