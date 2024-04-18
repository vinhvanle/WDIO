import { When } from '@wdio/cucumber-framework';
import reporter from '../../helper/reporter.ts';
import serviceNowSowPage from '../../page-objects/ServiceNow/serviceNow.sow.page.ts';
import { expect, should, assert } from 'chai';
import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import serviceNowServicePortalPage from '../../page-objects/ServiceNow/serviceNow.servicePortal.page.ts';

When(/^I open new (.*) form in SOW$/, async function (form) {
  if (!form) throw Error(`Given form: ${form} is invalid`);
  form = form.trim().toUpperCase();

  reporter.addStep(this.testID, 'info', `Starting to open new ${form} form`);
  //Trigger different function for different form

  switch (form) {
    case 'INTERACTION':
      await serviceNowSowPage.openNewInteractionForm(this.testID);
      let url = await browser.getUrl();
      expect(url).to.include(constants.SN.APPLICATIONS.INTERACTION);
      break;
  }
});

When(/^I initiate a Virtual Agent conversation$/, async function () {
  reporter.addStep(
    this.testID,
    'info',
    `Starting to Open a new Virtual Agent conversation`
  );

  await serviceNowServicePortalPage.openVAConversation(this.testID);
});

When(/^I click (.*) in VA conversation$/, async function (buttonName) {
  if (!buttonName)
    throw new Error(`Given buttonName: ${buttonName} is invalid`);

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
});
