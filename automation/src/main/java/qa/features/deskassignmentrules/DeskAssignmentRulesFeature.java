package qa.features.deskassignmentrules;

/**
 * Desk Assignment Rules (Direct + Round Robin + Round Robin Preferences + Skills) on NDC-Staging (tenant ...0004).
 * Fixed ids learned in the 19 Nov 2026 full run (executions/execu_2026-11-19_assignment-rules-full).
 */
public final class DeskAssignmentRulesFeature {
    public static final String NAME = "deskassignmentrules";

    public static final String PAGE_PATH = "/settings/automation/assignment-rules";
    public static final String RR_PATH = "/settings/automation/assignment-rules?view=round-robin";
    public static final String SKILLS_PATH = "/settings/customization/skills";
    public static final String NOTIFICATIONS_SETUP_PATH = "/settings/customization/notifications";

    /** Module ids. */
    public static final String TICKETS = "88e8ea44-1658-4df3-9930-d0902b91073d";
    public static final String CONTACTS = "43004ce2-577f-4eda-b00a-0750fe40c3d4";
    public static final String ACCOUNTS = "784400e1-4a2a-42c2-b4f3-7ca56e79828a";
    public static final String NEW_TICKET_PATH = "/modules/" + TICKETS + "/records/new";

    /** QA departments: QA AS6 Dept A / Dept B. */
    public static final String DA = "b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6";
    public static final String DB = "ce1d8a43-07df-4b37-891c-cc8b2eceec6f";
    public static final String DA_NAME = "QA AS6 Dept A";
    public static final String DB_NAME = "QA AS6 Dept B";

    /** A1 = Test User 1 (signs in), A2 = Mahmoud Samy (signs in), A3 = Dev Team 2 (cannot sign in: always offline). */
    public static final String A1 = "876ce871-2b02-4854-89a7-68050391c62b";
    public static final String A2 = "d23fb4e0-248d-41f6-af60-d28885a7007e";
    public static final String A3 = "5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4";
    public static final String A1_NAME = "Test User 1";
    public static final String A2_NAME = "Mahmoud Samy";
    public static final String A3_NAME = "Dev Team 2";
    /** An agent who is in neither QA department. */
    public static final String OUTSIDER = "9d182dfa-05f3-4af7-9685-8615a2fbe537";
    /** QA AS6 Team A (Dept A): A2 + A3. */
    public static final String TEAM_A = "434140a3-2145-428c-9e57-e6bc5cf2f8d0";
    public static final String TEAM_A_NAME = "QA AS6 Team A";

    /** Detached holiday list "QA AS6 HOL today" (only holiday 7 Nov) and the default business-hours profile. */
    public static final String HOLIDAY_LIST = "3bf42474-8564-47ae-9aa4-3b70b3907c4d";
    public static final String BUSINESS_HOURS = "a0302234-3896-41de-9b85-443a555a7131";

    /** Credential labels (name column of docs/Credentials/TAVI Desk Credentials.csv). */
    public static final String OWNER_LABEL = "ndc-staging-owner";
    public static final String A1_LABEL = "Test User 1";
    public static final String A2_LABEL = "Mahmoud Samy";
    /** Desk agent profile without desk:assignment:manage. */
    public static final String NO_PERMISSION_LABEL = "Customer Experience Specialists 2";

    /** Every record this feature creates starts with this prefix. */
    public static final String PREFIX = "QA AR ";

    private DeskAssignmentRulesFeature() {
    }
}
