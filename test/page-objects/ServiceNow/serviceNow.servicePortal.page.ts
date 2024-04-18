import reporter from '../../helper/reporter.ts';
import { expect, should, assert } from 'chai';
import Page from '../page.ts';
import constants from '../../../data/constants/constants.json' assert { type: 'json' };

class ServicePortalPage extends Page {
  constructor() {
    super();
  }

  /**
   * Define page elements
   */

  get VAButton() {
    return $(`button[class*='sp-ac-btn']`);
  }

  get newConversationClicker() {
    return $(`>>>div[class*="new-conversation-clicker"]`);
  }

  get showMeEverythingButton() {
    return $(`>>>div[id='all-topic-picker']`);
  }

  get VAChatIframe() {
    return $(`iframe[class='sp-ac-frame'][title='Agent Chat Window']`);
  }

  get topicList() {
    return $(`>>>div[aria-labelledby="full-topic-list-header"]`);
  }

  get topics() {
    return $$(`>>>li[class="sn-cs-topic-container"]`);
  }

  /**
   * Define page functions
   */

  /**
   * Todo:
   * 1. When first go to a sp page, check if the VA chat is already opened
   *      a. If Already opened, check if it is an old conversation, end the conversation then start a new one
   *      b. If new conversation, then do nothing
   * 2. If VA chat is not opened yet, open one and start a new conversation
   */

  async openVAConversation(testID: string) {
    try {
      const VAButton = await this.VAButton;
      await this.click(VAButton);

      //Check if the VA chat is already opened
      if (
        (await VAButton.getAttribute('aria-label')) === 'Minimize chat window'
      ) {
        //switch to Chat iframe
        await this.switchToVAChatIframe(testID);
        //VA is already opened, check conversation
        await this.checkConversation(testID);
        //Asertion to make sure it is a new conversation
      } else if (
        (await VAButton.getAttribute('aria-label')) === 'Open chat window'
      ) {
        //Conversation is closed, open it
        await this.click(VAButton);
        //Switch to Chat iframe
        await this.switchToVAChatIframe(testID);
        //Check the conversation
        await this.checkConversation(testID);
      }
    } catch (error) {
      error.message = `Failed at openVAConversation: ${error.message}`;
      throw error;
    }
  }

  async checkConversation(testID: string) {
    try {
      const conversationClicker = await this.newConversationClicker;
      if (
        (await conversationClicker.getAttribute('aria-label')) ===
          'Start a new conversation' &&
        (await conversationClicker.getAttribute('aria-disabled')) === 'true'
      ) {
        //It is a new conversation. Do nothing
        //Asserts that it is a new conversation
        expect(await conversationClicker.getAttribute('aria-label')).to.equal(
          'Start a new conversation'
        );
        expect(
          await conversationClicker.getAttribute('aria-disabled')
        ).to.equal('true');

        reporter.addStep(
          testID,
          'info',
          `New VA conversation started successful`
        );
        return;
      } else if (
        (await conversationClicker.getAttribute('aria-label')) ===
        'End conversation'
      ) {
        //Need to start a new conversation

        //Close the current conversation
        await this.click(conversationClicker);

        reporter.addStep(testID, 'info', `Old conversation closed successful`);

        //Wait until the clicker has changed its state to start a new conversation
        await browser.waitUntil(
          async function () {
            return (
              (await conversationClicker.getAttribute('aria-label')) ===
                'Start a new conversation' &&
              (await conversationClicker.getAttribute('aria-disabled')) ===
                'true'
            );
          },
          {
            timeout: 30000,
            interval: 500,
          }
        );

        //Start a new conversation
        await this.click(conversationClicker);

        //Asserts that it is a new conversation
        expect(await conversationClicker.getAttribute('aria-label')).to.equal(
          'Start a new conversation'
        );
        expect(
          await conversationClicker.getAttribute('aria-disabled')
        ).to.equal('true');

        reporter.addStep(
          testID,
          'info',
          `New VA conversation started successful`
        );
      }
    } catch (err) {
      err.message = `Failed at checkConversation: ${err.message}`;
      throw err;
    }
  }

  async switchToVAChatIframe(testID: string) {
    try {
      const iframe = await this.VAChatIframe;
      await browser.switchToFrame(iframe);
      reporter.addStep(testID, 'info', `Switched to VA chat iframe`);
    } catch (error) {
      error.message = `Failed at switchToVAChatIframe: ${error.message}`;
      throw error;
    }
  }

  async switchToParentFrame(testID: string) {
    try {
      await browser.switchToParentFrame();
      reporter.addStep(testID, 'info', 'Switched back to parent frame');
    } catch (error) {
      error.message = `Failed at switchToParentFrame: ${error.message}`;
      throw error;
    }
  }

  async clickShowMeEverything(testID) {
    try {
      const showMeEverything = await this.showMeEverythingButton;
      await showMeEverything.waitForDisplayed({
        timeout: 30000,
        interval: 500,
      });
      await this.click(showMeEverything);
      reporter.addStep(testID, 'info', 'Clicked Show Me Everything successful');
      const topicList = await this.topicList;
      //Assertion to make sure the topic list is displayed
      expect(await topicList.getAttribute('class')).to.contains('visible');
    } catch (err) {
      err.message = `Failed at clickShowMeEverything: ${err.message}`;
      throw err;
    }
  }

  async verifyTopicsAvailability(
    testID: string,
    company: string,
    role: string
  ) {
    try {
      let availableTopics = constants.SN.COMPANIES[company].VA.TOPICS[role];
      let counter = availableTopics.length;

      const topics = await this.topics;

      for (const topic of topics) {
        const topicName = await topic.getAttribute('data-topic-name');

        if (availableTopics.includes(topicName)) {
          counter = counter - 1;
        }
      }

      //assert if all topics are available
      expect(counter).to.equal(0);
      if (counter === 0) {
        reporter.addStep(
          testID,
          'info',
          `Sucessfully verified topic availability for ${company} ${role} user`
        );
      } else {
        reporter.addStep(
          testID,
          'error',
          `Topics availability doesn't match for ${company} ${role} user`
        );
      }
    } catch (error) {
      error.message = `Failed at verifyTopicsAvailability, ${error.message}`;
      throw error;
    }
  }
}

export default new ServicePortalPage();
