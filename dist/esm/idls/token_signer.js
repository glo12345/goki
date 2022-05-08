export const TokenSignerJSON = {
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
import { generateErrorMap } from "@saberhq/anchor-contrib";
export const TokenSignerErrors = generateErrorMap(TokenSignerJSON);
//# sourceMappingURL=token_signer.js.map
