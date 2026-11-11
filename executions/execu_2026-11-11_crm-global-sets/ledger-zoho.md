2026-11-11T09:37:54.527Z global set QA GS1111 Tier 7687862000000750031
2026-11-11T09:37:56.570Z global set html 7687862000000750040
2026-11-11T09:38:13.764Z Leads field QA GS1111 Tier 7687862000000750045
2026-11-11T09:38:14.424Z Contacts field QA GS1111 Tier 7687862000000750057
2026-11-11T09:38:15.102Z Leads field QA GS1111 Multi 7687862000000750070
2026-11-11T09:38:16.119Z Leads field QA GS1111 Local 7687862000000750079
2026-11-11T09:38:47.600Z Lead QA GS1111 L1 7687862000000750090
2026-11-11T09:38:47.611Z Lead QA GS1111 L2 7687862000000750091
2026-11-11T09:38:47.621Z Lead QA GS1111 L3 7687862000000750092
2026-11-11T09:38:49.230Z Contact QA GS1111 C1 7687862000000750096
2026-11-11T09:38:49.874Z Lead QA GS1111 Lbad 7687862000000750098
2026-11-11T09:39:02.511Z Leads custom view QA GS1111 Silver view 7687862000000750102
2026-11-11T09:39:02.938Z field update QA GS1111 set Silver 7687862000000750107
2026-11-11T09:39:30.004Z workflow rule QA GS1111 Bronze rule 7687862000000750111
2026-11-11T10:48:55.767Z CLEANUP {"wf":"200 {\"workflow_rules\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750111\"},\"message\":\"WorkFlow Rule deleted successfull","fu":"200 {\"field_updates\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750107\"},\"message\":\"field update deleted successfully\"","cv":"400 {\"code\":\"INVALID_REQUEST_METHOD\",\"details\":{},\"message\":\"The http request method type is not a valid one\",\"status\":\"erro","leads":"200 {\"data\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750090\"},\"message\":\"record deleted\",\"status\":\"success\"},{\"code\"","contact":"200 {\"data\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750096\"},\"message\":\"record deleted\",\"status\":\"success\"}]}","fields":{"7687862000000750045":"400 {\"code\":\"NOT_ALLOWED\",\"details\":{\"resource_path_index\":2},\"message\":\"The custom field has already used in other places\",","7687862000000750057":"200 {\"fields\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750057\"},\"message\":\"field deleted\",\"status\":\"success\"}]}","7687862000000750070":"200 {\"fields\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750070\"},\"message\":\"field deleted\",\"status\":\"success\"}]}","7687862000000750079":"200 {\"fields\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750079\"},\"message\":\"field deleted\",\"status\":\"success\"}]}"},"sets":{"7687862000000750031":"202 {\"global_picklists\":[{\"code\":\"SCHEDULED\",\"details\":{\"job_id\":\"7687862000000750595\"},\"message\":\"global picklist delete sc","7687862000000750040":"202 {\"global_picklists\":[{\"code\":\"SCHEDULED\",\"details\":{\"job_id\":\"7687862000000750596\"},\"message\":\"global picklist delete sc"}}
2026-11-11T10:49:21.472Z CLEANUP2 {"/crm/v8/settings/custom_views?ids=7687862000000750102&module=Leads":"200 {\"custom_views\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750102\"},\"message\":\"deleted successfully\",\"status\":\"suc","fieldNow":{"gp":null,"vals":"-None-/Gold/Tmp1/Tmp2/Silver Plus"},"field":"200 {\"fields\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750045\"},\"message\":\"field deleted\",\"status\":\"success\"}]}","setsLeft":["Source","Industry","Team Member Role","Access","Country__s","States__s","QA RT15 GS Colors","QA GS1111 <b>x</b>"]}
2026-11-11T13:43:38.163Z R3 set QA GS1111 Z3 7687862000000750882
2026-11-11T13:43:38.857Z R3 Leads field QA GS1111 Z3P 7687862000000750889
2026-11-11T13:43:39.483Z R3 Leads field QA GS1111 Z3C 7687862000000750902
2026-11-11T13:43:42.083Z R3 map dependency undefined
2026-11-11T13:43:44.340Z R3 Lead 7687862000000750913
2026-11-11T13:43:44.353Z R3 Lead 7687862000000750914
2026-11-11T13:43:44.364Z R3 Lead 7687862000000750915
2026-11-11T13:44:02.637Z R3 map dependency 7687862000000750919
2026-11-11T13:48:15.816Z R3 report QA GS1111 Z3 Gold report 7687862000000750922
2026-11-11T13:52:24.375Z R3 CLEANUP {"report":"400 {\"code\":\"INVALID_REQUEST\",\"details\":{},\"message\":\"unable to process your request. please verify whet","map":"200 {\"map_dependency\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750919\"},\"message\":\"map dependenc","leads":"200 {\"data\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750913\"},\"message\":\"record deleted\",\"status","fc":"200 {\"fields\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750902\"},\"message\":\"field deleted\",\"statu","fp":"400 {\"code\":\"NOT_ALLOWED\",\"details\":{\"resource_path_index\":2},\"message\":\"The custom field has already us","set":"202 {\"global_picklists\":[{\"code\":\"SCHEDULED\",\"details\":{\"job_id\":\"7687862000000750934\"},\"message\":\"globa"}
2026-11-11T13:55:17.283Z R3 CLEANUP report deleted (Recently Deleted folder); field 400 {"code":"NOT_ALLOWED","details":{"resource_path_index":2},"message":"The custom field has already used in other places",; sets now Source,Industry,Team Member Role,Access,Country__s,States__s
2026-11-11T13:56:39.432Z R3 CLEANUP report purged; {"field":"200 {\"fields\":[{\"code\":\"SUCCESS\",\"details\":{\"id\":\"7687862000000750889\"},\"message\":\"field deleted\",\"status\":\"success\"}]}","qaFieldsLeft":[],"qaContactsLeft":[],"qaLeadsLeft":0,"sets":["Source","Industry","Team Member Role","Access","Country__s","States__s"]}
2026-11-11T14:10:50.682Z MS set QA GS1111 MS 7687862000000750938
2026-11-11T14:10:51.400Z MS Leads field QA GS1111 MS New 7687862000000750945
2026-11-11T14:10:52.045Z MS Leads field QA GS1111 MS Local 7687862000000750954
2026-11-11T14:23:06.524Z MS CLEANUP {"f1":200,"f2":200,"set":202,"leftFields":[],"sets":["Source","Industry","Team Member Role","Access","Country__s","States__s","Colors"]}
