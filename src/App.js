import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from "ethers";
import { useEffect, useState, useRef } from 'react';
import { readLandBlockSC, writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA } from './components/LandBlockSale';
import CreateOffer from './components/CreateOffer';
import WithdrawComponent from './components/WithdrawComponent';

import {
  XC_RMRK_ABI,
  MOONBASE_ALPHA_XC_RMRK_ADDRESS,
  MOONBASE_ALPHA_SKYBREACH_ADDRESS,
  SKYBREACH_ABI
} from './components/Constants';
import Block from './components/Block';
import HandleMyOffers from './components/MyOffers';

function App() {

  const [actualActiveOffers, setActualActiveOffers] = useState([]);
  const [accountAddress, setAccountAddress] = useState("click to connect -->");
  var activeOffersNumber = useRef(-1);

  // SC management
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const smartContractXCRMRK = new ethers.Contract(MOONBASE_ALPHA_XC_RMRK_ADDRESS, XC_RMRK_ABI, provider.getSigner());
  const smartContractSkybreach = new ethers.Contract(MOONBASE_ALPHA_SKYBREACH_ADDRESS, SKYBREACH_ABI, provider.getSigner());

  function handleClick() {
    readLandBlockSC.getActiveOffers().then(offerIds => {
      setActualActiveOffers(offerIds);
      // Change state
      activeOffersNumber = offerIds.length;
      console.log("IDs offerte ricevute: " + offerIds);
    }).catch(error => {
      console.log("Errore: " + error);
      setActualActiveOffers([]);
    });
  }

  // Metamask button
  const buttonWalletConnectionHandler = () => {
    if (window.ethereum) {
      // Connecting to wallet
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(wallets => {
          setAccountAddress(wallets[0]);
          console.log("Logged with metamask, wallet: " + accountAddress);
        }
        );
    } else {
      console.log("Manca matamask o altri errori");
    }
  };

  function approveXCRMRK() {
    const offerCreationFee = 5 * 10 ** 9;
    Promise.all([smartContractXCRMRK.approve(landBlockCA, offerCreationFee)
    ]).then(allResponses => { console.log("Risultato 1: " + allResponses[0]) });
  }

  useEffect(() => {

  }, [activeOffersNumber]);

  return (
    <div class="container-p-3 my-3 bg-dark text-white">
      <div class='padding_20'>
        <div class="d-flex justify-content-between align-center">
          <h1>Skybreach tools - Land Block Sale</h1>
          <div class="row">
            <div class="col"></div>
            <h5>Connected wallet:</h5>
            <div class="padding_20"><h5>{accountAddress}</h5></div>
          </div>
          <button type="button" class="btn btn-outline-primary" onClick={buttonWalletConnectionHandler}>Connect wallet</button>
        </div>
      </div>

      <HandleMyOffers connected_wallet={accountAddress} />
      <CreateOffer create_offer={0} />
      <div class="card bg-info">
        <div class="card-body">
          <h3 class="card-title">Market offers</h3>
          <div class="col d-flex justify-content-center btn-block">
            <button type="button" class="btn btn-warning col-12" onClick={handleClick}>Get active offers</button>
          </div>
        </div>
      </div>
      <div>
        {actualActiveOffers.map(offerId => (
          <Block offer_id={offerId} key={offerId} />
        ))}
      </div>
      <WithdrawComponent key={accountAddress} connected_account={accountAddress} />
    </div>
  );


}

export default App;