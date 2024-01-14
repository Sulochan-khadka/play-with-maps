'use client';

import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
  overflow: 'scroll',
};

const center = {
  lat: 28.745,
  lng: 28.523,
};
const GoogleMaps = ({ places }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_KEY,
  });
  const DirectionsService = new google.maps.DirectionsService();
  let [directions, setDirections] = useState('');
  const origin = places.slice(0, -1);
  const dest = places.slice(1);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        options={{
          zoomControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
        //   onLoad={onLoad}
        //   onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {places.map((item, index) => {
          const [lat, lng] = item.split(',');
          const coordinatesObject = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          };
          return <Marker key={index} position={coordinatesObject} />;
        })}

        <></>
      </GoogleMap>
    </div>
  ) : (
    <div>This is google maps</div>
  );
};

export default GoogleMaps;
