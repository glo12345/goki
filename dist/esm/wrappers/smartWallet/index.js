import { __awaiter, __rest } from "tslib";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import {
  findOwnerInvokerAddress,
  findTransactionAddress,
  findWalletDerivedAddress,
} from "./pda";
export * from "./pda";
export * from "./types";
export class SmartWalletWrapper {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      const index = (yield this.reloadData()).numTransactions.toNumber();
      const [txKey, txBump] = yield findTransactionAddress(this.key, index);
      const accounts = {
        smartWallet: this.key,
        transaction: txKey,
        proposer,
        payer,
        systemProgram: SystemProgram.programId,
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
        tx: new TransactionEnvelope(this.provider, instructions),
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
      args = __rest(_a, ["tx"]);
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      const [txKey] = yield findTransactionAddress(this.key, index);
      return yield this.program.account.transaction.fetchNullable(txKey);
    });
  }
  /**
   * fetchTransaction
   */
  fetchTransaction(key) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.program.account.transaction.fetch(key);
    });
  }
  /**
   * Approves a transaction.
   */
  approveTransaction(transactionKey, owner = this.provider.wallet.publicKey) {
    return new TransactionEnvelope(this.provider, [
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
    return __awaiter(this, void 0, void 0, function* () {
      const ix = this.program.instruction.executeTransaction(
        yield this._fetchExecuteTransactionContext({ transactionKey, owner })
      );
      return new TransactionEnvelope(this.provider, [ix]);
    });
  }
  /**
   * Finds the derived wallet address and bump of a given index.
   * @param index
   * @returns
   */
  findWalletDerivedAddress(index) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield findWalletDerivedAddress(this.key, index);
    });
  }
  /**
   * Finds the owner invoker address and bump of a given index.
   * @param index
   * @returns
   */
  findOwnerInvokerAddress(index) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield findOwnerInvokerAddress(this.key, index);
    });
  }
  _fetchExecuteTransactionContext({
    transactionKey,
    owner = this.provider.wallet.publicKey,
    walletDerivedAddress = null,
  }) {
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      const [walletDerivedAddress, walletBump] =
        yield this.findWalletDerivedAddress(walletIndex);
      const ix = this.program.instruction.executeTransactionDerived(
        new BN(walletIndex),
        walletBump,
        yield this._fetchExecuteTransactionContext({
          transactionKey,
          owner,
          walletDerivedAddress,
        })
      );
      return new TransactionEnvelope(this.provider, [ix]);
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
    return __awaiter(this, void 0, void 0, function* () {
      const [invokerAddress, invokerBump] = yield this.findOwnerInvokerAddress(
        index
      );
      const ix = this.program.instruction.ownerInvokeInstruction(
        new BN(index),
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
      return new TransactionEnvelope(this.provider, [ix]);
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
    return __awaiter(this, void 0, void 0, function* () {
      const [invokerAddress, invokerBump] = yield this.findOwnerInvokerAddress(
        index
      );
      const ix = this.program.instruction.ownerInvokeInstructionV2(
        new BN(index),
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
      return new TransactionEnvelope(this.provider, [ix]);
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
    return new TransactionEnvelope(this.provider, [ix]);
  }
  /**
   * changeThreshold
   */
  changeThreshold(threshold) {
    const ix = this.program.instruction.changeThreshold(new BN(threshold), {
      accounts: {
        smartWallet: this.key,
      },
    });
    return new TransactionEnvelope(this.provider, [ix]);
  }
  /**
   * Loads a SmartWallet
   */
  static load(sdk, key) {
    return __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=index.js.map
