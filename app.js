const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const fs = require('fs');

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Data');

let url = "https://glovoapp.com/ma/fr/tetouan/tele-pizza/?content=menu-c.174232486";

let fileName = "TEST";

axios.get(url)
  .then(response => {

    const $ = cheerio.load(response.data);

    // Extract data from the website
    const data = [];
    
    $("[data-test-id='grid-elements']").map((i, item) => {
      
      let name = $(item)
        .children("div")
        .children(".tile__description")
        .children("span")
        .text();

      let price = $(item)
        .children("div")
        .children(".tile__price")
        .children(".product-price")
        .children("div")
        .children("span")
        .text();

      let image = $(item)
        .children("div")
        .children(".tile__background")
        .children("img")
        .attr("src");

        data.push(
          {
            name: `${name}`.trim(),
            price: `${price}`.trim(),
            image: `${image}`.trim(),
          },
        );

    });

    // $("[data-test-id='list-element']").map((i, item) => {
      
    //   let name = $(item)
    //     .children("div")
    //     .children(".product-row__content")
    //     .children(".product-row__info")
    //     .children(".product-row__name")
    //     .children("span")
    //     .text();

    //   let price = $(item)
    //     .children("div")
    //     .children(".product-row__bottom")
    //     .children(".product-price")
    //     .children("div")
    //     .children("span")
    //     .text();

    //   let image = $(item)
    //     .children("div")
    //     .children(".product-row__content")
    //     .children("img")
    //     .attr("src");

    //     data.push(
    //       {
    //         name: `${name}`.trim(),
    //         price: `${price}`.trim(),
    //         image: `${image}`.trim(),
    //       },
    //     );

    // });

    console.log(
      data
    );

    // Add data to the worksheet
    worksheet.columns = [
      { header: 'Names', key: 'name' },
      { header: 'Prices', key: 'price' },
      { header: 'images', key: 'image' },
    ];
    data.forEach(item => {
      worksheet.addRow(item);
    });

    // Save the workbook to a file
    return workbook.xlsx.writeFile(`./dataExcel/${fileName}.xlsx`);

  })
  .then(() => {
    console.log('Data saved file');
  })
  .catch(error => {
    console.error(error);
  });