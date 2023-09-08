"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedChainInfo = exports.RollnaChainInfo = exports.ArbSysAddr = exports.RollOutAddr = exports.nodeInterfaceContractAddr = void 0;
const rollnaInfoUrl = "http://openapi.cyclenetwork.io/config/getRollnaInfo";
const chainInfosUrl = "http://openapi.cyclenetwork.io/config/getChainsInfo";
exports.nodeInterfaceContractAddr = "0x00000000000000000000000000000000000000C8";
exports.RollOutAddr = "0x0000000000000000000000000000000000000064";
exports.ArbSysAddr = "0x0000000000000000000000000000000000000064";
class RollnaChainInfo {
    static rollnaInfo;
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
    // test done
    static async getRollNaInfo() {
        if (!RollnaChainInfo.rollnaInfo) {
            await RollnaChainInfo.updateRollNaInfo();
        }
        return RollnaChainInfo.rollnaInfo;
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
