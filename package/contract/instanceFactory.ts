import { Numbers } from "web3";
import {BaseContractInstance} from "./baseRollUp"
import {NativeContractInstance} from "./nativeRollUp"
import {ERC20ContractInstance} from "./ERC20RollUp"




const nativeTokenTypeList = new Map<Numbers, Array<string>>([// mapping from chainid to contract instance construct function
    [5, ["0xaaa", "0xbbb"]], //this is just a demo, waiting for contract abi and interface
]);

const ERC20TokenTypeList = new Map<Numbers, Map<string, Array<string>>>([// mapping from chainid to contract instance construct function
    [5, new Map([
        ["0xfffff", ["0xaaa", "0xbbb"]],//this is just a demo, waiting for contract abi and interface
    ])],
]);



export class ContractInstanceFactory {
    private  constructor() {}
    static getContractInstance(isERC20 : boolean, chainId: Numbers, tokenAddr?: string) : BaseContractInstance|undefined {
        if (isERC20) {
            return ContractInstanceFactory.getNativeInstance(chainId)
        } else {
            if (!tokenAddr) {
                return
            }
            return ContractInstanceFactory.getERC20Instance(chainId, tokenAddr)
        }
    } 
    private static getNativeInstance(chainId: Numbers) : BaseContractInstance|undefined {
        let contractAddrs = nativeTokenTypeList.get(chainId)
        if (contractAddrs != undefined && contractAddrs.length == 2) {
            return new NativeContractInstance(contractAddrs[0], contractAddrs[1])
        }
    }
    private static getERC20Instance(chainId: Numbers, tokenAddr: string) : BaseContractInstance|undefined {
        let inner = ERC20TokenTypeList.get(chainId)
        if (inner != undefined) {
            let contractAddrs = inner.get(tokenAddr)
            if (contractAddrs != undefined && contractAddrs.length == 2) {
                return new ERC20ContractInstance(contractAddrs[0], contractAddrs[1])
            }
        }

    }
}



