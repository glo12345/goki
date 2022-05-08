import { __awaiter } from "tslib";
import { newProgramMap } from "@saberhq/anchor-contrib";
import {
  SolanaAugmentedProvider,
  TransactionEnvelope,
} from "@saberhq/solana-contrib";
import { u64 } from "@saberhq/token-utils";
import { Keypair, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import mapValues from "lodash.mapvalues";
import { GOKI_ADDRESSES, GOKI_IDLS } from "./constants";
import {
  findOwnerInvokerAddress,
  findSmartWallet,
  findSubaccountInfoAddress,
  findWalletDerivedAddress,
  SmartWalletWrapper,
} from "./wrappers/smartWallet";
/**
 * Goki SDK.
 */
export class GokiSDK {
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
      addresses: mapValues(this.programs, (v) => v.programId),
    });
  }
  /**
   * loadSmartWallet
   */
  loadSmartWallet(key) {
    return SmartWalletWrapper.load(this, key);
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
    return __awaiter(this, void 0, void 0, function* () {
      const [subaccount] =
        type === "derived"
          ? yield findWalletDerivedAddress(smartWallet, index)
          : yield findOwnerInvokerAddress(smartWallet, index);
      const [subaccountInfo, bump] = yield findSubaccountInfoAddress(
        subaccount
      );
      return this.provider.newTX([
        this.programs.SmartWallet.instruction.createSubaccountInfo(
          bump,
          subaccount,
          smartWallet,
          new u64(index),
          {
            [type]: {},
          },
          {
            accounts: {
              subaccountInfo,
              payer,
              systemProgram: SystemProgram.programId,
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
    base = Keypair.generate(),
    delay = new BN(0),
  }) {
    return __awaiter(this, void 0, void 0, function* () {
      const [smartWallet, bump] = yield findSmartWallet(base.publicKey);
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
            systemProgram: SystemProgram.programId,
          },
        }
      );
      return {
        smartWalletWrapper: new SmartWalletWrapper(this, {
          bump,
          key: smartWallet,
          base: base.publicKey,
        }),
        tx: new TransactionEnvelope(this.provider, [ix], [base]),
      };
    });
  }
  /**
   * Loads the SDK.
   * @returns
   */
  static load({ provider, addresses = GOKI_ADDRESSES }) {
    const allAddresses = Object.assign(
      Object.assign({}, GOKI_ADDRESSES),
      addresses
    );
    const programs = newProgramMap(provider, GOKI_IDLS, allAddresses);
    return new GokiSDK(new SolanaAugmentedProvider(provider), programs);
  }
}
//# sourceMappingURL=sdk.js.map
