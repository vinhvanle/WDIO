import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';

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
