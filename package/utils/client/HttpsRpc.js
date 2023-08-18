"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRollOutTx = exports.getClaimParams = exports.updateLatestAAVersion = exports.lookupAAs = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const ErrorType_1 = require("../../types/ErrorType");
const mappingAAUrl = "https://rollna.io/mappingAA";
const latestAAAddr = "https://rollna.io/latestAAAddr";
const getClaimParamsUrl = "https://rollna.io/api/getClaimParams";
const getRollOutTxUrl = "https://rollna.io/api/getRollOutTx";
async function lookupAAs(Eoa) {
    var ret = await (0, node_fetch_1.default)(mappingAAUrl + "?eoa=" + Eoa);
    if (ret.ok) {
        var rawRes = ret.body?.read().toString();
        if (rawRes != undefined) {
            var res = JSON.parse(rawRes);
            if (Array.isArray(res)) {
                return res;
            }
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.lookupAAs = lookupAAs;
async function updateLatestAAVersion() {
    var ret = await (0, node_fetch_1.default)(latestAAAddr);
    if (ret.status != 200) {
        return ErrorType_1.ErrorType.HttpRpcFailed;
    }
    else {
        return ret.body?.read().toString();
    }
}
exports.updateLatestAAVersion = updateLatestAAVersion;
async function getClaimParams(TxHash) {
    var ret = await (0, node_fetch_1.default)(mappingAAUrl + "txhash?=" + TxHash);
    if (ret.ok) {
        var rawRes = ret.body?.read().toString();
        if (rawRes != undefined) {
            return JSON.parse(rawRes);
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getClaimParams = getClaimParams;
async function getRollOutTx(sender) {
    var ret = await (0, node_fetch_1.default)(getRollOutTxUrl + "?sender=" + sender);
    if (ret.ok) {
        var rawRes = ret.body?.read().toString();
        if (rawRes != undefined) {
            var res = JSON.parse(rawRes);
            if (Array.isArray(res)) {
                return res;
            }
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getRollOutTx = getRollOutTx;
