import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';
import reporter from '../../helper/reporter.ts';
import apiHelper from '../../helper/apiHelper.ts';
import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import fieldValue from '../../../data/constants/fieldValues.json' assert { type: 'json' };
import fs from 'fs';
import serviceNowLoginPage from '../../page-objects/ServiceNow/serviceNow.login.page.ts';
import serviceNowSowPage from '../../page-objects/ServiceNow/serviceNow.sow.page.ts';
import serviceNowInteractionPage from '../../page-objects/ServiceNow/serviceNow.interaction.page.ts';

Given(/^As an (.*) user login to serviceNow$/, async function (user) {
  if (!user) throw Error(`The given user: ${user} is invalid`);
  user = user.trim().toUpperCase();
  try {
    reporter.addStep(
      this.testID,
      'info',
      `Starting to login to serviceNow with ${user} user`
    );
    await serviceNowLoginPage.loginToServiceNow(
      this.testID,
      process.env[`SERVICENOW_${user}_USERNAME`],
      process.env[`SERVICENOW_${user}_PASSWORD`]
    );
  } catch (err) {
    err.message = `${this.testID}: Failed at login to ServiceNow step, ${err.message}`;
    throw err;
  }
});

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
      `${browser.options.serviceNowBaseURL}${constants.SN.SOW_HOME}`
    );
  } catch (err) {
    err.message = `Failed at navigating to ${application} application, ${err.message}`;
    throw err;
  }
});

When(/^I open new (.*) form in SOW$/, async function (form) {
  if (!form) throw Error(`Given form: ${form} is invalid`);
  form = form.trim().toUpperCase();
  try {
    reporter.addStep(this.testID, 'info', `Starting to open new ${form} form`);
    //Trigger different function for different form
    switch (form) {
      case 'INTERACTION':
        await serviceNowSowPage.openNewInteractionForm(this.testID);
        let url = await browser.getUrl();
        expect(url).to.include(constants.SN.INTERACTION);
        break;
    }
  } catch (err) {
    err.message = `${this.testID}: Failed at opening new ${form} form, ${err.message}`;
    throw err;
  }
});

Then(/^I fill in mandatory fields$/, async function () {
  reporter.addStep(this.testID, 'info', `Filling in mandatory fields`);
  try {
    const company = fieldValue.INTERACTION.TEXT_NAME.COMPANY;
    const endUser = fieldValue.INTERACTION.TEXT_NAME.END_USER;
    const agentUser = fieldValue.INTERACTION.TEXT_NAME.AGENT_USER;
    await serviceNowInteractionPage.fillInMandatoryFields(
      company,
      endUser,
      agentUser
    );
    await browser.debug();
  } catch (err) {
    err.message = `Failed at filling in mandatory fields, ${err.message}`;
    throw err;
  }
});
