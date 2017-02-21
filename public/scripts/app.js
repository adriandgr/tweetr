/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.
var data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

function calculateDaysSincePostDate(postDate){
  let post = new Date(postDate);
  let today = new Date();
  let timeDiff = Math.abs(today.getTime() - post.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function createHeader(data) {
  let $header = $('<header></header>');
  $header.append($(`<img class="avatar" src="${data.user.avatars.regular}">`));
  $header.append($(`<h2>${data.user.name}</h2>`));
  $header.append($(`<span class="user-handle">${data.user.handle}</span>`));
  return $header;
}

function createBody(data) {
  let $body = $('<main></main>');
  $body.append(`<p>${data.content.text}</p>`);
  return $body;
}

function createFooter(data) {
  let $footer = $('<footer></footer>');
  $footer.append(`${calculateDaysSincePostDate(data.created_at)} days ago`);
  $footer.append('<i class="fa fa-flag" aria-hidden="true"></i>');
  $footer.append('<i class="fa fa-retweet" aria-hidden="true"></i>');
  $footer.append('<i class="fa fa-heart" aria-hidden="true"></i>');
  return $footer;
}

function createTweetElement(tweet) {
  let $article = $('<article class="tweet"></article>');
  $article.append(createHeader(tweet));
  $article.append(createBody(tweet));
  $article.append(createFooter(tweet));
  return $article;
}

function renderTweets(tweets) {
  let $tweetDeck = $('<section id="tweets"></section>');
  for (let tweet in tweets){
    $tweetDeck.append(createTweetElement(tweets[tweet]));
  }
  console.log($tweetDeck);
  return $tweetDeck;
}
$(document).ready(()=> {
  $('.container').append(renderTweets(data));
});

