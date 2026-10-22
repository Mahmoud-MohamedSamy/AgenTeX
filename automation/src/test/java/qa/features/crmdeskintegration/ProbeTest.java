package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.testng.annotations.Test;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * Exploration helper (GET only): one API sign-in per account, then every line of target/probe-in.txt
 * ("crm|desk GET /path", optional "as <email>" suffix) is called and the body saved to target/probe/NN.json.
 * Run: mvnw test -Dtest=ProbeTest -Dgroups=probe
 */
public class ProbeTest {
    @Test(groups = "probe")
    public void probe() throws Exception {
        Path in = Path.of("target/probe-in.txt");
        Path out = Path.of("target/probe");
        Files.createDirectories(out);
        List<String> lines = Files.readAllLines(in);
        int n = 0;
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty() || line.startsWith("#")) continue;
            String who = CrmDeskFeature.OWNER;
            int as = line.indexOf(" as ");
            if (as > 0) {
                who = line.substring(as + 4).trim();
                line = line.substring(0, as).trim();
            }
            String[] p = line.split("\\s+", 3);
            AppUser u = AppUser.as(who);
            AppUser.App app = "crm".equals(p[0]) ? u.crm() : u.desk();
            long t0 = System.currentTimeMillis();
            Response r = "GET".equals(p[1]) ? app.get(p[2]) : null;
            long ms = System.currentTimeMillis() - t0;
            if (r == null) throw new IllegalArgumentException("GET only: " + line);
            n++;
            String body = r.asString();
            if (body.length() > 600000) body = body.substring(0, 600000) + "…[cut]";
            Files.writeString(out.resolve(String.format("%02d.json", n)), line + "\n" + r.statusCode() + "\n" + body, StandardCharsets.UTF_8);
            System.out.println("[probe] " + String.format("%02d", n) + " " + r.statusCode() + " " + ms + "ms " + line + " (" + r.asString().length() + " bytes)");
        }
    }
}
