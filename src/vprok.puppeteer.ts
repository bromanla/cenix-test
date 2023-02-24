import puppeteer from 'puppeteer';

interface VprokPuppeteerConstructor {
  width?: number;
  height?: number;
}

export class VprokPuppeteer implements Required<VprokPuppeteerConstructor> {
  private browser: puppeteer.Browser;
  private page: puppeteer.Page;
  readonly width = 1920;
  readonly height = 1080;

  constructor(option: VprokPuppeteerConstructor) {
    Object.assign(this, option);
  }

  private getNumbersFromString(text: any) {
    return typeof text === 'string'
      ? parseFloat(text.replace(/[^\d\.\,]/g, '').replace(',', '.'))
      : NaN;
  }

  private compareText(a: string, b: string) {
    return a.toLowerCase().trim() === b.toLowerCase().trim();
  }

  public async changeRegion(targetRegion: string) {
    const buttonSelector = 'div.FirstHeader_region__lHCGj';
    const regionSelector = 'div.RegionModal_item___fYU6';

    // loading buttons of selection of the region
    await this.page.waitForSelector(buttonSelector);
    const currentRegion = await this.page.$eval(
      buttonSelector,
      (el) => el?.textContent,
    );

    // if the target region is already selected
    if (this.compareText(targetRegion, String(currentRegion))) {
      return;
    }

    // waiting for a modal window loading
    await this.page.click(buttonSelector);
    await this.page.waitForSelector(regionSelector);
    const elements = await this.page.$$(regionSelector);

    // search for the target region
    for (const el of elements) {
      const text = await this.page.evaluate((el) => el?.textContent, el);

      if (this.compareText(targetRegion, String(text))) {
        await this.page.evaluate((el) => el.click(), el);
        await this.page.waitForNavigation();
        break;
      }
    }
  }

  /* Building a browser */
  public async launch(headless = true) {
    this.browser = await puppeteer.launch({
      headless,
      args: ['--disable-notifications'],
    });
  }

  public async setPage(targetUrl: string, clearCookies = false) {
    // page creation on first launch
    if (!this.page) this.page = await this.browser.newPage();

    await this.page.setViewport({ width: this.width, height: this.height });

    if (clearCookies) {
      const client = await this.page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');
    }
    await this.page.goto(targetUrl);
    await this.page.waitForNavigation();
  }

  public async getAbout() {
    const selector = '.Summary_title__Uie8u';
    await this.page.waitForSelector(selector);

    const elements = await this.page.$$(selector);
    const [rating, reviewCount] = await Promise.all(
      elements.slice(2).map((element) => {
        return this.page.evaluate((el) => el?.textContent, element);
      }),
    );

    return {
      rating: this.getNumbersFromString(rating),
      reviewCount: this.getNumbersFromString(reviewCount),
    };
  }

  public async getPrice() {
    const selector = '.BuyQuant_price__7f54F';
    await this.page.waitForSelector(selector);

    const { price, priceOld } = await this.page.$eval(selector, (el) => {
      const price = el.querySelector(
        '.Price_priceDesktop__P9b2W ',
      )?.textContent;

      const priceOld = el.querySelector('.Price_role_old__qW2bx')?.textContent;
      return { price, priceOld };
    });

    return {
      price: this.getNumbersFromString(price),
      priceOld: this.getNumbersFromString(priceOld),
    };
  }

  public getScreenshot() {
    return this.page.screenshot({ fullPage: true });
  }

  public close() {
    return Promise.all([this.page.close(), this.browser.close()]);
  }
}
