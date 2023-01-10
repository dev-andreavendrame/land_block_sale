import { React, useEffect, useState } from 'react';
import { landBlockSalesReadable } from './smartContracts/MoonriverConfig.js';
import OfferCard from './OfferCard';
import { Typography, Box, Button } from '@mui/material';

// IMPORTANT!   =>  This class will replace the "Market offer" section created in App.js
//                    
//
//                  As consequences, lots of testing must be made to be sure everything works fine !!!

function HandleOffers(props) {

    const userWallet = props.wallet;
    const [actualActiveOffers, setActualActiveOffers] = useState([]);

    function fetchMarketActiveOffers() {
        landBlockSalesReadable.getActiveOffers()
            .then((offerIds) => {
                console.log("Offerte con la nuova configurazione: [" + offerIds + "]");
                setActualActiveOffers(offerIds);
            }).catch(error => {
                console.log("Errore handleClick");
                console.log(error);
                setActualActiveOffers([]);
            })
    }

    function fetchMyActiveOffers() {
        landBlockSalesReadable.getOfferByUser(userWallet)
            .then((offerIds) => {
                console.log("Offerte con la nuova configurazione: [" + offerIds + "]");
                setActualActiveOffers(offerIds);
            }).catch(error => {
                console.log("Errore handleClick");
                console.log(error);
                setActualActiveOffers([]);
            })
    }



    // RE-DO ALL !!!!!
    return (
        <Box>
            <Box sx={{ mt: 5 }}>
                <Box display='flex' alignItems='center'>
                    <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                        Active Market Offers
                    </Typography>
                    <Button className='blueGradientButton' variant='contained' size='large' onClick={fetchMarketActiveOffers} sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                        Check
                    </Button>
                </Box>
                {actualActiveOffers.map(offerId => (
                    <OfferCard id={offerId} key={offerId} />
                ))}

                <Box display='flex' alignItems='center' sx={{ mt: 5 }}>
                    <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                        My Offers
                    </Typography>
                    <Button className='blueGradientButton' variant='contained' size='large' sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                        Check
                    </Button>
                </Box>
            </Box>

        </Box>
    );

} export default HandleOffers;