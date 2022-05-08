"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSignerErrors = exports.TokenSignerJSON = void 0;
exports.TokenSignerJSON = {
  version: "0.6.1",
  name: "token_signer",
  instructions: [
    {
      name: "invokeSignedInstruction",
      accounts: [
        {
          name: "ownerAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "nftAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "nftPda",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: "bytes",
        },
      ],
    },
  ],
  types: [
    {
      name: "ErrorCode",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Unauthorized",
          },
        ],
      },
    },
  ],
};
const anchor_contrib_1 = require("@saberhq/anchor-contrib");
exports.TokenSignerErrors = (0, anchor_contrib_1.generateErrorMap)(
  exports.TokenSignerJSON
);
//# sourceMappingURL=token_signer.js.map
