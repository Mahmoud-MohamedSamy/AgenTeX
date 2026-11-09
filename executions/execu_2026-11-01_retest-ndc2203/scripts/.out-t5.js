{
 "before": {
  "is_enabled": false,
  "trigger": "on_close"
 },
 "enable": "200",
 "rules": {
  "all": 201,
  "good": 201,
  "bad": 201
 },
 "sendRule": 201,
 "send": {
  "good": [
   "SendHappinessEmail:Succeeded {\"sent\":true,\"reason\":null}"
  ],
  "bad": [
   "SendHappinessEmail:Succeeded {\"sent\":true,\"reason\":null}"
  ]
 },
 "token": {
  "good": null,
  "bad": null
 },
 "rate": {
  "good": "no token found",
  "bad": "no token found"
 },
 "fired": {
  "good": {
   "comments": "",
   "rules": [
    "7fcc48ea:Fired"
   ]
  },
  "bad": {
   "comments": "",
   "rules": [
    "7fcc48ea:Fired"
   ]
  }
 },
 "tickets": {
  "good": "429ccfc6-180f-4fb3-93d0-82cf8fce0683",
  "bad": "2876285e-21dd-4a1f-8e9c-8d52b1239478"
 },
 "n_429c": "736",
 "n_2876": "737",
 "restore": "200",
 "after": false,
 "created": [
  {
   "k": "rule",
   "id": "1ea33f1f-5331-4484-9209-ca2ad7bbdf53",
   "tag": "H5all",
   "at": "2026-11-01T14:44:35.455Z"
  },
  {
   "k": "rule",
   "id": "3b8a5feb-410d-4054-9f6e-a79161d09320",
   "tag": "H5good",
   "at": "2026-11-01T14:44:37.606Z"
  },
  {
   "k": "rule",
   "id": "673db8ef-fec8-437f-acde-c0aac202186c",
   "tag": "H5bad",
   "at": "2026-11-01T14:44:38.225Z"
  },
  {
   "k": "rule",
   "id": "7fcc48ea-1229-4edd-bdcc-658f7007f2d8",
   "tag": "H5send",
   "at": "2026-11-01T14:44:38.936Z"
  },
  {
   "k": "ticket",
   "id": "429ccfc6-180f-4fb3-93d0-82cf8fce0683",
   "tag": "H5 good",
   "at": "2026-11-01T14:44:43.551Z"
  },
  {
   "k": "ticket",
   "id": "2876285e-21dd-4a1f-8e9c-8d52b1239478",
   "tag": "H5 bad",
   "at": "2026-11-01T14:44:45.086Z"
  }
 ]
}
