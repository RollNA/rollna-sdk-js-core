"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractInstanceFactory = void 0;
const nativeRollUp_1 = require("./nativeRollUp");
const ERC20RollUp_1 = require("./ERC20RollUp");
const nativeTokenTypeList = new Map([
    [5, ["0xaaa", "0xbbb"]], //this is just a demo, waiting for contract abi and interface
]);
const ERC20TokenTypeList = new Map([
    [5, new Map([
            ["0xfffff", ["0xaaa", "0xbbb"]], //this is just a demo, waiting for contract abi and interface
        ])],
]);
class ContractInstanceFactory {
    constructor() { }
    static getContractInstance(isERC20, chainId, tokenAddr) {
        if (isERC20) {
            return ContractInstanceFactory.getNativeInstance(chainId);
        }
        else {
            if (!tokenAddr) {
                return;
            }
            return ContractInstanceFactory.getERC20Instance(chainId, tokenAddr);
        }
    }
    static getNativeInstance(chainId) {
        let contractAddrs = nativeTokenTypeList.get(chainId);
        if (contractAddrs != undefined && contractAddrs.length == 2) {
            return new nativeRollUp_1.NativeContractInstance(contractAddrs[0], contractAddrs[1]);
        }
    }
    static getERC20Instance(chainId, tokenAddr) {
        let inner = ERC20TokenTypeList.get(chainId);
        if (inner != undefined) {
            let contractAddrs = inner.get(tokenAddr);
            if (contractAddrs != undefined && contractAddrs.length == 2) {
                return new ERC20RollUp_1.ERC20ContractInstance(contractAddrs[0], contractAddrs[1]);
            }
        }
    }
}
exports.ContractInstanceFactory = ContractInstanceFactory;
