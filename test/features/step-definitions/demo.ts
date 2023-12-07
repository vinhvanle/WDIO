import { Given, When, Then } from '@wdio/cucumber-framework';
import chai from 'chai';

/**First Test with Google
 *
 *
 *
 */
Given(/^Google page is opened$/, async () => {
  console.log(`Before opening browser...`);
  await browser.url('https://www.google.com');
  await browser.pause(1000);
  console.log(`After opening browser...`);
});

When(/^Search with (.*)$/, async (searchItem) => {
  const searchBar = await $(`[name=q]`);
  await searchBar.setValue(searchItem);
  await browser.keys('Enter');
});

Then(/^Click on first search result$/, async () => {
  let ele = await $(`<h3>`);
  await ele.click();
});

Then(/^The URL should match (.*)$/, async (expectedURL) => {
  const url = await browser.getUrl();
  chai.expect(url).to.equal(expectedURL);
  await browser.pause(3000);
});

/********************************
 *
 *
 *
 */

/** Web Interactions
 *
 *
 *
 */

Given(/^A web page is opened$/, async () => {
  await browser.url('/inputs');
  await browser.setTimeout({
    implicit: 15000,
    pageLoad: 10000,
  });
  // await browser.maximizeWindow();
});

When(/^Perform web interactions$/, async () => {
  /**
   * 1. Input box
   * Actions:
   * 1. Type into input box
   * 2. Clear the field and type or add value
   * 3. Click and type
   * 4. Slow typing
   *
   */

  // let num = 12345;
  // let strNum = num.toString();

  // const ele = await $(`input[type=number]`);
  // await ele.click();
  // // await ele.setValue('12345');
  // for (let i = 0; i < strNum.length; i++) {
  //   let charStr = strNum.charAt(i);
  //   await browser.pause(1000);
  //   await browser.keys(charStr);
  // }

  /**
   * 2. Dropdown
   * Actions:
   * 1. Assert default option is selected
   * 2. Select by attribute, text, index
   * 3. Get a list of options
   */

  await browser.debug();
});
