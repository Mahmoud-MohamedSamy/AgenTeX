package qa.features.deskskills.pages;

import qa.core.base.BasePage;
import qa.features.deskskills.DeskSkillsFeature;

/**
 * Skills — Desk Skills (parity vs Zoho Desk).
 * Element keys live in src/test/resources/features/deskskills/locators.json under "SkillsPage".
 * Methods are user intentions (createRule, openRow), not raw clicks; tests never touch locators.
 */
public class SkillsPage extends BasePage {

    public SkillsPage() {
        super(DeskSkillsFeature.NAME);
    }
}
