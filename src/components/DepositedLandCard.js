import { React, useEffect, useState } from 'react';
import { Box, IconButton, Button, Card, CardHeader, CardContent, CardActions, Typography } from '@mui/material';

import { getImageByRarity } from './minorComponents/LandUtils';

function DepositedLandCard(props) {

    const [coordinates, setCoordinates] = useState([-1, -1]);
    const [landBiomes, setLandBiomes] = useState(["loading..."]);

    return (
        <Card sx={{ mb: 3, maxWidth: 270, borderRadius: 3, boxShadow: 24, }}>
            <CardHeader className='blueGradient'
                title={<Typography sx={{ fontSize: 22, fontWeight: 'bold' }}> ( {coordinates[0]} , {coordinates[1]} ) </Typography>}
                avatar={<img src={getImageByRarity("4")} alt="land-rarity" />}>
            </CardHeader>

            <CardContent className='lightGreyGradient'>
                <Box display='flex' flexDirection='column'>
                    <Typography >
                        <Box fontWeight='fontWeightMedium' display='inline'> Biomes:</Box>
                    </Typography>
                    {
                        landBiomes.map((biome) => {
                            return (
                                <Typography>
                                    - {biome} X%
                                </Typography>
                            );
                        })
                    }
                </Box>
            </CardContent>

            <CardActions className='blueGradient'>
                <Box>
                    <Typography sx={{ mr: 5 }}>
                        <Box fontWeight='fontWeightMedium' display='inline'> Gift: </Box>
                    </Typography>
                    <Typography sx={{ mr: 5 }}>
                        <Box fontWeight='fontWeightMedium' display='inline'> Chunky: </Box>
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    );
} export default DepositedLandCard;
