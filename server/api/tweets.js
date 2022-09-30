const router = require("express").Router();
const { Client } = require("twitter-api-sdk")
require('@tensorflow/tfjs');

const use = require('@tensorflow-models/universal-sentence-encoder');
const client = new Client(process.env.TWITTER_BEARER_TOKEN);


router.get("/", async (req, res, next) => {
  try {
    const { data } = await client.tweets.tweetsRecentSearch({
        query: '#ES_F',
        max_results: 100,
        start_time: '2022-09-28T09:00:00Z',
    });

    if (!data) throw new Error("Couldn't find user")
    const mlValues = []

    // Load the model.
    use.load().then(model => {
        // Embed an array of sentences.
        const sentences = data.map(tweet => tweet.text);
        model.embed(sentences).then(embeddings => {
            // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
            // So in this example `embeddings` has the shape [2, 512].
            embeddings.print(true /* verbose */);
        });
    });

    res.send(mlValues)
  } catch (error) {
    next(error);
  }
});

module.exports = router