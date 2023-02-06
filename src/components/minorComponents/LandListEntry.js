// React imports
import { React, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, IconButton, SvgIcon } from '@mui/material';

// Subsquid imports
import { subsquidClient } from '../../index';
import { gql } from '@apollo/client';

// Other imports
import { getImageByRarity } from './LandUtils';


import img_gift_box from '../images/gift-with_border.png';
import img_othala_chunky from '../images/othalachunky-with-border.png';
import MyLocationTwoToneIcon from '@mui/icons-material/MyLocationTwoTone';

function LandListEntry(props) {

    const landId = props.id;
    const othalaChunkyPresent = props.isOthalaChunkyPresent;
    const giftBoxPresent = props.isGiftBoxPresent;
    const [landRetrievedDetails, setLandRetrievedDetails] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    // Land details
    const [plotRarity, setPlotRarity] = useState(-1);
    let x, y;

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

    function getFormattedLandId(landId) {
        y = Math.floor(landId / 256);
        x = landId % 256;
        return "(" + x + "," + y + ") ";
    }

    function getLandLink() {
        return ("https://skybreach.app/map?jumpTo=" + x + "," + y)
    }

    return (
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ p: 1, backgroundColor: getColorByRarity(plotRarity) }}>
            <Box display='flex' alignItems='center' gap={1}>
                <Typography variant='body2' color='white'>
                    {getFormattedLandId(landId)}
                </Typography>
                <a href={getLandLink()} class="iconLink">
                    <MyLocationTwoToneIcon />
                </a>
            </Box>

            <Typography variant='body2' color='white'>
                {getRarityByConstants(plotRarity)}
            </Typography>
            <Box display='inline-flex' justifyContent='flex-end' sx={{ gap: 0.5 }}>
                <img width="30" height="30" alt='' src={getImageByRarity(plotRarity)} />
                <Box display='inline-flex' justifyContent='flex-end' sx={{ gap: 1 }}>
                    {getOthalaChunkyIcon(othalaChunkyPresent)}
                    {getGiftBoxIcon(giftBoxPresent)}
                </Box>
            </Box>
        </Box>
    );
} export default LandListEntry

function getOthalaChunkyIcon(isPresent) {
    if (isPresent) {
        return (<img width="30" height="30" alt='othala chunky icon' src={img_othala_chunky} />);
    }
}

function getGiftBoxIcon(isPresent) {
    if (isPresent) {
        return (<img width="30" height="30" alt='gift box icon' src={img_gift_box} />);
    }
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

function getColorByRarity(rarityValue) {

    const plotRarity = parseInt(rarityValue);

    if (plotRarity === 1) {
        return "#ADB5AD";
    } else if (plotRarity === 2) {
        return "#435FC4";
    } else if (plotRarity === 3) {
        return "#7346C4";
    } else if (plotRarity === 5) {
        return "#CF8441";
    } else {
        return "#9D265C";
    }

}