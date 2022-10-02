const router = require("express").Router();
const { Client } = require("twitter-api-sdk")
const needle = require('needle');
require('@tensorflow/tfjs');

const use = require('@tensorflow-models/universal-sentence-encoder');
const userId = '2704294333';
const client = new Client(process.env.TWITTER_BEARER_TOKEN);
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";
const userEndpointUrl = `https://api.twitter.com/2/users/${userId}/tweets`;


router.get("/", async (req, res, next) => {
  try {
    // const { data } = await client.tweets.tweetsRecentSearch({
    //     query: '#ES_F',
    //     max_results: 100,
    //     start_time: '2022-09-28T09:00:00Z',
    // });

    const params = {
      // 'query': 'from:deltaone',
      'max_results': 20
    }

    let userTweets = [];

    const result = await needle('get', userEndpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${'AAAAAAAAAAAAAAAAAAAAADWLhgEAAAAAPLW6bDzXq7msHWXxjsDUZ7yanVY%3D9YU2MZl0i3bwbvmoBxcmKQFssbMWGDTZTemJR73s0PggODLnVd'}`
        }
    })

    if (!result.body) throw new Error("Couldn't find user")

    const sentences = result.body.data.map(tweet => tweet.text);
    // let mlValues;

    // // Load the model.
    // use.load().then(model => {
    //     // Embed an array of sentences.
    //     const sentences = data.map(tweet => tweet.text);
    //     model.embed(sentences).then(embeddings => {
    //       // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
    //       // So in this example `embeddings` has the shape [2, 512].
    //       embeddings.print(true /* verbose */);
    //       console.log(embeddings.values)
    //     })
    // });

    res.send(sentences)
  } catch (error) {
    next(error);
  }
});

module.exports = router