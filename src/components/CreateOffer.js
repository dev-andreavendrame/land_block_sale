import { ethers } from "ethers";
import { writeLandBlockSC, landBlockCA, readLandBlockSC, smartContractSkybreach } from './LandBlockSale';
import GenericPopup from './minorComponents/GenericPopup/GenericPopup';
import { getPopupContent } from './errorHadling/Errors';

import { React, useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, Collapse, CardContent, Typography, Box, Grid, TextField, Button, CardActions, IconButton, Modal } from '@mui/material';
import { COORDINATES_ALREADY_INSERTED, INVALID_COORDINATES, LAND_NOT_FOUND, NEGATIVE_COORDINATE } from "./errorHadling/Errors";

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

function CreateOffer(props) {

    // Offer details
    const [blockPrice, setBlockPrice] = useState(-1);
    const [serviceFee, setServiceFee] = useState(null);

    const [declareDepositButtonState, setDeclareDepositButtonState] = useState(false);
    const [sendLandsButtonState, setSendLandsButtonState] = useState(false);
    const [confirmDepositButtonState, setConfirmDepositButtonState] = useState(false);
    const [createOfferButtonState, setCreateOfferButtonState] = useState(false);

    // Offer data
    const inputLandIdsRef = useRef(null);
    const inputPriceRef = useRef(null);
    const [currentOfferCoordinates, setCurrentOfferCoordinates] = useState([]);

    const [landXValue, setLandXValue] = useState(null);
    const [landYValue, setLandYValue] = useState(null);

    // Interface animation state
    const [isExpanded, setIsExpanded] = useState(false);


    // Popup & log
    const [popupDeclareDeposit, setPopupDeclareDeposit] = useState(false);
    const [popupSendLands, setPopupSendLands] = useState(false);
    const [popupConfirmDeposit, setPopupConfirmDeposit] = useState(false);
    const [popupCreateOffer, setPopupCreateOffer] = useState(false);

    const closePopupDeclareDeposit = () => {
        setPopupDeclareDeposit(false);
    };
    const closePopupSendLands = () => {
        setPopupSendLands(false);
    };
    const closePopupConfirmDeposit = () => {
        setPopupConfirmDeposit(false);
    };
    const closePopupCreateOffer = () => {
        setPopupCreateOffer(false);
    };

    // Logs states
    const [logLandNotFound, setLogLandNotFound] = useState("");
    const [logInvalidCoordinates, setLogInvalidCoordinates] = useState("");
    const [logCoordinateAlreadyInserted, setLogCoordinateAlreadyInserted] = useState("");
    const [logNegativeCoordinate, setLogNegativeCoordinate] = useState("");

    // collapsable elements
    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (serviceFee == null) {
            getCurrentServiceFee();
        }
    }, [serviceFee]);

    const addLandToList = () => {

        console.log("X: %d, Y: %d", landXValue, landYValue);

        if (landXValue === null || landYValue === null || Number.isNaN(landXValue) || Number.isNaN(landYValue)) {
            console.log("One or more coordinates not valid!");
            // SHOW WARNING POPUP
            setLogInvalidCoordinates("Invalid Coordinates");
        } else if (landXValue < 0 || landYValue < 0) {
            // SHOW WARNING POPUP
            setLogNegativeCoordinate("One or more coordinates are less than 0");
        } else {
            if (!checkCoordinatesAlreadyIn(landXValue, landYValue, currentOfferCoordinates)) {
                // Coordinates not already inserted
                const updatedCoords = currentOfferCoordinates;
                updatedCoords.push({ x: landXValue, y: landYValue });
                setCurrentOfferCoordinates([...updatedCoords]);
                console.log(currentOfferCoordinates);
            } else {
                console.log("Coordinates already inserted in the land list!");
                // SHOW WARNING POPUP
                setLogCoordinateAlreadyInserted("Land coordinates already inserted!");

            }
        }
    }

    const removeLandFromList = () => {

        const landXToRemove = landXValue;
        const landYToRemove = landYValue;

        var indexToRemove = -1;
        let updatedCoordinates = [];

        for (let i = 0; i < currentOfferCoordinates.length; i++) {
            const currentX = currentOfferCoordinates[i]['x'];
            const currentY = currentOfferCoordinates[i]['y'];

            if (currentX === landXToRemove && currentY === landYToRemove) {
                indexToRemove = i;
            } else {
                updatedCoordinates.push({ x: currentX, y: currentY });
            }
        }

        if (indexToRemove === -1) {
            console.log("Land to remove not found!");
            // MOSTRARE POPUP NOT FOUND (WARNING)
            setLogLandNotFound("Land not found");
        } else {
            console.log("Land removed!");
            // MOSTRARE POPUP LAND REMOVED (SUCCESS)
            console.log("Removed land at %d index", indexToRemove);
            setCurrentOfferCoordinates(updatedCoordinates);
        }

    }

    const handleXChange = event => {
        setLandXValue(parseInt(event.target.value));
        console.log('value is:', event.target.value);
    };
    const handleYChange = event => {
        setLandYValue(parseInt(event.target.value));
        console.log('value is:', event.target.value);
    };


    function createOffer() {

        var landIds = decodeOfferLands(currentOfferCoordinates);
        var blockPrice = getEffectiveBlockPrice(inputPriceRef.current.value);
        console.log("Land ids: " + landIds + " offer price: " + blockPrice + " RMRK");
        // Execute transactions
        writeLandBlockSC.createNewOffer(landIds, blockPrice);
    }

    function declareBatchDeposit() {
        var landIds = decodeOfferLands(currentOfferCoordinates);
        writeLandBlockSC.declareBatchLandDeposit(landIds)
            .then(depositBatchResult => {
                console.log("Deposit batch result: " + depositBatchResult);
            })
            .catch(error => {
                console.log("land: " + landIds);
                console.log("Deposit batch error: " + error);
            });

    }

    function confirmBatchDeposit() {
        var landIds = decodeOfferLands(currentOfferCoordinates);
        writeLandBlockSC.confirmBatchLandDeposit(landIds)
            .then(depositResult => {
                console.log("Deposit result" + depositResult);
            })
            .catch(error => {
                console.log("Errore batch deposit: " + error);
            });
    }

    function sendLands() {
        var landIds = decodeOfferLands(currentOfferCoordinates);
        var sendLandPromises = [];
        for (let i = 0; i < landIds.length; i++) {
            sendLandPromises.push(smartContractSkybreach.transfer(landIds[i], landBlockCA));
        }
        Promise.all(sendLandPromises)
            .then(allResponses => {
                console.log(allResponses);
                console.log("Land da depositare: " + landIds.length + "\nPromises number: " + sendLandPromises.length);
            })
            .catch(errors => {
                console.error(errors);
            });
    }

    function getCurrentServiceFee() {

        readLandBlockSC.getServiceFee()
            .then(currentFee => {
                if (currentFee != null) {
                    console.log(currentFee);
                    var fee = ethers.utils.formatEther(currentFee) * 10 ** 18;
                    setServiceFee("Actual service fee: " + (fee / 10) + " %");
                } else {
                    setServiceFee("Can't retrive the actual service fee");
                }
            })
            .catch(error => {
                console.log("Error: " + error);
            })
        return <p>Errore</p>
    }



    return (
        <Box>
            <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                Create new offer
            </Typography>

            {logLandNotFound ? getPopupContent(LAND_NOT_FOUND, logLandNotFound, setLogLandNotFound) : <></>}
            {logInvalidCoordinates ? getPopupContent(INVALID_COORDINATES, logInvalidCoordinates, setLogInvalidCoordinates) : <></>}
            {logCoordinateAlreadyInserted ? getPopupContent(COORDINATES_ALREADY_INSERTED, logCoordinateAlreadyInserted, setLogCoordinateAlreadyInserted) : <></>}
            {logNegativeCoordinate ? getPopupContent(NEGATIVE_COORDINATE, logNegativeCoordinate, setLogNegativeCoordinate) : <></>}

            {popupDeclareDeposit ?
                <GenericPopup
                    handleOpen={popupDeclareDeposit}
                    handleClose={closePopupDeclareDeposit}
                    popupType="normal"
                    popupMessage="Testo di prova"
                    popupButtonMessage="Ok"
                    popupButtonAction={closePopupDeclareDeposit} />
                :
                <></>
            }

            <Grid container spacing={5}>
                <Grid item xs={6}>

                    <Card className='blueGradient' sx={{ p: 1.5, mb: 3, borderRadius: 3, boxShadow: 8 }}>
                        <CardContent>
                            <Grid container direction='column' spacing={0.5} justifyContent='center' sx={{ mb: 3 }} >
                                <Grid item xs={4}>
                                    <Typography variant='h6' >
                                        Land to sell:
                                    </Typography>
                                </Grid>

                                <Grid item xs='auto' container spacing={1} alignItems='center'>
                                    <Grid item xs='auto'>
                                        <TextField
                                            inputProps={{ style: { backgroundColor: 'white', borderRadius: 5 } }}
                                            size='small'
                                            type='number'
                                            required
                                            id="x_coordinate"
                                            name="x_coordinate"
                                            onChange={handleXChange}
                                            value={landXValue}
                                            placeholder="X"
                                            sx={{ maxWidth: 100 }}
                                        />
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <TextField
                                            inputProps={{ style: { backgroundColor: 'white', borderRadius: 5 } }}
                                            size='small'
                                            type='number'
                                            required
                                            id="y_coordinate"
                                            name="y_coordinate"
                                            onChange={handleYChange}
                                            value={landYValue}
                                            placeholder="Y"
                                            sx={{ maxWidth: 100 }}
                                        />
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <Button onClick={addLandToList} className='yellowButton' variant='contained' sx={{ maxWidth: 100, fontWeight: 'bold', color: '#282c34' }}>
                                            Add
                                        </Button>
                                    </Grid>
                                    <Grid item xs='auto' >
                                        <Button onClick={removeLandFromList} className='redButton' variant='contained' sx={{ maxWidth: 100, fontWeight: 'bold', color: 'white' }}>
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>


                            <Grid container direction='column' spacing={0.5} justifyContent='center' sx={{ mb: 3 }}>
                                <Grid item xs={4}>
                                    <Typography variant='h6' >
                                        Price in RMRK:
                                    </Typography>
                                </Grid>
                                <Grid item xs='auto' container spacing={2} direction='row' alignItems='end' >
                                    <Grid item xs='auto'>
                                        <TextField
                                            inputProps={{ style: { backgroundColor: 'white', borderRadius: 5 } }}
                                            size='small'
                                            type='number'
                                            required
                                            id="rmrk_price"
                                            name="rmrk_price"
                                            onChange={inputPriceRef}
                                            placeholder="RMRK amount"
                                        />
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <Typography variant='h6' color='#666666' sx={{ fontSize: 16 }} >
                                            {serviceFee}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction='column' spacing={1} justifyContent='center' sx={{ mb: 2 }}>
                                <Grid item xs={4}>
                                    <Typography variant='h6' >
                                        Deposit operations sequence:
                                    </Typography>
                                </Grid>

                                <Grid item xs='auto' container spacing={2} direction='row' alignItems='center' >
                                    <Grid item xs='auto'>
                                        <Button onClick={setPopupDeclareDeposit} className='yellowButton' variant='contained' sx={{ width: 180, fontWeight: 'bold', color: '#282c34' }}>
                                            Declare Deposit
                                        </Button>

                                    </Grid>
                                    <Grid item xs='auto'>
                                        <Typography variant='body1' sx={{ fontSize: 14, fontWeight: 500 }} >
                                            Step 1: declare the list of lands to deposit
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs='auto' container spacing={2} direction='row' alignItems='center' >
                                    <Grid item xs='auto'>
                                        <Button className='yellowButton' variant='contained' sx={{ width: 180, fontWeight: 'bold', color: '#282c34' }}>
                                            Send Lands
                                        </Button>
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <Typography variant='body1' sx={{ fontSize: 14, fontWeight: 500 }} >
                                            Step 2: send the declared lands
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs='auto' container spacing={2} direction='row' alignItems='center' >
                                    <Grid item xs='auto'>
                                        <Button className='yellowButton' variant='contained' sx={{ width: 180, fontWeight: 'bold', color: '#282c34' }}>
                                            Confirm Deposit
                                        </Button>
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <Typography variant='body1' sx={{ fontSize: 14, fontWeight: 500 }} >
                                            Step 3: confirm your deposit
                                        </Typography>
                                    </Grid>
                                </Grid>

                            </Grid>

                            <Grid container direction='column' spacing={1} justifyContent='center' sx={{ mt: 5 }}>
                                <Grid item xs={4}>
                                    <Typography variant='h6' >
                                        Final operation:
                                    </Typography>
                                </Grid>

                                <Grid item xs='auto'>
                                    <Button className='yellowButton' variant='contained' sx={{ width: 180, fontWeight: 'bold', color: '#282c34' }}>
                                        Create Offer
                                    </Button>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid >


                <Grid item xs={6}>
                    <Card className='blueGradient' sx={{ p: 1.5, mb: 3, borderRadius: 3, boxShadow: 8, minHeight: 370 }}>
                        <CardContent>
                            <Box display='inline-flex' alignItems='center'>
                                <Typography variant='h6' >
                                    Lands list:
                                </Typography>
                                <ExpandMore
                                    expand={isExpanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={isExpanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </Box>
                            <Collapse in={isExpanded} timeout="auto" >
                                {
                                    currentOfferCoordinates.map((coordinates) => {
                                        return (
                                            <Typography variant='h6' color='#555555' >
                                                {"X: " + coordinates['x'] + ", Y: " + coordinates['y']}
                                            </Typography>
                                        );
                                    })
                                }
                            </Collapse>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>

    );

} export default CreateOffer;

function checkCoordinatesAlreadyIn(currentX, currentY, currentCoordinates) {

    const coordinatesIn = currentCoordinates.length;
    for (let i = 0; i < coordinatesIn; i++) {
        if (currentCoordinates[i]['x'] === currentX && currentCoordinates[i]['y'] === currentY) {
            return true;
        }
    }

    return false;
}

function decodeOfferLands(currentCoordinates) {

    let landIds = [];

    for (let i = 0; i < currentCoordinates.length; i++) {
        const currentX = currentCoordinates[i]['x'];
        const currentY = currentCoordinates[i]['y'];

        console.log("X: %d, Y: %d", currentX, currentY);

        const landId = currentX + currentY * 256;
        landIds.push(landId);
    }

    console.log("Lands inserted in the offer: %d", landIds.length);

    return landIds;
}

function getEffectiveBlockPrice(rawPrice) {

    // Example of correct price encoding 12.99

    return parseFloat(rawPrice) * 10 ** 10;
}