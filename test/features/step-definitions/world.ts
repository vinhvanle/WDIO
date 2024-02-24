import { setWorldConstructor } from '@wdio/cucumber-framework';
import { expect, should } from 'chai';

class CustomWorld {
  testID: string;
  constructor() {
    this.testID = '';
  }
}

setWorldConstructor(CustomWorld);
