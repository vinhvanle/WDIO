import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect, should, assert } from 'chai';

class LoginPage extends Page {
  constructor() {
    super();
  }
  /**
   * Define Page Objects
   */
  get usernameInputBox() {
    return $(`#user_name`);
  }

  get passwordInputBox() {
    return $(`#user_password`);
  }

  get loginBtn() {
    return $(`#sysverb_login`);
  }

  /**
   * Define Page Actions
   */

  async loginToServiceNow(testID: string, username: string, password: string) {
    if (!username || !password)
      throw Error(`Given data: username: ${username} or password is not valid`);
    username = username.trim();
    try {
      reporter.addStep(testID, 'info', `Login to serviceNow with ${username}`);
      //@ts-ignore
      await this.navigateTo(`${browser.options.serviceNowBaseURL}/login.do`);
      await this.usernameInputBox.waitForClickable();
      await this.typeInto(await this.usernameInputBox, username);
      await this.typeInto(await this.passwordInputBox, password);
      await this.click(await this.loginBtn);
    } catch (err) {
      err.message = `Failed login to serviceNow with username: ${username}, ${err.message}`;
      throw err;
    }
  }
}

export default new LoginPage();
