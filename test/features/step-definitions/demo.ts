import { Given, When, Then } from '@wdio/cucumber-framework';
import chai from 'chai';

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
