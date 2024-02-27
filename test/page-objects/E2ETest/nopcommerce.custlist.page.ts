import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect, should, assert } from 'chai';

class CustList extends Page {
  constructor() {
    super();
  }
  /**
   * Define Page Objects
   */
  get firstNameInputBox() {
    return $(`#SearchFirstName`);
  }
  get lastNameInputBox() {
    return $(`#SearchLastName`);
  }
  get searchBtn() {
    return $(`#search-customers`);
  }
  get noResultMessage() {
    return $(`td=No data available in table`);
  }

  /**
   * Define Page Actions
   */

  async searchNameAndConfirm(
    testID: string,
    firstname: string,
    lastname: string
  ): Promise<boolean> {
    if (!firstname || !lastname)
      throw Error(`Invalid firstname: ${firstname}, or lastname: ${lastname}`);
    let nameNotExist = false;
    firstname = firstname.trim();
    lastname = lastname.trim();
    reporter.addStep(
      testID,
      'info',
      `Searching user: ${firstname} ${lastname}`
    );
    try {
      await this.typeInto(await this.firstNameInputBox, firstname);
      await this.typeInto(await this.lastNameInputBox, lastname);
      await this.click(await this.searchBtn);
      await browser.pause(1000);
      let isNotDisplayed = await this.noResultMessage.isDisplayed();
      if (isNotDisplayed) nameNotExist = true;
    } catch (err) {
      throw `Failed searching given firstname: ${firstname}, lastname: ${lastname} on customer list page, ${err}`;
    }
    return nameNotExist;
  }
}

export default new CustList();
