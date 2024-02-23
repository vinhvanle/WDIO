import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';

/**
 * Demo.feature
 */
Given(/^Google page is opened$/, async function () {
  await browser.maximizeWindow();
  await browser.url('https://google.com');
  //   await browser.pause(3000);
  // console.log(`>> Browser Obj: ${JSON.stringify(browser)}`);
});

When(/^Search with (.*)$/, async function (searchItem) {
  let searchBox = await $(`[name=q]`);
  await searchBox.setValue(searchItem);
  //   await browser.pause(3000);
  await browser.keys('Enter');
  // console.log(`>> Element Obj: ${JSON.stringify(searchBox)}`);
});

Then(/^Click on first search result$/, async function () {
  let ele = await $(`h3`);
  await ele.click();
  //   await browser.pause(3000);
});

Then(/^URL should match (.*)$/, async function (expectedURL) {
  await browser.waitUntil(
    async () => {
      return (
        (await browser.getTitle()) ===
        'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO'
      );
    },
    {
      timeout: 20000,
      interval: 500,
      timeoutMsg: `Could not load the page, current title: ${await browser.getTitle()}`,
    }
  );
  let url = await browser.getUrl();
  expect(url).to.equal(expectedURL);
});

/**
 * WebInteractions.feature
 */

Given(/^A web page is opened at (.*)$/, async function (URL) {
  await browser.url(URL);
  await browser.setTimeout({ implicit: 15000, pageLoad: 10000 });
  await browser.maximizeWindow();
});

