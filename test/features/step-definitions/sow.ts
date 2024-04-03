import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';
import reporter from '../../helper/reporter.ts';
import prepareTestData from '../../helper/prepareTestData.ts';
import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import fieldValue from '../../../data/constants/fieldValues.json' assert { type: 'json' };
import serviceNowLoginPage from '../../page-objects/ServiceNow/serviceNow.login.page.ts';
import serviceNowSowPage from '../../page-objects/ServiceNow/serviceNow.sow.page.ts';
import serviceNowInteractionPage from '../../page-objects/ServiceNow/serviceNow.interaction.page.ts';
import URLManipulation from '../../helper/URLManipulation.ts';

Given(/^Create a new (.*) (.*) user record$/, async function (company, role) {
  if (!company || !role)
    return new Error(`Given company: ${company} or role: ${role} is invalid`);
  //Manipulate input:
  company = company.trim().toUpperCase().replace(' ', '_');
  role = role.trim().toUpperCase().replace(' ', '_');

  const userInfo = {
    user_name: `WDIO.${role}.user`,
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
    constants.SN.QUERY_PARAM
  );

  const addUserToGroupPayload = {
    user: user.sys_id,
    group: constants.SN.COMPANIES[company]['GROUPS'][role],
  };

  //Add user to group
  const addUserToGroup = await prepareTestData.createRecord(
    this.testID,
    'sys_user_grmember',
    addUserToGroupPayload,
    {}
  );

  //Add sysid to global array for removal later
  this.sysIDArr.push(user);
  this.sysIDArr.push(addUserToGroup);

  //save user to temp object:
  this.temp[`${role}_USER`] = userInfo;
});

Given(/^As an (.*) user login to serviceNow$/, async function (role) {
  if (!role) throw Error(`The given user: ${role} is invalid`);
  role = role.trim().toUpperCase().replace(' ', '_');

  const userInfo = this.temp[`${role}_USER`];

  try {
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

    // await browser.pause(2000);
  } catch (err) {
    err.message = `Failed at filling in mandatory fields, ${err.message}`;
    throw err;
  }
});

Then(/^I can remove test data$/, async function () {
  reporter.addStep(this.testID, 'info', 'Starting to remove test data');
  const records = this.sysIDArr;

  if (records.length !== 0) {
    try {
      //Delete from the back towards the beginning of the arr so that it delete child records first
      for (let i = records.length - 1; i >= 0; i--) {
        const record = records[i];
        try {
          await prepareTestData.deleteRecord(
            this.testID,
            record.table,
            record.sys_id
          );
        } catch (error) {
          console.error(`Error deleting record: ${record}, error: ${error}`);
        }
      }
    } catch (error) {
      console.warn(`Error rolling back data: ${error}`);
    } finally {
      console.info('Data rollback completed!');
    }
  }
});
