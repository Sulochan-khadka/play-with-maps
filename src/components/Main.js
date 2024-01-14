'use client';

import React, { useState, useRef } from 'react';
import GoogleMaps from './GoogleMaps';
import BingMaps from './BingMaps';
import Autocomplete from 'react-google-autocomplete';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
const Main = () => {
  const [position, setPosition] = useState(['']);
  const [google, showGoogle] = useState(false);
  const [bing, showBing] = useState(false);
  const autocompleteRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState([]);

  const handleDragDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;
    if (type === 'group') {
      const reorderedStores = [...selectedPlace];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedStore] = reorderedStores.splice(sourceIndex, 1);
      reorderedStores.splice(destinationIndex, 0, removedStore);
      return setSelectedPlace(reorderedStores);
    }
  };
  const onPlaceSelected = (place) => {
    const { geometry } = place;
    const { location } = geometry;
    setPosition((prev) => [...prev, `${location.lat()},${location.lng()}`]);
    setSelectedPlace((prev) => [
      ...prev,
      {
        name: place.address_components[0].short_name,
        id: `${location.lat()}.${location.lng()}`,
      },
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
        <DragDropContext onDragEnd={handleDragDrop}>
          <div style={{ marginTop: '100px' }}>
            <Droppable droppableId='root' type='group'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedPlace.map((position, index) => (
                    <Draggable
                      draggableId={position.id}
                      key={position.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
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
                              <div key={index}>{position.name}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
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
