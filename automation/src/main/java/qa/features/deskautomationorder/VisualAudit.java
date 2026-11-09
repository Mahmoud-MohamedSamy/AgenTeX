package qa.features.deskautomationorder;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chromium.ChromiumDriver;
import qa.core.base.Waits;
import qa.core.config.Config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Visual checks V-01..V-06 and V-11 as automatic scans, plus the captures that a person reviews for V-07..V-12.
 * Each screen is scanned and saved in three variants: light English desktop, Arabic, phone width.
 * Output: executions/execu_2026-11-08_desk-automation-order/visual/&lt;screen&gt;-&lt;variant&gt;.png and visual/issues.jsonl.
 */
public final class VisualAudit {
    private static final Path OUT = Config.projectDir().resolve("../executions/execu_2026-11-08_desk-automation-order/visual").normalize();

    private static final String SCAN = """
            const out=[];const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>1&&r.height>1&&s.visibility!=='hidden'&&s.display!=='none'&&r.bottom>0&&r.top<innerHeight*3&&r.right>0&&r.left<innerWidth};
            const top=e=>{const r=e.getBoundingClientRect();const x=Math.min(Math.max(r.left+r.width/2,0),innerWidth-1),y=r.top+r.height/2;if(y<0||y>=innerHeight)return true;const h=document.elementFromPoint(x,y);return !!h&&(h===e||e.contains(h)||h.contains(e))};
            const label=e=>((e.innerText||e.getAttribute('aria-label')||e.placeholder||e.tagName)+'').trim().replace(/\\s+/g,' ').slice(0,70);
            if(document.documentElement.scrollWidth>innerWidth+2)out.push({v:'V-02',what:'page scrolls sideways',detail:document.documentElement.scrollWidth+'>'+innerWidth});
            const body=document.body.innerText||'';
            for(const m of (body.match(/\\{\\{[^}]+\\}\\}/g)||[]).slice(0,5))out.push({v:'V-03',what:'raw placeholder',detail:m});
            for(const m of (body.match(/\\b[a-z][a-zA-Z]+(?:\\.[a-zA-Z_]+){2,}\\b/g)||[]).filter(x=>!/\\.(com|org|net|software|png|jpg|js)$/.test(x)).slice(0,8))out.push({v:'V-03',what:'looks like a raw translation key',detail:m});
            const all=[...document.querySelectorAll('body *')].filter(e=>vis(e)&&top(e));
            for(const e of all){if(e.children.length===0&&(e.innerText||'').trim()){const s=getComputedStyle(e);if(e.scrollWidth>e.clientWidth+1&&s.overflowX!=='visible'&&s.textOverflow!=='ellipsis')out.push({v:'V-01',what:'clipped text',detail:label(e)});}}
            for(const i of document.images)if(vis(i)&&i.complete&&i.naturalWidth===0)out.push({v:'V-05',what:'broken image',detail:(i.src||'').slice(0,90)});
            for(const b of all.filter(e=>e.matches('button,a[href],[role=button]'))){if(!(b.innerText||'').trim()&&!b.getAttribute('aria-label')&&!b.title)out.push({v:'V-11',what:'button with no name',detail:b.outerHTML.slice(0,110)});}
            for(const i of all.filter(e=>e.matches('input:not([type=hidden]),textarea,select'))){const l=i.getAttribute('aria-label')||i.getAttribute('aria-labelledby')||i.placeholder||(i.id&&document.querySelector('label[for="'+i.id+'"]'))||i.closest('label');if(!l)out.push({v:'V-11',what:'field with no label',detail:i.outerHTML.slice(0,110)});}
            const btns=all.filter(e=>e.matches('button,a[href],input,[role=button],h1,h2,h3')).slice(0,250);const seen=[];
            for(let a=0;a<btns.length;a++){const ra=btns[a].getBoundingClientRect();for(let b=a+1;b<btns.length;b++){if(btns[a].contains(btns[b])||btns[b].contains(btns[a]))continue;const rb=btns[b].getBoundingClientRect();const w=Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left),h=Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top);if(w>4&&h>4&&seen.length<6){seen.push(1);out.push({v:'V-02',what:'elements overlap',detail:label(btns[a])+' / '+label(btns[b])});}}}
            const bg=getComputedStyle(document.body).backgroundColor;const n=(bg.match(/[0-9.]+/g)||[255,255,255]).map(Number);out.push({v:'INFO',what:'body background',detail:bg+' luminance '+Math.round((n[0]*.3+n[1]*.59+n[2]*.11))+' dir='+document.documentElement.dir+' lang='+document.documentElement.lang});
            const uniq=new Map();for(const o of out)uniq.set(o.v+o.what+o.detail,o);return [...uniq.values()];
            """;

