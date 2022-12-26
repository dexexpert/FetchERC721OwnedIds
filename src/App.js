import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import abi from './ERC721Abi';

export default function App() {
  const context = useWeb3React();
  const { library, chainId, account, activate, deactivate, active, error } =
    context;
  const [ownerAddress, setOwnerAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTokens, setShowTokens] = useState('');
  const tokensOfOwner = async ({ contractAddress, walletAddress }) => {
    setIsLoading(true);
    let url = 'https://bscrpc.com';
    let customHttpProvider = new ethers.providers.JsonRpcProvider(url);

    const token = new ethers.Contract(contractAddress, abi, customHttpProvider);

    console.log(token);

    const sentLogs = await token.queryFilter(
      token.filters.Transfer(walletAddress, null)
    );

    console.log('sent logs', sentLogs);
    const receivedLogs = await token.queryFilter(
      token.filters.Transfer(null, walletAddress)
    );

    console.log('r logs', receivedLogs);

    const logs = sentLogs
      .concat(receivedLogs)
      .sort(
        (a, b) =>
          a.blockNumber - b.blockNumber ||
          a.transactionIndex - b.transactionIndex
      );

    console.log('logs', logs);

    const owned = new Set();

    for (const log of logs) {
      const { from, to, tokenId } = log.args;

      if (addressEqual(to, account)) {
        owned.add(tokenId.toString());
      } else if (addressEqual(from, account)) {
        owned.delete(tokenId.toString());
      }
    }
    console.log('owned', owned);
    setIsLoading(false);
    return owned;
  };

  // async function showTokensOfOwner() {
  //   try {
  //     console.log('tokens owned by', walletAddress);
  //     const owned = await tokensOfOwner();
  //     console.log(owned);
  //     setShowTokens([...owned].join('\n'));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  const fetchIds = async () => {
    const owned = await tokensOfOwner({
      // contractAddress: '0xe3b1d32e43ce8d658368e2cbff95d57ef39be8a6',
      contractAddress: '0x9292eecf86ac8633af9e67ddf10e8eff92bf5632',
      walletAddress: ownerAddress,
    });
    console.log(owned);
    setShowTokens([...owned].join('\n'));
  };

  return (
    <div class="bg-gray-600">
      <h1 class="text-3xl font-bold underline">
        This App is to fetch token IDs owned by address
      </h1>
      <p>Input your address here and just click fetch :)</p>
      <input
        value={ownerAddress}
        onChange={(e) => {
          setOwnerAddress(e.target.value);
        }}
      ></input>
      <button style={{ marginLeft: '10px' }} onClick={fetchIds}>
        fetch
      </button>
      {isLoading && <div>Loading...</div>}
      <div>{showTokens}</div>
    </div>
  );
}
