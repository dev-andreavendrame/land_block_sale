import { React, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Box, IconButton, Button } from '@mui/material';
import LandListEntry from './minorComponents/LandListEntry';

// Blockchain imports
import { landBlockSalesReadable } from '../components/smartContracts/MoonriverConfig';
import { ethers } from "ethers";



const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function OfferCard(props) {

    // Parent passed values
    const currentOfferId = props.id;

    // Component state variables
    const [offerDetails, setOfferDetails] = useState(null);
    const [landIdsInOffer, setLandIdsInOffer] = useState([]);
    const [blockPrice, setBlockPrice] = useState(-1);
    const [serviceFee, setServiceFee] = useState("Loading");
    const [offerTimestamp, setOfferTimestamp] = useState(-1);
    const [isInitializedWithDetails, setIsInitializedWithDetails] = useState(false);
    const [offerMaker, setOfferMaker] = useState("Loading...");

    const [expanded, setExpanded] = useState(false);
    const [landsListDetails, setLandsListDetails] = useState({});
    var landNumeration = 1;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {

        if (!isInitializedWithDetails) {
            // Get offer details on component creation
            landBlockSalesReadable.getOfferDetails(currentOfferId)
                .then(details => {
                    console.log("Dettagli reperiti: " + details);
                    setOfferDetails(details);
                    // Decoding offer data
                    if (offerDetails != null) {
                        console.log("Decoding offer deta...");
                        setLandIdsInOffer(decodeLandIdsFromCall(offerDetails['landIds']));
                        setBlockPrice(offerDetails['price']);
                        setServiceFee(offerDetails['serviceFee']);
                        setOfferTimestamp(offerDetails['timestamp']);
                        setOfferMaker(offerDetails['offerMaker']);

                        // Stop refresh updating initialization
                        setIsInitializedWithDetails(true);
                    }
                })
                .catch(error => {
                    console.log("Error : " + error);
                });
        }
    });



    return (
        <Card sx={{ mb: 3, maxWidth: 345, borderRadius: 3, boxShadow: 24, }}>
            <CardHeader className='blueGradient'
                title={"Offer ID: " + props.id} />

            <CardContent className='lightGreyGradient'>
                <Typography paragraph>
                    <Box fontWeight='fontWeightMedium' display='inline'> Price:</Box> {getRMRKBlockPrice(blockPrice)}
                </Typography>
                <Typography paragraph>
                    <Box fontWeight='fontWeightMedium' display='inline'> Total lands contained:</Box> {landIdsInOffer.length}
                </Typography>
                <Box display='inline-flex' alignItems='center'>
                    <Typography variant='body2' color="text.secondary" >
                        Lands list:
                    </Typography>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </Box>
                <Collapse in={expanded} timeout="auto" >
                    {
                        landIdsInOffer.map((landId) => {
                            return (
                                <LandListEntry
                                    key={landId}
                                    id={landId}
                                />
                            );
                        })
                    }
                </Collapse>
            </CardContent>

            <CardActions className='blueGradient'>
                <Box sx={{ p: 1 }}>
                    <Typography >
                        <Box fontWeight='fontWeightMedium' display='inline'> Created by:&nbsp;</Box>
                    </Typography>
                    <Typography paragraph sx={{ fontSize: 12 }}>
                        {offerMaker}
                    </Typography>
                    <Typography paragraph>
                        <Box fontWeight='fontWeightMedium' display='inline'>  Creator fee:</Box> {serviceFee / 10}%
                    </Typography>
                    <Box display='flex' flexDirection='column'>
                        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography sx={{ mr: 5 }}>
                                <Box fontWeight='fontWeightMedium' display='inline'> Gifts contained:</Box>
                            </Typography>
                            <DoneOutlineIcon sx={{ ml: 5 }} />
                        </Box>
                        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography sx={{ mr: 5 }}>
                                <Box fontWeight='fontWeightMedium' display='inline'> Othala chunkies contained:</Box>
                            </Typography>
                            <DoneOutlineIcon sx={{ ml: 5 }} />
                        </Box>
                        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography sx={{ mr: 5 }}>
                                <Box fontWeight='fontWeightMedium' display='inline'> Adjacency bonus:</Box> {hasAdjacencyBonus(landIdsInOffer) + ""}
                            </Typography>
                            <DoneOutlineIcon sx={{ ml: 5 }} />
                        </Box>
                    </Box>
                    <Box display='flex'>
                        <Button className='yellowButton' variant='contained' sx={{ mt: 2, fontWeight: 'bold', color: '#282c34', width: 100 }}>
                            Buy
                        </Button>
                    </Box>
                </Box>
            </CardActions>
        </Card >
    );
} export default OfferCard;


