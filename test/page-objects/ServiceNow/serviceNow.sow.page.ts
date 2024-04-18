import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect, should, assert } from 'chai';

class SOWPage extends Page {
  constructor() {
    super();
  }
  /**
   * Define Page Objects
   */
  get appRoot() {
    return $(`//*[@app-id='aa881cad73c4301045216238edf6a716']`);
  }
  get chromeAddNewBtn() {
    return $(`>>>button[id="chrome-add-new-button"]`);
  }

  get newInteractionBtn() {
    return $(
      `>>>//span[@class="sn-canvas-tabs-menu-text" and text()="New Interaction"]`
    );
  }

  get newIncidentBtn() {
    return $(
      `>>>//span[@class="sn-canvas-tabs-menu-text" and text()="New Incident"]`
    );
  }
  /**
   * Define Page Actions
   */

  async clickAddBtn(testID: string) {
    if (!testID) throw Error(`Given testID: ${testID} is invalid`);
    try {
      reporter.addStep(testID, 'info', `Clicking addBtn`);
      await this.click(await this.chromeAddNewBtn);
      await browser.pause(500);
      let isDisplayed = await this.newInteractionBtn.isDisplayed();
      expect(isDisplayed).to.be.true;
    } catch (err) {
      err.message = `Failed at clicking addBtn, ${err.message}`;
      throw err;
    }
  }

  async clickNewInteractionBtn(testID: string) {
    if (!testID) throw Error(`Given testID: ${testID} is invalid`);
    try {
      reporter.addStep(testID, 'info', `Clicking newInteractionBtn`);
      await this.click(await this.newInteractionBtn);
      let url = await browser.getUrl();
    } catch (err) {
      err.message = `Failed at clicking newInteractionBtn, ${err.message}`;
      throw err;
    }
  }

  async openNewInteractionForm(testID: string) {
    if (!testID) throw Error(`Given testID: ${testID} is invalid`);

    reporter.addStep(testID, 'info', `Opening new Interaction form`);
    await this.clickAddBtn(testID);
    await this.clickNewInteractionBtn(testID);
  }
}

export default new SOWPage();
