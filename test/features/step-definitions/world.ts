import { setWorldConstructor } from '@wdio/cucumber-framework';
import { expect, should, assert } from 'chai';

class CustomWorld {
  testID: string;
  constructor() {
    this.testID = '';
  }
}

setWorldConstructor(CustomWorld);
