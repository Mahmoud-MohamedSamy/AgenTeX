package qa.features.deskautomationorder.pages;

import qa.core.base.BasePage;
import qa.features.deskautomationorder.DeskAutomationOrderFeature;

/**
 * Notification Rules — Desk automation order.
 * Element keys live in src/test/resources/features/deskautomationorder/locators.json under "NotificationRulesPage".
 * Methods are user intentions (createRule, openRow), not raw clicks; tests never touch locators.
 */
public class NotificationRulesPage extends BasePage {

    public NotificationRulesPage() {
        super(DeskAutomationOrderFeature.NAME);
    }
}
