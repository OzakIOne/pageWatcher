import puppeteer from 'puppeteer';
import open from 'open';

const pptrOptions = {
  headless: true,
  args: [
    '--no-service-autorun',
    '--no-experiments',
    '--no-default-browser-check',
    '--disable-extensions',
  ],
};

const ALARM_FILE = 'alarm.wav';

const watchListData = [
  {
    URL: 'https://github.com/',
    SELECTOR: 'h1',
    PATTERN: 'Where the world builds software',
    REFRESH_INTERVAL_SEC: 3,
    openAlarm: true,
    openURL: true,
  },
  {
    URL: 'https://github.com/',
    SELECTOR: 'h1',
    PATTERN: 'Where the world builds software',
    REFRESH_INTERVAL_MIN: 1,
    openAlarm: false,
    openURL: false,
  },
];

const getBrowserInstance = async (options) => puppeteer.launch(options);

const handleError = (err) => console.error(`There was an error`, err);

const closePage = async (tabPage, browser) => {
  await tabPage.close();
  const browserPageNumber = await browser.pages();
  if (browserPageNumber.length === 1) browser.close();
};

const isSelectorValid = async (tabPage, { SELECTOR, PATTERN }) => {
  const selectorTextContent = await tabPage.$eval(
    SELECTOR,
    (el) => el.textContent,
  );
  if (selectorTextContent.includes(PATTERN)) return true;
  else return false;
};

const watchPages = async (browser, dataList) => {
  dataList.forEach(async (data) => {
    const {
      URL,
      SELECTOR,
      PATTERN,
      REFRESH_INTERVAL_SEC,
      REFRESH_INTERVAL_MIN,
      openAlarm,
      openURL,
    } = data;
    const page = await browser.newPage();
    await page.goto(URL, {
      waitUntil: 'domcontentloaded',
    });

    const pageRefreshInterval = setInterval(
      async () => {
        const now = new Date();
        const valid = await isSelectorValid(page, { SELECTOR, PATTERN });
        if (valid) {
          closePage(page, browser);
          console.log(
            `${URL} validated at ${now.getHours()}h:${now.getMinutes()}m:${now.getSeconds()}s`,
          );
          if (openURL) await open(URL);
          if (openAlarm) await open(ALARM_FILE);
          clearInterval(pageRefreshInterval);
        } else {
          console.log(
            `${URL} not valid at ${now.getHours()}h:${now.getMinutes()}m:${now.getSeconds()}s`,
          );
          page.reload({ waitUntil: 'domcontentloaded' });
        }
      },
      REFRESH_INTERVAL_SEC * 1000 || REFRESH_INTERVAL_MIN * 60000,
      { URL, SELECTOR, PATTERN, openAlarm, openURL },
    );
  });
};

getBrowserInstance(pptrOptions).then((browser) => {
  watchPages(browser, watchListData);
});
