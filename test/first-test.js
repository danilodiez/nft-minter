import {expect} from 'chai';
describe("MyNFT", function(){
  it("Should mint and transfer an NFT to someone", async function() {
    const FiredGuys = await ethers.getContractFactory("FiredGuys");
    const firedguys = await FiredGuys.deploy();
    await firedguys.deployed();

    const recipient = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const metadataURI = 'cid/test.png';

    let balance = await firedguys.balanceOf(recipient);
    expect(balance).to.equal(0);
    const newlyMintedToken = await firedguys.payToMint(recipient, metadataURI, {value: ethers.utils.parseEther('0.01')});

    // we wait to have the transaction mined
    await newlyMintedToken.wait();
    console.log(newlyMintedToken);

    balance = await firedguys.balanceOf(recipient);

    expect(balance).to.equal(1);

    expect(await firedguys.isContentOwned(metadataURI).to.equal(true));
  })
})
