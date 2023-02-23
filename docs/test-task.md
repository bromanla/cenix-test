# Тестовое задание

Необходимо создать JS-скрипт для Node, который с помощью библиотеки puppeteer
выбирает регион, делает полноразмерный скриншот страницы товара на сайте
vprok.ru, а также получает из нее цену товара (если есть зачеркнутая, то две цены),
рейтинг товара и количество отзывов на товар.
Скриншот надо сохранить на диск с именем screenshot.jpg.
Цены, рейтинг и количество отзывов надо сохранить на диск в файл product.txt.
Скрипт должен принимать два аргумента - адрес ссылки, которую надо обработать и
регион.
Например, запускаем скрипт командой:

```bash
  node index.js https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202 "Санкт-Петербург и область"
```
На выходе получаем скриншот screenshot.jpg и файл с характеристиками товара product.txt с содержимым:
```
  price=89.9
  priceOld=134
  rating=4.8
  reviewCount=780
```
Примеры ссылок:
* https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202
* https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778
* https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739
* https://www.vprok.ru/product/greenfield-greenf-chay-gold-ceyl-bl-pak-100h2g--307403
* https://www.vprok.ru/product/chaykofskiy-chaykofskiy-sahar-pesok-krist-900g--308737

Бонусом будет использование линтера и форматтера кода (это необязательно).
