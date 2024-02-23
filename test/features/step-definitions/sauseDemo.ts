import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'chai';
import 'dotenv';

Given(/^Login to inventory app at (.*)$/, async function (URL) {
  //Navigate to the site
  await browser.url(URL);
  await browser.setTimeout({ implicit: 15000, pageLoad: 10000 });
  await browser.maximizeWindow();

  //Login to the app
  let username = await $('#user-name');
  let password = await $('#password');
  let login = await $('#login-button');

  await username.setValue('standard_user');
  await password.setValue('secret_sauce');
  await login.click();
  await browser.debug();
});

When(
  /^Inventory page should list (.*) products$/,
  async function (numberOfProducts) {
    if (!numberOfProducts)
      throw Error(`Invalid number of products provided : ${numberOfProducts}`);
    let productPanels = await $$(`//div[@class='inventory_item']`);
    let products = productPanels.length;
    expect(products).to.equal(parseInt(numberOfProducts));
  }
);

Then(/^Validate all products have valid price$/, async function () {
  let prices = [];
  let productsPrice = await $$(`.inventory_item_price`);
  for (let i = 0; i < productsPrice.length; i++) {
    let value = await productsPrice[i].getText();
    let price = +value.replace('$', '');
    prices.push(price);
  }
  console.log(prices);

  prices.forEach((price) => {
    expect(price).to.be.above(0);
  });
});
