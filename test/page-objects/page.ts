import { expect, should, assert } from 'chai';

class Page {
  constructor() {}

  /**
   * All reuseable web functions
   */

  async navigateTo(path: string) {
    await browser.url(path);
    await browser.maximizeWindow();
  }

  async click(ele: WebdriverIO.Element) {
    await ele.waitForClickable({ timeout: 15000 });
    if (!ele.elementId) {
      throw Error(ele.error.message);
    }
    await ele.click();
  }
  async typeInto(ele: WebdriverIO.Element, text: string) {
    await ele.waitForDisplayed({ timeout: 15000 });
    if (!ele.elementId) {
      throw Error(ele.error.message);
    }
    await ele.setValue(text);
  }
}

export default Page;
