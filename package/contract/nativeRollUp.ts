import { BaseContractInstance } from "./baseRollUp";
import rollInAbi from "../abi/IInbox.json"
import rollOutAbi from "../abi/ArbSys.json"
import {Contract} from 'web3-eth-contract';
import { Numbers } from "web3";

export class NativeContractInstance extends BaseContractInstance {
    rollIn(lrTo : string) {
        var contract = new Contract(rollInAbi);
        //@ts-ignore
        return contract.methods.rollinEth(lrTo).encodeABI();
    }
    rollOut(leTo : string, chainId : Numbers) {
        var contract = new Contract(rollOutAbi);
        //@ts-ignore
        return contract.methods.withdrawEth(chainId, leTo).encodeABI()
    }
    getRollInContractAddr() {
        return this.rollInContractAddr
    }
    getRollOutContractAddr() {
        return this.rollOutContractAddr
    }
}

