const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const fs = require('fs');

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Data');

axios.get('https://glovoapp.com/ma/fr/tetouan/mcdonaldsr-tet55/?content=sauces-c.1415115344')
  .then(response => {

    const $ = cheerio.load(response.data);

    // Extract data from the website
    const data = [];
      $("div[data-test-id='list-element']").map((i, item) => {
        
        let names = $(item)
          .children("[data-test-id='product-row-content']")
          .children(".product-row__content")
          .children(".product-row__info")
          .children(".product-row__name")
          .children("span")
          .children('span')
          .text();

        let imgs = $(item)
          .children("[data-test-id='product-row-content']")
          .children(".product-row__content")
          .children("img")
          .attr("src");

        let prices = $(item)
          .children("[data-test-id='product-row-content']")
          .children(".product-row__bottom")
          .children(".product-price")
          .children("span")
          .text();

        data.push(
          {
            names: names.trim(),
            imgs: imgs.trim(),
            prices: prices.trim(),
          },
        );

      });
      console.log(
        data
      );



    // Save data to a JSON file
    fs.writeFile('./dataJson/SAUCES.json', JSON.stringify(data), err => {
      if (err) throw err;
      console.log('Data saved to data.json');
    });




    // // Add data to the worksheet
    // worksheet.columns = [
    //   { header: 'Names', key: 'names' },
    //   { header: 'Prices', key: 'prices' },
    //   { header: 'Imgs', key: 'imgs' },
    // ];
    // data.forEach(item => {
    //   worksheet.addRow(item);
    // });

    // // Save the workbook to a file
    // return workbook.xlsx.writeFile('./data/SAUCES.xlsx');

  })
  .then(() => {
    console.log('Data saved to data.xlsx');
  })
  .catch(error => {
    console.error(error);
  });