package qa.core.evidence;

import io.qameta.allure.Allure;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import qa.core.config.Config;

import javax.imageio.ImageIO;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Failure evidence only (passed tests get none). Writes target/evidence/{case}/app.png and, when the
 * test has a @ZohoRef, {case}-vs-zoho.png: the app on the left, the reference product on the right.
 */
public final class Evidence {
    private Evidence() {
    }

    public static Path dir(String caseName) {
        return Config.projectDir().resolve(Config.get("evidence.dir", "target/evidence")).resolve(caseName.replaceAll("[^A-Za-z0-9._-]", "_"));
    }

    public static byte[] screenshot(WebDriver driver, String caseName) {
        try {
            byte[] png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            Path d = dir(caseName);
            Files.createDirectories(d);
            Files.write(d.resolve("app.png"), png);
            Allure.addAttachment("App at failure", "image/png", new ByteArrayInputStream(png), ".png");
            return png;
        } catch (Exception e) {
            System.err.println("[evidence] screenshot failed: " + e.getMessage());
            return null;
        }
    }

    public static void sideBySide(byte[] appPng, Path referencePng, String caseName, String verdict, String note) {
        if (appPng == null || referencePng == null || !Files.exists(referencePng)) return;
        try {
            BufferedImage a = ImageIO.read(new ByteArrayInputStream(appPng));
            BufferedImage z = ImageIO.read(referencePng.toFile());
            int panelW = 900;
            BufferedImage sa = scale(a, panelW), sz = scale(z, panelW);
            int head = 70, foot = note == null || note.isEmpty() ? 0 : 40, gap = 20;
            int h = Math.max(sa.getHeight(), sz.getHeight());
            BufferedImage out = new BufferedImage(panelW * 2 + gap * 3, head + h + foot + gap * 2, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = out.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, out.getWidth(), out.getHeight());
            g.setColor(new Color(0xB00020));
            g.fillRect(0, 0, out.getWidth(), 40);
            g.setColor(Color.WHITE);
            g.setFont(new Font("SansSerif", Font.BOLD, 20));
            g.drawString(caseName + " — " + verdict, gap, 27);
            g.setColor(Color.DARK_GRAY);
            g.setFont(new Font("SansSerif", Font.BOLD, 16));
            g.drawString("App under test", gap, head - 8);
            g.drawString("Reference (Zoho)", panelW + gap * 2, head - 8);
            g.drawImage(sa, gap, head, null);
            g.drawImage(sz, panelW + gap * 2, head, null);
            g.setStroke(new BasicStroke(2));
            g.setColor(new Color(0xB00020));
            g.drawRect(gap, head, sa.getWidth(), sa.getHeight());
            g.setColor(new Color(0x2E7D32));
            g.drawRect(panelW + gap * 2, head, sz.getWidth(), sz.getHeight());
            if (foot > 0) {
                g.setColor(Color.BLACK);
                g.setFont(new Font("SansSerif", Font.PLAIN, 15));
                g.drawString(note, gap, head + h + gap + 20);
            }
            g.dispose();
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ImageIO.write(out, "png", bos);
            Path d = dir(caseName);
            Files.createDirectories(d);
            Files.write(d.resolve(caseName.replaceAll("[^A-Za-z0-9._-]", "_") + "-vs-zoho.png"), bos.toByteArray());
            Allure.addAttachment("App vs Zoho", "image/png", new ByteArrayInputStream(bos.toByteArray()), ".png");
        } catch (Exception e) {
            System.err.println("[evidence] side-by-side failed: " + e.getMessage());
        }
    }

    private static BufferedImage scale(BufferedImage src, int w) {
        int h = (int) Math.round(src.getHeight() * (w / (double) src.getWidth()));
        BufferedImage out = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = out.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(src, 0, 0, w, h, null);
        g.dispose();
        return out;
    }
}
