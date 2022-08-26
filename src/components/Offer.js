import React from "react";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { readLandBlockSC } from './LandBlockSale';

function Offer(props) {

  // Offer info
  const [offerId, setOfferId] = useState(-1);
  const [offerPrice, setOfferPrice] = useState(-1);
  const [offerLandIds, setOfferLandIds] = useState([]);
  const [lastOfferId, setLastOfferId] = useState(0);

  console.log("Dentro OFFER");

  useEffect(() => {
    const x = 0;
  }, [lastOfferId]);

  setOfferId(props.key);
  console.log("Id offerta: " + props.key);

  console.log("Lavorando all'offerta " + offerId);
  readLandBlockSC.getOfferDetails(offerId)
    .then(offerDetails => {
      const price = offerDetails.price;
      const offerMaker = offerDetails.offerMaker;
      const landsInOffer = offerDetails.landIds;
      const serviceFee = parseInt(offerDetails.serviceFee) / 10 + "";
      return (
        <table class="table">
          <thead className='thead-light'>
            <tr>
              <th scope="col">Offer ID</th>
              <th scope="col">Price</th>
              <th scope="col">Maker</th>
              <th scope='col'>Service fee</th>
              <th scope="col">Lands in offer</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-white">
              <td>{props.key}</td>
              <td>{price}</td>
              <td>{offerMaker}</td>
              <td>{serviceFee}</td>
              <td>{landsInOffer}</td>
            </tr>
          </tbody>
        </table>
      );
    })
    .catch(error => {
      console.log("Error getting offer data: " + error);
      return (
        <div>
          <p>Error getting offer data</p>
        </div>
      );
    });

}

export default Offer;