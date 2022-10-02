import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import {} from "./components";
import Loader from "react-loader-spinner";
import * as tf from '@tensorflow/tfjs'
import * as tfModel from '@tensorflow-models/universal-sentence-encoder'
import padSequences from './components/padSequences.js'

// function App() {
//   const [tweets, setTweets] = React.useState([])
//   const [model, setModel] = React.useState(null);
//   const [sentimentScore, setSentimentScore] = React.useState([]);

//   const loadModel = async ()=>{
//     const loadedModel = await tfModel.load()
//     setModel(loadedModel);

//     const embeddings = await loadedModel.embed(tweets);
//     const scores = [];

//     for (let i = 0; i < tweets.length; i++) {
//       const sentenceI = tf.slice(embeddings, [i, 0], [1]);
//       const sentenceJ = tf.slice(embeddings, [i, 0], [1]);
//       const sentenceITranspose = false;
//       const sentenceJTranspose = true;
//       const score =
//       tf.matMul(
//         sentenceI, sentenceJ, sentenceITranspose, sentenceJTranspose)
//         .dataSync();
//         scores.push(score[0])
//         console.log(tweets[i])
//         console.log(score [0])
//       }
//       setSentimentScore(scores)
//     }

//     React.useEffect(() => {
//       const getTweets = async() => {
//         const {data} = await axios.get('api/tweets')
//         setTweets(data)
//     }
//     getTweets()
//   }, [])

//   return (
//     <>
//       <button onClick={loadModel}>Test model</button>
//     </>
//   );
// }

// export default App;


function App() {

  const [tweets, setTweets] = React.useState([])

  const url = {

    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
};

const OOV_INDEX = 2;

const [metadata, setMetadata] = React.useState();
const [model, setModel] = React.useState();
const [testText, setText] = React.useState("");
const [testScore, setScore] = React.useState("");
const [trimedText, setTrim] = React.useState("")
const [seqText, setSeq] = React.useState("")
const [padText, setPad] = React.useState("")
const [inputText, setInput] = React.useState("")


async function loadModel(url) {
  try {
    const model = await tf.loadLayersModel(url.model);
    setModel(model);
  } catch (err) {
    console.log(err);
  }
}

async function loadMetadata(url) {
  try {
    const metadataJson = await fetch(url.metadata);
    const metadata = await metadataJson.json();
    setMetadata(metadata);
  } catch (err) {
    console.log(err);
  }
}


const getSentimentScore =(text) => {

  const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
  setTrim(inputText)
  const sequence = inputText.map(word => {
    let wordIndex = metadata?.word_index[word] + metadata?.index_from;
    if (wordIndex > metadata?.vocabulary_size) {
      wordIndex = OOV_INDEX;
    }
    return wordIndex;
  });
  setSeq(sequence)
  // Perform truncation and padding.
  const paddedSequence = padSequences([sequence], 100);
  setPad(paddedSequence)

  const input = tf.tensor2d(paddedSequence, [1, 100]);
  setInput(input)
  const predictOut = model?.predict(input);
  const score = predictOut?.dataSync()[0];
  predictOut?.dispose();
  setScore(score)
  console.log(score)
  return score;
}


  React.useEffect(() => {
      const getTweets = async() => {
        const {data} = await axios.get('api/tweets')
        setTweets(data)
      }
      getTweets()

      tf.ready().then(
        ()=>{
          loadModel(url)
          loadMetadata(url)
        }
      );
  }, [])

  return (
    <div>
       <button onClick={() => getSentimentScore('i had a bad day today')}>Test model</button>
    </div>
  )
}

export default App;