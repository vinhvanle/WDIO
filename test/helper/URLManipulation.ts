import { expect, should } from 'chai';

async function verifyUrl(testID: string, expectedURL: string) {
  if (!testID || !expectedURL)
    throw new Error(
      `Given testID: ${testID} or expectedURL: ${expectedURL} is invalid!`
    );
  try {
    const URL = await browser.getUrl();
    chai.expect(URL).to.equal(expectedURL);
  } catch (error) {
    error.message = `Error verifying URL: ${error.message}`;
  }
}

function extractRecordDetails(url: string, level: 'top' | 'sub') {
  // Split the URL by '/'
  const parts = url.split('/');

  // Find the index of the first occurrence of 'record'
  const recordIndex = parts.indexOf('record');

  // Calculate the index based on the desired level
  const startIndex = level === 'top' ? recordIndex + 1 : recordIndex + 5;

  // Extract the table name and sys_id
  const table = parts[startIndex];
  const sys_id = parts[startIndex + 1];

  return { table, sys_id };
}

export default { verifyUrl, extractRecordDetails };
