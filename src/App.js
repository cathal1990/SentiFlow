import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import {} from "./components";
import * as tf from '@tensorflow/tfjs'
import * as tfModel from '@tensorflow-models/universal-sentence-encoder'

function App() {
  const [tweets, setTweets] = React.useState([])
  const [model, setModel] = useState(null);

  const loadModel = async ()=>{
    const loadedModel = await tfModel.load()
    setModel(loadedModel);
    console.log('Model loaded.')
  }

  React.useEffect(() => {
    const getTweets = async() => {
      const {data} = await axios.get('api/tweets')
      {console.log(data)}
      setTweets(data)
    }
    loadModel()
    getTweets()
  }, [])

  return (
    <>
    <canvas className="canvas" width="500px" height="500px"></canvas>
    <button onClick={runModel}></button>
    </>
  );
}

export default App;
