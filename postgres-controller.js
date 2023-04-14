import pg from 'pg';
const { Client } = pg;

export class PostgresController {
  constructor() {
    const client = new Client({
      user: 'gen_user',
      host: '188.225.76.252',
      database: 'default_db',
      password: 'fasQHmjvI6',
      port: 5432,
    });
    client.connect();
    this.client = client;
  }

  addNewObject(objectId) {
    const query = {
      text: 'INSERT INTO objects(object_id) VALUES($1)',
      values: [objectId],
    }
    return this.client.query(query);
  }

  addNewRecord(objectId, egrnRecordId, egrnRecord) {
    const query = {
      text: 'INSERT INTO records(object_id, record_id, record) VALUES($1, $2, $3)',
      values: [objectId, egrnRecordId, egrnRecord],
    }
    return this.client.query(query);
  }

  getAllObjects() {
    const query = {
      text: 'SELECT * FROM objects',
    }
    return this.client.query(query);
  }

  getRecordsByObjectId(objectId) {
    const query = {
      text: 'SELECT * FROM records WHERE object_id = $1',
      values: [objectId],
    }
    return this.client.query(query);
  }

  getRecordByRecordId(recordId) {
    const query = {
      text: 'SELECT * FROM records WHERE record_id = $1',
      values: [recordId],
    }
    return this.client.query(query);
  }
}