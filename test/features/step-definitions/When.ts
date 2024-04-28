import { When } from '@wdio/cucumber-framework';
import reporter from '../../helper/reporter.ts';
import serviceNowSowPage from '../../page-objects/ServiceNow/serviceNow.sow.page.ts';
import { expect, should, assert } from 'chai';
import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import serviceNowServicePortalPage from '../../page-objects/ServiceNow/serviceNow.servicePortal.page.ts';

When(/^I open new (.*) form in SOW$/, async function (form) {
  if (!form) throw new Error(`Given form: ${form} is invalid`);
  try {
    form = form.trim().toUpperCase().replaceAll(' ', '_');

    reporter.addStep(this.testID, 'info', `Starting to open new ${form} form`);
    //Trigger different function for different form

    await serviceNowSowPage.openNewForm(this.testID, form);
  } catch (err) {
    reporter.addStep(
      this.testID,
      'error',
      `Error while opening new ${form}, ${err}`
    );
    throw err;
  }
});

When(/^I initiate a Virtual Agent conversation$/, async function () {
  try {
    reporter.addStep(
      this.testID,
      'info',
      `Starting to Open a new Virtual Agent conversation`
    );

    await serviceNowServicePortalPage.openVAConversation(this.testID);
  } catch (err) {
    reporter.addStep(
      this.testID,
      'error',
      `Error while initiating a Virtual Agent conversation, ${err}`
    );
    throw err;
  }
});

When(/^I click (.*) in VA conversation$/, async function (buttonName) {
  if (!buttonName)
    throw new Error(`Given buttonName: ${buttonName} is invalid`);

  try {
    buttonName = buttonName.trim().toUpperCase().replace(' ', '_');
    reporter.addStep(
      this.testID,
      'info',
      `Stating to click ${buttonName} in VA conversation`
    );

    switch (buttonName) {
      case 'SHOW_ME_EVERYTHING':
        await serviceNowServicePortalPage.clickShowMeEverything(this.testID);
        break;

      default:
        await serviceNowServicePortalPage.clickShowMeEverything(this.testID);
        break;
    }
  } catch (err) {
    reporter.addStep(
      this.testID,
      'error',
      `Error while clicking ${buttonName} in VA conversation, ${err}`
    );
    throw err;
  }
});
