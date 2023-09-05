"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["HttpRpcFailed"] = 0] = "HttpRpcFailed";
    ErrorType[ErrorType["FormatInputFailed"] = 1] = "FormatInputFailed";
    ErrorType[ErrorType["UnsupportedChainOrToken"] = 2] = "UnsupportedChainOrToken";
    ErrorType[ErrorType["NotAuthorizedOwner"] = 3] = "NotAuthorizedOwner";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
