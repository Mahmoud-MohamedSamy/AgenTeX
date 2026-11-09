package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.owner;

/**
 * Round 2 Wave 1: read-only snapshot of everything the wave can touch (users, profiles and their permissions, user
 * overrides, org units, Leads field permissions, record visibility per module, teamspaces, the hierarchy and session
 * settings), written as one JSON object to -Dw1.out. Run before and after the wave; diff the two files.
 */
public class R2W1SnapshotTest {

    private static String body(String path) {
        Response r = owner().get(path);
        String b = r.asString();
        return r.statusCode() / 100 == 2 && b != null && !b.isBlank() ? b : "{\"status\":" + r.statusCode() + "}";
    }

    @Test(groups = {"crmaccess", "r2w1", "snapshot"})
    public void snapshot() throws Exception {
        StringBuilder s = new StringBuilder("{\n");
        s.append("\"users\":").append(body("/iam/users?limit=200")).append(",\n");
        s.append("\"profiles\":").append(body("/iam/profiles")).append(",\n");
        s.append("\"orgUnits\":").append(body("/iam/org-units")).append(",\n");
        s.append("\"leadsFieldPermissions\":").append(body("/modules/" + CrmAccessFeature.LEADS + "/field-permissions")).append(",\n");
        s.append("\"teamspaces\":").append(body("/teamspaces")).append(",\n");
        s.append("\"hierarchyMode\":").append(body(qa.features.crmhierarchy.CrmHierarchyFeature.RESOLVED)).append(",\n");
        for (String k : List.of("idle_timeout_minutes", "absolute_timeout_minutes", "max_concurrent"))
            s.append("\"session_").append(k).append("\":").append(body("/settings/resolved?app_key=iam&key=iam.security.session." + k + "&scope_type=Org")).append(",\n");
        // per-profile permissions and per-user overrides
        s.append("\"profilePermissions\":{");
        List<Map<String, Object>> profiles = CrmUser.ok(owner().get("/iam/profiles"), "profiles").jsonPath().getList("data");
        boolean first = true;
        for (Map<String, Object> p : profiles) {
            String id = String.valueOf(p.get("profileId") != null ? p.get("profileId") : p.get("id"));
            s.append(first ? "" : ",").append("\n\"").append(id).append("\":").append(body("/iam/profiles/" + id + "/permissions"));
            first = false;
        }
        s.append("},\n\"overrides\":{");
        first = true;
        for (Map<String, Object> u : CrmHierarchyApi.users()) {
            String id = String.valueOf(u.get("userId"));
            s.append(first ? "" : ",").append("\n\"").append(id).append("\":").append(body("/iam/users/" + id + "/overrides"));
            first = false;
        }
        s.append("},\n\"recordVisibility\":{");
        first = true;
        for (Map<String, Object> mo : CrmUser.ok(owner().get("/modules"), "modules").jsonPath().<Map<String, Object>>getList("data")) {
            String id = String.valueOf(mo.get("id"));
            s.append(first ? "" : ",").append("\n\"").append(id).append("\":").append(body("/modules/" + id + "/record-visibility"));
            first = false;
        }
        s.append("}\n}\n");
        Path out = Path.of(System.getProperty("w1.out", "target/r2w1-snapshot.json"));
        Files.createDirectories(out.toAbsolutePath().getParent());
        Files.writeString(out, s.toString(), StandardCharsets.UTF_8);
        System.out.println("[snapshot] wrote " + out.toAbsolutePath() + " (" + s.length() + " chars, " + profiles.size() + " profiles)");
    }
}
