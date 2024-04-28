import { Given } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';

import prepareTestData from '../../helper/prepareTestData.ts';
import reporter from '../../helper/reporter.ts';

import constants from '../../../data/constants/constants.json' assert { type: 'json' };

import URLManipulation from '../../helper/URLManipulation.ts';
import serviceNowLoginPage from '../../page-objects/ServiceNow/serviceNow.login.page.ts';
import serviceNowInteractionPage from '../../page-objects/ServiceNow/serviceNow.interaction.page.ts';

Given(/^Create a new (.*) (.*) user record$/, async function (company, role) {
  if (!company || !role)
    return new Error(`Given company: ${company} or role: ${role} is invalid`);
  //Manipulate input:
  try {
    company = company.trim().toUpperCase().replace(' ', '_');
    role = role.trim().toUpperCase().replace(' ', '_');

    const userInfo = {
      //Randomize user_name to prevent test fail when previous run data rollback failed

      user_name: `WDIO.${role}.user.${Math.floor(Math.random() * 1000 + 1)}`,
      first_name: `WDIO ${role}`,
      last_name: company,
      user_password: '1',
      company: constants.SN.COMPANIES[company]['SYS_ID'],
      email: `WDIO.${role}.user@example.com`,
    };

    //Create user record
    const user = await prepareTestData.createRecord(
      this.testID,
      'sys_user',
      userInfo,
      constants.SN.APIS.QUERY_PARAM
    );

    const addUserToGroupPayload = {
      user: user.sys_id,
      group: constants.SN.COMPANIES[company]['GROUPS'][role],
    };

    //Add user to group
    if (role !== 'ESS') {
      const addUserToGroup = await prepareTestData.createRecord(
        this.testID,
        'sys_user_grmember',
        addUserToGroupPayload,
        {}
      );

      //Add sysid to global array for removal later
      this.sysIDArr.push(addUserToGroup);
    }

    //Add sysid to global array for removal later
    this.sysIDArr.push(user);

    //save user to temp object: (including sys_id)
    const newUserInfo = {
      ...userInfo,
      sys_id: user.sys_id,
      company: {
        //convert company name back to normal
        name: company.replace('_', ' '),
        sys_id: constants.SN.COMPANIES[company]['SYS_ID'],
      },
    };
    console.log(newUserInfo);
    this.temp[`${role}_USER`] = newUserInfo;
  } catch (error) {
    reporter.addStep(
      this.testID,
      'error',
      `Error while creating new user record, ${error}`
    );
    throw error;
  }
});

Given(/^As an (.*) user I login to serviceNow$/, async function (role) {
  if (!role) throw new Error(`The given user: ${role} is invalid`);
  try {
    role = role.trim().toUpperCase().replace(' ', '_');

    const userInfo = this.temp[`${role}_USER`];

    reporter.addStep(
      this.testID,
      'info',
      `Starting to login to serviceNow with ${role} user`
    );
    await serviceNowLoginPage.loginToServiceNow(
      this.testID,
      userInfo.user_name,
      userInfo.user_password
    );
  } catch (error) {
    reporter.addStep(
      this.testID,
      'error',
      `Error while login to serviceNow as ${role} user, ${error}`
    );
    throw error;
  }
});

Given(/^I submit the (new|current) form$/, async function (formState) {
  if (!formState) throw new Error(`Given formState: ${formState} is invalid`);
  try {
    reporter.addStep(this.testID, 'info', `Submitting the form`);
    if (formState === 'new') {
      //If it's a new form, extract the sys_id of the record for data rollback

      await serviceNowInteractionPage.clickSaveBtn();
      //Wait until the URL has changed
      const currentURL = await browser.getUrl();
      await browser.waitUntil(
        async function () {
          return (await browser.getUrl()) !== currentURL;
        },
        {
          timeout: 5000,
          timeoutMsg: 'URL did not change within 5 seconds',
        }
      );

      const newURL = await browser.getUrl();

      //Extract the table and sys_id from URL
      const record = URLManipulation.extractRecordDetails(newURL, 'top');
      //save the record to world object
      this.sysIDArr.push(record);
    } else {
      //If it is not a new form, just save
      await serviceNowInteractionPage.clickSaveBtn();
      //Assert that the browser has reloaded after clicking the button
      await browser.waitUntil(
        async () =>
          (await browser.execute(() => document.readyState)) === 'complete',
        {
          timeout: 30000,
          timeoutMsg: 'Page did not reload properly in the expected time',
        }
      );
    }
  } catch (error) {
    reporter.addStep(
      this.testID,
      'error',
      `Error when submitting the form, ${error}`
    );
    throw error;
  }
});
