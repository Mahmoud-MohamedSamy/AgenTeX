package qa.features.deskassignmentrules.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskassignmentrules.DeskAssignmentRulesFeature;

import java.util.List;

/** Setup › Customization › Skills: tabs Skills / Skill Types / Agent Skills, department picker, search and status filter. */
public class SkillsSetupPage extends BasePage {

    public SkillsSetupPage() {
        super(DeskAssignmentRulesFeature.NAME);
    }

    public SkillsSetupPage open() {
        open(DeskAssignmentRulesFeature.SKILLS_PATH);
        if (!isShown("heading", 60)) {
            driver.navigate().refresh();
            el("heading");
        }
        Waits.sleep(2000);
        return this;
    }

    public SkillsSetupPage department(String name) {
        if (!text("departmentButton").contains(name)) {
            click("departmentButton");
            click("option", name);
            Waits.sleep(2500);
        }
        return this;
    }

    public SkillsSetupPage tab(String name) {
        click("tab", name);
        Waits.sleep(2500);
        return this;
    }

    public SkillsSetupPage search(String text) {
        type("searchSkills", text);
        Waits.sleep(1500);
        return this;
    }

    public SkillsSetupPage searchAgents(String text) {
        type("searchAgents", text);
        Waits.sleep(1500);
        return this;
    }

    public List<String> statusOptions() {
        click("statusButton");
        Waits.sleep(800);
        List<String> o = driver.findElements(By.cssSelector("[role=option]")).stream().filter(WebElement::isDisplayed)
                .map(e -> e.getText().trim()).toList();
        return o;
    }

    public SkillsSetupPage status(String option) {
        click("statusButton");
        click("option", option);
        Waits.sleep(1500);
        return this;
    }

    /** Names of the skill rows shown (the row title buttons, next to "Drag <name> to change its place"). */
    public List<String> skillRows() {
        return driver.findElements(By.xpath("//main//button[starts-with(@aria-label,'Drag ') and contains(@aria-label,'to change its place')]"))
                .stream().map(e -> e.getAttribute("aria-label").replaceFirst("^Drag ", "").replaceFirst(" to change its place$", "")).toList();
    }

    public String mainText() {
        return driver.findElement(By.tagName("main")).getText();
    }

    public long liveImgOnerror() {
        return ((Number) ((JavascriptExecutor) driver).executeScript("return document.querySelectorAll('img[onerror]').length;")).longValue();
    }
}
