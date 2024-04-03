import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';
import reporter from '../../helper/reporter.ts';
import apiHelper from '../../helper/apiHelper.ts';
import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import fs from 'fs';
import nopcommerceHomePage from '../../page-objects/E2ETest/nopcommerce.home.page.ts';
import nopcommerceCustlistPage from '../../page-objects/E2ETest/nopcommerce.custlist.page.ts';

Given(/^Get list of (.*) from reqres.in$/, async function (endpointRef) {
  /**
   * Get list of users from reqres api
   * Sub-steps:
   * 1. Get payload data
   * 2. Make GET call by using apiHelper
   * 3. Store the results
   */

  if (!endpointRef) throw Error(`Given endpointRef: ${endpointRef} is invalid`);

  try {
    /**1. Get payload data*/
    reporter.addStep(
      this.testID,
      'info',
      `Getting the payload data for endpointRef: ${endpointRef}`
    );
    let endpoint = '';
    if (endpointRef.trim().toUpperCase() === 'USERS') {
      endpoint = constants.REQRES.GET_USER;
    }
    if (!endpoint)
      throw Error(`Error getting endpoint: ${endpoint} from constants.json`);
    /**2. Make GET call by using apiHelper */
    let res;
    let username = '';
    let password = '';
    let testID = this.testID;
    await browser.call(async function () {
      res = await apiHelper.GET(
        testID,
        //@ts-ignore
        browser.options.reqresBaseURL,
        endpoint,
        username,
        password,
        constants.REQRES.QUERY_PARAM
      );
    });
    if (res.status !== 200)
      chai.expect.fail(
        //@ts-ignore
        `Failed getting users from endpoint: ${browser.getHubConfig.reqresBaseURL}/${endpoint}`
      );
    reporter.addStep(
      this.testID,
      'info',
      `API response received, data: ${JSON.stringify(res.body)}`
    );

    /**3. Store the results */
    let data = JSON.stringify(res.body, undefined, 4);
    let filename = `${process.cwd()}/data/api-res/reqresAPIUsers.json}`;
    fs.writeFileSync(filename, data);
  } catch (err) {
    err.message = `${this.testID}: Failed at getting API Users from reqres, ${err.message}`;
    throw err;
  }
});

When(/^As an (.*) user login to nopcommerce site$/, async function (user) {
  if (!user) throw Error(`Given user: ${user} is invalid`);
  user = user.trim().toUpperCase();
  try {
    reporter.addStep(
      this.testID,
      'info',
      `Starting to login to nopcommerce web with ${user} user`
    );
    await nopcommerceHomePage.loginToNopCommerceWeb(
      this.testID,
      //@ts-ignore
      browser.options.nopCommerceBaseURL,
      process.env[`TEST_NOP_${user}_USERNAME`],
      process.env[`TEST_NOP_${user}_PASSWORD`]
    );
  } catch (err) {
    err.message = `${this.testID}: Failed at nopcommerce login step, ${err.message}`;
    throw err;
  }
});

// When(/^Search users in customer list$/, async function () {});

Then(/^Verify if all users exist in customers list$/, async function () {
  try {
    /**1. Navigate/ select Customer options from left menu */

    await browser.url(
      //@ts-ignore
      `${browser.options.nopCommerceBaseURL}/Admin/Customer/List`
    );
    reporter.addStep(this.testID, 'info', `Navigated to Customer List screen`);

    /**2. Read API response from /data folder */
    let filename = `${process.cwd()}/data/api-res/reqresAPIUsers.json}`;
    let data = fs.readFileSync(filename, 'utf8');
    let dataObj = JSON.parse(data);

    /**3. For each user object in API response */
    let usersArr = dataObj.data;
    let resultArr = [];
    for (let i = 0; i < usersArr.length; i++) {
      let obj = {};
      let firstname = usersArr[i].first_name;
      let lastname = usersArr[i].last_name;
      let custNotFound = await nopcommerceCustlistPage.searchNameAndConfirm(
        this.testID,
        firstname,
        lastname
      );

      if (custNotFound) {
        obj['firstname'] = firstname;
        obj['lastname'] = lastname;
        resultArr.push(obj);
      }
    }

    /**4. In case user does not exist write it to error file */
    if (resultArr.length > 1) {
      let data = JSON.stringify(resultArr, undefined, 4);
      let filepath = `${process.cwd()}/results/custNotFoundList.json`;
      fs.writeFileSync(filepath, data);
    }
  } catch (err) {
    err.message = `${this.testID}: Failed at checking users in nopcommerce web Customer List, ${err.message}`;
    throw err;
  }
});
