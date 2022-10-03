const router = require("express").Router();
const needle = require('needle');
require('@tensorflow/tfjs');

const userId = '2704294333';
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";
const userEndpointUrl = `https://api.twitter.com/2/users/${userId}/tweets`;


router.get("/", async (req, res, next) => {
  try {
    const querys = ['#ES_F', '#NQ_F', '#SPY', '2704294333']
    let results = [];

    for (let i = 0; i < querys.length; i++) {
      if (querys[i][0] === '#') {
        const loopParams = {
          'query': `${querys[i]}`,
          'max_results': 100
        }

        const result = await needle('get', endpointUrl, loopParams, {
          headers: {
              "User-Agent": "v2RecentSearchJS",
              "authorization": `Bearer ${'AAAAAAAAAAAAAAAAAAAAADWLhgEAAAAAPLW6bDzXq7msHWXxjsDUZ7yanVY%3D9YU2MZl0i3bwbvmoBxcmKQFssbMWGDTZTemJR73s0PggODLnVd'}`
          }
        })
        if (!result.body) throw new Error("Couldn't find user")

        results.push(result.body.data.map(tweet => tweet.text))
      }
      else {
        const loopParams = {
          // 'query': `${querys[i]}`,
          'max_results': 100
        }
        const result = await needle('get', userEndpointUrl, loopParams, {
          headers: {
              "User-Agent": "v2RecentSearchJS",
              "authorization": `Bearer ${'AAAAAAAAAAAAAAAAAAAAADWLhgEAAAAAPLW6bDzXq7msHWXxjsDUZ7yanVY%3D9YU2MZl0i3bwbvmoBxcmKQFssbMWGDTZTemJR73s0PggODLnVd'}`
          }
        })

        if (!result.body) throw new Error("Couldn't find user")

        results.push(result.body.data.map(tweet => tweet.text));
      }
    }

    res.send(results.flat())

    // const result = await needle('get', endpointUrl, params, {
    //     headers: {
    //         "User-Agent": "v2RecentSearchJS",
    //         "authorization": `Bearer ${'AAAAAAAAAAAAAAAAAAAAADWLhgEAAAAAPLW6bDzXq7msHWXxjsDUZ7yanVY%3D9YU2MZl0i3bwbvmoBxcmKQFssbMWGDTZTemJR73s0PggODLnVd'}`
    //     }
    // })



    // const sentences = result.body.data.map(tweet => tweet.text);
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


  } catch (error) {
    next(error);
  }
});

module.exports = router