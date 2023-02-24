import { VprokPuppeteer } from '#src/vprok.puppeteer.js';
import { formatter } from '#src/common/formatter.js';
import { saveToFile } from '#src/common/saveToFile.js';

const [url, region] = process.argv.slice(2);

const vprok = new VprokPuppeteer({});
await vprok.launch();
await vprok.setPage(url);
await vprok.changeRegion(region);

const { price, priceOld } = await vprok.getPrice();
const { rating, reviewCount } = await vprok.getAbout();

const screenshot = await vprok.getScreenshot();
await vprok.close();

const text = formatter({ price, priceOld, rating, reviewCount });

await saveToFile('product.txt', text);
await saveToFile('screenshot.jpg', screenshot);

console.table({ rating, reviewCount, price, priceOld });
