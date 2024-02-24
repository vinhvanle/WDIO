import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'chai';
import 'dotenv';

Given(/^Login to inventory app at (.*)$/, async function (URL) {
  // console.log(`>>> Browser options: ${JSON.stringify(browser.options)}`);
  //Navigate to the site
  //@ts-ignore
  await browser.url(browser.options.sauceDemoURL);
  // console.log(`>> Test config value: ${JSON.stringify(browser.options)}`);

  // await browser.setTimeout({ implicit: 15000, pageLoad: 10000 });
  await browser.maximizeWindow();

  // console.log(`Test user: ${process.env.TEST_USERNAME}`);

  //Login to the app
  try {
    await $('#user-name').setValue(process.env.STANDARD_USERNAME);
    await $('#password').setValue(process.env.STANDARD_PASSWORD);
    await $('#login-button').click();
  } catch (err) {
    console.log(`Error in first login. retrying....`);
    await browser.refresh();
    await browser.pause(2000);

    await $('#user-name').setValue('standard_user');
    await $('#password').setValue('secret_sauce');
    await $('#login-button').click();
  }
  /**
   * Login with another user
   */
  // await browser.pause(2000);
  // await browser.reloadSession();

  // await browser.url(URL);
  // await browser.maximizeWindow();

  // await $('#user-name').setValue('problem_user');
  // await $('#password').setValue('secret_sauce');
  // await $('#login-button').click();

  // await browser.pause(2000);
  // await browser.back();
  // await browser.pause(2000);
  // await browser.forward();
  // await browser.pause(2000);

  // await browser.debug();
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
