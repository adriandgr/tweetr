/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


function calculateDaysSincePostDate(postDate){
  let post = new Date(postDate);
  let today = new Date();
  let timeDiff = Math.abs(today.getTime() - post.getTime());
  return Number(Math.ceil(timeDiff / (1000 * 3600 * 24)));
}

function createHeader(data) {
  let $header = $('<header></header>');
  $header.append($('<img class="avatar">').attr('src', data.user.avatars.regular))
         .append($('<h2></h2>').text(data.user.name))
         .append($('<span class="user-handle"></span>').text(data.user.handle));
  return $header;
}

function createBody(data) {
  let $body = $('<main></main>');
  $body.append($('<p></p>').text(data.content.text));
  return $body;
}

function createFooter(data) {
  let $footer = $('<footer></footer>');
  $footer.append(`${calculateDaysSincePostDate(data.created_at)} days ago`)
         .append('<i class="fa fa-flag" aria-hidden="true"></i>')
         .append('<i class="fa fa-retweet" aria-hidden="true"></i>')
         .append('<i class="fa fa-heart" aria-hidden="true"></i>');
  return $footer;
}

function createTweetElement(tweet) {
  let $article = $('<article class="tweet"></article>');
  $article.append(createHeader(tweet))
          .append(createBody(tweet))
          .append(createFooter(tweet));
  return $article;
}

function renderTweets(tweets) {
  for (let tweet in tweets){
    $( createTweetElement(tweets[tweet]) ).prependTo( '#tweets' );
  }
}

// // // // // // // //

$(document).ready(()=> {

  function tweetLoader() {
    $.ajax({
      type: 'GET',
      url: '/tweets'
    }).then((result) => {
      if (!arguments.length) {
        $('.container').append(renderTweets(result));
      } else {
        let newTweet = result.slice(result.length - 1);
        $('.container').append(renderTweets(newTweet));
      }
    });
  }

  $('#compose-btn').on('click', ()=> {
    $('.new-tweet').slideToggle( 350 );
  });


  $('.new-tweet form').on('submit', (e) => {
    e.preventDefault();
    let $formData = $('.new-tweet form');
    // TODO, get formData in an easier way
    let formLength = $formData["0"].firstChild.nextElementSibling.textLength;
    if (formLength === 0){
      let $emptyTweet = $('<span>Don\'t be a shy birdy... Tweet text area may not be empty.</span>');
      Materialize.toast($emptyTweet, 5000);
    } else if ( formLength > 140 ){
      let $tweetOverflow = $('<span>Aren\'t you a chatty bird... Tweet exceeds 140 character limit!</span>');
      Materialize.toast($tweetOverflow, 5000);
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets',
        data: $formData.serialize()
      }).then(tweetLoader);
    }
  });

  tweetLoader();

});



