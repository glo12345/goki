"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GokiSDK = void 0;
const tslib_1 = require("tslib");
const anchor_contrib_1 = require("@saberhq/anchor-contrib");
const solana_contrib_1 = require("@saberhq/solana-contrib");
const token_utils_1 = require("@saberhq/token-utils");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const lodash_mapvalues_1 = tslib_1.__importDefault(require("lodash.mapvalues"));
const constants_1 = require("./constants");
const smartWallet_1 = require("./wrappers/smartWallet");
/**
 * Goki SDK.
 */
class GokiSDK {
  constructor(provider, programs) {
    this.provider = provider;
    this.programs = programs;
  }
  /**
   * Creates a new instance of the SDK with the given keypair.
   */
  withSigner(signer) {
    return GokiSDK.load({
      provider: this.provider.withSigner(signer),
      addresses: (0, lodash_mapvalues_1.default)(
        this.programs,
        (v) => v.programId
      ),
    });
  }
  /**
   * loadSmartWallet
   */
  loadSmartWallet(key) {
    return smartWallet_1.SmartWalletWrapper.load(this, key);
  }
  /**
   * Creates a subaccount info.
   * @returns
   */
  createSubaccountInfo({
    smartWallet,
    index,
    type,
    payer = this.provider.wallet.publicKey,
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const [subaccount] =
        type === "derived"
          ? yield (0, smartWallet_1.findWalletDerivedAddress)(
              smartWallet,
              index
            )
          : yield (0, smartWallet_1.findOwnerInvokerAddress)(
              smartWallet,
              index
            );
      const [subaccountInfo, bump] = yield (0,
      smartWallet_1.findSubaccountInfoAddress)(subaccount);
      return this.provider.newTX([
        this.programs.SmartWallet.instruction.createSubaccountInfo(
          bump,
          subaccount,
          smartWallet,
          new token_utils_1.u64(index),
          {
            [type]: {},
          },
          {
            accounts: {
              subaccountInfo,
              payer,
              systemProgram: web3_js_1.SystemProgram.programId,
            },
          }
        ),
      ]);
    });
  }
  /**
   * Create a new multisig account
   */
  newSmartWallet({
    owners,
    threshold,
    numOwners,
    base = web3_js_1.Keypair.generate(),
    delay = new bn_js_1.default(0),
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const [smartWallet, bump] = yield (0, smartWallet_1.findSmartWallet)(
        base.publicKey
      );
      const ix = this.programs.SmartWallet.instruction.createSmartWallet(
        bump,
        numOwners,
        owners,
        threshold,
        delay,
        {
          accounts: {
            base: base.publicKey,
            smartWallet,
            payer: this.provider.wallet.publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
          },
        }
      );
      return {
        smartWalletWrapper: new smartWallet_1.SmartWalletWrapper(this, {
          bump,
          key: smartWallet,
          base: base.publicKey,
        }),
        tx: new solana_contrib_1.TransactionEnvelope(
          this.provider,
          [ix],
          [base]
        ),
      };
    });
  }
  /**
   * Loads the SDK.
   * @returns
   */
  static load({ provider, addresses = constants_1.GOKI_ADDRESSES }) {
    const allAddresses = Object.assign(
      Object.assign({}, constants_1.GOKI_ADDRESSES),
      addresses
    );
    const programs = (0, anchor_contrib_1.newProgramMap)(
      provider,
      constants_1.GOKI_IDLS,
      allAddresses
    );
    return new GokiSDK(
      new solana_contrib_1.SolanaAugmentedProvider(provider),
      programs
    );
  }
}
exports.GokiSDK = GokiSDK;
//# sourceMappingURL=sdk.js.map
