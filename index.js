const puppeteer = require("puppeteer");
async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("  https://e.kgeu.ru/Account/Login");

  await page.$eval("#UserName", (el) => (el.value = "login")); //login
  await page.$eval("#Password", (el) => (el.value = "password")); //password

  await page.click("#loginForm > fieldset > form > input.btn.btn-default");
  await page.waitForTimeout(5000);

  const totalArray = [];
  for (let index = 1; index <= 4; index++) {
    index <= 2
      ? await page.goto(
          `https://e.kgeu.ru/StudentSession/Marks?year=2020&semestr=${index}`
        )
      : await page.goto(
          `https://e.kgeu.ru/StudentSession/Marks?year=2021&semestr=${index}`
        );

    totalArray.push(
      ...(await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll("table tr td a"));
        return tds
          .map((td) => td.innerText)
          .filter((t) => ["Хорошо", "Удов-но", "Отлично"].includes(t));
      }))
    );
  }
  const countItems = (items) => {
    const map = new Map();

    for (const item of items) {
      map.set(item, map.has(item) ? map.get(item) + 1 : 1);
    }
    return map;
  };
  const result = countItems(totalArray);

  const AVG_mark_KSPEU_Masters =
    (result.get("Отлично") * 5 +
      result.get("Хорошо") * 4 +
      result.get("Удов-но") * 3) /
    totalArray.length;
  console.log(result);
  console.log("Средняя оценка в магистратуре = " + AVG_mark_KSPEU_Masters);
  await browser.close();
}
start();
