import { setWorldConstructor } from '@wdio/cucumber-framework';
import { expect, should } from 'chai';

class CustomWorld {
  testID: string;
  environment: string;
  constructor() {
    this.testID = '';
    this.environment = '';
  }
}

setWorldConstructor(CustomWorld);
