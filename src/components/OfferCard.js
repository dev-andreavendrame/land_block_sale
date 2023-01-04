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
import { Box, IconButton } from '@mui/material';

// Logic imports
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
            <CardHeader
                title={"Offer ID: " + props.id} />
            <CardContent>
                <Typography paragraph>
                    Price: {getRMRKBlockPrice(blockPrice)}
                </Typography>
                <Typography paragraph>
                    Total lands contained: {landIdsInOffer.length}
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
                <Collapse in={expanded} timeout="auto" unmountOnExit>


                    <Box display='flex' justifyContent='space-between' sx={{ p: 1, backgroundColor: 'red' }}>
                        <Typography variant='body2' color='white'>
                            1° (15, 22)
                        </Typography>
                        <Typography variant='body2' color='white'>
                            Leggendaria
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' sx={{ p: 1, backgroundColor: 'green' }}>
                        <Typography variant='body2' color='white'>
                            (18, 6)
                        </Typography>
                        <Typography variant='body2' color='white'>
                            Comune
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' sx={{ p: 1, backgroundColor: 'blue' }}>
                        <Typography variant='body2' color='white'>
                            (132, 55)
                        </Typography>
                        <Typography variant='body2' color='white'>
                            Rara
                        </Typography>
                    </Box>

                </Collapse>
            </CardContent>

            <CardActions>
                <Box sx={{ p: 1 }}>
                    <Typography paragraph>
                        Created by: {offerMaker}
                    </Typography>
                    <Typography paragraph>
                        Creator fee: {serviceFee / 10}%
                    </Typography>
                    <Box display='flex' flexDirection='column'>
                        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography sx={{ mr: 5 }}>
                                Gifts contained:
                            </Typography>
                            <DoneOutlineIcon sx={{ ml: 5 }} />
                        </Box>
                        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography sx={{ mr: 5 }}>
                                Adjacency bonus: {hasAdjacencyBonus(landIdsInOffer) + ""}
                            </Typography>
                            <DoneOutlineIcon sx={{ ml: 5 }} />
                        </Box>
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

function getFormattedLandId(landId) {
    const y = Math.floor(landId / 256);
    const x = landId % 256;
    return "(" + x + "," + y + ") ";
}


function hasAdjacencyBonus(landIds) {

    if (landIds.length < 9) {
        return false;
    }

    var hasBonus = false;

    for (let i=0; i<landIds.length; i++) {
        var currentHasBonus = true;
        const currentLandId = landIds[i];
        const y = Math.floor(currentLandId / 256);
        const x = currentLandId % 256;

        currentHasBonus = currentHasBonus & landIds.includes((y+1)*256+(x-1))   // top left corner
        currentHasBonus = currentHasBonus & landIds.includes((y+1)*256+(x))     // top middle
        currentHasBonus = currentHasBonus & landIds.includes((y+1)*256+(x+1))   // top right corner

        currentHasBonus = currentHasBonus & landIds.includes((y)*256+(x-1))     // left side 
        currentHasBonus = currentHasBonus & landIds.includes((y)*256+(x+1))     // right side

        currentHasBonus = currentHasBonus & landIds.includes((y-1)*256+(x-1))   // bottom left corner
        currentHasBonus = currentHasBonus & landIds.includes((y-1)*256+(x))     // bottom middle
        currentHasBonus = currentHasBonus & landIds.includes((y-1)*256+(x+1))   // bottom right corner

        // We need only one land to have the bonus to end the function
        if (currentHasBonus) {
            return true;
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