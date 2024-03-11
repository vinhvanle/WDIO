import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect, should, assert } from 'chai';

import fieldValues from '../../../data/constants/fieldValues.json' assert { type: 'json' };

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

  get openedForInputBox() {
    return $(`>>>input[name="opened_for_input"]`);
  }

  get assignedToInputBox() {
    return $(`>>>input[name="assigned_to_input"]`);
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
  get statusCallChoice() {
    return $(`>>>div[id="Status Call"]`);
  }
  get hangUpChoice() {
    return $(`>>>div[id="Hang up/Wrong number"]`);
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
  get emailChoice() {
    return $(`>>>div[id="Email]`);
  }
  get walkInChoice() {
    return $(`>>>div[id="Walk-in"]`);
  }

  get saveBtn() {
    return $(`>>>button[data-tooltip="Save record and remain here"]`);
  }

  /**
   * Define Page Actions
   */

  async getReferenceRecord(sysID: string) {
    if (!sysID) throw Error(`Given sysID: ${sysID} is invalid`);
    try {
      return await $(`>>>li[id="${sysID}"]`);
    } catch (err) {
      err.message = `Failed at getting the reference value with sysID: ${sysID}, ${err.message}`;
      throw err;
    }
  }

  // async getDropdownChoice(choiceValue: string) {
  //   if (!choiceValue)
  //     throw Error(`Given choiceValue: ${choiceValue} is invalid`);
  //   try {
  //     return await $(`>>>div[id="${choiceValue}"]`);
  //   } catch (err) {}
  // }

  async fillCompany(company: string) {
    if (!company) throw Error(`Given company: ${company} is invalid`);
    try {
      await this.typeInto(await this.companyInputBox, company);
      const sys_id = fieldValues.INTERACTION.SYS_ID[company];
      console.log(sys_id);

      await this.click(await this.getReferenceRecord(sys_id));
    } catch (err) {
      err.message = `Failed at typing Company with ${company}, ${err.message}`;
      throw err;
    }
  }
  async fillOpenedFor(openedFor: string) {
    if (!openedFor) throw Error(`Given openedFor: ${openedFor} is invalid`);
    try {
      await this.typeInto(await this.openedForInputBox, openedFor);
      const sys_id = fieldValues.INTERACTION.SYS_ID[openedFor];
      console.log(sys_id);
      await this.click(await this.getReferenceRecord(sys_id));
    } catch (err) {
      err.message = `Failed at typing 'Opened For' with ${openedFor}, ${err.message}`;
      throw err;
    }
  }
  async fillAssignedTo(assignedTo: string) {
    if (!assignedTo) throw Error(`Given assignedTo: ${assignedTo} is invalid`);
    try {
      await this.typeInto(await this.assignedToInputBox, assignedTo);
      const sys_id = fieldValues.INTERACTION.SYS_ID[assignedTo];
      console.log(sys_id);
      await this.click(await this.getReferenceRecord(sys_id));
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
