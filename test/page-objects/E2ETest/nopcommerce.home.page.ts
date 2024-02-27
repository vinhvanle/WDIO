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
    return $(`#Email`);
  }

  get passwordInputBox() {
    return $(`#Password`);
  }

  get loginBtn() {
    return $(`button=Log in`);
  }

  /**
   * Define Page Actions
   */

  async loginToNopCommerceWeb(
    testID: string,
    url: string,
    username: string,
    password: string
  ) {
    if (!url || !username || !password)
      throw Error(
        `Given data, url: ${url}, username: ${username} or password is not valid`
      );
    url = url.trim();
    username = username.trim();
    try {
      reporter.addStep(testID, 'info', `Login to: ${url} with ${username}`);
      await this.navigateTo(url);
      await this.typeInto(await this.usernameInputBox, username);
      await this.typeInto(await this.passwordInputBox, password);
      await this.click(await this.loginBtn);
      reporter.addStep(
        testID,
        'info',
        `Login to: ${url} with ${username} is successful`
      );
    } catch (err) {
      err.message = `Failed login to nopcommerce web: ${url}, with username: ${username}, ${err.message}`;
      throw err;
    }
  }
}

export default new HomePage();
