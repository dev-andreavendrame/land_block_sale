import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import { Box, AppBar, Typography, Button } from '@mui/material';
import MButton from '@mui/material/Button';

import CreateOffer from './components/CreateOffer';
import WithdrawComponent from './components/WithdrawComponent';

import SRSlogo from './components/images/SRS_logo.png';
import SkybreachIsland from './components/images/skybreach_island.jpg';

// New imports

import HandleOffers from './components/HandleOffers';

//added react router for more pages
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DAPP_NAME, MADE_BY, DAPP_VERSION } from './components/minorComponents/Constants';
import DepositedLandCard from './components/DepositedLandCard';

function App() {

  // Account state
  const [currentAccount, setCurrentAccount] = useState("");

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
              <Box display='flex' flexDirection='row' alignItems='flex-end' >
                <Typography sx={{ ml: 2, fontWeight: 'bold', fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', textAlign: 'left' }} variant='h4' noWrap>
                  {DAPP_NAME}
                </Typography>
                <Typography sx={{ mb: 0.6, ml: 1, fontWeight: 300, fontSize: 'clamp(0.7rem, 2vw, 1rem)', textAlign: 'left' }} variant='h4' noWrap>
                  v{DAPP_VERSION}
                </Typography>
              </Box>
              <Typography sx={{ ml: 2, mb: 3, fontWeight: 'normal', fontSize: 'clamp(0.5rem, 2vw, 1.3rem)', textAlign: 'left' }} variant='h5' noWrap>
                {MADE_BY}
              </Typography>
            </Box>
            <Box sx={{ ml: 5, mb: 2 }}>
              {updateConnectedWallet()}
            </Box>
          </Box>

          <Box sx={{ minWidth: 50 }} />

          <Box display="inline-flex" gap={3} sx={{ mr: 5, mb: 2, alignItems: "center", justifyContent: "flex-end", minHeight: 10 }}>
            <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ width: 160, maxHeight: 80, borderRadius: 4 }}>
              <Link to={'/Landmanagement'} style={routeLinkStyle}>
                Land Management
              </Link>
            </Button>
            <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ width: 160, maxHeight: 80, borderRadius: 4 }}>
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
              <h2>{DAPP_NAME + ", " + MADE_BY}
              </h2>
              <div class="padding_20">
                <p class="pr-5 text-white-50">{DAPP_NAME} (also shortened LBS) is a free dApp made {MADE_BY} that aims to add a new feature by giving to the project users the possibility to sell Skybreach metaverse lands in block, directly on-chain and without any third human part.</p>
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
            <Typography sx={{ color: "#4180CB", fontSize: 'clamp(0.5rem, 2vw, 1.3rem)' }} >
              Connected&nbsp;wallet:
            </Typography>
            <Typography sx={{ color: "#4180CB", fontSize: 'clamp(0.5rem, 2vw, 1.3rem)' }} >
              {currentAccount.substring(0, 5) + "..." + currentAccount.substring(currentAccount.length, currentAccount.length - 5)}
            </Typography>
          </Box>
        </Box>
      );
    }
  }

  // VARIOUS STYLES
  const routeLinkStyle = {
    textDecoration: "none",
    color: 'white',
    fontWeight: '800',
    fontSize: 16
  };

  const homeLinkStyle = {
    textDecoration: "none",
    color: 'white',
    fontWeight: '800',
    fontSize: 22
  };

  return (
    <BrowserRouter>

      <div className="App" class="bg" >

        <Routes >

          <Route exact path='/' element={
            <Box className='fullPage bg-homeImage' display='flex' justifyContent='center' alignItems='center' sx={{ p: 5 }} style={{ backgroundImage: `url(${SkybreachIsland})` }}>
              <Box className="whiteHomeBackground" display='flex' flexDirection='column' justifyContent='center' alignItems='center' sx={{ p: 5, pr: 10, pl: 10 }} >
                <Box sx={{ mb: 2, maxWidth: 180 }}>
                  <img src={SRSlogo} alt="Superrisk Studio logo" class='img-fluid' />
                </Box>
                <Typography className='blueGradientText textThinShadow' sx={{ wordSpacing: '10px', fontSize: 72, fontWeight: 1000 }}>
                  {DAPP_NAME.toUpperCase()}
                </Typography>
                <Typography className='blueGradientText' sx={{ mt: -2, fontSize: 36, fontWeight: 1000 }}>
                  {MADE_BY}
                </Typography>
                <Typography className='blueGradientText' sx={{ mt: -1, fontSize: 18, fontWeight: 600 }}>
                  Version: {DAPP_VERSION}
                </Typography>
                <Box display='flex' gap={10} alignItems='center'>
                  <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ mt: 5, width: 200, height: 100, borderRadius: 4 }} onClick={connectWallet}>
                    <Typography sx={{ color: 'white', fontWeight: '800', fontSize: 22 }}>
                      Connect&nbsp; wallet
                    </Typography>
                  </Button>
                  <Button className='blueGradientButton blueGradientButton--navigation' variant='contained' size='large' sx={{ mt: 5, width: 200, height: 100, borderRadius: 4 }} disabled={currentAccount === ""}>
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
              <Box display='flex' flexDirection='column' justifyContent='center' gap={7} sx={{ p: 5 }} >
                <CreateOffer create_offer={0} sx={{ mb: 5 }}/>
                <WithdrawComponent key={currentAccount} connected_account={currentAccount} />
              </Box>
              {SkybreachFooter()}
            </div>
          } />

        </Routes>
      </div >
    </BrowserRouter>
  );


}

export default App;
