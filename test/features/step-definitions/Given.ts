import { Given } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';

import prepareTestData from '../../helper/prepareTestData.ts';
import reporter from '../../helper/reporter.ts';

import constants from '../../../data/constants/constants.json' assert { type: 'json' };

import serviceNowLoginPage from '../../page-objects/ServiceNow/serviceNow.login.page.ts';

Given(/^Create a new (.*) (.*) user record$/, async function (company, role) {
  if (!company || !role)
    return new Error(`Given company: ${company} or role: ${role} is invalid`);
  //Manipulate input:
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

  //save user to temp object:
  this.temp[`${role}_USER`] = userInfo;
});

Given(/^As an (.*) user I login to serviceNow$/, async function (role) {
  if (!role) throw Error(`The given user: ${role} is invalid`);
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
});
