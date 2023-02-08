import { React, useEffect, useState } from 'react';
import { landBlockSalesReadable } from './smartContracts/MoonriverConfig.js';
import OfferCard from './OfferCard';
import { Typography, Box, Button, IconButton, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function HandleOffers(props) {

    const [actualActiveOffers, setActualActiveOffers] = useState([]);
    const [myActiveOffers, setMyActiveOffers] = useState([]);
    const [otherActiveOffers, setOtherActiveOffers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);



    function fetchActiveOffers() {
        landBlockSalesReadable.getActiveOffers()
            .then((offerIds) => {
                console.log("Offerte con la nuova configurazione: [" + offerIds + "]");
                setActualActiveOffers(offerIds);
            }).catch(error => {
                console.log("Errore fetchActiveOffers");
                console.log(error);
                setActualActiveOffers([]);
            });
    }

    function fetchMyActiveOffers() {
        landBlockSalesReadable.getOfferByUser(props.wallet)
            .then((offerIds) => {
                console.log("Offerte con la nuova configurazione: [" + offerIds + "]");
                setMyActiveOffers(offerIds);
            }).catch(error => {
                console.log("Errore fetchMyActiveOffers ");
                console.log(error);
                setMyActiveOffers([]);
            });

    }

    function loadActiveOffers() {
        fetchActiveOffers();
        fetchMyActiveOffers();
        let otherOffersIds = actualActiveOffers.filter(x => myActiveOffers.indexOf(x) === -1);
        setOtherActiveOffers(otherOffersIds);
        console.log("Other offers are: " + otherActiveOffers);
    }

    if (!isLoaded) {
        loadActiveOffers();
        setIsLoaded(true);
        console.log("Automated loading done!");
    }


    return (
        <Box>
            <Box sx={{ mt: 5 }}>
                <Box display='flex' alignItems='center'>
                    <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                        Active Market Offers
                    </Typography>
                    <IconButton className='blueGradientButton' variant='contained' size='large' onClick={loadActiveOffers} sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                        <RefreshIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Box>
                <Grid container spacing={5} direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ mb: 1 }}>
                    {otherActiveOffers.map(offerId => (
                        <Grid item xs='auto'>
                            <OfferCard
                                id={offerId}
                                key={offerId}
                                userWallet={props.wallet}
                                isMine={false} />
                        </Grid>
                    ))}
                </Grid>

                <Box display='flex' alignItems='center' sx={{ mt: 5 }}>
                    <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                        My Offers
                    </Typography>
                    <IconButton className='blueGradientButton' onClick={loadActiveOffers} variant='contained' size='large' sx={{ maxWidth: 120, maxHeight: 60, borderRadius: 10, fontWeight: 600 }}>
                        <RefreshIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Box>
                <Grid container spacing={5} direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ mb: 1 }}>
                    {myActiveOffers.map(offerId => (
                        <Grid item xs='auto'>
                            <OfferCard
                                id={offerId}
                                key={offerId}
                                userWallet={props.wallet}
                                isMine={true} />
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