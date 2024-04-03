import { setWorldConstructor } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';

class CustomWorld {
  testID: string;
  sysIDArr: Array<String>;
  temp: object;
  constructor() {
    this.testID = '';
    this.sysIDArr = [];
    this.temp = {};
  }
}

setWorldConstructor(CustomWorld);
