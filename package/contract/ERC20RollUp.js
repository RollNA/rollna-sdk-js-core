"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20ContractInstance = void 0;
const baseRollUp_1 = require("./baseRollUp");
const IL1GatewayRouter_json_1 = __importDefault(require("../abi/IL1GatewayRouter.json"));
const ArbSys_json_1 = __importDefault(require("../abi/ArbSys.json"));
const web3_eth_contract_1 = require("web3-eth-contract");
class ERC20ContractInstance extends baseRollUp_1.BaseContractInstance {
    rollIn(leTo, _lrFrom, value, refundTo, maxGas, gasPriceBid, tokenAddr) {
        var contract = new web3_eth_contract_1.Contract(IL1GatewayRouter_json_1.default);
        //@ts-ignore
        return contract.methods.outboundTransferCustomRefund(tokenAddr, refundTo, leTo, value, maxGas, gasPriceBid, "").encodeABI();
    }
    rollOut(leTo, _chainId, value, tokenAddr) {
        var contract = new web3_eth_contract_1.Contract(ArbSys_json_1.default);
        //@ts-ignore
        return contract.methods.outboundTransfer(tokenAddr, leTo, value, "").encodeABI();
    }
    getRollInContractAddr() {
        return this.rollInContractAddr;
    }
    getRollOutContractAddr() {
        return this.rollOutContractAddr;
    }
}
exports.ERC20ContractInstance = ERC20ContractInstance;
