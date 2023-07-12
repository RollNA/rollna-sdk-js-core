"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeContractInstance = void 0;
const baseRollUp_1 = require("./baseRollUp");
const IInbox_json_1 = __importDefault(require("../abi/IInbox.json"));
const ArbSys_json_1 = __importDefault(require("../abi/ArbSys.json"));
const web3_eth_contract_1 = require("web3-eth-contract");
class NativeContractInstance extends baseRollUp_1.BaseContractInstance {
    rollIn(lrTo) {
        var contract = new web3_eth_contract_1.Contract(IInbox_json_1.default);
        //@ts-ignore
        return contract.methods.rollinEth(lrTo).encodeABI();
    }
    rollOut(leTo, chainId) {
        var contract = new web3_eth_contract_1.Contract(ArbSys_json_1.default);
        //@ts-ignore
        return contract.methods.withdrawEth(chainId, leTo).encodeABI();
    }
    getRollInContractAddr() {
        return this.rollInContractAddr;
    }
    getRollOutContractAddr() {
        return this.rollOutContractAddr;
    }
}
exports.NativeContractInstance = NativeContractInstance;
