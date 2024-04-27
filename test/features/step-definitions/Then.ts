import { Then } from '@wdio/cucumber-framework';
import reporter from '../../helper/reporter.ts';
import { expect, should, assert } from 'chai';

import serviceNowLoginPage from '../../page-objects/ServiceNow/serviceNow.login.page.ts';
import serviceNowInteractionPage from '../../page-objects/ServiceNow/serviceNow.interaction.page.ts';
import serviceNowServicePortalPage from '../../page-objects/ServiceNow/serviceNow.servicePortal.page.ts';
import URLManipulation from '../../helper/URLManipulation.ts';

//Import constants
import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import interaction from '../../../data/constants/interaction.json' assert { type: 'json' };
import incident from '../../../data/constants/incident.json' assert { type: 'json' };
import testData from '../../../data/test-data/testData.json' assert { type: 'json' };

Then(/^I navigate to (.*) application$/, async function (application) {
  if (!application) throw Error(`Given application: ${application} is invalid`);
  application = application.trim().toUpperCase().replace(' ', '_');
  reporter.addStep(
    this.testID,
    'info',
    `Navigating to ${application} application`
  );
  await serviceNowLoginPage.navigateTo(
    //@ts-ignore
    `${browser.options.serviceNowBaseURL}${constants.SN.APPLICATIONS[application]}`
  );

  await URLManipulation.verifyUrl(
    this.testID,
    //@ts-ignore
    `${browser.options.serviceNowBaseURL}${constants.SN.APPLICATIONS[application]}`
  );
});

Then(/^I fill in (.*) mandatory fields$/, async function (form) {
  if (!form) throw Error(`Given form: ${form} is invalid`);
  form = form.trim().toUpperCase().replaceAll(' ', '_');
  let formFields = [];
  switch (form) {
    case 'INCIDENT':
      formFields = incident.FORM_FIELDS;
      break;
    default:
      'INTERACTION';
      formFields = interaction.FORM_FIELDS;
      break;
  }

  reporter.addStep(this.testID, 'info', `Filling in mandatory fields`);
  const ESS_USER = this.temp.ESS_USER;
  const ITIL_USER = this.temp.ITIL_USER;

  const company = ESS_USER.company.name;
  const company_sysID = ESS_USER.company.sys_id;
  const endUser = `${ESS_USER.first_name} ${ESS_USER.last_name}`;
  const endUser_sysID = ESS_USER.sys_id;
  const agentUser = `${ITIL_USER.first_name} ${ITIL_USER.last_name}`;
  const agentUser_sysID = ITIL_USER.sys_id;

  const mandatoryFields = await serviceNowInteractionPage.getMandatoryFields(
    formFields
  );

  const data = testData[this.testID].data;

  console.log(data);

  console.log(mandatoryFields);

  // await browser.debug();

  for (const mandatoryField of mandatoryFields) {
    reporter.addStep(
      this.testID,
      'info',
      `Starting to fill in mandatory field: ${mandatoryField.fieldName} with value: ${mandatoryField.text}`
    );
    await serviceNowInteractionPage.fillMandatoryField(
      mandatoryField.fieldName,
      data.fieldName.fieldValue
    );
  }

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
});

Then(
  /^I can verify (.*) topics availability for (.*) user$/,
  async function (company, role) {
    if (!company || !role)
      throw new Error(`Given company: ${company} or role: ${role} is invalid`);
    company = company.trim().toUpperCase().replace(' ', '_');
    role = role.trim().toUpperCase().replace(' ', '_');
    reporter.addStep(
      this.testID,
      'info',
      `Starting to verify the ${company} available topics`
    );

    await serviceNowServicePortalPage.verifyTopicsAvailability(
      this.testID,
      company,
      role
    );
  }
);
