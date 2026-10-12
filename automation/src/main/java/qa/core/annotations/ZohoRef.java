package qa.core.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Reference screenshot of the same behaviour in the product being cloned (Zoho), relative to the
 * feature's resource folder: @ZohoRef("zoho/triggers.png"). On failure the listener builds a
 * side-by-side "app vs reference" image. Passed tests get no screenshots.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ZohoRef {
    String value();

    /** What the reference shows, printed under the image. */
    String note() default "";
}
