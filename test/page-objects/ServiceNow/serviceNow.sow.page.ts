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

  get newFormBtn() {
    return $$(`>>>button[class="sn-canvas-tabs-menu-list-item-button"]`);
  }

  /**
   * Define Page Actions
   */

  async clickAddBtn(testID: string) {
    if (!testID) throw Error(`Given testID: ${testID} is invalid`);
    try {
      await this.click(await this.chromeAddNewBtn);

      const newFormBtn = await this.newFormBtn;

      if (newFormBtn.length > 0) {
        reporter.addStep(testID, 'info', `Successfully clicked addBtn`);
      }
      //Assert that addBtn clicked
      expect(newFormBtn.length).to.be.greaterThan(0);
    } catch (err) {
      err.message = `Failed at clicking addBtn, ${err.message}`;
      throw err;
    }
  }

  async clickNewFormBtn(
    testID: string,
    buttonName: 'New Interaction' | 'New Incident' | 'New Change Request'
  ) {
    if (!testID) throw Error(`Given testID: ${testID} is invalid`);
    try {
      const newFormButtons = await this.newFormBtn;
      let button;
      switch (buttonName) {
        case 'New Interaction':
          button = newFormButtons[0];
          break;
        case 'New Incident':
          button = newFormButtons[1];
          break;
        case 'New Change Request':
          button = newFormButtons[2];
          break;
      }

      //Click the button
      await this.click(button);
      reporter.addStep(
        testID,
        'info',
        `Successfully clicked button: ${buttonName}`
      );
    } catch (err) {
      err.message = `Failed at clicking ${buttonName}, ${err.message}`;
      throw err;
    }
  }

  async openNewInteractionForm(testID: string) {
    if (!testID) throw Error(`Given testID: ${testID} is invalid`);

    reporter.addStep(testID, 'info', `Opening new Interaction form`);
    await this.clickAddBtn(testID);
    await this.clickNewFormBtn(testID, 'New Interaction');
  }
}

export default new SOWPage();
