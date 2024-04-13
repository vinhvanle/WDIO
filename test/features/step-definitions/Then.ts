import { Then } from '@wdio/cucumber-framework';
import reporter from '../../helper/reporter.ts';
import { expect, should, assert } from 'chai';

import serviceNowLoginPage from '../../page-objects/ServiceNow/serviceNow.login.page.ts';
import serviceNowInteractionPage from '../../page-objects/ServiceNow/serviceNow.interaction.page.ts';
import URLManipulation from '../../helper/URLManipulation.ts';

import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import fieldValues from '../../../data/constants/fieldValues.json' assert { type: 'json' };

Then(/^I navigate to (.*) application$/, async function (application) {
  if (!application) throw Error(`Given application: ${application} is invalid`);
  application = application.trim().toUpperCase();
  try {
    reporter.addStep(
      this.testID,
      'info',
      `Navigating to ${application} application`
    );
    await serviceNowLoginPage.navigateTo(
      //@ts-ignore
      `${browser.options.serviceNowBaseURL}/${constants.SN.SOW_HOME}`
    );

    await URLManipulation.verifyUrl(
      this.testID,
      //@ts-ignore
      `${browser.options.serviceNowBaseURL}/${constants.SN.SOW_HOME}`
    );
  } catch (err) {
    err.message = `Failed at navigating to ${application} application, ${err.message}`;
    throw err;
  }
});

Then(/^I fill in mandatory fields$/, async function () {
  reporter.addStep(this.testID, 'info', `Filling in mandatory fields`);
  try {
    const company = fieldValues.INTERACTION.TEXT_NAME.COMPANY;
    const endUser = fieldValues.INTERACTION.TEXT_NAME.END_USER;
    const agentUser = fieldValues.INTERACTION.TEXT_NAME.AGENT_USER;
    await serviceNowInteractionPage.fillInMandatoryFields(
      company,
      endUser,
      agentUser
    );

    //Wait until the URL has changed
    const currentURL = await browser.getUrl();
    await browser.waitUntil(
      async function () {
        return (await browser.getUrl()) !== currentURL;
      },
      {
        timeout: 5000, // Timeout in milliseconds
        timeoutMsg: 'URL did not change within 5 seconds',
      }
    );

    const newURL = await browser.getUrl();

    //Extract the table and sys_id from URL

    const record = URLManipulation.extractRecordDetails(newURL, 'top');

    //Push to global object
    this.sysIDArr.push(record);

    // //Intentional failing
    // expect(0).to.equal(1);
  } catch (err) {
    err.message = `Failed at filling in mandatory fields, ${err.message}`;
    throw err;
  }
});
