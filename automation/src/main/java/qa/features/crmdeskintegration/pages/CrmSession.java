package qa.features.crmdeskintegration.pages;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import qa.core.auth.AuthManager;
import qa.core.base.Waits;
import qa.features.crmdeskintegration.CrmDeskFeature;

/**
 * The Desk session works on the CRM host too: the token cookies live on .taviportal.com (login feature map). Only the
 * per-origin localStorage key aw_auth_tenant_id has to be copied once to the CRM origin. No second login.
 */
final class CrmSession {
    private CrmSession() {
    }

    static void ensure(WebDriver d) {
        Object tenant = ((JavascriptExecutor) d).executeScript("return localStorage.getItem('aw_auth_tenant_id');");
        d.get(CrmDeskFeature.CRM + "/");
        Waits.pageReady(d);
        ((JavascriptExecutor) d).executeScript("localStorage.setItem('aw_auth_tenant_id', arguments[0]);",
                tenant != null ? tenant.toString() : CrmDeskFeature.TENANT);
        Waits.sleep(1000);
        if (AuthManager.onLoginPage(d)) {
            d.get(CrmDeskFeature.CRM + "/");
            Waits.pageReady(d);
        }
        if (Waits.until(() -> AuthManager.onLoginPage(d), 8))
            throw new IllegalStateException("The Desk session is not accepted on the CRM host (landed on " + d.getCurrentUrl() + ")");
    }
}
