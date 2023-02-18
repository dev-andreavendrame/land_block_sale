import { Box, Typography, Card, CardHeader, CardContent, CardActions, Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { readLandBlockSC } from './LandBlockSale';
import SingleLand from './SingleLand';

function WithdrawComponent(props) {

    // Withdraw info
    const [depositedLands, setDepositedLands] = useState([]);
    const [testo, setTesto] = useState("");

    useEffect(() => {
        console.log("Use state: " + testo);
        var dati = testo.split(",");
        console.log("Use state: dati: " + dati);
        setDepositedLands(dati);
    }, [testo]);

    return (
        <Box>
            <Typography className='blueGradientText' sx={{ mr: 5, fontSize: 60, fontWeight: 1000 }}>
                Handle deposited lands
            </Typography>
            <Card sx={{ mb: 5, borderRadius: 3, boxShadow: 8 }}>
                <CardHeader className='blueGradient'
                    avatar={
                        <Button className='yellowButton' variant='contained' onClick={updateDepositedLandList} sx={{ maxWidth: 200, fontWeight: 'bold', color: '#282c34' }}>
                            Get deposited land list
                        </Button>
                    }
                />
                <CardContent className='lightGreyGradient'>
                    {depositedLands.map((index, i) => (
                        <SingleLand 
                            key={index} 
                            land_id={index} 
                            number={i} />
                    ))}
                </CardContent>

                <CardActions className='blueGradient' sx={{ p: 2 }}>
                    <Button className='redButton' variant='contained' onClick={withdrawAllDepositedLands} sx={{ maxWidth: 200, fontWeight: 'bold', color: 'white' }}>
                        Withdraw all deposited lands
                    </Button>
                </CardActions>
            </Card>
        </Box>
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