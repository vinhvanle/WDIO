import reporter from '../../helper/reporter.ts';
import { expect, should, assert } from 'chai';
import Page from '../page.ts';

class LandingPage extends Page {
  constructor() {
    super();
  }

  /**
   * Define page elements
   */

  get navigationFilter() {
    return $(`>>>input[id='filter']`);
  }

  /**
   * Define page functions
   */

  async searchFilter() {
    await this.click(await this.navigationFilter);
    await this.typeInto(await this.navigationFilter, 'Incident');
  }

  async clickModuleLink(moduleID: string) {
    const link = await $(`>>>a[id="${moduleID}"]`);
    await link.waitForClickable({ timeout: 15000, interval: 500 });
    await this.click(link);
  }
}

export default new LandingPage();
