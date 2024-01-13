'use client';

import React, { useState, useRef } from 'react';
import GoogleMaps from './GoogleMaps';
import BingMaps from './BingMaps';
import Autocomplete from 'react-google-autocomplete';
const Main = () => {
  const [position, setPosition] = useState(['']);
  const [google, showGoogle] = useState(false);
  const [bing, showBing] = useState(false);
  const autocompleteRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState([]);

  const onPlaceSelected = (place) => {
    const { geometry } = place;
    const { location } = geometry;
    setPosition((prev) => [...prev, `${location.lat()},${location.lng()}`]);
    setSelectedPlace((prev) => [
      ...prev,
      place.address_components[0].short_name,
    ]);

    console.log('location: ', place.address_components[0].short_name);
    console.log('latitude: ', location.lat(), ' longitude: ', location.lng());
    if (autocompleteRef.current) {
      autocompleteRef.current.value = '';
    }
  };

  const googlemapsHandler = () => {
    showGoogle(true);
    showBing(false);
  };
  const bingmapsHandler = () => {
    showGoogle(false);
    showBing(true);
    console.log('places:', position);
  };
  return (
    <div style={{ overflowY: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={googlemapsHandler}>Google Maps</button>
        <button onClick={bingmapsHandler}>Bing Maps</button>
      </div>
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_API_KEY}
          onPlaceSelected={onPlaceSelected}
          ref={autocompleteRef}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginTop: '100px' }}>
          {selectedPlace.map((position, index) => (
            <>
              <div
                style={{
                  marginTop: '5px',
                  width: '250px',
                }}
              >
                <div
                  style={{
                    margin: '2px',
                    backgroundColor: 'grey',
                    height: '40px',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div key={index}>{position}</div>
                </div>
              </div>
            </>
          ))}
        </div>
        <div
          style={{ margin: '100px 50px 0 50px', width: '100%', height: '100%' }}
        >
          {google && !bing && <GoogleMaps places={position} />}
          {!google && bing && <BingMaps places={position} />}
        </div>
      </div>
    </div>
  );
};

export default Main;
