import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { EgrnSmartContractController } from './smart-contract-controller.js';
import { PostgresController } from './postgres-controller.js';

const app = express();
const port = 9999;
const host = '127.0.0.1';
const egrnController = new EgrnSmartContractController(
  'http://127.0.0.1:8545',
  '0xa6f23f94ee10f03d8122fc52a4b41ea71b177f0c',
  '0xea751f926341c44189fd2C8D6bb486d249Bf8cF8')

const psql = new PostgresController();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  egrnController.getOwner().then((owner) => {
    res.send(owner);
  });
});

app.get('/getAllObjects', (req, res) => {
  psql.getAllObjects().then((result) => {
    res.send(result);
  });
});

app.get('/getRecordsByObjectId', (req, res) => {
  psql.getRecordsByObjectId(req.query.objectId).then((result) => {
    res.send(result);
  });
});

app.post('/addNewObject', (req, res) => {
  egrnController.addNewObject(
    req.body.objectId,
    req.body.egrnRecordId,
    req.body.egrnRecord
  ).then((result) => {
    psql.addNewObject(req.body.objectId).then((result) => {
      psql.addNewRecord(
        req.body.objectId, 
        req.body.egrnRecordId, 
        req.body.egrnRecord
      ).then((result) => {
        res.status(200).send({message: 'OK'});
      });
    });
  }).catch(error => {
    res.send({message: 'Error', error});
  })
});

app.post('/addNewRecord', (req, res) => {
  egrnController.addNewRecord(
    req.body.objectId,
    req.body.egrnRecordId,
    req.body.egrnRecord
  ).then((result) => {
    psql.addNewRecord(
      req.body.objectId, 
      req.body.egrnRecordId, 
      req.body.egrnRecord
    ).then((result) => {
      res.status(200).send({message: 'OK'});
    });
  }).catch(error => {
    res.send({message: 'Error', error});
  })
});

app.get('/checkRecordIdentity', (req, res) => {
  egrnController.checkRecordIdentity(
    req.query.objectId,
    req.query.egrnRecordId,
    req.query.egrnRecord
  ).then((result) => {
    res.send({result});
  });
});


app.listen(port, host, () => {
  egrnController.getOwner().then((owner) => {
    console.log(owner);
  });
  console.log(`Example app listening at http://${host}:${port}`);
});
