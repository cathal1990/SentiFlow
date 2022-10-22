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


  } catch (error) {
    next(error);
  }
});

module.exports = router
