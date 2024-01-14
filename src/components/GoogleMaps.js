'use client';

import React, { useState, useEffect } from 'react';
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
  const [routes, setRoutes] = useState([]);
  const [location, setLocation] = useState([]);

  const calculateRoute = async ({ origin, destination }) => {
    if (!origin || !destination) return;

    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setRoutes((prev) => [
      ...prev,
      {
        origin,
        destination,
        directions: results,
      },
    ]);
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_KEY,
  });

  useEffect(() => {
    if (places.length > 1) {
      const [lat, lng] = places[places.length - 1].split(',');
      const coordinatesObject = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };

      setLocation((prev) => [...prev, coordinatesObject]);
    }
  }, [places]);

  // Calculate routes when location changes
  useEffect(() => {
    if (location.length > 1) {
      const origin = location[location.length - 2];
      const destination = location[location.length - 1];
      calculateRoute({ origin, destination });
    }
  }, [location]);

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
      >
        {routes.map((route, index) => (
          <React.Fragment key={index}>
            <DirectionsRenderer directions={route.directions} />
            <Marker position={route.origin} />
            {index === routes.length - 1 && (
              <Marker position={route.destination} />
            )}
          </React.Fragment>
        ))}
      </GoogleMap>
    </div>
  ) : (
    <div>This is google maps</div>
  );
};

export default GoogleMaps;
