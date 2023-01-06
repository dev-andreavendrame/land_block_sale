import { React, useEffect, useState, useRef } from 'react';
import { readLandBlockSC, writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA } from './LandBlockSale';
import { decodeLandIdsFromCall } from './Block';

// IMPORTANT!   =>  This class will replace the "Market offer" section created in App.js
//                      -   The code pasted in "return" must be reworked.
//                      -   The secondary functions such as "handleClick" must be cut from App.js and re-written here.
//
//                  As consequences, lots of testing must be made to be sure everything works fine !!!

function HandleOffers(props) {

    return (
        <div class="card bg-info">
            <div class="card-body">
                <h3 class="card-title">Market offers</h3>
                <div class="col d-flex justify-content-center btn-block">
                    <button type="button" class="btn btn-warning col-12" onClick={handleClick}>Get active offers</button>
                </div>
            </div>
        </div>
    );

}