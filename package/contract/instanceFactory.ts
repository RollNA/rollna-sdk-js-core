import { Numbers } from "web3";
import {BaseContractInstance} from "./baseRollUp"
import {NativeContractInstance} from "./nativeRollUp"
import {ERC20ContractInstance} from "./ERC20RollUp"
import {SupportedChainInfo, EthRollOutAddr} from "../types/index"

export class ContractInstanceFactory {
    private  constructor() {}
    static async getContractInstance(isERC20 : boolean, chainId: Numbers, tokenAddr?: string, gateWayAddr?: string, rollOutAddr?: string) : Promise<BaseContractInstance|undefined> {
        if (!isERC20) {
            return ContractInstanceFactory.getNativeInstance(chainId, gateWayAddr, rollOutAddr)
        } else {
            if (!tokenAddr) {
                return
            }
            return ContractInstanceFactory.getERC20Instance(chainId, tokenAddr, gateWayAddr, rollOutAddr)
        }
    } 
    private static async getNativeInstance(chainId: Numbers, routerAddr?: string, rollOutAddr?: string) : Promise<BaseContractInstance|undefined> {
        let inner = await SupportedChainInfo.getChainInfo(chainId)
        if (inner != undefined) {
            let _routerAddr = inner.EthGatewayAddr
            let _rollOutAddr = EthRollOutAddr
            if (routerAddr != undefined) {
                _routerAddr = routerAddr
            }
            if (rollOutAddr != undefined) {
                _rollOutAddr = rollOutAddr
            }
            return new NativeContractInstance(_routerAddr, _rollOutAddr)
        }
    }
    private static async getERC20Instance(chainId: Numbers, tokenAddr: string, routerAddr?: string, rollOutAddr?: string) : Promise<BaseContractInstance|undefined> {
        let inner = await SupportedChainInfo.getChainInfo(chainId)
        if (inner != undefined) {
                let tokenInfo = inner.ContractInfos.get(tokenAddr)
                if (tokenInfo == undefined) {
                    return
                }
                let _routerAddr = inner.RouterAddr    
                
                if (routerAddr != undefined) {
                    _routerAddr = routerAddr
                }
                let _rollOutAddr = tokenInfo.rollOutRouterAddr
                if (rollOutAddr != undefined) {
                    _rollOutAddr = rollOutAddr
                }
                return new ERC20ContractInstance(_routerAddr, _rollOutAddr)
        }
    }
}



