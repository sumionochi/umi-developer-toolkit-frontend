// test/Counter.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter (EVM)", function () {
  let counter;

  before(async function () {
    // grab the factory
    const Counter = await ethers.getContractFactory("Counter");
    // deploy it
    counter = await Counter.deploy();
    // wait until it’s mined
    await counter.waitForDeployment();
  });

  it("starts at 0", async function () {
    expect(await counter.count()).to.equal(0);
  });

  it("increments the counter", async function () {
    await counter.increment();
    expect(await counter.count()).to.equal(1);
  });
});
