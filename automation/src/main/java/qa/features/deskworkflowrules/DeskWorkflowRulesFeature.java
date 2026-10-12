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

    /** The editor restores unsaved work from localStorage under this prefix + moduleId. */
    public static final String DRAFT_KEY_PREFIX = "workflow-rule-draft-";
}
