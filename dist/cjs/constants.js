"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOKI_CODERS = exports.GOKI_IDLS = exports.GOKI_ADDRESSES = void 0;
const anchor_contrib_1 = require("@saberhq/anchor-contrib");
const web3_js_1 = require("@solana/web3.js");
const smart_wallet_1 = require("./idls/smart_wallet");
const token_signer_1 = require("./idls/token_signer");
exports.GOKI_ADDRESSES = {
  SmartWallet: new web3_js_1.PublicKey(
    "GokivDYuQXPZCWRkwMhdH2h91KpDQXBEmpgBgs55bnpH"
  ),
  TokenSigner: new web3_js_1.PublicKey(
    "NFTUJzSHuUCsMMqMRJpB7PmbsaU7Wm51acdPk2FXMLn"
  ),
};
exports.GOKI_IDLS = {
  SmartWallet: smart_wallet_1.SmartWalletJSON,
  TokenSigner: token_signer_1.TokenSignerJSON,
};
exports.GOKI_CODERS = (0, anchor_contrib_1.buildCoderMap)(
  exports.GOKI_IDLS,
  exports.GOKI_ADDRESSES
);
//# sourceMappingURL=constants.js.map
