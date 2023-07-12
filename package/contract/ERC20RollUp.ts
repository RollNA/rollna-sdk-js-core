import { BaseContractInstance } from "./baseRollUp";
import rollInAbi from "../abi/IL1GatewayRouter.json"
import rollOutAbi from "../abi/ArbSys.json"
import {Contract} from 'web3-eth-contract';
import { Numbers } from "web3";

export class ERC20ContractInstance extends BaseContractInstance {
    rollIn(leTo : string, _lrFrom: string, value: Numbers, refundTo: string, maxGas: Numbers, gasPriceBid: Numbers, tokenAddr: string) {
        var contract = new Contract(rollInAbi);
        //@ts-ignore
        return contract.methods.outboundTransferCustomRefund(tokenAddr, refundTo, leTo, value, maxGas, gasPriceBid, "").encodeABI();
    }
    rollOut(leTo : string, _chainId : Numbers, value: Numbers, tokenAddr: string) {
        var contract = new Contract(rollOutAbi);
        //@ts-ignore
        return contract.methods.outboundTransfer(tokenAddr, leTo, value, "").encodeABI()
    }
    getRollInContractAddr() {
        return this.rollInContractAddr
    }
    getRollOutContractAddr() {
        return this.rollOutContractAddr
    }
}