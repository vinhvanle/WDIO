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
  if (!application)
    throw new Error(`Given application: ${application} is invalid`);
  try {
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
  } catch (err) {
    reporter.addStep(
      this.testID,
      'error',
      `Error while navigating to ${application}, ${err}`
    );
    throw err;
  }
});

Then(
  /^I fill in (.*) (non-mandatory|mandatory) fields$/,
  async function (form, mandatory) {
    if (!form || !mandatory)
      throw new Error(
        `Given form: ${form} or mandatory: ${mandatory} is invalid`
      );
    try {
      form = form.trim().toUpperCase().replaceAll(' ', '_');
      let formFields = [];
      switch (form) {
        case 'INCIDENT':
          formFields = incident.FORM_FIELDS;
          break;
        case 'INTERACTION':
          formFields = incident.FORM_FIELDS;
          break;
      }

      //Get the user info from world object
      const ESS_USER = this.temp.ESS_USER;
      const ITIL_USER = this.temp.ITIL_USER;

      const data = testData[this.testID].data;
      //Manipulate data to add in newly created users record
      data.company = {
        text: ESS_USER.company.name,
        sys_id: ESS_USER.company.sys_id,
      };
      data.opened_for = {
        text: `${ESS_USER.first_name} ${ESS_USER.last_name}`,
        sys_id: ESS_USER.sys_id,
      };
      data.assigned_to = {
        text: `${ITIL_USER.first_name} ${ITIL_USER.last_name}`,
        sys_id: ITIL_USER.sys_id,
      };
      data.caller_id = {
        text: `${ESS_USER.first_name} ${ESS_USER.last_name}`,
        sys_id: ESS_USER.sys_id,
      };

      //Click details tab
      await serviceNowInteractionPage.clickDetailsTab();

      if (mandatory === 'mandatory') {
        reporter.addStep(this.testID, 'info', `Filling in mandatory fields`);

        //Get all mandatory fields
        const mandatoryFields = await serviceNowInteractionPage.getAllFields(
          formFields,
          true
        );

        for (const mandatoryField of mandatoryFields) {
          reporter.addStep(
            this.testID,
            'info',
            `Starting to fill in mandatory field: ${mandatoryField.fieldName}`
          );
          await serviceNowInteractionPage.fillMandatoryField(
            mandatoryField,
            data
          );
        }
      } else {
        reporter.addStep(
          this.testID,
          'info',
          `Filling in non-mandatory fields`
        );

        //Get all non-mandatory fields
        const nonMandatoryFields = await serviceNowInteractionPage.getAllFields(
          formFields
        );

        for (const nonMandatoryField of nonMandatoryFields) {
          reporter.addStep(
            this.testID,
            'info',
            `Starting to fill in non-mandatory field: ${nonMandatoryField.fieldName}`
          );
          await serviceNowInteractionPage.fillMandatoryField(
            nonMandatoryField,
            data
          );
        }
      }
    } catch (err) {
      reporter.addStep(
        this.testID,
        'error',
        `Error while filling in ${mandatory} fields in ${form}, ${err}`
      );
      throw err;
    }
  }
);

Then(
  /^I can verify (.*) topics availability for (.*) user$/,
  async function (company, role) {
    if (!company || !role)
      throw new Error(`Given company: ${company} or role: ${role} is invalid`);
    try {
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
    } catch (err) {
      reporter.addStep(
        this.testID,
        'error',
        `Error while verifying ${company} topics availability for ${role}`
      );
      throw err;
    }
  }
);
