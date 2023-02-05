import img_rarity_common from '../images/rarityCommon.png';
import img_rarity_rare from '../images/rarityRare.png';
import img_rarity_epic from '../images/rarityEpic.png';
import img_rarity_harb from '../images/rarityHarb.png';
import img_rarity_premium from '../images/rarityPremium.png';

export function getImageByRarity(rarityValue) {

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