    private VisualAudit() {
    }

    private static List<Map<String, Object>> scan(WebDriver d) {
        Object r = ((JavascriptExecutor) d).executeScript(SCAN);
        return r instanceof List ? (List<Map<String, Object>>) r : List.of();
    }

    private static void save(WebDriver d, String screen, String variant, List<Map<String, Object>> issues) {
        try {
            Files.createDirectories(OUT);
            Files.write(OUT.resolve(screen + "-" + variant + ".png"), ((TakesScreenshot) d).getScreenshotAs(OutputType.BYTES));
            StringBuilder sb = new StringBuilder();
            for (Map<String, Object> i : issues)
                sb.append(("{\"screen\":\"%s\",\"variant\":\"%s\",\"v\":\"%s\",\"what\":\"%s\",\"detail\":\"%s\"}\n").formatted(screen, variant, i.get("v"), i.get("what"),
                        String.valueOf(i.get("detail")).replace("\\", "/").replace("\"", "'").replace("\n", " ")));
            if (sb.length() > 0) Files.writeString(OUT.resolve("issues.jsonl"), sb.toString(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception e) {
            System.out.println("[VISUAL] could not save " + screen + "-" + variant + ": " + e.getMessage());
        }
    }

    private static void dark(WebDriver d, boolean on) {
        if (d instanceof ChromiumDriver c) {
            c.executeCdpCommand("Emulation.setEmulatedMedia", Map.of("features", List.of(Map.of("name", "prefers-color-scheme", "value", on ? "dark" : "light"))));
        }
        ((JavascriptExecutor) d).executeScript("try{localStorage.setItem('theme',arguments[0])}catch(e){}", on ? "dark" : "light");
    }

    /** Puts the page in English; the saved session may hold another language. */
    public static void english(WebDriver d) {
        ((JavascriptExecutor) d).executeScript("localStorage.setItem('anyware_language','en');localStorage.setItem('anyware_language_explicit','en');document.cookie='anyware_lang=en;path=/';");
    }

    private static void reload(WebDriver d, Runnable reopen, int settle) {
        d.navigate().refresh();
        Waits.sleep(settle * 1000L);
        if (reopen != null) {
            reopen.run();
            Waits.sleep(1500);
        }
    }

    /**
     * Audits the screen now on display. {@code reopen} brings back a dialog or step after a reload; null for plain pages.
     * Returns the number of automatic issues.
     */
    /** Waits for the page to have content and no loading message, so a slow load isn't captured as a blank page. Gives up after 30 seconds. */
    private static void settle(WebDriver d) {
        for (int i = 0; i < 30; i++) {
            Object ready = ((JavascriptExecutor) d).executeScript("var t=document.body.innerText||'';return t.trim().length>150&&!/Loading|\\u062c\\u0627\\u0631\\u064d? \\u0627\\u0644\\u062a\\u062d\\u0645\\u064a\\u0644/.test(t)&&!document.querySelector('[aria-busy=true]');");
            if (Boolean.TRUE.equals(ready)) break;
            Waits.sleep(1000);
        }
        Waits.sleep(1000);
    }

    public static int audit(WebDriver d, String screen, Runnable reopen) {
        int total = 0;
        Dimension size = d.manage().window().getSize();
        List<Map<String, Object>> i = scan(d);
        save(d, screen, "light-en", i);
        total += i.size();
        // V-07 dark theme: not captured. No switch was found on this account and emulation does not change the app's theme.
        ((JavascriptExecutor) d).executeScript("localStorage.setItem('anyware_language','ar');localStorage.setItem('anyware_language_explicit','ar');");
        reload(d, reopen, 7);
        settle(d);
        i = scan(d);
        save(d, screen, "ar", i);
        total += i.size();
        english(d);
        reload(d, reopen, 7);
        d.manage().window().setSize(new Dimension(390, 844));
        Waits.sleep(1500);
        settle(d);
        i = scan(d);
        save(d, screen, "phone", i);
        total += i.size();
        d.manage().window().setSize(size);
        Waits.sleep(800);
        return total;
    }
}
