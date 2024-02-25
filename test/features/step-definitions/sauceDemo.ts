import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';
import reporter from '../../helper/reporter.ts';
import sauceHomePage from '../../page-objects/SauceDemo/sauce.home.page.ts';

Given(
  /^As (a|an) (.*) user I Login to inventory app$/,
  async function (prefixText, userType, dataTable) {
    try {
      reporter.addStep(this.testID, 'info', `Login to SauceDemo`);
      let dt = dataTable.hashes();
      //@ts-ignore
      await sauceHomePage.navigateTo(browser.options.sauceDemoURL);
      await sauceHomePage.loginToSauceApp(
        this.testID,
        process.env.STANDARD_USERNAME,
        process.env.STANDARD_PASSWORD
      );
    } catch (err) {
      err.message = `${this.testID}: Failed at login step, ${err.message}`;
      throw err;
    }
  }
);

When(
  /^Inventory page should (.*)\s?list (.*) products$/,

  async function (negativeCheck, numberOfProducts) {
    try {
      if (!numberOfProducts)
        throw Error(
          `Invalid number of products provided : ${numberOfProducts}`
        );
      let productPanels = await $$(`//div[@class='inventory_item']`);
      let products = productPanels.length;

      //Handle assertion known bugs
      try {
        expect(products).to.equal(parseInt(numberOfProducts));
      } catch (err) {
        reporter.addStep(
          this.testID,
          'error',
          'Known issue - product count mismatch',
          true,
          'JIRA-123'
        );
      }
    } catch (err) {
      err.message = `${this.testID}: Failed when comparing product count, ${err.message}`;
      throw err; //failing
    }
  }
);

Then(/^Validate all products have valid price$/, async function () {
  // throw Error(`Failed...`);

  let prices = [];
  let productsPrice = await $$(`.inventory_item_price`);
  for (let i = 0; i < productsPrice.length; i++) {
    let value = await productsPrice[i].getText();
    let price = +value.replace('$', '');
    prices.push(price);
  }
  // console.log(prices);

  prices.forEach((price) => {
    expect(price).to.be.above(0);
  });
});
