// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token =
  "BQDHDoHvDSSSPSw3m9QJ3B9eqDPHJ16qKIQmT4TsjK5Pk_v3qNXj-2WcN79475kwUwLMZK2T20ZmovldQUVBLTgDQ_x82jzzVOCMQUSu-JQMCTi_3To";
async function fetchWebApi() {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/58wXmynHaAWI5hwlPZP3qL`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log(data);
}

fetchWebApi();

//https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=gal&track=surlebanc&api_key=61b44fe40efc49a620583b7cdbb0ebe0&format=json
