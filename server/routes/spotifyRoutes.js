"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = "BQDHDoHvDSSSPSw3m9QJ3B9eqDPHJ16qKIQmT4TsjK5Pk_v3qNXj-2WcN79475kwUwLMZK2T20ZmovldQUVBLTgDQ_x82jzzVOCMQUSu-JQMCTi_3To";
function fetchWebApi() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://api.spotify.com/v1/artists/58wXmynHaAWI5hwlPZP3qL`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = yield res.json();
        console.log(data);
    });
}
fetchWebApi();
//https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=gal&track=surlebanc&api_key=61b44fe40efc49a620583b7cdbb0ebe0&format=json
