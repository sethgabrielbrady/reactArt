import React, { useState, useEffect } from 'react';

import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('small');


  function getRandomId () {
    axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects')
    .then(response => {
      let randomId = response.data.objectIDs[Math.floor(Math.random()*response.data.objectIDs.length)];
      if (randomId !== null) {
        getImage(randomId);
      }
    })
    .catch(error => {
      console.log("error", error)
    });
  }
  function getImage(id) {
    axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects/'+id)
      .then(response => {
        if (response.data.primaryImage === "") {
          getRandomId();
        }
        setData(response.data);
        console.log("data", response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }
  useEffect(() => {
    getRandomId();
  }, []); // Empty dependency array ensures this runs once on mount

  function changeSize () {
    setSize(!size);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="container">
        <div className="art-info padding" class={size ? "show" : "hide"}>
          <h1 className="clickable" onClick={getRandomId}>ReactArt</h1>
          <h3>{data.primaryImage ? data.title : "Getting your art" }</h3>
          <a href={data.primaryImage ? data.url : "" }>{data.primaryImage}</a>
        </div>
        <img onClick={changeSize} src={data.primaryImageSmall} className="primary-image" class={size ? "small" : "large"} alt="art" />
      </div>
    </>
  )
}

export default App
