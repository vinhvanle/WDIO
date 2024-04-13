import apiHelper from './apiHelper.ts';
import reporter from './reporter.ts';
import constants from '../../data/constants/constants.json' assert { type: 'json' };

async function createRecord(
  testID: string,
  table: string,
  payload: object,
  queryParams: object
) {
  const endpoint = `/api/now/table/${table}`;
  if (!testID || !table || !payload || !queryParams)
    throw new Error(
      `Given TestID: ${testID} or table: ${table} or payload: ${payload} or queryParams: ${queryParams} is invalid`
    );

  try {
    const res = await apiHelper.POST(
      testID,
      //@ts-ignore
      browser.options.serviceNowBaseURL,
      endpoint,
      process.env.SERVICENOW_ADMIN_USERNAME,
      process.env.SERVICENOW_ADMIN_PASSWORD,
      payload,
      queryParams
    );

    if (res.ok) {
      const sys_id = res.body.result.sys_id;

      reporter.addStep(
        testID,
        'info',
        `Record created successfully, sys_id: ${sys_id}, table: ${table}`
      );

      return { sys_id, table };
    }
  } catch (error) {
    error.message = `Failed to create new record in ${table} with information: ${JSON.stringify(
      payload
    )}, ${error.message}`;
    throw error;
  }
}

async function deleteRecord(testID: string, table: string, record: string) {
  const endpoint = `/api/now/table/${table}/${record}`;
  if (!testID || !record)
    throw new Error(`Given TestID: ${testID} or record: ${record} is invalid`);
  try {
    const res = await apiHelper.DELETE(
      testID,
      //@ts-ignore
      browser.options.serviceNowBaseURL,
      endpoint,
      process.env.SERVICENOW_ADMIN_USERNAME,
      process.env.SERVICENOW_ADMIN_PASSWORD
    );

    if (res.ok) {
      reporter.addStep(
        testID,
        'info',
        `Record: ${record} deleted successfully, status code: ${res.status} `
      );
    } else if (res.status === 403) {
      reporter.addStep(
        testID,
        'warn',
        `Record: ${record} delete failed, forbidden: ${res.status}`
      );
    } else if (res.status === 404) {
      reporter.addStep(testID, 'warn', `Record: ${record} not found!`);
    }
  } catch (error) {
    error.message = `Failed to delete record: ${record}, ${error.message}`;
    throw error;
  }
}

async function dataRollBack(testID, rollback, records) {
  if (rollback.trim().toUpperCase() === 'Y') {
    if (records.length !== 0) {
      console.log(`<<<<<< Starting to clean up data >>>>>>`);

      try {
        //Delete from the back towards the beginning of the arr so that it delete child records first
        for (let i = records.length - 1; i >= 0; i--) {
          const record = records[i];

          await this.deleteRecord(testID, record.table, record.sys_id);
        }
      } catch (error) {
        console.warn(`Error rolling back data: ${error}`);
      } finally {
        console.info('Data rollback completed!');
      }
    }
  } else {
    console.log(
      `${testID}: The records generated for this test will not be deleted. The list is as below: `
    );
    console.table(records);
  }
}

export default { createRecord, deleteRecord, dataRollBack };
