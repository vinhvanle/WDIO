import request from 'supertest';
import reporter from './reporter.ts';

async function GET(
  testID: string,
  baseURL: string,
  endpoint: string,
  username: string,
  password: string,
  queryParams: object
) {
  if (!baseURL || !endpoint || !username || !password) {
    throw Error(
      `Given baseURL: ${baseURL} and/or endpoint: ${endpoint} is invalid`
    );
  }
  baseURL = baseURL.trim();
  endpoint = endpoint.trim();
  reporter.addStep(testID, 'info', `Making a GET call to ${endpoint}`);
  try {
    return await request(baseURL)
      .get(endpoint)
      .query({ queryParams })
      .auth(username, password)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
  } catch (err) {
    err.message = `Error making a GET call to ${endpoint}, ${err.message}`;
    throw err;
  }
}
async function POST(
  testID: string,
  baseURL: string,
  endpoint: string,
  username: string,
  password: string,
  payload: object,
  queryParams: object
) {
  if (!baseURL || !endpoint || !username || !password || !payload) {
    throw Error(
      `Given baseURL: ${baseURL} or endpoint: ${endpoint} or username: ${username} or password: ${password} or payload: ${JSON.stringify(
        payload
      )} is invalid`
    );
  }
  baseURL = baseURL.trim();
  endpoint = endpoint.trim();
  reporter.addStep(testID, 'info', `Making a POST call to ${endpoint}`);
  try {
    return await request(baseURL)
      .post(endpoint)
      .auth(username, password)
      .set('Content-Type', 'application/json')
      .query(queryParams)
      .send(payload);
  } catch (err) {
    err.message = `Error making a POST call to ${endpoint}, ${err.message}`;
    throw err;
  }
}

async function DELETE(
  testID: string,
  baseURL: string,
  endpoint: string,
  username: string,
  password: string
) {
  if (!baseURL || !endpoint || !username || !password) {
    throw Error(
      `Given baseURL: ${baseURL} or endpoint: ${endpoint} or username: ${username} or password: ${password} is invalid`
    );
  }
  baseURL = baseURL.trim();
  endpoint = endpoint.trim();
  reporter.addStep(testID, 'info', `Making a DELETE call to ${endpoint}`);
  try {
    return await request(baseURL).delete(endpoint).auth(username, password);
  } catch (err) {
    err.message = `Error making a DELETE call to ${endpoint}, ${err.message}`;
    throw err;
  }
}

export default { GET, POST, DELETE };
/**
 * 'https://reqres.in'
 * /api/users?page=2
 */
