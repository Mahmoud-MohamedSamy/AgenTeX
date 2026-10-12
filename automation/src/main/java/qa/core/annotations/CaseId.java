package qa.core.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** Test-spec case id(s) this test covers, e.g. @CaseId("WFR-012"). Shown in Allure and evidence names. */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface CaseId {
    String[] value();
}
