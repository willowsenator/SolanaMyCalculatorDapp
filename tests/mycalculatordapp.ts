import * as anchor from "@project-serum/anchor";
import * as assert from "assert";
const { SystemProgram } = anchor.web3;

describe("mycalculatordapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatordapp;

  it("Create a calculator", async () => {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator],
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.greeting === "Welcome to Solana");
  });

  it("Add two numbers", async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(7)));
  });

  it("Substract two numbers", async () => {
    await program.rpc.substract(new anchor.BN(2), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(-3)));
  });

  it("Multiply two numbers", async () => {
    await program.rpc.multiply(new anchor.BN(2), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(10)));
  });

  it("Divide two numbers", async () => {
    await program.rpc.divide(new anchor.BN(1), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(0)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
  });
});
