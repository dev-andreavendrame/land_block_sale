import 'bootstrap/dist/css/bootstrap.min.css';
import { readLandBlockSC, writeLandBlockSC, LAND_BLOCK_ABI, landBlockCA } from './LandBlockSale';


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

        <div class="container-p-3 my-3 bg-dark text-white padding_side_20">
            <div class="row">
                <div class="col-1">
                    <h5>{"Land " + (props.number + 1) + ")"}</h5>
                </div>
                <div class="col-4">
                    <h5 class="padding_side_20">{"Coordinates (" + (props.land_id % 256) + "," + Math.floor(props.land_id / 256) + ")"}</h5>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-outline-primary" onClick={withdrawSingleLand}>Withdraw this land</button>
                </div>
            </div>
        </div>
    )

} export default SingleLand;