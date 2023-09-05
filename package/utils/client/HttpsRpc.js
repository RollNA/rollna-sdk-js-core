"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfirmBlock = exports.getRollOutTx = exports.getClaimParams = exports.updateLatestAAVersion = exports.lookupAAs = void 0;
const ErrorType_1 = require("../../types/ErrorType");
const mappingAAUrl = "https://rollna.io/mappingAA";
const latestAAAddr = "https://rollna.io/latestAAAddr";
const getClaimParamsUrl = "http://127.0.0.1:8331/api/getClaimParams";
const getRollOutTxUrl = "http://127.0.0.1:8331/api/getRollOutTx";
const getConfirmBlockUrl = "http://127.0.0.1:8331/api/getConfirmBlock";
async function lookupAAs(Eoa) {
    var ret = await fetch(mappingAAUrl + "?eoa=" + Eoa);
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (Array.isArray(res)) {
                return res;
            }
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.lookupAAs = lookupAAs;
async function updateLatestAAVersion() {
    var ret = await fetch(latestAAAddr);
    if (ret.status != 200) {
        return ErrorType_1.ErrorType.HttpRpcFailed;
    }
    else {
        return await ret.json();
    }
}
exports.updateLatestAAVersion = updateLatestAAVersion;
// test done
async function getClaimParams(TxHash) {
    var ret = await fetch(getClaimParamsUrl + "?txhash=" + TxHash);
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (res["code"] == 0)
                return res["data"];
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getClaimParams = getClaimParams;
// test done
async function getRollOutTx(sender) {
    var ret = await fetch(getRollOutTxUrl + "?sender=" + sender);
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (res["code"] == 0)
                return res["data"];
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getRollOutTx = getRollOutTx;
async function getConfirmBlock(confirmdata) {
    let body = new FormData();
    body.append("confirmdata", confirmdata);
    var ret = await fetch(getConfirmBlockUrl, {
        method: "POST",
        body: body
    });
    if (ret.ok) {
        var res = await ret.json();
        if (res != undefined) {
            if (res["code"] == 0)
                return res["data"]["blocknum"];
        }
    }
    return ErrorType_1.ErrorType.HttpRpcFailed;
}
exports.getConfirmBlock = getConfirmBlock;
