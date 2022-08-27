import { React, useEffect, useState, useRef } from 'react';
import { readLandBlockSC, writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA } from './LandBlockSale';
import { XC_RMRK_ABI, MOONRIVER_XC_RMRK_ADDRESS, MOONBASE_ALPHA_SKYBREACH_ADDRESS, SKYBREACH_ABI } from './Constants';
import { decodeLandIdsFromCall } from './Block';
import { ethers } from "ethers";

function HandleMyOffers(props) {

    // SC management
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const smartContractXCRMRK = new ethers.Contract(MOONRIVER_XC_RMRK_ADDRESS, XC_RMRK_ABI, provider.getSigner());
    const smartContractSkybreach = new ethers.Contract(MOONBASE_ALPHA_SKYBREACH_ADDRESS, SKYBREACH_ABI, provider.getSigner());

    // Wallet address connected
    const [accountAddress, setAccountAddress] = useState("");

    // My offers
    const [myOfferIds, setMyOfferIds] = useState([]);
    const [myOfferDetails, setMyOfferDetails] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {

        // Setting up wallet
        console.log("Child wallet: " + props.connected_wallet);
        if (props.connected_wallet != "") {
            setAccountAddress(props.connected_wallet);
        }

        // Getting land ids
        readLandBlockSC.getOfferByUser(props.connected_wallet)
            .then(offerIds => {
                console.log("My offer ids: " + offerIds);
                setMyOfferIds(offerIds);
            })
            .catch(error => {
                console.log("Error getOfferByUser: " + error);
            });

        // Getting offer details
        var detailPromisises = [];
        for (let i = 0; i < myOfferIds.length; i++) {
            detailPromisises.push(readLandBlockSC.getOfferDetails(myOfferIds[i]));
        }
        Promise.all(detailPromisises)
            .then(promisesResults => {
                setMyOfferDetails(promisesResults);
                console.log(promisesResults);
            })
            .catch(error => {
                console.log("Error - Getting offer details: " + error);
            });

    }, [accountAddress, count]);

    return (
        <div class="card bg-info">
            <div class="card-body">
                <h3 class="card-title">Handle my offers</h3>
                <div class="col d-flex justify-content-center btn-block">
                    <button type="button" class="btn btn-warning col-12" onClick={updateMyOffers}>Get my active offers</button>
                </div>
                {myOfferDetails.map(offerDetail => decodeOfferDetails(offerDetail))}
            </div>
        </div>

    );

    function updateMyOffers() {

        var x = count + 1;
        setCount(x);
        console.log("updateMyOffers: " + count);
    }


} export default HandleMyOffers;

function getFormattedPrice(rawPrice) {
    return rawPrice / 10 ** 10;
}

function decodeOfferDetails(rawDetails) {

    const offerId = rawDetails['offerId'];
    const landIdsInOffer = decodeLandIdsFromCall(rawDetails['landIds']);
    const price = rawDetails['price'];
    const serviceFee = rawDetails['serviceFee'];
    const timestamp = rawDetails['timestamp'];

    function cancelOffer() {

        writeLandBlockSC.cancelOffer(offerId)
            .then(cancelResult => {
                console.log("Cancel call result: " + cancelResult);
            })
            .catch(error => {
                console.log("Error - cancelOffer: " + error);
            });
    }

    if (rawDetails != null) {
        return (
            <div class="card bg-dark margin_top_10">
                <h4 class="card-header bg-secondary">{"Offer " + offerId}</h4>
                <div class="card-body">
                    <p class="card-text">{"Lands contained in this offer: " + getFormattedLandCoordinates(landIdsInOffer)}</p>
                    <div class="row">
                        <div class="col">
                            <p>{"Offer fee: " + serviceFee / 10 + "%"}</p>
                        </div>
                        <div class="col">
                            <p>{"Offer price: " + getFormattedPrice(price) + " RMRK"}</p>
                        </div>
                    </div>
                    <div class="row padding_20">
                        <button type="button" class="btn btn-primary btn-block" onClick={cancelOffer}>Cancel offer</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <p>Loading...</p>
        );
    }
}

function getFormattedLandCoordinates(landIds) {

    var rawLandIds = (landIds + "").split(",");
    var text = "";
    for (let i = 0; i < rawLandIds.length; i++) {
        const y = Math.floor(parseInt(rawLandIds[i]) / 256);
        const x = parseInt(rawLandIds[i]) % 256;
        text = text + "(" + x + "," + y + ") ";
    }
    return text;
}