import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect, should, assert } from 'chai';

class HomePage extends Page {
  constructor() {
    super();
  }
  /**
   * Define Page Objects
   */
  get usernameInputBox() {
    return $(`#user-name`);
  }

  get passwordInputBox() {
    return $(`#password`);
  }

  get loginBtn() {
    return $(`#login-button`);
  }

  /**
   * Define Page Actions
   */
  async enterUsername(testID: string, username: string) {
    if (!username) {
      throw Error(`The given username: ${username} is Invalid`);
    }
    try {
      username = username.trim();
      await this.typeInto(await this.usernameInputBox, username);
      reporter.addStep(
        testID,
        'info',
        `Username: ${username} entered successfully`
      );
    } catch (err) {
      err.message = `Error entering username: ${username}, ${err.message}`;
      throw err;
    }
  }
  async enterPassword(testID: string, password: string) {
    if (!password) {
      throw Error(`The given password is Invalid`);
    }
    try {
      password = password.trim();
      await this.typeInto(await this.passwordInputBox, password);
      reporter.addStep(testID, 'info', `Password entered successfully`);
    } catch (err) {
      err.message = `Error entering password, ${err.message}`;
      throw err;
    }
  }
  async clickLoginBtn(testID: string) {
    try {
      await this.click(await this.loginBtn);
      reporter.addStep(testID, 'info', 'Login button clicked!');
    } catch (err) {
      err.message = `Error clicking the Login button, ${err.message}`;
      throw err;
    }
  }

  async loginToSauceApp(testID: string, username: string, password: string) {
    try {
      await this.enterUsername(testID, username);
      await this.enterPassword(testID, password);
      await this.clickLoginBtn(testID);
    } catch (err) {
      throw err;
    }
  }
}

export default new HomePage();
