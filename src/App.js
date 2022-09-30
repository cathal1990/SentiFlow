import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import {} from "./components";

function App() {
  const [tweets, setTweets] = React.useState([])

  React.useEffect(() => {
    const getTweets = async() => {
      const {data} = await axios.get('api/tweets')
      setTweets(data)
    }
    getTweets()
  }, [])

  return (
    <>
    <ul>{console.log(tweets)}
      {tweets?.map((array) => {
        array.map((value, i) => <li key={i}>{value}</li>)
      })}
    </ul>
    </>
  );
}

export default App;