When(/^Perform web interactions at (.*)$/, async function (URL) {
  /**
   * Input box - type, clear, slow typing
   * Actions:
   * 1. Type into input box
   * 2. Clear the field and type or just addValue
   * 3. Click an type
   * 4. Slow typing
   */

  // await browser.url(`${URL}/inputs`);
  // //1. + 2. + 3.
  // let ele = await $(`input[type=number]`);
  // // await ele.moveTo();
  // // await ele.scrollIntoView();
  // // await ele.click();
  // // await ele.setValue(12345);
  // // await ele.addValue('9876');

  // //4.
  // let num = 12345;
  // let strNum = num.toString();
  // await ele.click();
  // for (let i = 0; i < strNum.length; i++) {
  //   let char = strNum.charAt(i);
  //   await browser.pause(1000);
  //   await browser.keys(char);
  // }

  /**2. Dropdown
   * Actions:
   * 1. Assert default option is selected
   * 2. Select by attribute, text, index
   * 3. Get a list of options
   */

  // await browser.url(`${URL}/dropdown`);

  // //1. Assert default option is selected

  // let ele = await $('//select[@id="dropdown"]/option[@selected="selected"]');
  // let val = await ele.getText();
  // expect(val).to.equal('Please select an option');

  // //2. Select a specific option

  // let ddEle = await $('#dropdown');
  // await browser.pause(1000);
  // await ddEle.selectByAttribute('value', '1');
  // await browser.pause(1000);
  // await ddEle.selectByIndex(2);
  // await browser.pause(1000);
  // await ddEle.selectByVisibleText('Option 1');

  // //3. Get a list of options
  // let ddEle = await $$('//select[@id="dropdown"]/option');
  // let options = [];
  // const expectedOptions = ['Please select an option', 'Option 1', 'Option 2'];
  // await ddEle.forEach(async (ele) => {
  //   let text = await ele.getText();
  //   options.push(text);
  // });

  // //traditional way to compare two arrays
  // for (let i = 0; i < options.length; i++) {
  //   expect(options[i]).to.equal(expectedOptions[i]);
  // }
  // //faster way to compare two arrays
  // expect(options).to.deep.equal(expectedOptions);

  /**
   * 3. Checkbox
   * Actions:
   * 1. Select an option
   * 2. Unselect an option (if selected)
   * 3. Assert if option is selected
   * 4. Select all options
   */

  // await browser.url(`${URL}/checkboxes`);

  // let eleArray = await $$(`//form[@id="checkboxes"]/input`);
  // let result = [];
  // let expectedResult = [true, true];
  // for (let i = 0; i < eleArray.length; i++) {
  //   let ele = eleArray[i];
  //   if (!(await ele.isSelected())) {
  //     await ele.click();
  //   }
  //   let isChecked = await ele.isSelected();
  //   result.push(isChecked);
  // }
  // console.log(result);

  // expect(result).to.deep.equal(expectedResult);

  /**
   * 4. Windows handling
   * Steps:
   * 1. Launch the browser
   * 2. Open another window
   * 3. Switch to the window based on title
   * 4. Switch back to the main window
   *
   * Methods used:
   * 1. getTitle()
   * 2. getWindowHandle()
   * 3. getWindowHandles()
   * 4. switchToWindow()
   */

  // await browser.url(`${URL}/windows`);

  // //Open new windows
  // (await $('=Click Here')).click();
  // (await $('=Elemental Selenium')).click();
  // let firstWindowTitle = await browser.getTitle();
  // let firstWindowHandle = await browser.getWindowHandle();

  // //Switch to specific window
  // let winHandles = await browser.getWindowHandles();
  // let currentWindowHandle = await browser.getWindowHandle();
  // let currentWindowTitle = await browser.getTitle();
  // for (let i = 0; i < winHandles.length; i++) {
  //   console.log(`>> Win handle: ${winHandles[i]}`);
  //   await browser.switchToWindow(winHandles[i]);
  //   console.log(`>>Current page title: ${currentWindowTitle}`);
  //   if (currentWindowHandle === 'Home | Elemental Selenium') {
  //     let headerTxt = (await $('<h1>')).getText();
  //     expect(headerTxt).to.equal('Elemental Selenium');
  //     break;
  //   }
  // }
  // //Switch back to parent window
  // await browser.switchToWindow(firstWindowHandle);
  // let parentTxt = await (await $('<h3>')).getText();
  // console.log(`>>Current page header: ${parentTxt}`);

  /**
   *4. Handling alerts

   Methods used: 
   1. isAlertOpen()
   2. acceptAlert()
   3. dismissAlert()
   4. getAlertText()
   5. sendAlertText()
   */

  // await browser.url(`${URL}/javascript_alerts`);

  // await (await $(`button=Click for JS Alert`)).click();
  // if (await browser.isAlertOpen()) {
  //   await browser.pause(2000);
  //   await browser.acceptAlert();
  //   let result = await (await $('#result')).getText();
  //   expect(result).to.equal('You successfully clicked an alert');
  // }

  // await (await $(`button=Click for JS Confirm`)).click();
  // if (await browser.isAlertOpen()) {
  //   await browser.pause(2000);
  //   await browser.dismissAlert();
  //   let result = await (await $('#result')).getText();
  //   expect(result).to.equal('You clicked: Cancel');
  // }

  // await (await $(`button=Click for JS Prompt`)).click();
  // if (await browser.isAlertOpen()) {
  //   await browser.pause(1000);
  //   await browser.sendAlertText('hello from Automation');
  //   await browser.pause(1000);
  //   await browser.acceptAlert();
  //   let result = await (await $('#result')).getText();
  //   expect(result).to.equal('You entered: hello from Automation');
  // }

  // await browser.url(
  //   `https://admin:admin@the-internet.herokuapp.com/basic_auth`
  // );

  // let text = await $(`//*[@id="content"]/div/p`).getText();
  // expect(text).to.equal(
  //   'Congratulations! You must have the proper credentials.'
  // );

  /**
   * 5. File Upload
   */

  // await browser.url(`${URL}/upload`);
  // await $('#file-upload').addValue(
  //   `${process.cwd()}/data/file-upload/dummy.txt`
  // );
  // await (await $('#file-submit')).click();

  // let result = await (await $('#uploaded-files')).getText();
  // expect(result).to.equal('dummy.txt');

  /**
   * 6. Frames
   * Methods used:
   * 1. switchToFrame
   * 2. switchToParentFrame
   */

  // await browser.url(`${URL}/frames`);

  // await $(`=iFrame`).click();

  // //Switch to frame

  // let iframe = await $(`#mce_0_ifr`);
  // await browser.switchToFrame(iframe);

  // //iframe interaction

  // await $('#tinymce').click();

  // await browser.keys(['Meta', 'A']);
  // await browser.pause(2000);
  // await browser.keys('Delete');
  // await browser.pause(2000);

  // await $('#tinymce').addValue('hahahahahahaha');

  // //back to parent frame
  // await browser.switchToParentFrame();

  // expect(await $('<h3>').getText()).to.equal(
  //   'An iFrame containing the TinyMCE WYSIWYG Editor'
  // );

  /**
   * 7. Basic scrolling
   * Methods: (Element methods)
   * 1. scrollIntoView
   */
  // await browser.url('https://amazon.co.uk');

  // await $('span=Best Sellers in Books').scrollIntoView();

  /**
   * Web tables
   * What are we going to cover:
   * 1. Check number of rows and columns
   * 2. Get whole table data
   * 3. Get single row [based on a condition]
   * 4. Get single column
   * 5. Get single cell value [based on another cell]
   *
   */

  // await browser.url(`${URL}/tables`);

  // //1. Check number of rows and columns
  // let rowCount = await $$(`//table[@id='table1']/tbody/tr`).length;
  // expect(rowCount).to.equal(4);
  // console.log(`>> Number of rows: ${rowCount}`);

  // let colCount = await $$(`//table[@id='table1']/thead/tr/th`).length;
  // expect(colCount).to.equal(6);
  // console.log(`>> Number of columns: ${colCount}`);

  //2. get whole table data
  // let data = [];

  // for (let i = 0; i < rowCount; i++) {
  //   let personObj = {
  //     lastname: '',
  //     firstname: '',
  //     email: '',
  //     due: '',
  //     web: '',
  //   };
  //   for (let j = 0; j < colCount; j++) {
  //     let celValue = await $(
  //       `//table[@id='table1']/tbody/tr[${i + 1}]/td[${j + 1}]`
  //     ).getText();
  //     if (j === 0) personObj.lastname = celValue;
  //     if (j === 1) personObj.firstname = celValue;
  //     if (j === 2) personObj.email = celValue;
  //     if (j === 3) personObj.due = celValue;
  //     if (j === 4) personObj.web = celValue;
  //   }
  //   data.push(personObj);
  // }
  // console.log(`>>> Data: ${JSON.stringify(data)}`);

  // //3. Get single row (based on a condition)
  // let data = [];

  // for (let i = 0; i < rowCount; i++) {
  //   let personObj = {
  //     lastname: '',
  //     firstname: '',
  //     email: '',
  //     due: '',
  //     web: '',
  //   };
  //   for (let j = 0; j < colCount; j++) {
  //     let cellValue = await $(
  //       `//table[@id='table1']/tbody/tr[${i + 1}]/td[${j + 1}]`
  //     ).getText();
  //     let firstname = await $(
  //       `//table[@id='table1']/tbody/tr[${i + 1}]/td[2]`
  //     ).getText();
  //     if (firstname === 'Jason') {
  //       if (j === 0) personObj.lastname = cellValue;
  //       if (j === 1) personObj.firstname = cellValue;
  //       if (j === 2) personObj.email = cellValue;
  //       if (j === 3) personObj.due = cellValue;
  //       if (j === 4) personObj.web = cellValue;
  //     }
  //   }
  //   if (personObj.firstname) {
  //     data.push(personObj);
  //   }
  // }
  // console.log(data);

  // //4. Get single column
  // let arr = [];
  // for (let i = 0; i < rowCount; i++) {
  //   let cellValue = await $(
  //     `//table[@id='table1']/tbody/tr[${i + 1}]/td[4]`
  //   ).getText();
  //   arr.push(cellValue);
  // }
  // console.log(arr);

  // //5. Get single cell value based on another cell

  // let arr = [];
  // for (let i = 0; i < rowCount; i++) {
  //   let price = await $(
  //     `//table[@id='table1']/tbody/tr[${i + 1}]/td[4]`
  //   ).getText();
  //   let firstname = await $(
  //     `//table[@id='table1']/tbody/tr[${i + 1}]/td[2]`
  //   ).getText();

  //   if (+price.replace('$', '') > 50) {
  //     arr.push(firstname);
  //   }
  // }
  // console.log(arr);

  /**
   *8. Scrolling

   Visible Portion
   windows object: 
   1. scrollBy
   Y -> [-]window.innerHeight
   */
  // await browser.url('https://vi.wikipedia.org');
  // //Scroll down
  // await browser.execute(() => {
  //   window.scrollBy(0, window.innerHeight);
  // });
  // await browser.pause(2000);

  // //SCroll top
  // await browser.execute(() => {
  //   window.scrollBy(0, -window.innerHeight);
  // });

  // /**
  //  * Invisible portion
  //  * windows object:
  //  * 1. scrollTo
  //  * Y => document.body.scrollTop[scrollHeight]
  //  */
  // await browser.pause(2000);
  // await browser.execute(() => {
  //   window.scrollTo(0, document.body.scrollHeight);
  // });

  // await browser.pause(2000);
  // await browser.execute(() => {
  //   window.scrollTo(0, document.body.scrollTop);
  // });

  await browser.debug();
});
