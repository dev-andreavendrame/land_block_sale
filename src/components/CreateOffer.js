import { React, useEffect, useState, useRef } from 'react';
import { writeLandBlockSC, landBlockCA, readLandBlockSC, smartContractSkybreach } from './LandBlockSale';

import { ethers } from "ethers";
import { Card, CardContent, Typography, Box, Grid, TextField, Button, CardActions } from '@mui/material';

function CreateOffer(props) {

    // Offer details
    const [landIdsInOffer, setLandIdsInOffer] = useState([]);
    const [blockPrice, setBlockPrice] = useState(-1);
    const [landsToSellIds, setLandsToSellIds] = useState([]);
    const [serviceFee, setServiceFee] = useState(null);

    const [declareDepositButtonState, setDeclareDepositButtonState] = useState(false);
    const [sendLandsButtonState, setSendLandsButtonState] = useState(false);
    const [confirmDepositButtonState, setConfirmDepositButtonState] = useState(false);
    const [createOfferButtonState, setCreateOfferButtonState] = useState(false);

    // Offer data
    const inputLandIdsRef = useRef(null);
    const inputPriceRef = useRef(null);

    useEffect(() => {

        getCurrentServiceFee();

    }, [serviceFee]);

    if (serviceFee == null) {
        getCurrentServiceFee();
    }



    function createOffer() {

        var landIds = decodeOfferLands(inputLandIdsRef.current.value);
        var blockPrice = getEffectiveBlockPrice(inputPriceRef.current.value);
        console.log("Land ids: " + landIds + " offer price: " + blockPrice + " RMRK");
        // Execute transactions
        writeLandBlockSC.createNewOffer(landIds, blockPrice);
    }

    function declareBatchDeposit() {
        var landIds = decodeOfferLands(inputLandIdsRef.current.value);
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
        var landIds = decodeOfferLands(inputLandIdsRef.current.value);
        writeLandBlockSC.confirmBatchLandDeposit(landIds)
            .then(depositResult => {
                console.log("Deposit result" + depositResult);
            })
            .catch(error => {
                console.log("Errore batch deposit: " + error);
            });
    }

    function sendLands() {
        var landIds = decodeOfferLands(inputLandIdsRef.current.value);
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
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 24, backgroundColor: '#63a9ff' }}>
                <CardContent>
                    <Typography sx={{ mb: 4, ml: 1, fontWeight: 600, fontSize: 26, color: "#282c34", mt: 2 }} variant='h3'>
                        CREATE NEW OFFER
                    </Typography>
                    <Grid container direction='row' spacing={2} alignItems='center' sx={{ ml: 1 }}>
                        <Grid item xs={2}>
                            <Typography variant='h6' >
                                Land to sell:
                            </Typography>
                        </Grid>

                        <Grid item xs={3} container spacing={1} alignItems='center'>
                            <Grid item xs={4}>
                                <TextField
                                    inputProps={{ style: { backgroundColor: 'white', borderRadius: 5 } }}
                                    size='small'
                                    type='number'
                                    required
                                    id="x_coordinate"
                                    name="x_coordinate"
                                    onChange={inputLandIdsRef}
                                    placeholder="X"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    inputProps={{ style: { backgroundColor: 'white', borderRadius: 5 } }}
                                    size='small'
                                    type='number'
                                    required
                                    id="y_coordinate"
                                    name="y_coordinate"
                                    onChange={inputLandIdsRef}
                                    placeholder="Y"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button className='yellowButton' variant='contained' sx={{ fontWeight: 'bold', color: '#282c34' }}>
                                    Add
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={7}>
                            <Box sx={{ ml: 4 }}>
                                <Typography variant='h6' color='#555555' >
                                    Lands:
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>



                    <Grid container direction='row' spacing={2} alignItems='center' sx={{ ml: 1, mt: 0 }}>
                        <Grid item xs={2}>
                            <Typography variant='h6' >
                                Price in RMRK:
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
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

                        <Grid item xs={7}>
                            <Box sx={{ ml: 4 }}>
                                <Typography variant='h6' color='#555555' >
                                    Actual service fee:
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>

                <CardActions>
                    <Grid container direction='row' spacing={2} alignItems='center' sx={{ ml: 2, mt: 0, mb: 2 }}>
                        <Grid item xs={1.4}>
                            <Button className='yellowButton' disabled={!declareDepositButtonState} variant='contained' size='medium' sx={{ fontWeight: 'bold', color: '#282c34', width: 100, height: 70, borderRadius: 2 }}>
                                Declare deposit
                            </Button>
                        </Grid>
                        <Grid item xs={1.4}>
                            <Button className='yellowButton' disabled={!sendLandsButtonState} variant='contained' size='medium' sx={{ fontWeight: 'bold', color: '#282c34', width: 100, height: 70, borderRadius: 2 }}>
                                Send lands
                            </Button>
                        </Grid>
                        <Grid item xs={1.4}>
                            <Button className='yellowButton' disabled={!confirmDepositButtonState} variant='contained' size='medium' sx={{ fontWeight: 'bold', color: '#282c34', width: 100, height: 70, borderRadius: 2 }}>
                                Confirm deposit
                            </Button>
                        </Grid>
                        <Grid item xs={1.2}>
                        </Grid>
                        <Grid item xs={1.5}>
                            <Button className='redWhiteButton' disabled={!createOfferButtonState} variant='outlined' size='medium' sx={{ fontWeight: 600, backgroundColor: '#cf2020', width: 100, height: 70, borderRadius: 3, border: '4px solid',}}>
                                Create offer
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>



            <div class="card bg-info">
                <div class="card-body">
                    <h3 class="card-title">Create new offer</h3>
                    <div class="row padding_bottom">
                        <div class="col-2">
                            <h5>Lands to sell:</h5>
                        </div>
                        <div class="col">
                            <input class="form-control input-sm" ref={inputLandIdsRef}
                                type="text"
                                id='createOfferLandIds'
                                name='createOfferLandIds'
                                placeholder={'Ids list:'}
                            />
                        </div>
                    </div>
                    <div class="row padding_bottom">
                        <div class="col-2">
                            <h5>Price in RMRK:</h5>
                        </div>
                        <div class="col">
                            <input class="form-control input-sm" ref={inputPriceRef}
                                type="text"
                                id='offerPrice'
                                name='offerPrice'
                                placeholder={'RMRK amount: '}
                            />
                        </div>
                    </div>
                    <div class="row padding_bottom">
                        <div class="col-2">
                            <h5>Important info:</h5>
                        </div>
                        <div class="col">
                            <h5>{serviceFee}</h5>
                        </div>

                    </div>
                    <div class="row padding_20">
                        <div class="col btn-block justify-content-center">
                            <button type="button" class="btn btn-warning" onClick={declareBatchDeposit}>1 - Declare deposit</button>
                        </div>
                        <div class="col btn-block justify-content-center">
                            <button type="button" class="btn btn-warning" onClick={sendLands}>2 - Send lands</button>
                        </div>
                        <div class="col btn-block justify-content-center">
                            <button type="button" class="btn btn-warning" onClick={confirmBatchDeposit}>3 - Confirm deposit</button>
                        </div>
                    </div>
                    <div class="col d-flex justify-content-center btn-block">
                        <button type="button" class="btn btn-danger col-12" onClick={createOffer}>Create offer</button>
                    </div>
                </div>
            </div>
        </Box >

    );

} export default CreateOffer;



















function decodeOfferLands(rawText) {

    // Example of land encoding --> (122,12) & (122,13)

    var text = rawText.replaceAll(" ", ""); // Remove spaces
    const rawArray = text.split("&");    // Split by land coordinates
    var landsIds = [];
    for (let i = 0; i < rawArray.length; i++) {
        var landCoordinates = rawArray[i].replaceAll("(", "").replaceAll(")", "");
        var coordinates = landCoordinates.split(",");
        landsIds.push(parseInt(coordinates[0]) + parseInt(coordinates[1] * 256));
    }
    return landsIds;
}

function getEffectiveBlockPrice(rawPrice) {

    // Example of correct price encoding 12.99

    return parseFloat(rawPrice) * 10 ** 10;
}