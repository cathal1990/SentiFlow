import React from "react";
import axios from "axios";
import { Blocks } from "react-loader-spinner";
import * as tf from '@tensorflow/tfjs'
import padSequences from './components/padSequences.js'


function App() {

  const url = {
      model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
      metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
  };

  const OOV_INDEX = 2;

  const [tweets, setTweets] = React.useState([])
  const [tweetsVisible, setTweetsVisible] = React.useState(false)
  const [userInput, setUserInput] = React.useState('')
  const [metadata, setMetadata] = React.useState();
  const [model, setModel] = React.useState(null);
  const [sentimentScore, setSentimentScore] = React.useState(0)
  const [sentimentResult, setSentimentResult] = React.useState('')
  const [userSentiment, setUserSentiment] = React.useState(0)
  const [userSentimentResult, setUserSentimentResult] = React.useState(0)

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

    const sequence = inputText.map(word => {
      let wordIndex = metadata?.word_index[word] + metadata?.index_from;
      if (wordIndex > metadata?.vocabulary_size) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], 100);
    const input = tf.tensor2d(paddedSequence, [1, 100]);
    const predictOut = model?.predict(input);
    const score = predictOut?.dataSync()[0];
    predictOut?.dispose();
    return score
  }

  const sentimentLoop = () => {
    let scoreCount = 0;
      for (let i = 0; i < tweets?.length; i++) {
        const newScore = getSentimentScore(tweets[i]);
        scoreCount += newScore;
      }
      setSentimentScore(scoreCount)

      if (scoreCount > 65) { setSentimentResult('POSITIVE') }
      if (scoreCount < 35) { setSentimentResult('NEGATIVE') }
      if (scoreCount > 35 && scoreCount < 65) { setSentimentResult('NEUTRAL') }

  }

  const userSentimentFunc = (sentence) => {

    if (sentence === '') { return }

    const newScore = getSentimentScore(sentence);

    setUserSentiment(newScore)

    if (newScore > 0.65) { setUserSentimentResult('POSITIVE') }
    if (newScore < 0.35) { setUserSentimentResult('NEGATIVE') }
    if (newScore > 0.35 && newScore < 0.65) { setUserSentimentResult('NEUTRAL') }

    setUserInput('')
  }

  const getTweets = async() => {
    const {data} = await axios.get('api/tweets')
    setTweets(data)
    setTweetsVisible(true)
  }


  React.useEffect(() => {

    getTweets()

    tf.ready().then(
      ()=>{
        loadModel(url)
        loadMetadata(url)
      }
    );
  }, [])

  return (
    <>{!model ?
      <div className="loading-screen-container">
        <Blocks
          height="200"
          width="200"
          radius={1}
          ariaLabel="puff-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        <p>MODEL LOADING...</p>
      </div>
      :
      <div className="main-content-container">
        <div className='user-input-container'>
          <div className="user-input-field-container">
            <p>Enter a sentence</p>
            <input type="text" onChange={(e) => setUserInput(e.target.value)} value={userInput}/>
          </div>
          <div className='tweet-sentiment-container'>
            <p>Sentiment Score: {userSentiment ? userSentiment : ''}</p>
            <p className={userSentimentResult}>Sentiment Result: <span>{userSentimentResult}</span></p>
          </div>
          <div className='user-input-result-container'>
            <button id='tweet-analysis-button' type="submit" onClick={() => {
              userSentimentFunc(userInput)
            }}>Run Sentiflow</button>
          </div>
        </div>
        <div className='tweet-analysis-container'>
          <div className='tweet-container'>
            <div className="tweet-list-container">
              <h2>Most recent 400 Tweets</h2>
              <small>(#ES_F, #NQ_F, #SPY, @Deltaone)</small>
              {!tweetsVisible ?
                <Blocks
                  height="200"
                  width="200"
                  radius={1}
                  // color="#00BFFF"
                  ariaLabel="puff-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              :
              <ul>
                {tweets?.map((tweet, i) => <li key={i}>{tweet}</li>)}
              </ul>
              }
            </div>
          </div>
          <div className='tweet-sentiment-container'>
            <p>Sentiment Score: {sentimentScore ? (sentimentScore / tweets.length).toFixed(3) : ''}</p>
            <p className={sentimentResult}>Sentiment Result: <span>{sentimentResult}</span></p>
          </div>
          <div className='button-container'>
            <button id='tweet-analysis-button' onClick={() => {
              getTweets();
              setTweetsVisible(true)
              sentimentLoop();
            }}>Run Sentiflow</button>
          </div>
        </div>
      </div>
    }
    </>
  )
}

export default App;