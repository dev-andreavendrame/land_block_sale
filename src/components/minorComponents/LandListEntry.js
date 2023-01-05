// React imports
import { React, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

// Subsquid imports
import { subsquidClient } from '../../index';
import { gql } from '@apollo/client';

// Other imports

import img_rarity_common from '../images/rarityCommon.png';
import img_rarity_rare from '../images/rarityRare.png';
import img_rarity_epic from '../images/rarityEpic.png';
import img_rarity_harb from '../images/rarityHarb.png';
import img_rarity_premium from '../images/rarityPremium.png';

function LandListEntry(props) {

    const landId = props.id;
    const [landRetrievedDetails, setLandRetrievedDetails] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    // Land details
    const [plotRarity, setPlotRarity] = useState(-1);

    function loadLandDetailsFromSubsquid(landId) {
        // Get data from Subsquid
        subsquidClient.query({
            query: gql`
            query LandDetailsQuery {
                plotById(id: "${landId}") {
                  id
                  data {
                    rarity
                    cyber
                    dragon
                    entropy
                    fire
                    isIsland
                    isMountainFoot
                    isShore
                    meadow
                    mecha
                    necro
                    steampunk
                    water
                    wind
                    volcano
                  }
                }
              }
            `,
        })
            .then((result) => {
                console.log("Query test result:");
                console.log(result);
                setLandRetrievedDetails(result);
            }
            );
    }

    useEffect(() => {

        if (!isDataLoaded) {
            loadLandDetailsFromSubsquid(landId);
            if (landRetrievedDetails != null) {
                setPlotRarity(landRetrievedDetails['data']['plotById']['data']['rarity']);
                setIsDataLoaded(true);
            }
        }

    }, [landRetrievedDetails])


    return (
        <Box display='flex' justifyContent='space-between' sx={{ p: 1, backgroundColor: 'blue' }}>
            <Typography variant='body2' color='white'>
                {getFormattedLandId(landId)}
            </Typography>
            <Typography variant='body2' color='white'>
                {getRarityByConstants(plotRarity)}
            </Typography>
            <img width="30" height="30" src={getImageByRarity(plotRarity)} />
        </Box>
    );
} export default LandListEntry


function getFormattedLandId(landId) {
    const y = Math.floor(landId / 256);
    const x = landId % 256;
    return "(" + x + "," + y + ") ";
}

function getRarityByConstants(rarityValue) {
    const plotRarity = parseInt(rarityValue);
    if (plotRarity === 1) {
        return "Common";
    } else if (plotRarity === 2) {
        return "Rare";
    } else if (plotRarity === 3) {
        return "Epic";
    } else if (plotRarity === 5) {
        return "Premium";
    } else {
        return "Harberger";
    }
}

function getImageByRarity(rarityValue) {
    const plotRarity = parseInt(rarityValue);
    if (plotRarity === 1) {
        return img_rarity_common;
    } else if (plotRarity === 2) {
        return img_rarity_rare;
    } else if (plotRarity === 3) {
        return img_rarity_epic;
    } else if (plotRarity === 5) {
        return img_rarity_premium;
    } else {
        return img_rarity_harb;
    }
}