"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartWalletWrapper = void 0;
const tslib_1 = require("tslib");
const solana_contrib_1 = require("@saberhq/solana-contrib");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const pda_1 = require("./pda");
tslib_1.__exportStar(require("./pda"), exports);
tslib_1.__exportStar(require("./types"), exports);
class SmartWalletWrapper {
  constructor(sdk, args) {
    this.sdk = sdk;
    this.bump = args.bump;
    this.key = args.key;
    this._data = args.data;
    this.program = sdk.programs.SmartWallet;
  }
  get provider() {
    return this.sdk.provider;
  }
  get data() {
    return this._data;
  }
  /**
   * reloadData
   */
  reloadData() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      this._data =
        yield this.sdk.programs.SmartWallet.account.smartWallet.fetch(this.key);
      return this._data;
    });
  }
  /**
   * Proposes a new transaction.
   * @returns
   */
  newTransaction({
    proposer = this.provider.wallet.publicKey,
    payer = this.provider.wallet.publicKey,
    instructions: ixs,
    eta,
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const index = (yield this.reloadData()).numTransactions.toNumber();
      const [txKey, txBump] = yield (0, pda_1.findTransactionAddress)(
        this.key,
        index
      );
      const accounts = {
        smartWallet: this.key,
        transaction: txKey,
        proposer,
        payer,
        systemProgram: web3_js_1.SystemProgram.programId,
      };
      const instructions = [];
      if (eta === undefined) {
        instructions.push(
          this.program.instruction.createTransaction(txBump, ixs, {
            accounts,
          })
        );
      } else {
        instructions.push(
          this.program.instruction.createTransactionWithTimelock(
            txBump,
            ixs,
            eta,
            {
              accounts,
            }
          )
        );
      }
      return {
        transactionKey: txKey,
        tx: new solana_contrib_1.TransactionEnvelope(
          this.provider,
          instructions
        ),
        index,
      };
    });
  }
  /**
   * Creates a new transaction from an envelope.
   * @returns
   */
  newTransactionFromEnvelope(_a) {
    var { tx } = _a,
      args = tslib_1.__rest(_a, ["tx"]);
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return this.newTransaction(
        Object.assign(Object.assign({}, args), {
          instructions: tx.instructions,
        })
      );
    });
  }
  /**
   * Fetches a transaction by its index.
   */
  fetchTransactionByIndex(index) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const [txKey] = yield (0, pda_1.findTransactionAddress)(this.key, index);
      return yield this.program.account.transaction.fetchNullable(txKey);
    });
  }
  /**
   * fetchTransaction
   */
  fetchTransaction(key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield this.program.account.transaction.fetch(key);
    });
  }
  /**
   * Approves a transaction.
   */
  approveTransaction(transactionKey, owner = this.provider.wallet.publicKey) {
    return new solana_contrib_1.TransactionEnvelope(this.provider, [
      this.program.instruction.approve({
        accounts: {
          smartWallet: this.key,
          transaction: transactionKey,
          owner,
        },
      }),
    ]);
  }
  /**
   * Executes a transaction as the Smart Wallet.
   */
  executeTransaction({
    transactionKey,
    owner = this.provider.wallet.publicKey,
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const ix = this.program.instruction.executeTransaction(
        yield this._fetchExecuteTransactionContext({ transactionKey, owner })
      );
      return new solana_contrib_1.TransactionEnvelope(this.provider, [ix]);
    });
  }
  /**
   * Finds the derived wallet address and bump of a given index.
   * @param index
   * @returns
   */
  findWalletDerivedAddress(index) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield (0, pda_1.findWalletDerivedAddress)(this.key, index);
    });
  }
  /**
   * Finds the owner invoker address and bump of a given index.
   * @param index
   * @returns
   */
  findOwnerInvokerAddress(index) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return yield (0, pda_1.findOwnerInvokerAddress)(this.key, index);
    });
  }
  _fetchExecuteTransactionContext({
    transactionKey,
    owner = this.provider.wallet.publicKey,
    walletDerivedAddress = null,
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const data = yield this.fetchTransaction(transactionKey);
      return {
        accounts: {
          smartWallet: this.key,
          transaction: transactionKey,
          owner,
        },
        remainingAccounts: data.instructions.flatMap((ix) => [
          {
            pubkey: ix.programId,
            isSigner: false,
            isWritable: false,
          },
          ...ix.keys.map((k) => {
            if (
              k.isSigner &&
              ((walletDerivedAddress &&
                k.pubkey.equals(walletDerivedAddress)) ||
                k.pubkey.equals(this.key))
            ) {
              return Object.assign(Object.assign({}, k), { isSigner: false });
            }
            return k;
          }),
        ]),
      };
    });
  }
  /**
   * Executes a transaction using a wallet-derived address.
   */
  executeTransactionDerived({
    transactionKey,
    walletIndex,
    owner = this.provider.wallet.publicKey,
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const [walletDerivedAddress, walletBump] =
        yield this.findWalletDerivedAddress(walletIndex);
      const ix = this.program.instruction.executeTransactionDerived(
        new bn_js_1.default(walletIndex),
        walletBump,
        yield this._fetchExecuteTransactionContext({
          transactionKey,
          owner,
          walletDerivedAddress,
        })
      );
      return new solana_contrib_1.TransactionEnvelope(this.provider, [ix]);
    });
  }
  /**
   * Executes a transaction using an owner invoker address.
   */
  ownerInvokeInstruction({
    instruction,
    index,
    owner = this.provider.wallet.publicKey,
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const [invokerAddress, invokerBump] = yield this.findOwnerInvokerAddress(
        index
      );
      const ix = this.program.instruction.ownerInvokeInstruction(
        new bn_js_1.default(index),
        invokerBump,
        instruction,
        {
          accounts: {
            smartWallet: this.key,
            owner,
          },
          remainingAccounts: [
            {
              pubkey: instruction.programId,
              isSigner: false,
              isWritable: false,
            },
            ...instruction.keys.map((k) => {
              if (k.isSigner && invokerAddress.equals(k.pubkey)) {
                return Object.assign(Object.assign({}, k), { isSigner: false });
              }
              return k;
            }),
          ],
        }
      );
      return new solana_contrib_1.TransactionEnvelope(this.provider, [ix]);
    });
  }
  /**
   * Executes a transaction using an owner invoker address.
   */
  ownerInvokeInstructionV2({
    instruction,
    index,
    owner = this.provider.wallet.publicKey,
  }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const [invokerAddress, invokerBump] = yield this.findOwnerInvokerAddress(
        index
      );
      const ix = this.program.instruction.ownerInvokeInstructionV2(
        new bn_js_1.default(index),
        invokerBump,
        invokerAddress,
        instruction.data,
        {
          accounts: {
            smartWallet: this.key,
            owner,
          },
          remainingAccounts: [
            {
              pubkey: instruction.programId,
              isSigner: false,
              isWritable: false,
            },
            ...instruction.keys.map((k) => {
              if (k.isSigner && invokerAddress.equals(k.pubkey)) {
                return Object.assign(Object.assign({}, k), { isSigner: false });
              }
              return k;
            }),
          ],
        }
      );
      return new solana_contrib_1.TransactionEnvelope(this.provider, [ix]);
    });
  }
  /**
   * setOwners
   */
  setOwners(owners) {
    const ix = this.program.instruction.setOwners(owners, {
      accounts: {
        smartWallet: this.key,
      },
    });
    return new solana_contrib_1.TransactionEnvelope(this.provider, [ix]);
  }
  /**
   * changeThreshold
   */
  changeThreshold(threshold) {
    const ix = this.program.instruction.changeThreshold(
      new bn_js_1.default(threshold),
      {
        accounts: {
          smartWallet: this.key,
        },
      }
    );
    return new solana_contrib_1.TransactionEnvelope(this.provider, [ix]);
  }
  /**
   * Loads a SmartWallet
   */
  static load(sdk, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const data = yield sdk.programs.SmartWallet.account.smartWallet.fetch(
        key
      );
      return new SmartWalletWrapper(sdk, {
        key,
        data,
        bump: data.bump,
        base: data.base,
      });
    });
  }
}
exports.SmartWalletWrapper = SmartWalletWrapper;
//# sourceMappingURL=index.js.map
