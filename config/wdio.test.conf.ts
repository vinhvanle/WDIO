import { config as baseConfig } from '../wdio.conf.ts';

export const config = Object.assign(baseConfig, {
  //All test env specific key value pairs
  environment: 'TEST',
  sauceDemoURL: 'https://saucedemo.com',
  reqresBaseURL: 'https://reqres.in',
  nopCommerceBaseURL: 'https://admin-demo.nopcommerce.com',
});
