import { When } from '@wdio/cucumber-framework';
import reporter from '../../helper/reporter.ts';
import serviceNowSowPage from '../../page-objects/ServiceNow/serviceNow.sow.page.ts';
import { expect, should, assert } from 'chai';
import constants from '../../../data/constants/constants.json' assert { type: 'json' };

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
