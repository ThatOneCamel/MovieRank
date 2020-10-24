const axios = require("axios");
const cheerio = require("cheerio");
let re = "alt=\"(.*?)\"";
var list = [];
var URL = "https://letterboxd.com/thatmovieguy21/list/i-change-this-every-day-because-im-bipolar/";
const fetchHTML = async function(url) {
  const { data } = await axios.get(url).catch(err => console.log(err));
  const $ = cheerio.load(data);
  //Mapping the 'alt' text of each element with the 'image' class to an array
  const result = $(".image").map((i, x) => $(x).attr("alt")).toArray();

  //console.log(`Site HTML: ${$.html()}\n\n`)
  //console.log($(".poster-contianer").text());
  
  return result;
};
export const getList = async function() {
  var n = 1;
  var count = 0;

  //Each loop is a page
  //A page has a maximum number of 100 entries
  do {
    let result;
    if(n == 1){
      result = await fetchHTML(URL);
    } else {
      result = await fetchHTML(URL + "page/" + n);
    }

    list.push.apply(list, result);

    //Print each movie from this page
    result.forEach(x => {
      console.log("[" + (count + 1) + "] " + x);
      count++;
    });
    //Works as well, just wont print the index of movies
    //count += result.length; 

    console.log("Page " + n + " has " + result.length + " elements");
    n++;
  } while(count % 100 == 0 && count != 0)

  console.log("This list has " + list.length + " elements.");
  return list;
  
}

//Get list of movies
getList();