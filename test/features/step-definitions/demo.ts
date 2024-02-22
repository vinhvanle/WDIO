import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';

/**
 * Demo.feature
 */
Given(/^Google page is opened$/, async function () {
  await browser.maximizeWindow();
  await browser.url('https://google.com');
  //   await browser.pause(3000);
});

When(/^Search with (.*)$/, async function (searchItem) {
  let searchBox = await $(`[name=q]`);
  await searchBox.setValue(searchItem);
  //   await browser.pause(3000);
  await browser.keys('Enter');
});

Then(/^Click on first search result$/, async function () {
  let ele = await $(`h3`);
  await ele.click();
  //   await browser.pause(3000);
});

Then(/^URL should match (.*)$/, async function (expectedURL) {
  let url = await browser.getUrl();
  expect(url).to.equal(expectedURL);
});

/**
 * WebInteractions.feature
 */

Given(/^A web page is opened at (.*)$/, async function (URL) {
  await browser.url(URL);
  await browser.setTimeout({ implicit: 15000, pageLoad: 10000 });
  await browser.maximizeWindow();
});

When(/^Perform web interactions at (.*)$/, async function (URL) {
  /**
   * Input box - type, clear, slow typing
   * Actions:
   * 1. Type into input box
   * 2. Clear the field and type or just addValue
   * 3. Click an type
   * 4. Slow typing
   */

  // await browser.url(`${URL}/inputs`);
  // //1. + 2. + 3.
  // let ele = await $(`input[type=number]`);
  // // await ele.moveTo();
  // // await ele.scrollIntoView();
  // // await ele.click();
  // // await ele.setValue(12345);
  // // await ele.addValue('9876');

  // //4.
  // let num = 12345;
  // let strNum = num.toString();
  // await ele.click();
  // for (let i = 0; i < strNum.length; i++) {
  //   let char = strNum.charAt(i);
  //   await browser.pause(1000);
  //   await browser.keys(char);
  // }

  /**2. Dropdown
   * Actions:
   * 1. Assert default option is selected
   * 2. Select by attribute, text, index
   * 3. Get a list of options
   */

  await browser.debug();
});
