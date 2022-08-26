import 'bootstrap/dist/css/bootstrap.min.css';
import { Component, useEffect, useState, useRef } from 'react';
import { readLandBlockSC, writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA } from './LandBlockSale';
import SingleLand from './SingleLand';

function WithdrawComponent(props) {

    // Withdraw info
    const [depositedLands, setDepositedLands] = useState([]);
    const [selectedLands, setSelectedLands] = useState([]);
    const [testo, setTesto] = useState("");

    useEffect(() => {
        console.log("Use state: " + testo);
        var dati = testo.split(",");
        console.log("Use state: dati: " + dati);
        setDepositedLands(dati);
    }, [testo]);

    return (
        <div class="card bg-info">
            <div class="card-body">
                <h3 class="card-title">Handle deposited lands</h3>
            </div>
            <div class="bg-dark">
                <div class="col d-flex justify-content-center btn-block padding_20">
                    <button type="button" class="btn btn-warning col-12" onClick={updateDepositedLandList}>Get deposited land list</button>
                </div>
                {depositedLands.map((index, i) => (
                    <SingleLand key={index} land_id={index} number={i}/>
                ))}

                <div class="col d-flex justify-content-center btn-block padding_20">
                    <button type="button" class="btn btn-danger col-12" onClick={withdrawAllDepositedLands}>Withdraw all deposited lands</button>
                </div>
            </div>
        </div>
    );

    function withdrawAllDepositedLands() {

        console.log(props.connected_account);
        readLandBlockSC.getDepositedLandIds(props.connected_account).then(depositedLandIds => {
            console.log("All deposited lands: " + depositedLandIds);
            setDepositedLands(depositedLandIds);
        }).catch(error => {
            console.log("withdrawAllDepositedLands error: " + error);
        });

    }

    function updateDepositedLandList() {
        console.log(props.connected_account);
        readLandBlockSC.getDepositedLandIds(props.connected_account).then(depositedLandIds => {
            console.log("All deposited lands: " + depositedLandIds);
            setTesto(depositedLands + "");
            setDepositedLands(depositedLandIds);
        }).catch(error => {
            console.log("updateDepositedLandList error: " + error);
        });
    }


} export default WithdrawComponent;