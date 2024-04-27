import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect as expectChai, should, assert } from 'chai';
//Import constants
import constants from '../../../data/constants/constants.json' assert { type: 'json' };
import interaction from '../../../data/constants/interaction.json' assert { type: 'json' };
import incident from '../../../data/constants/incident.json' assert { type: 'json' };

class InteractionPage extends Page {
  constructor() {
    super();
  }
  /**
   * Define Page Objects
   */

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

  get inputFields() {
    return $$(`>>>input[aria-describedby='form-field-label-end ']`);
  }

  get numberField() {
    return $(`>>>//*[@name="number"]`);
  }

  get companyField() {
    return $(`>>>[name="company"]`);
  }

  /**
   * Define Page Actions
   */

  /**
   * Reference field operations
   * *******************************************
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

  async getReferenceField(fieldName: string) {
    if (!fieldName) throw Error(`Given fieldName: ${fieldName} is invalid`);
    fieldName = fieldName.trim().toLowerCase().replace(' ', '_');
    try {
      return $(`>>>input[name="${fieldName}_input"]`);
    } catch (error) {
      error.message = `Failed at getReferenceField: ${fieldName}, ${error.message}`;
      throw error;
    }
  }

  async fillReferenceField(fieldName: string, text: string, sys_id: string) {
    if (!fieldName || !text || !sys_id)
      throw Error(
        `Given fieldName: ${fieldName} or text: ${text}, or sys_id: ${sys_id} is invalid`
      );
    try {
      const field = await this.getReferenceField(fieldName);
      await this.typeInto(field, text);
      await this.click(await this.getReferenceRecord(sys_id));
    } catch (error) {
      error.message = `Failed at fillReferenceField for ${fieldName}`;
      throw error;
    }
  }

  /**
   * ********************************************************************
   */

  /**
   * Dropdown fields operations
   * *******************************************************************
   */

  // async getDropdownField(fieldName: string) {
  //   if (!fieldName) throw Error(`Given fieldName: ${fieldName} is invalid`);
  //   try {
  //     return $(`>>>button[aria-label="${fieldName}"]`);
  //   } catch (error) {
  //     error.message = `Failed at getDropdownField, ${error.message}`;
  //   }
  // }

  async fillDropdownFieldValue(fieldName: string, fieldValue: string) {
    const dropdownChoice = interaction.DROPDOWN_CHOICE;
    if (!fieldName || !fieldValue)
      throw Error(
        `Given fieldName: ${fieldName} or fieldValue: ${fieldValue} is invalid`
      );

    fieldValue = fieldValue
      .trim()
      .toUpperCase()
      .replaceAll(' ', '_')
      .replaceAll('-', '_')
      .replaceAll('/', '');

    const value = dropdownChoice[fieldName][fieldValue];

    try {
      //Get the dropdown field
      const dropdown = await this.getField(fieldName);
      //Open the dropdown list
      await this.click(dropdown);
      //Choose value
      const choice = await $(`>>>div[id="${value}"]`);
      await this.click(choice);
      //Assertion that the choice is selected
      expectChai((await choice.getAttribute('aria-selected')) === 'true');
    } catch (error) {
      error.message = `Failed at setDropdownValue, ${error.message}`;
      throw error;
    }
  }

  /**
   * **********************************************************
   */

  async fillTextField(fieldName: string, text: string) {
    if (!fieldName || !text)
      throw Error(`Given fieldName: ${fieldName} or text: ${text} is invalid`);
    try {
      //get the text field
      const textField = await this.getField(fieldName);
      //fill field
      await this.typeInto(textField, text);
    } catch (error) {
      error.message = `Failed at fillTextField, ${error.message}`;
      throw error;
    }
  }

  async clickSaveBtn() {
    await this.click(await this.saveBtn);
  }

  async getField(technicalName: string) {
    if (!technicalName)
      throw Error(`Given technicalName: ${technicalName} is invalid`);
    return await $(`>>>[name="${technicalName}"]`);
  }

  async getMandatoryFields(formFields: Array<string>) {
    let mandatoryFields = [];

    try {
      //get each field and if it has attribute 'required' then add it to the mandatoryFields array
      for (const formField of formFields) {
        const field = await this.getField(formField);
        await field.waitForDisplayed({
          timeout: 30000,
          interval: 500,
        });
        const isMandatory = await field.getAttribute('required');
        if (isMandatory) {
          const fieldInfo = {
            fieldType: await field.getTagName(),
            fieldName: formField,
          };
          mandatoryFields.push(fieldInfo);
        }
      }
      return mandatoryFields;
    } catch (error) {
      error.message = `Failed at getMandatoryFields, ${error.message}`;
      throw error;
    }
  }

  async fillMandatoryField(mandatoryField, fieldValue) {
    if (mandatoryField.fieldType === 'sn-record-choice-connected') {
      await this.fillDropdownFieldValue(
        mandatoryField.fieldName,
        fieldValue.text
      );
    } else if (mandatoryField.fieldType === 'sn-record-reference-connected') {
      await this.fillReferenceField(
        mandatoryField.fieldName,
        fieldValue.text,
        fieldValue.sys_id
      );
    } else if (mandatoryField.fieldType === 'sn-record-input-connected') {
      await this.fillTextField(mandatoryField.fieldName, fieldValue.text);
    }

    await this.clickSaveBtn();
  }
}

export default new InteractionPage();
