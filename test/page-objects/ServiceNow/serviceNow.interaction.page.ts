import reporter from '../../helper/reporter.ts';
import Page from '../page.ts';
import { expect as expectChai, should, assert } from 'chai';

import URLManipulation from '../../helper/URLManipulation.ts';
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
    return $(`>>>button[aria-label="Save"]`);
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

  get detailsTab() {
    return $(`>>>button[data-tooltip="Details"]`);
  }

  /**
   * Define Page Actions
   */

  async clickDetailsTab() {
    try {
      const detail = await this.detailsTab;
      await this.click(detail);
    } catch (error) {
      console.log(`Failed at clicking Details Tab, ${error}`);
      throw error;
    }
  }

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
      error.message = `Failed at fillReferenceField for ${fieldName}, ${error.message}`;
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
      const textField = await $(`>>>input[name='${fieldName}']`);
      //fill field
      await this.typeInto(textField, text);
    } catch (error) {
      error.message = `Failed at fillTextField: ${fieldName}, ${error.message}`;
      throw error;
    }
  }

  async clickSaveBtn() {
    await this.click(await this.saveBtn);
  }

  async getField(technicalName: string) {
    if (!technicalName)
      throw Error(`Given technicalName: ${technicalName} is invalid`);
    return $(`>>>[name="${technicalName}"]`);
  }

  async getAllFields(formFields: Array<string>, mandatory = false) {
    let fields = [];

    try {
      //get each field and if it has attribute 'required' then add it to the mandatoryFields array
      for (const formField of formFields) {
        const field = await this.getField(formField);
        await field.waitForDisplayed({
          timeout: 30000,
          interval: 500,
        });
        if (mandatory === true) {
          const isMandatory = await field.getAttribute('required');
          if (isMandatory) {
            const fieldInfo = {
              fieldType: await field.getTagName(),
              fieldName: formField,
            };
            fields.push(fieldInfo);
          }
        } else if (mandatory === false) {
          const isMandatory = await field.getAttribute('required');
          const readOnly = await field.getAttribute('readonly');
          if (!isMandatory && !readOnly) {
            const fieldInfo = {
              fieldType: await field.getTagName(),
              fieldName: formField,
            };
            fields.push(fieldInfo);
          }
        }
      }
      return fields;
    } catch (error) {
      error.message = `Failed at getAllField, ${error.message}`;
      throw error;
    }
  }

  /**
   *
   * @param {object} mandatoryField - the mandatofy field object that contains fieldType and fieldName attributes
   * @param {object} data - the values that will be input to the field that contains text and sys_id attributes. This data should come from the testData.json in data folder
   */
  async fillMandatoryField(mandatoryField, data) {
    if (mandatoryField.fieldType === 'sn-record-choice-connected') {
      await this.fillDropdownFieldValue(
        mandatoryField.fieldName,
        data[mandatoryField.fieldName].text
      );
    } else if (mandatoryField.fieldType === 'sn-record-reference-connected') {
      await this.fillReferenceField(
        mandatoryField.fieldName,
        data[mandatoryField.fieldName].text,
        data[mandatoryField.fieldName].sys_id
      );
    } else if (mandatoryField.fieldType === 'sn-record-input-connected') {
      await this.fillTextField(
        mandatoryField.fieldName,
        data[mandatoryField.fieldName].text
      );
    }
  }
}

export default new InteractionPage();
