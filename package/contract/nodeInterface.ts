import * as web3 from 'web3';
import { Numbers } from "web3";
import interfaceAbi from "../abi/NodeInterface.json"
import {nodeInterfaceContractAddr, RollnaChainInfo} from "../types";
export class NodeInterfaceContract {
    static async getProof(size : Numbers, leaf : Numbers) : Promise<any> {
        var rollnaInfo = await RollnaChainInfo.getRollNaInfo()
        var contract = new web3.eth.contract.Contract(interfaceAbi, nodeInterfaceContractAddr)
        contract.setProvider(rollnaInfo?.rollnaProvider);
        //@ts-ignore
        return contract.methods.constructOutboxProof(size, leaf).send()       
    }
}
