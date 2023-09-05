"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedChainInfo = exports.RollnaChainInfo = exports.ProposalType = exports.ArbSysAddr = exports.RollOutAddr = exports.preComplieAddr = exports.nodeInterfaceContractAddr = void 0;
const ErrorType_1 = require("./ErrorType");
const HttpsRpc_1 = require("../utils/client/HttpsRpc");
const rollnaInfoUrl = "http://127.0.0.1:8331/config/getRollnaInfo";
const chainInfosUrl = "http://127.0.0.1:8331/config/getChainsInfo";
exports.nodeInterfaceContractAddr = "0x00000000000000000000000000000000000000C8";
exports.preComplieAddr = "0xfffffff";
exports.RollOutAddr = "0x0000000000000000000000000000000000000064";
exports.ArbSysAddr = "0x0000000000000000000000000000000000000064";
var ProposalType;
(function (ProposalType) {
    ProposalType[ProposalType["Lock"] = 0] = "Lock";
    ProposalType[ProposalType["Unlock"] = 1] = "Unlock";
    ProposalType[ProposalType["Recover"] = 2] = "Recover";
})(ProposalType || (exports.ProposalType = ProposalType = {}));
class RollnaChainInfo {
    static rollnaInfo;
    static accountAbstractionTemplate;
    // test done
    static async updateRollNaInfo() {
        var ret = await fetch(rollnaInfoUrl);
        if (ret.ok) {
            var infoJson = await ret.json();
            if (infoJson != undefined) {
                infoJson = JSON.parse(infoJson.data);
                if (infoJson.provider && infoJson.chainId && infoJson.symbol) {
                    var rolloutAddrs = new Map();
                    if (infoJson.rolloutGateways) {
                        for (const v of infoJson.rolloutGateways) {
                            rolloutAddrs.set(v.chainId, v.router);
                        }
                    }
                    var TempRollnaInfo = {
                        rollnaProvider: infoJson.provider,
                        rollnaChainId: infoJson.chainId,
                        rollnaTokenSymbols: infoJson.symbol,
                        routerAddrs: rolloutAddrs
                    };
                    RollnaChainInfo.rollnaInfo = TempRollnaInfo;
                }
            }
        }
    }
    static async updateAAVersion() {
        var ret = await (0, HttpsRpc_1.updateLatestAAVersion)();
        if (ret != ErrorType_1.ErrorType.HttpRpcFailed && ret != null) {
            RollnaChainInfo.accountAbstractionTemplate = ret;
        }
        return ret;
    }
    // test done
    static async getRollNaInfo() {
        if (!RollnaChainInfo.rollnaInfo) {
            await RollnaChainInfo.updateRollNaInfo();
        }
        return RollnaChainInfo.rollnaInfo;
    }
    static getAAVersion() {
        return RollnaChainInfo.accountAbstractionTemplate;
    }
}
exports.RollnaChainInfo = RollnaChainInfo;
class SupportedChainInfo {
    static ChainInfos;
    constructor() { }
    // test done
    static async updateChainInfos() {
        var TempChainInfos = new Map();
        var ret = await fetch(chainInfosUrl);
        if (ret.ok) {
            var res = await ret.json();
            if (res != undefined) {
                res = JSON.parse(res.data);
                for (const v of res) {
                    var ContractInfos = new Map();
                    for (const s of v.ChainInfo.supportedErc20Tokens) {
                        var contract_info = {
                            tokenAddr: s.tokenAddr,
                            gatewayAddr: s.gatewayAddr,
                            destTokenAddr: s.destTokenAddr
                        };
                        ContractInfos.set(s.tokenAddr, contract_info);
                    }
                    var chainInfo = {
                        ContractInfos: ContractInfos,
                        RouterAddr: v.ChainInfo.routerAddr,
                        EthGatewayAddr: v.ChainInfo.EthGatewayAddr,
                        OutBox: v.ChainInfo.outbox,
                        RollUp: v.ChainInfo.rollup,
                        Provider: v.ChainInfo.provider,
                        ChainId: v.ChainInfo.chainId
                    };
                    chainInfo.ChainId = v.ChainInfo.chainId;
                    TempChainInfos.set(v.ChainInfo.chainId, chainInfo);
                }
                SupportedChainInfo.ChainInfos = TempChainInfos;
            }
        }
    }
    // test done
    static async getChainInfo(chainId) {
        if (!SupportedChainInfo.ChainInfos) {
            await SupportedChainInfo.updateChainInfos();
        }
        return SupportedChainInfo.ChainInfos.get(chainId);
    }
}
exports.SupportedChainInfo = SupportedChainInfo;
