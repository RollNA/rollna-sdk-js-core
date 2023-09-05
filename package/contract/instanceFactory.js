"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractInstanceFactory = void 0;
const nativeRollUp_1 = require("./nativeRollUp");
const ERC20RollUp_1 = require("./ERC20RollUp");
const index_1 = require("../types/index");
class ContractInstanceFactory {
    constructor() { }
    static async getContractInstance(isERC20, chainId, tokenAddr, gateWayAddr, rollOutAddr) {
        if (!isERC20) {
            return ContractInstanceFactory.getNativeInstance(chainId, gateWayAddr, rollOutAddr);
        }
        else {
            if (!tokenAddr) {
                return;
            }
            return ContractInstanceFactory.getERC20Instance(chainId, tokenAddr, gateWayAddr, rollOutAddr);
        }
    }
    static async getNativeInstance(chainId, routerAddr, rollOutAddr) {
        let inner = await index_1.SupportedChainInfo.getChainInfo(chainId);
        if (inner != undefined) {
            let _routerAddr = inner.EthGatewayAddr;
            let _rollOutAddr = index_1.RollOutAddr;
            if (routerAddr != undefined) {
                _routerAddr = routerAddr;
            }
            if (rollOutAddr != undefined) {
                _rollOutAddr = rollOutAddr;
            }
            return new nativeRollUp_1.NativeContractInstance(_routerAddr, _rollOutAddr);
        }
    }
    static async getERC20Instance(chainId, tokenAddr, routerAddr, rollOutAddr) {
        let inner = await index_1.SupportedChainInfo.getChainInfo(chainId);
        if (inner != undefined) {
            let tokenInfo = inner.ContractInfos.get(tokenAddr);
            var rollnaInfo = await index_1.RollnaChainInfo.getRollNaInfo();
            if (tokenInfo == undefined || rollnaInfo == undefined) {
                return;
            }
            let _routerAddr = inner.RouterAddr;
            if (routerAddr != undefined) {
                _routerAddr = routerAddr;
            }
            let _rollOutAddr = rollnaInfo.routerAddrs.get(chainId);
            if (_rollOutAddr == undefined) {
                return;
            }
            if (rollOutAddr != undefined) {
                _rollOutAddr = rollOutAddr;
            }
            return new ERC20RollUp_1.ERC20ContractInstance(_routerAddr, _rollOutAddr);
        }
    }
}
exports.ContractInstanceFactory = ContractInstanceFactory;
