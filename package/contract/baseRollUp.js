"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContractInstance = void 0;
class BaseContractInstance {
    rollInContractAddr;
    rollOutContractAddr;
    constructor(rollIn, rollOut) {
        this.rollInContractAddr = rollIn;
        this.rollOutContractAddr = rollOut;
    }
}
exports.BaseContractInstance = BaseContractInstance;