function decodeLandIdsFromCall(encodedIds) {
    var ids = [];
    for (let i = 0; i < encodedIds.length; i++) {
        ids.push(ethers.utils.formatEther(encodedIds[i]) * 10 ** 18);
    }
    return ids;
}

function getRMRKBlockPrice(landBlockPrice) {
    var price = landBlockPrice / 10 ** 10;
    return price + " RMRK";
}


function hasAdjacencyBonus(landIds) {

    if (landIds.length < 9) {
        return "No";
    }

    var hasBonus = false;

    for (let i = 0; i < landIds.length; i++) {
        var currentHasBonus = true;
        const currentLandId = landIds[i];
        const y = Math.floor(currentLandId / 256);
        const x = currentLandId % 256;

        currentHasBonus = currentHasBonus & landIds.includes((y + 1) * 256 + (x - 1))   // top left corner
        currentHasBonus = currentHasBonus & landIds.includes((y + 1) * 256 + (x))     // top middle
        currentHasBonus = currentHasBonus & landIds.includes((y + 1) * 256 + (x + 1))   // top right corner

        currentHasBonus = currentHasBonus & landIds.includes((y) * 256 + (x - 1))     // left side 
        currentHasBonus = currentHasBonus & landIds.includes((y) * 256 + (x + 1))     // right side

        currentHasBonus = currentHasBonus & landIds.includes((y - 1) * 256 + (x - 1))   // bottom left corner
        currentHasBonus = currentHasBonus & landIds.includes((y - 1) * 256 + (x))     // bottom middle
        currentHasBonus = currentHasBonus & landIds.includes((y - 1) * 256 + (x + 1))   // bottom right corner

        // We need only one land to have the bonus to end the function
        if (currentHasBonus) {
            return "Yes";
        }
    }

    return hasBonus;

}




/*
    /-----------------------/
    /----- SPIEGAZIONE -----/
    /-----------------------/

    Dentro il "Collapse", al posto del codice di prova, andrà inserito il MAP prendendo i dati delle land 
    inserite nell'offerta.

    Ipotizziamo che tra i dati ci siano:
        -   le coordinate della land (string -> "( X, Y)")
        -   la rarità (string -> "R")

    Il mapping creerà un Box il cui colore dipenderà dalla rarità della land: bisognerà creare una 
    funzione "checkRarity(string)" che, presa la rarità della land, restituirà un colore.
    
    All'interno del Box ci sarà un Typography che andrà a scrivere il numero cardinale della land 
    (in ordine di inserimento nell'offerta), seguito dalle coordinate della land e dalla sua rarità.


    /------------------/
    /----- CODICE -----/
    /------------------/

            {
              LAND_LIST.map((info) => {
                return (
                    <Box display='inline-flex' justifyContent='space-between' 
                        sx={{ p: 1, backgroundColor: {checkRarity(info.rarity)} }}>
                        <Typography variant='body2' color='white'>
                            { landNumeration + " " + info.coordinates}
                        </Typography>
                        <Typography variant='body2' color='white'>
                            {info.rarity}
                        </Typography>
                    </Box>
                )
              }
              );
              landNumeration++;
            }

*/