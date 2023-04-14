import Web3 from "web3";
import path from 'path';
import fs from 'fs';

const getAbi = (contractName) => {
  const contractPath = path.resolve('contracts', contractName + '.json');
  const data = fs.readFileSync(contractPath, 'utf8');
  const contract = JSON.parse(data);
  return contract.abi;
}

export class EgrnSmartContractController {
  constructor(url, contractAddress, ownerAddress) {
    this.url = url;
    this.contractAddress = contractAddress;
    this.ownerAddress = ownerAddress;
    const web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(url));
    this.web3 = web3;
    this.abi = getAbi('EGRN');
    this.contract = new web3.eth.Contract(this.abi, contractAddress);
  }

  getOwner = async () => {
    const owner = await this.contract.methods.owner().call();
    return owner;
  }

  addNewObject = async (objectId, egrnRecordId, egrnRecord) => {
    const result = await this.contract.methods.addNewObject(
      objectId,
      egrnRecordId, 
      egrnRecord
    ).send({ from: this.ownerAddress });
    return result;
  }

  addNewRecord = async (objectId, egrnRecordId, egrnRecord) => {
    const result = await this.contract.methods.addNewRecord(
      objectId,
      egrnRecordId, 
      egrnRecord
    ).send({ from: this.ownerAddress });
    return result;
  }

  checkRecordIdentity = async (objectId, egrnRecordId, egrnRecord) => {
    const result = await this.contract.methods.checkRecordIdentity(
      objectId,
      egrnRecordId, 
      egrnRecord
    ).call();
    return result;
  }
}