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

  public async changeRegion(targetRegion: string) {
    const buttonSelector = 'div.FirstHeader_region__lHCGj';
    const regionSelector = 'div.RegionModal_item___fYU6';

    await this.page.waitForSelector(buttonSelector);
    await this.page.click(buttonSelector);

    await this.page.waitForSelector(regionSelector);
    const elements = await this.page.$$(regionSelector);

    for (const el of elements) {
      const text = await this.page.evaluate((el) => el?.textContent, el);

      if (text === targetRegion) {
        await this.page.evaluate((el) => el.click(), el);
        break;
      }
    }
    await this.page.waitForNavigation();
  }

  public async mount(targetUrl: string) {
    this.browser = await puppeteer.launch();

    if (this.page) await this.page.close();
    this.page = await this.browser.newPage();

    await this.page.goto(targetUrl);
    await this.page.setViewport({ width: 1920, height: 1080 });
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
