import { React, useEffect, useState } from 'react';
import { landBlockSalesReadable } from './smartContracts/MoonriverConfig.js';
import OfferCard from './OfferCard';
import { Typography, Box, Button, IconButton, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function HandleOffers(props) {

    const userWallet = props.wallet;
    const [actualActiveOffers, setActualActiveOffers] = useState([]);
    const [myButton, setMyButton] = useState(false);
    const [marketButton, setMarketButton] = useState(false);

    function fetchMarketActiveOffers() {
        landBlockSalesReadable.getActiveOffers()
            .then((offerIds) => {
                console.log("Offerte con la nuova configurazione: [" + offerIds + "]");
                setActualActiveOffers(offerIds);
            }).catch(error => {
                console.log("Errore handleClick");
                console.log(error);
                setActualActiveOffers([]);
            });
        if (!marketButton) { setMarketButton(true) };
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
            });
        if (!myButton) { setMyButton(true) };
    }

    return (
        <Box>
            <Box sx={{ mt: 5 }}>
                <Box display='flex' alignItems='center'>
                    <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                        Active Market Offers
                    </Typography>
                    {marketButton ?
                        <IconButton className='blueGradientButton' variant='contained' size='large' onClick={fetchMarketActiveOffers} sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                            <RefreshIcon sx={{ color: 'white' }} />
                        </IconButton>
                        :
                        <Button className='blueGradientButton' variant='contained' size='large' onClick={fetchMarketActiveOffers} sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                            Check
                        </Button>
                    }
                </Box>
                <Grid container spacing={5} direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ mb: 1 }}>
                    {actualActiveOffers.map(offerId => (
                        <Grid item xs='auto'>
                            <OfferCard
                                id={offerId}
                                key={offerId}
                                isMyOffer={true} />
                        </Grid>
                    ))}
                </Grid>


            </Box>

        </Box>
    );

} export default HandleOffers;


// MY OFFERS section, to add in the future under the map of MARKET OFFERS
/*
                <Box display='flex' alignItems='center' sx={{ mt: 5 }}>
                    <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                        My Offers
                    </Typography>
                    {myButton ?
                        <IconButton className='blueGradientButton' variant='contained' size='large' sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                            <RefreshIcon sx={{ color: 'white' }} />
                        </IconButton>
                        :
                        <Button className='blueGradientButton' variant='contained' size='large' sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                            Check
                        </Button>
                    }
                </Box>
*/