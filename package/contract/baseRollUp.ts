import { Numbers } from "web3";
export abstract class BaseContractInstance {
    protected rollInContractAddr: string;
    protected rollOutContractAddr: string;
    constructor(rollIn: string, rollOut: string) {
        this.rollInContractAddr = rollIn;
        this.rollOutContractAddr = rollOut;
    }
    abstract rollIn(
        lrTo : string, 
        leFrom?: string, 
        value?: Numbers, 
        refundTo?: string, 
        maxGas?: Numbers, 
        gasPriceBid?: Numbers, 
        tokenAddr?: string
    ) : string;
    abstract rollOut(
        leTo : string, 
        chainId?: Numbers, 
        value?: Numbers, 
        tokenAddr?: string
    ) : string;
    abstract getRollInContractAddr() : string
    abstract getRollOutContractAddr() : string
}
