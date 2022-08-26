import { React, useEffect, useState, useRef } from 'react';
import { readLandBlockSC, writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA } from './LandBlockSale';
import { XC_RMRK_ABI, MOONBASE_ALPHA_XC_RMRK_ADDRESS, MOONBASE_ALPHA_SKYBREACH_ADDRESS, SKYBREACH_ABI } from './Constants';
import { ethers } from "ethers";

function Block(props) {

    // SC management
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const smartContractXCRMRK = new ethers.Contract(MOONBASE_ALPHA_XC_RMRK_ADDRESS, XC_RMRK_ABI, provider.getSigner());

    // Offer state
    const [offerDetails, setOfferDetails] = useState(null);
    const [offerId, setOfferId] = useState(props.offer_id);
    // Offer details
    const [landIdsInOffer, setLandIdsInOffer] = useState([]);
    const [blockPrice, setBlockPrice] = useState(-1);
    const [serviceFee, setServiceFee] = useState(-1);
    const [offerTimestamp, setOfferTimestamp] = useState(-1);

    useEffect(() => {

        setOfferId(props.offer_id);
        // Get offer details
        readLandBlockSC.getOfferDetails(offerId)
            .then(details => {
                console.log("Dettagli reperiti: " + details);
                setOfferDetails(details);
            })
            .catch(error => {
                console.log("Error : " + error);
            });
        // Decoding offer data
        if (offerDetails != null) {
            console.log("Decoding offer deta...");
            setLandIdsInOffer(decodeLandIdsFromCall(offerDetails['landIds']));
            setBlockPrice(offerDetails['price']);
            setServiceFee(offerDetails['serviceFee']);
            setOfferTimestamp(offerDetails['timestamp']);
        }

    }, [props.offer_id]);

    if (offerDetails != null) {
        return (
            <div class="card bg-dark">
                <div class="card-body">
                    <h4 class="card-title">{"Offer " + offerId}</h4>
                    <h5 class="card-subtitle mb-2 text-muted">{"Maker: " + offerDetails['offerMaker']}</h5>
                    <p class="card-text">{"Lands contained in this offer: " + landIdsInOffer.length}</p>
                    <p>{"Offer fee: " + serviceFee / 10 + "%"}</p>
                    <ul class="list-group list-group-flush margin_20">
                        {landIdsInOffer.map(landId => (
                            <li class="list-group-item" key={landId}>{getFormattedLandId(landId)}</li>
                        ))}
                    </ul>
                    <div class="row">
                        <div class="col">
                            <button type="button" class="btn btn-primary margin_20" onClick={approveLandBlockBuy}>Approve buy</button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-primary margin_20" onClick={buyLandBlock}>{getBuyButtonText(blockPrice)}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <p>Loading...</p>
        );
    }

    function approveLandBlockBuy() {

        smartContractXCRMRK.approve(landBlockCA, blockPrice)
            .then(approveResult => {
                console.log("Approve result: " + approveResult);
            })
            .catch(approveError => {
                console.log("Approve buy land block error: " + approveError);
            });
    }

    function buyLandBlock() {
        writeLandBlockSC.buyLandBlock(offerId)
            .then(buyResponseResult => {
                console.log("buyResponseResult: " + buyResponseResult);
            })
            .catch(buyError => {
                console.log("Buy error: " + buyError);
            });
    }

} export default Block;

export function decodeLandIdsFromCall(encodedIds) {
    var ids = [];
    for (let i = 0; i < encodedIds.length; i++) {
        ids.push(ethers.utils.formatEther(encodedIds[i]) * 10 ** 18);
    }
    return ids;
}

function getBuyButtonText(landBlockPrice) {
    var price = landBlockPrice / 10 ** 10;
    return "Buy for " + price + " RMRK";
}

function getFormattedLandId(landId) {
    const y = Math.floor(landId / 256);
    const x = landId % 256;
    return "(" + x + "," + y + ") ";
}

