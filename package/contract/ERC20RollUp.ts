import { BaseContractInstance } from "./baseRollUp";
import rollInAbi from "../abi/IL1GatewayRouter.json"
import rollOutAbi from "../abi/L2GatewayRouter.json"
import {Contract} from 'web3-eth-contract';
import { Bytes, Numbers } from "web3";

export class ERC20ContractInstance extends BaseContractInstance {
    rollIn(lrTo : string, _leFrom: string, value: Numbers, refundTo: string, maxGas: Numbers, gasPriceBid: Numbers, tokenAddr: string, data: Bytes) {

        var contract = new Contract(rollInAbi, this.rollInContractAddr);
        //@ts-ignore
        return contract.methods.outboundTransferCustomRefund(tokenAddr, refundTo, lrTo, value, maxGas, gasPriceBid, data).encodeABI();
    }
    rollOut(leTo : string, _chainId : Numbers, value: Numbers, tokenAddr: string) {
        var contract = new Contract(rollOutAbi, this.rollOutContractAddr);
        //@ts-ignore
        return contract.methods.outboundTransfer(tokenAddr, leTo, value, []).encodeABI()
    }
    getRollInContractAddr() {
        return this.rollInContractAddr
    }
    getRollOutContractAddr() {
        return this.rollOutContractAddr
    }
}