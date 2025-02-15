import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import React, { useEffect, useState } from "react";

// Function to get coordinates using OpenStreetMap API
const fetchCoordinates = async (place) => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
    );
    const data = await response.json();
    return data.length > 0 ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
};

// Component to update the map center
const MapUpdater = ({ coordinates }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coordinates, 15);
    }, [coordinates, map]);
    return null;
};

const MeetupMap = ({ municipality, barangay }) => {
    const [coordinates, setCoordinates] = useState([14.2893, 120.9057]); // Default: General Trias, Cavite

    useEffect(() => {
        const getCoordinates = async () => {
            const location = `${barangay}, ${municipality}, Cavite, Philippines`;
            const coords = await fetchCoordinates(location);
            if (coords) setCoordinates(coords);
        };
        getCoordinates();
    }, [municipality, barangay]);

    return (
        <MapContainer center={coordinates} zoom={15} className="w-full h-full rounded-md">
            <MapUpdater coordinates={coordinates} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coordinates}>
                <Popup>Meet-up Location: {barangay}, {municipality}</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MeetupMap;
