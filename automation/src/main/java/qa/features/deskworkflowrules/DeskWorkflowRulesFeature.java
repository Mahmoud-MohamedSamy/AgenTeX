package qa.features.deskworkflowrules;

/** Constants shared by the Desk Workflow Rules pages, API helper and tests. */
public final class DeskWorkflowRulesFeature {
    /** Folder name under src/test/resources/features/ and the locators.json owner. */
    public static final String NAME = "deskworkflowrules";

    private DeskWorkflowRulesFeature() {
    }

    public static final String LIST_PATH = "/settings/automation/workflow-rules";
    public static final String NEW_RULE_PATH = "/settings/automation/workflow-rules/new?moduleId=";
    public static final String EXECUTIONS_PATH = "/settings/workflow-executions";
    public static final String DESK_ROLES_PATH = "/settings/roles";

    /** Tickets module on desk.anyware.software (same id as staging). */
    public static final String TICKETS_MODULE_ID = "88e8ea44-1658-4df3-9930-d0902b91073d";

    /** Standard layout of Tickets (staging). */
    public static final String STANDARD_LAYOUT_ID = "1b55c25d-eb27-4046-afd1-b292398b435b";
    /** Calls module (Create Record target) and its Standard layout (staging). */
    public static final String CALLS_MODULE_ID = "f7e488b5-0232-42fd-811c-1f24356af653";
    public static final String CALLS_LAYOUT_ID = "fdb13486-6c74-4a80-8401-c9a25255dfe1";
    /** Default department "Customer Support" (tags are per department; API-created tickets land here). */
    public static final String DEFAULT_DEPARTMENT_ID = "7e1ac409-58b0-41ab-97e1-0e7d5c8c5158";
    /** Department for every QA ticket and tag: Tech (spec 1.2; teammates test assignment in Customer Support). */
    public static final String QA_DEPARTMENT_ID = "19510fdc-91f3-4a7a-8888-153f1318b765";
    public static final String SETTINGS_ACTIONS_PATH = "/settings/automation/actions";
    /** Every QA rule, action, tag and ticket subject starts with this; every QA rule has the guard condition subject starts with it. */
    public static final String QA = "QA WF ";

    /** The editor restores unsaved work from localStorage under this prefix + moduleId. */
    public static final String DRAFT_KEY_PREFIX = "workflow-rule-draft-";
}
