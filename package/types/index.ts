import { Numbers } from "web3";
import { ErrorType } from "./ErrorType"
import {updateLatestAAVersion} from "../utils/client/HttpsRpc"
const rollnaInfoUrl = "https://rollna-static.s3.ap-southeast-2.amazonaws.com/config/rollna_info.json";
const chainInfosUrl = "https://rollna-static.s3.ap-southeast-2.amazonaws.com/config/content.json";
export const nodeInterfaceContractAddr = "0xfffffffff";
export const preComplieAddr = "0xfffffff";
export const RollOutAddr = "0x0000000000000000000000000000000000000064";
export const ArbSysAddr="0x0000000000000000000000000000000000000064"

export enum ProposalType {
    Lock,
    Unlock,
    Recover
}

export type AccountType = 'EOA' | 'AA';

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
    ChainId: string;
}

export class RollnaChainInfo {
    private static rollnaInfo : RollnaInfo;
    private static accountAbstractionTemplate : string;
    // test done
    static async updateRollNaInfo() {
        var ret = await fetch(rollnaInfoUrl)
        if (ret.ok) {
            var infoJson = await ret.json()
            if (infoJson != undefined) {
                if (infoJson.provider && infoJson.chainId && infoJson.symbol) {
                    var TempRollnaInfo : RollnaInfo = {
                        rollnaProvider: infoJson.provider,
                        rollnaChainId: infoJson.chainId,
                        rollnaTokenSymbols: infoJson.symbol
                    }
                    RollnaChainInfo.rollnaInfo = TempRollnaInfo
                }  
            }
        }
    }
    static async updateAAVersion() {
        var ret = await updateLatestAAVersion()
        if (ret != ErrorType.HttpRpcFailed && ret != null) {
            RollnaChainInfo.accountAbstractionTemplate = ret
        }       
        return ret
    }

    // test done
    static async getRollNaInfo() {
        if (!RollnaChainInfo.rollnaInfo) {
            await RollnaChainInfo.updateRollNaInfo()
        }
        return RollnaChainInfo.rollnaInfo;
    }
    static getAAVersion() {
        return RollnaChainInfo.accountAbstractionTemplate
    }
}

export class SupportedChainInfo {
    protected static ChainInfos : Map<Numbers, ChainInfo>;
    private  constructor() {}
    // test done
    static async updateChainInfos() {
        var TempChainInfos = new Map<Numbers, ChainInfo>();
        var ret = await fetch(chainInfosUrl)
        if (ret.ok) {
            var res = await ret.json()
            if (res != undefined) {
                for (const v of res) {
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
                        ChainId: v.ChainInfo.chainId
                    }
                    chainInfo.ChainId = v.ChainInfo.chainId
                    TempChainInfos.set(v.ChainInfo.chainId, chainInfo)
                }
                SupportedChainInfo.ChainInfos = TempChainInfos
                //SupportedChainInfo.ChainInfos = infoJson;
            }
        }
    }

    // test done
    static async getChainInfo(chainId : Numbers) {
        if (!SupportedChainInfo.ChainInfos) {
            await SupportedChainInfo.updateChainInfos();
        }
        return SupportedChainInfo.ChainInfos.get(chainId)
    }
}