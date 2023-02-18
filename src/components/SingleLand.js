import 'bootstrap/dist/css/bootstrap.min.css';
import { readLandBlockSC, writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA } from './LandBlockSale';
import { Box, Typography, Button } from '@mui/material';


function SingleLand(props) {

    function withdrawSingleLand() {
        if (props.land_id == null) {
            console.log("Error: land id not available");
        } else {
            writeLandBlockSC.withdrawDepositedLand(props.land_id)
                .then(response => {
                    console.log("Land withdraw started...");
                })
                .catch(error => {
                    console.log("Land withdraw canceled: " + error);
                })
        }
    }

    return (
        <Box display='flex' flexDirection='row' alignItems='center' gap={6} sx={{ p: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
                Land &nbsp;{(props.number + 1)}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
                Coordinates {"(" + (props.land_id % 256) + "," + Math.floor(props.land_id / 256) + ")"}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
                Offer: &nbsp;{props.offer ? props.offer : "none"}
            </Typography>
            <Button className='yellowButton' variant='contained' onClick={withdrawSingleLand} sx={{ color: 'black' }}>
                Withdraw this land
            </Button>
        </Box>
    )

} export default SingleLand;