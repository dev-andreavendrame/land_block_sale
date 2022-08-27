import { React, useEffect, useState, useRef } from 'react';
import { writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA, readLandBlockSC } from './LandBlockSale';
import { XC_RMRK_ABI, MOONRIVER_XC_RMRK_ADDRESS, MOONBASE_ALPHA_SKYBREACH_ADDRESS, SKYBREACH_ABI } from './Constants';

import { ethers } from "ethers";

function CreateOffer(props) {

    // SC management
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const smartContractXCRMRK = new ethers.Contract(MOONRIVER_XC_RMRK_ADDRESS, XC_RMRK_ABI, provider.getSigner());
    const smartContractSkybreach = new ethers.Contract(MOONBASE_ALPHA_SKYBREACH_ADDRESS, SKYBREACH_ABI, provider.getSigner());

    // Offer details
    const [landIdsInOffer, setLandIdsInOffer] = useState([]);
    const [blockPrice, setBlockPrice] = useState(-1);
    const [landsToSellIds, setLandsToSellIds] = useState([]);
    const [serviceFee, setServiceFee] = useState(null);

    // Offer data
    const inputLandIdsRef = useRef(null);
    const inputPriceRef = useRef(null);

    useEffect(() => {

        getCurrentServiceFee();

    }, [serviceFee]);

    if (serviceFee == null) {
        getCurrentServiceFee();
    }
    

    return (
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

    );


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