import { Numbers } from "web3";
const rollnaInfoUrl = "http://openapi.cyclenetwork.io/config/getRollnaInfo";
const chainInfosUrl = "http://openapi.cyclenetwork.io/config/getChainsInfo";
export const nodeInterfaceContractAddr = "0x00000000000000000000000000000000000000C8";
export const RollOutAddr = "0x0000000000000000000000000000000000000064";
export const ArbSysAddr="0x0000000000000000000000000000000000000064"

export interface CommonInput {
    from: string;
    to?: string;
    value?: string;
    gas?: Numbers;
    gasPrice?: Numbers;
    data?: string;
}

export interface EstimateGasInfo {
    from: string;
    gaslimit?: Numbers;
    value?: Numbers; 
}

export interface RollOutProof {
    send: string;
    root: string;
    proof: string;
}

export interface UserOperation {
    signer: string;
    sender: string;
    to: string; 
    value: Numbers;
    data: string;
}

export type RollnaInfo = {
    rollnaProvider: string;
    rollnaChainId: Numbers;
    rollnaTokenSymbols: string;
    routerAddrs: Map<Numbers, string>;
}

export type supportedErc20Tokens = {
    tokenAddr: string;
    gatewayAddr: string;
    destTokenAddr: string;
}

export type ChainInfo = {
    Provider?: string;
    ContractInfos: Map<string, supportedErc20Tokens>;
    RouterAddr: string;
    EthGatewayAddr: string;
    OutBox: string;
    RollUp: string;
    ChainId: string;
}

export class RollnaChainInfo {
    private static rollnaInfo : RollnaInfo;
    // test done
    static async updateRollNaInfo() {
        if (process.env.CYCLE_ENV == "test" && process.env.CYCLE_INFO) {
            let res = JSON.parse(process.env.CYCLE_INFO)
            let TempRollnaInfo = RollnaChainInfo.formatRollNAInfo(res)
            RollnaChainInfo.rollnaInfo = TempRollnaInfo
            return
        }
        var ret = await fetch(rollnaInfoUrl)
        if (ret.ok) {
            var infoJson = await ret.json()
            if (infoJson != undefined) {
                infoJson = JSON.parse(infoJson.data)
                if (infoJson.provider && infoJson.chainId && infoJson.symbol) {
                    let TempRollnaInfo = RollnaChainInfo.formatRollNAInfo(infoJson)
                    RollnaChainInfo.rollnaInfo = TempRollnaInfo
                }  
            }
        }
    }
    static formatRollNAInfo(infoJson: any) {
        var rolloutAddrs = new Map<Numbers, string>()
        if (infoJson.rolloutGateways) {
            for (const v of infoJson.rolloutGateways) {
                rolloutAddrs.set(v.chainId, v.router)
            }
        }
        var TempRollnaInfo : RollnaInfo = {
            rollnaProvider: infoJson.provider,
            rollnaChainId: infoJson.chainId,
            rollnaTokenSymbols: infoJson.symbol,
            routerAddrs: rolloutAddrs
        }
        return TempRollnaInfo
    }
    // test done
    static async getRollNaInfo() {
        if (!RollnaChainInfo.rollnaInfo) {
            await RollnaChainInfo.updateRollNaInfo()
        }
        return RollnaChainInfo.rollnaInfo;
    }
}

export class SupportedChainInfo {
    protected static ChainInfos : Map<Numbers, ChainInfo>;
    private  constructor() {}
    // test done
    static async updateChainInfos() {
        if (process.env.CYCLE_ENV == "test" && process.env.CYCLE_CONTENT) {
            res = JSON.parse(process.env.CYCLE_CONTENT)
            let TempChainInfos = SupportedChainInfo.formatChainInfo(res)
            SupportedChainInfo.ChainInfos = TempChainInfos
            return
        }
        var ret = await fetch(chainInfosUrl)
        if (ret.ok) {
            var res = await ret.json()
            if (res != undefined) {
                res = JSON.parse(res.data)
                let TempChainInfos = SupportedChainInfo.formatChainInfo(res)
                SupportedChainInfo.ChainInfos = TempChainInfos
            }
        }
    }

    static formatChainInfo(input: any) {
        var TempChainInfos = new Map<Numbers, ChainInfo>();
        for (const v of input) {
            var ContractInfos = new Map<string, supportedErc20Tokens>();
            for (const s of v.ChainInfo.supportedErc20Tokens) {
                var contract_info : supportedErc20Tokens = {
                    tokenAddr: s.tokenAddr,
                    gatewayAddr: s.gatewayAddr,
                    destTokenAddr: s.destTokenAddr
                }
                ContractInfos.set(s.tokenAddr, contract_info)
            }
            var chainInfo: ChainInfo = {
                ContractInfos: ContractInfos,
                RouterAddr: v.ChainInfo.routerAddr,
                EthGatewayAddr: v.ChainInfo.EthGatewayAddr,
                OutBox: v.ChainInfo.outbox,
                RollUp: v.ChainInfo.rollup,
                Provider: v.ChainInfo.provider,
                ChainId: v.ChainInfo.chainId
            }
            chainInfo.ChainId = v.ChainInfo.chainId
            TempChainInfos.set(v.ChainInfo.chainId, chainInfo)
        }
        return TempChainInfos
    }

    // test done
    static async getChainInfo(chainId : Numbers) {
        if (!SupportedChainInfo.ChainInfos) {
            await SupportedChainInfo.updateChainInfos();
        }
        return SupportedChainInfo.ChainInfos.get(chainId)
    }
}