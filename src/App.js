import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useRef } from 'react';

import { Box, AppBar, Typography, Button } from '@mui/material';
import MButton from '@mui/material/Button';

import { readLandBlockSC, landBlockCA, smartContractXCRMRK } from './components/LandBlockSale';
import CreateOffer from './components/CreateOffer';
import WithdrawComponent from './components/WithdrawComponent';
import MyOffers from './components/MyOffers';

import SRSlogo from './components/images/SRS_logo.png';
import OfferCard from './components/OfferCard';

// New imports

import HandleOffers from './components/HandleOffers';
import DepositedLandCard from './components/DepositedLandCard';

//added react router for more pages
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function App() {

  // Account state
  const [currentAccount, setCurrentAccount] = useState("");
  var activeOffersNumber = useRef(-1);

  // Appbar 
  function SkybreachAppBar() {

    return (
      <AppBar position="static" sx={{ height: 130, backgroundColor: "#282c34", boxShadow: 24 }}>

        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ height: 100, mt: 3 }} >
          <Box display='inline-flex' sx={{ ml: 4, alignItems: "center" }}>
            <Box sx={{ minWidth: 100, maxWidth: 150, minHeight: 100, maxHeight: 150, mt: 2, elevation: 5, borderRadius: 100, boxShadow: 12, }} >
              <img src={SRSlogo} alt="SRS logo" class="img-fluid" />
            </Box>
            <Box >
              <Typography sx={{ ml: 2, fontWeight: 'bold', fontSize: 'clamp(26px, 4vw, 40px)', textAlign: 'left' }} variant='h4' >
                Skybreach tools
              </Typography>
              <Typography sx={{ ml: 2, mb: 3, fontWeight: 'normal', fontSize: 'clamp(18px, 4vw, 30px)', textAlign: 'left' }} variant='h5'>
                Land Block Sale
              </Typography>
            </Box>
            <Box sx={{ ml: 5, mb: 2 }}>
              {updateConnectedWallet()}
            </Box>
          </Box>

          <Box sx={{ minWidth: 50 }} />

          <Box display="inline-flex" gap={3} sx={{ mr: 5, mb: 2, alignItems: "center", justifyContent: "flex-end", minHeight: 10 }}>
            <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ width: 200, maxHeight: 100, borderRadius: 10 }}>
              <Link to={'/Landmanagement'} style={routeLinkStyle}>
                Land Management
              </Link>
            </Button>
            <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ width: 200, maxHeight: 100, borderRadius: 10 }}>
              <Link to={'/Offermarket'} style={routeLinkStyle}>
                Offer
                <br />
                Market
              </Link>
            </Button>
          </Box>
        </Box>
      </AppBar>
    );
  }

  function SkybreachFooter() {
    return (
      <div class="mt-5 pt-5 pb-5 footer">
        <div class="box_container_padded">
          <div class="d-flex justify-content-end">
            <div class="wrapper">
              <h2>Skybreach tools - Land Block Sale
              </h2>
              <div class="padding_20">
                <p class="pr-5 text-white-50">Skybreach tools - Land Block Sale (also shortened LBS) is a free dApp that has the aim to add a new feature by giving to the project users the possibility to sell Skybreach metaverse lands in block directly on-chain and without trust a third human part.</p>
              </div>
            </div>
            <div class="col-lg-3 col-xs-12 links">
              <h4 class="mt-lg-0 mt-sm-3">Links</h4>
              <ul class="m-0 p-0">
                <li>- <a href="https://github.com/qwertyuiop9/land_block_sale">Github repository</a></li>
                <li>- <a href="https://twitter.com/vendrame_and">Twitter</a></li>
                <li>- <a href="https://www.superrisknft.com/">Website</a></li>
                <li>- <a href="https://www.instagram.com/s_superrisk/">Instagram</a></li>
                <li>- <a href="https://superrisk-studio.gitbook.io/skybreach-land-block-sale/">Gitbook</a></li>
              </ul>
            </div>
            <div class="col-lg-4 col-xs-12 location">
              <h4 class="mt-lg-0 mt-sm-4">Contacts</h4>
              <p>Mail - superrisknft@gmail.com</p>
              <p>Discord - superrisk#5988</p>
              <p>Telegram - @vendrame_and</p>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col copyright">
              <p class="padding_20"><small class="text-white-50">© 2022. All Rights Reserved.</small></p>
            </div>
          </div>
        </div>
      </div>

    );
  }


  // Metamask button
  const connectWallet = async () => {

    // Check Metamask presence
    var { ethereum } = window;
    if (!ethereum) {
      console.log("Metamask not installed");
    } else {
      console.log("Wallet found, ready to start");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }); // fundamental to add this line for correctness
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        console.log("Account 0: " + accounts[0]);
      } else {
        console.log("0 account connected to Metamask extension");
      }
    } catch {
      console.log("Error during Metamask connection");
    }

  }


  // CHANGE CONNECT WALLET BUTTON
  function updateConnectedWallet() {

    if (currentAccount === "") {
      console.log("Not logged in");
      return (
        <MButton className="blueButton" variant="outlined" sx={{ borderRadius: 3, fontWeight: 'bold', border: '4px solid', padding: "10px 15px", maxWidth: '120px', maxHeight: '80px', minWidth: '5px', minHeight: '5px', fontSize: 'clamp(12px, 1vw, 18px)' }} onClick={connectWallet}>
          Connect wallet
        </MButton>
      );
    } else {
      return (

        <Box display="inline-flex" alignContent="center">
          <Box sx={{ ml: 1, mr: 1 }}>
            <Typography sx={{ color: "#4180CB", fontSize: 'clamp(22px, 1vw, 36px)' }} >
              Connected&nbsp;wallet:
            </Typography>
            <Typography sx={{ color: "#4180CB", fontSize: 'clamp(22px, 1vw, 36px)' }} >
              {currentAccount.substring(0, 5) + "..." + currentAccount.substring(currentAccount.length, currentAccount.length - 5)}
            </Typography>
          </Box>
        </Box>
      );
    }
  }


  function approveXCRMRK() {
    const offerCreationFee = 5 * 10 ** 9;
    Promise.all([smartContractXCRMRK.approve(landBlockCA, offerCreationFee)
    ]).then(allResponses => { console.log("Risultato 1: " + allResponses[0]) });
  }

  useEffect(() => {

  }, []);


  // VARIOUS STYLES
  const routeLinkStyle = {
    textDecoration: "none",
    color: 'white',
    fontWeight: '800',
    fontSize: 20
  };

  const homeLinkStyle = {
    textDecoration: "none",
    color: 'white',
    fontWeight: '800',
    fontSize: 30
  };

  return (
    <BrowserRouter>

      <div className="App" class="bg" >

        <Routes >

          <Route exact path='/' element={
            <Box className='fullPage' display='flex' justifyContent='center' alignItems='center' sx={{ p: 5 }}>
              <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' >
                <Box sx={{ maxWidth: 200 }}>
                  <img src={SRSlogo} alt="Superrisk Studio logo" class='img-fluid' />
                </Box>
                <Typography className='blueGradientText' sx={{ fontSize: 100, fontWeight: 1000 }}>
                  SKYBREACH TOOLS
                </Typography>
                <Typography className='blueGradientText' sx={{ mt: -4, fontSize: 60, fontWeight: 1000 }}>
                  Land-block Sale
                </Typography>
                <Box display='flex' gap={5} alignItems='center'>
                  <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ mt: 5, width: 350, height: 130, borderRadius: 50 }} onClick={connectWallet}>
                    <Typography sx={{ color: 'white', fontWeight: '800', fontSize: 30 }}>
                      Connect&nbsp; wallet
                    </Typography>
                  </Button>
                  <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ mt: 5, width: 350, height: 130, borderRadius: 50 }} disabled={currentAccount === ""}>
                    <Link to={'/Offermarket'} style={homeLinkStyle}>
                      Enter Market
                    </Link>
                  </Button>
                </Box>
              </Box>
            </Box>
          } />

          <Route exact path='/Offermarket' element={
            <div>
              {SkybreachAppBar()}
              <div class="mt-5 container">
                <HandleOffers wallet={currentAccount} />

              </div>
              {SkybreachFooter()}
            </div>
          } />

          <Route exact path='/Landmanagement' element={
            <div>
              {SkybreachAppBar()}
              <div class="mt-5 container">
                <CreateOffer create_offer={0} />
                <WithdrawComponent key={currentAccount} connected_account={currentAccount} />
              </div>
              {SkybreachFooter()}
            </div>
          } />

        </Routes>
      </div >
    </BrowserRouter>
  );


}

export default App;