import { VprokPuppeteer } from '#src/vprok.puppeteer.js';
import { formatter } from '#src/common/formatter.js';
import { saveToFile } from '#src/common/saveToFile.js';
import { join } from 'path';
import { mkdir, rm } from 'fs/promises';
import { setTimeout } from 'timers/promises';

const urls = [
  'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202',
  'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778',
  'https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739',
  'https://www.vprok.ru/product/greenfield-greenf-chay-gold-ceyl-bl-pak-100h2g--307403',
  'https://www.vprok.ru/product/chaykofskiy-chaykofskiy-sahar-pesok-krist-900g--308737',
];

const regions = [
  'Санкт-Петербург и область',
  'Москва и область',
  'Архангельская обл.',
  'Астраханская обл.',
  'Башкортостан респ.',
  'Владимирская обл.',
  'Волгоградская обл.',
  'Вологодская обл.',
  'Воронежская обл.',
  'Калужская обл.',
  'Карелия респ.',
  'Кировская обл.',
  'Краснодарский край',
  'Курганская обл.',
  'Марий Эл респ.',
  'Мурманская обл.',
  'Нижегородская обл.',
  'Оренбургская обл.',
  'Пермский край',
  'Рязанская обл.',
  'Свердловская обл.',
  'Смоленская обл.',
  'Ставропольский край',
  'Тамбовская обл.',
  'Татарстан респ.',
  'Тверская обл.',
  'Тульская обл.',
  'Тюменская обл.',
  'Ханты-Мансийский а.о',
  'Чувашская респ.',
  'Ямало-Ненецкий а.о.',
];

console.time('scrap');

// checking thread increase for libuv
const threadpool = process.env.UV_THREADPOOL_SIZE
  ? Number(process.env.UV_THREADPOOL_SIZE)
  : 4;

const folderPath = join(process.cwd(), 'archive');

await rm(folderPath, { recursive: true, force: true });
await mkdir(folderPath);

async function parse(url: string) {
  const vprok = new VprokPuppeteer({});
  await vprok.launch();

  const product = url
    .slice('https://www.vprok.ru/product/'.length)
    .replace(/[^a-z0-9-]/gi, '');

  const urlPath = join(folderPath, product);
  await mkdir(urlPath);

  await vprok.setPage(url, true);

  for (const region of regions) {
    const regionPath = join(
      urlPath,
      region.replace(' ', '-').replace(/[^а-яёa-z0-9-]/gi, ''),
    );
    await mkdir(regionPath);
    await vprok.changeRegion(region);
    const { price, priceOld } = await vprok.getPrice();
    const { rating, reviewCount } = await vprok.getAbout();
    const screenshot = await vprok.getScreenshot();

    const text = formatter({ price, priceOld, rating, reviewCount });

    const productPath = join(regionPath, 'product.txt');
    const screenshotPath = join(regionPath, 'screenshot.jpg');

    await saveToFile(productPath, text);
    await saveToFile(screenshotPath, screenshot);

    // there will be a timeout error
    if (threadpool < 10) await setTimeout(7500);
  }

  await vprok.close();
}

// we calculate how we will run the asynchronous code
const simultaneously =
  Math.floor(urls.length / threadpool) + (urls.length % threadpool ? 1 : 0);

// run how many threads at the same time
for (let i = 0; i < simultaneously; i += 1) {
  const start = i * threadpool;
  await Promise.all(
    urls.slice(start, start + threadpool).map((url) => parse(url)),
  );
}

console.timeEnd('scrap');
