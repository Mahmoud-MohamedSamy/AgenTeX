package qa.core.listeners;

import org.testng.IMethodInstance;
import org.testng.IMethodInterceptor;
import org.testng.ITestContext;
import qa.core.annotations.CaseId;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Narrows any suite from the command line (registered through META-INF/services):
 *   -Dfeature=deskworkflowrules      only that feature's package
 *   -Dtags=smoke,NDC-2205            tests in ANY of these TestNG groups (bug ids are groups)
 *   -Dcases=WFR-001,WFR-014          tests carrying these @CaseId values
 */
public class TagFilter implements IMethodInterceptor {
    @Override
    public List<IMethodInstance> intercept(List<IMethodInstance> methods, ITestContext context) {
        String feature = prop("feature");
        Set<String> tags = set(prop("tags"));
        Set<String> cases = set(prop("cases"));
        return methods.stream().filter(m -> {
            var tm = m.getMethod();
            if (!feature.isEmpty() && !tm.getRealClass().getPackageName().contains(".features." + feature.toLowerCase())) return false;
            if (!tags.isEmpty() && Arrays.stream(tm.getGroups()).noneMatch(g -> tags.contains(g.toLowerCase()))) return false;
            if (!cases.isEmpty()) {
                CaseId c = tm.getConstructorOrMethod().getMethod().getAnnotation(CaseId.class);
                return c != null && Arrays.stream(c.value()).anyMatch(v -> cases.contains(v.toLowerCase()));
            }
            return true;
        }).collect(Collectors.toList());
    }

    private static String prop(String k) {
        String v = System.getProperty(k);
        return v == null ? "" : v.trim();
    }

    private static Set<String> set(String csv) {
        return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).map(String::toLowerCase).collect(Collectors.toSet());
    }
}
