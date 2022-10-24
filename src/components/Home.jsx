import {ethers} from 'ethers';
import WalletBalance from './WalletBalance';
import {useEffect, useState} from 'react';

import FiredGuys from '../artifacts/contracts/MyNFT.sol/FiredGuys.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

//get the end user 

const signer = provider.getSigner();

//get the smart contract
const contract = new ethers.Contract(contractAddress, FiredGuys.abi, signer);


function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount()
  }, [])

  const getCount = async () => {
    const count = await contract.count();
    setTotalMinted(parseInt(count));
  }

  return (
    <div>
      <WalletBalance />

      <h1>Fired Guys NFT Collection</h1>
      {Array(totalMinted + 1)
        .fill(0) 
          .map((_, i) => (
            <div key={i}> 
              <NFTImage tokenId={i} />
            </div>
          ) )
      }
    </div>
  )
}

function NFTImage({ tokenId, getCount }) {
  const contentId = 'QmSzQ6xVesUDt7aPer4GbCGsYJpnzc3wVJ3gAWvUwUGgJx';

  const metadataURI = `${contentId}/${tokenId}.json`;

  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.svg`

  const [isMinted, setIsMinted] = useState(false);
  
  useEffect(() => {
    getMintedStatus();
  }, [isMinted])
  
  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadaURI);
    console.log(result);
    setIsMinted(result);
  }

   const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  return (
    <div>
      <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
        <h5>ID #{tokenId}</h5>
        {!isMinted ? (
          <button onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button onClick={getURI}>
            Taken! Show URI
          </button>
        )}
    </div>
  );
}

export default Home;
