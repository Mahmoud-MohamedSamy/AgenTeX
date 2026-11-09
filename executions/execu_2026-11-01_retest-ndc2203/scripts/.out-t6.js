{
 "agentSkillsBefore": [
  "account_management",
  "billing",
  "product_expertise"
 ],
 "skillBefore": "{\"conditions\":[],\"pattern\":null}",
 "saveSkill": "200",
 "skillStored": "{\"conditions\":[{\"field_key\":\"subject\",\"operator\":\"contains\",\"value\":\"SKILLQA\"}],\"pattern\":null}",
 "ruleB13": 201,
 "agentHasSkill": true,
 "ruleB14": 201,
 "B13match": {
  "skills": [
   "product_expertise"
  ],
  "run": [
   "RecalculateTicketSkills:Succeeded {\"skills\":[\"product_expertise\"],\"changed\":true,\"skipped\":[]}"
  ],
  "n": "738"
 },
 "B13plain": {
  "run": [
   "RecalculateTicketSkills:Succeeded {\"skills\":[],\"changed\":false,\"skipped\":[]}"
  ],
  "n": "739"
 },
 "B14": {
  "adminRead": 403,
  "ownerIsAgent": false,
  "run": [
   "RecalculateTicketSkills:Succeeded {\"skills\":[\"product_expertise\"],\"changed\":true,\"skipped\":[]}",
   "ReassignTicketBySkills:Succeeded {\"reassigned\":true,\"owner_id\":\"9d182dfa-05f3-4af7-9685-8615a2fbe537\",\"reason\":null}"
  ],
  "id": "aad01815-63d7-4890-807f-2dd11e7b6b91"
 },
 "restoreCriteria": 200,
 "agentSkillsAfter": [
  "account_management",
  "billing",
  "product_expertise"
 ],
 "skillAfter": "{\"conditions\":[],\"pattern\":null}",
 "created": [
  {
   "k": "rule",
   "id": "d30def64-719b-47c5-a59f-4bfbe7b2adb9",
   "tag": "B13",
   "at": "2026-11-01T15:05:39.781Z"
  },
  {
   "k": "ticket",
   "id": "d7359380-cd14-4e91-8ec3-3f32d80881c2",
   "tag": "B13",
   "at": "2026-11-01T15:05:41.317Z"
  },
  {
   "k": "ticket",
   "id": "3e4eff01-8175-4d4d-b572-423f1af847cf",
   "tag": "B13",
   "at": "2026-11-01T15:05:43.060Z"
  },
  {
   "k": "rule",
   "id": "5bde0d0b-2c4a-43d4-bd08-5300cf7c873b",
   "tag": "B14",
   "at": "2026-11-01T15:05:43.485Z"
  },
  {
   "k": "ticket",
   "id": "aad01815-63d7-4890-807f-2dd11e7b6b91",
   "tag": "B14",
   "at": "2026-11-01T15:05:44.389Z"
  }
 ]
}
