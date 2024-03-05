import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect, should, assert } from 'chai';

class InteractionPage extends Page {
  constructor() {
    super();
  }
  /**
   * Define Page Objects
   */
  get rootApp() {
    return $(``);
  }

  //Get all the input boxes

  get companyInputBox() {
    return $(`>>>input[name="company_input"]`);
  }

  get ACMEAmerica() {
    return $(`>>>li[id="98c37b193790200044e0bfc8bcbe5dbe"]`);
  }
  get openedForInputBox() {
    return $(`>>>input[name="opened_for_input"]`);
  }
  get abrahamLincoln() {
    return $(`>>>li[id="a8f98bb0eb32010045e1a5115206fe3a"]`);
  }

  get assignedToInputBox() {
    return $(`>>>input[name="assigned_to_input"]`);
  }

  get ITILUser() {
    return $(`>>>li[id="8174ed6493b402109c6436befaba107a"]`);
  }

  //Get dropdowns

  get callTypeDropdownTrigger() {
    return $(`>>>button[aria-label="Call type"]`);
  }

  get callTypeDropdown() {
    return $(`>>>div[aria-label="Call type"]`);
  }

  get newTicketChoice() {
    return $(`>>>div[id="New ticket"]`);
  }

  get typeDropdownTrigger() {
    return $(`>>>button[aria-label="Type"]`);
  }

  get typeDropdown() {
    return $(`>>>div[aria-label="Type"]`);
  }

  get phoneChoice() {
    return $(`>>>div[id="phone"]`);
  }

  get saveBtn() {
    return $(`>>>button[data-tooltip="Save record and remain here"]`);
  }

  /**
   * Define Page Actions
   */

  async fillCompany(company: string) {
    if (!company) throw Error(`Given company: ${company} is invalid`);
    try {
      await this.typeInto(await this.companyInputBox, company);
      await this.click(await this.ACMEAmerica);
    } catch (err) {
      err.message = `Failed at typing Company with ${company}, ${err.message}`;
      throw err;
    }
  }
  async fillOpenedFor(openedFor: string) {
    if (!openedFor) throw Error(`Given openedFor: ${openedFor} is invalid`);
    try {
      await this.typeInto(await this.openedForInputBox, openedFor);
      await this.click(await this.abrahamLincoln);
    } catch (err) {
      err.message = `Failed at typing 'Opened For' with ${openedFor}, ${err.message}`;
      throw err;
    }
  }
  async fillAssignedTo(assignedTo: string) {
    if (!assignedTo) throw Error(`Given assignedTo: ${assignedTo} is invalid`);
    try {
      await this.typeInto(await this.assignedToInputBox, assignedTo);
      await this.click(await this.ITILUser);
    } catch (err) {
      err.message = `Failed at typing 'Assigned To' with ${assignedTo}, ${err.message}`;
      throw err;
    }
  }

  async chooseNewTicket() {
    try {
      await this.click(await this.callTypeDropdownTrigger);
      await this.click(await this.newTicketChoice);
    } catch (err) {
      err.message = `Failed at choosing New Ticket, ${err.message}`;
      throw err;
    }
  }
  async chosePhone() {
    try {
      await this.click(await this.typeDropdownTrigger);
      await browser.pause(3000);
      await this.click(await this.phoneChoice);
    } catch (err) {
      err.message = `Failed at choosing Phone, ${err.message}`;
      throw err;
    }
  }
  async clickSaveBtn() {
    await this.click(await this.saveBtn);
  }

  async fillInMandatoryFields(
    company: string,
    openedFor: string,
    assignedTo: string
  ) {
    await this.fillCompany(company);
    await this.fillOpenedFor(openedFor);
    await this.fillAssignedTo(assignedTo);
    await this.chooseNewTicket();
    await this.chosePhone();
    await this.clickSaveBtn();
  }
}

export default new InteractionPage();
