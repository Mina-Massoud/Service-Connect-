import { chromium } from "playwright";
const OUT = "/private/tmp/claude-501/-Users-mina-Documents-Mina-Service-Connect-/21503c88-6891-4357-894b-62f8fbe17dc2/scratchpad";
const browser = await chromium.launch();
// wide + tall to mimic the user's large display
const page = await browser.newPage({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3210/showcase", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.keyboard.press("Space"); // pause early (learner-focused scene)
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/two-1.png` });
console.log("two-1");
await browser.close();
