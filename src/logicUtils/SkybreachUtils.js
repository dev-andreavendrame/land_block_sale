export function getLandIdsFromCoordinates(offerCoordinates) {
    // Every couple of coordinates is in the form of ({x: 323, y: 4322})
    const ids = [];
    for (let i = 0; i < offerCoordinates.length; i++) {
        const x = parseInt(offerCoordinates[i]['x']);
        const y = parseInt(offerCoordinates[i]['y']);
        const id = x + y * 256;
        console.log("X: %d, Y: %d, ID: %d", x, y, id);
        ids.push(id);
    }
    if (offerCoordinates.length === ids.length) {
        return ids;
    } else {
        return [];
    }
}

export function getEffectiveBlockPrice(rawPrice) {

    // Example of correct price encoding 12.99

    return parseFloat(rawPrice) * 10 ** 10;
}

export function getReadableLandsCoorinates(offerCoordinates) {

    var text = "";
    for (let i = 0; i < offerCoordinates.length; i++) {
        const x = parseInt(offerCoordinates[i]['x']);
        const y = parseInt(offerCoordinates[i]['y']);
        text = text + " (" + x + "," + y + ") ";
    }
    return text;
}

export function getReadableLandsFromIds(landIds) {

    var text = "";
    for (let i=0; i<landIds.length; i++) {
        const x = landIds[i] % 256;
        const y = parseInt(landIds[i] / 256);
        text = text + " (" + x + "," + y + ") ";
    }
    return text;
}