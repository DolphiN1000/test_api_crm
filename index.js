const axios = require('axios');
const xml2js = require('xml2js');

const url = 'https://brovko.salesdrive.me/export/yml/export.yml?publicKey=aYcKPKGzZgqwrGsQ2bXXErzE4d8T-YXxJOmKKoayHI84wLVjBm1h_LWz632yguyQ3S07J9mdTZx';

axios.get(url)
  .then(response => {
    const xmlData = response.data;
    // console.log(xmlData)
    const parser = new xml2js.Parser();

    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Помилка при обробці XML:', err);
      } else {
        const ymlCatalog = result.yml_catalog;
        const shop = ymlCatalog.shop[0];
        const name = shop.name[0];
        const company = shop.company[0];
        const currencies = shop.currencies[0].currency;
        const categories = shop.categories[0].category;
        const offers = shop.offers && shop.offers[0] && shop.offers[0].offer ? shop.offers[0].offer : [];

        console.log('Date:', ymlCatalog.$.date);
        console.log('Shop Name:', name);
        console.log('Company Name:', company);

        console.log('Currencies:');
        currencies.forEach(currency => {
          console.log('Currency ID:', currency.$.id);
          console.log('Currency Rate:', currency.$.rate);
        });

        console.log('Categories:');
        categories.forEach(category => {
          console.log('Category ID:', category.$.id);
          console.log('Category Name:', category._);
          if (category.$.parentId) {
            console.log('Parent Category ID:', category.$.parentId);
          }
        });

        console.log('Offers:');
        if (offers.length > 0) {
          offers.forEach(offer => {
            console.log('Offer ID:', offer.$.id);
            console.log('Availability:', offer.$.available);

            if (offer.price && offer.price[0]) {
              console.log('Price:', offer.price[0]);
            } else {
              console.log('Price: N/A');
            }

            console.log('Currency ID:', offer.currencyId[0]);
            console.log('Name:', offer.name[0]);
            console.log('Category ID:', offer.categoryId[0]);
            console.log('Quantity in Stock:', offer.quantity_in_stock && offer.quantity_in_stock[0] ? offer.quantity_in_stock[0] : 'N/A');
            console.log('Description:', offer.description && offer.description[0] ? offer.description[0] : 'No description available');
            console.log('URL:',  offer.url && offer.url[0]? offer.url[0] : 'No url available');

            if (offer.picture) {
              console.log('Pictures:');
              offer.picture.forEach(picture => {
                console.log(picture);
              });
            }

            console.log('---------------------');
          });
        } else {
          console.log('No offers available.');
        }
      }
    });
  })
  .catch(error => {
    console.error('Помилка при отриманні даних:', error);
  });
