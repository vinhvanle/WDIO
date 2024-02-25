import request from 'supertest';
import reporter from './reporter.ts';

async function GET(
  testID: string,
  baseURL: string,
  endpoint: string,
  authToken: string,
  queryParam: object
) {
  if (!baseURL || !endpoint) {
    throw Error(
      `Given baseURL: ${baseURL} and/or endpoint: ${endpoint} is invalid`
    );
  }
  baseURL = baseURL.trim();
  endpoint = endpoint.trim();
  reporter.addStep(testID, 'info', `Making a get call to ${endpoint}`);
  try {
    return await request(baseURL)
      .get(endpoint)
      .query({ queryParam })
      .auth(authToken, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
  } catch (err) {
    err.message = `Error making a GET call to ${endpoint}, ${err.message}`;
    throw err;
  }
}

export default { GET };
/**
 * 'https://reqres.in'
 * /api/users?page=2
 */
