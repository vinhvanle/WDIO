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

  get newInteractionBtn() {
    return $(
      `>>>button[class='sn-canvas-tabs-menu-list-item-button'][tabindex='1']`
    );
  }

  get newIncidentBtn() {
    return $(
      `>>>button[class='sn-canvas-tabs-menu-list-item-button'][tabindex='2']`
    );
  }

  get newChangeRequestBtn() {
    return $(
      `>>>button[class='sn-canvas-tabs-menu-list-item-button'][tabindex='3']`
    );
  }

  /**
   * Define Page Actions
   */

  async clickAddBtn(testID: string) {
    if (!testID) throw Error(`Given testID: ${testID} is invalid`);
    try {
      await this.click(await this.chromeAddNewBtn);
      const newFormBtn = await this.newFormBtn;
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
      let button: WebdriverIO.Element;
      switch (buttonName) {
        case 'New Interaction':
          button = await this.newInteractionBtn;
          break;
        case 'New Incident':
          button = await this.newIncidentBtn;
          break;
        case 'New Change Request':
          button = await this.newChangeRequestBtn;
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

  async openNewForm(testID: string, form: string) {
    if (!testID || !form)
      throw new Error(`Given testID: ${testID} or form: ${form} is invalid`);
    const buttonName = {
      INTERACTION: 'New Interaction',
      INCIDENT: 'New Incident',
      CHANGE_REQUEST: 'New Change Request',
    };
    try {
      reporter.addStep(testID, 'info', `Opening new ${form} form`);
      await this.clickAddBtn(testID);
      await this.clickNewFormBtn(testID, buttonName[form]);
    } catch (error) {
      error.message = `Failed at opening new ${form} form, ${error.message}`;
      throw error;
    }
  }
}

export default new SOWPage();
