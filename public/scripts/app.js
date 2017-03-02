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
         .append($('<span class="user-handle"></span>').text(`@${data.user.handle}`));
  return $header;
}

function createBody(data) {
  let $body = $('<main></main>');
  $body.append($('<p></p>').text(data.content.text));
  return $body;
}

function createFooter(data) {
  let $footer = $('<footer></footer>').append(`${calculateDaysSincePostDate(data.created_at)} days ago`);

  // Here we reduced the duplication of the entire i tag. These elements seem to be very consistent except for one piece of information.
  // Chances are any change I make to one, would also be made to the rest. With your previous example if we wanted to modify the icon structure we would have to modify 3 lines of code. This way when we want to make a change to one type of icon (we likely want to make that same change to all the icons) we only have to make it in one place.
  ['flag', 'retweet', 'heart'].map(name => {
    $footer.append(`<i class="fa fa-${name}" aria-hidden="true"></i>`);
  });

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


// ON Document ready

$(document).ready(()=> {
  const SLIDE_TIME_MILLISECONDS = 350;
  const TWEET_CHARACTER_MAX = 140;

  $.get('/users/session', (data, status) => {
    if ($( "#login-btn" ).data( "ui-state" ) === 'visible') {
      $('#compose-btn').toggle();
      $('#logout-btn').toggle();
      $('#login-btn').toggle();
      $( "#login-btn" ).data( "ui-state", 'hidden' );
    }
    console.log(data);
    console.log(status);
  });


  function tweetLoader(num) {
    $.ajax({
      type: 'GET',
      url: '/tweets',
      data: {
        render: num
      }
    }).then((result) => {
      //console.log(arguments)
      if (!arguments.length) {
        //console.log(xhr.status);
        $('.container').append(renderTweets(result));
      } else {
        let newTweet = result.slice(result.length - 1);
        $('.container').append(renderTweets(newTweet));
      }
    }).catch((a, b) =>{
      console.log(arguments);
    });
  }

  /*  Contrived example, and seems like it is close to the same amount of code either this way or hardcoded.
      The point I would like to make here is that if you start to see patterns like this you may be able to accomplish the same task dynamically. What about a situation where you have a bunch of panels on the screen and the configuration changes depending on data?

  [
    {
      selector: '#compose-btn',
      sliders: ['#new-tweet']
    },
    {
      selector: '#login-view i',
      sliders: '#login-view'
    },
    {
      selector: '#register i',
      sliders: ['#register-view']
    },
    {
      selector: '#register',
      sliders: ['#login-view', '#register-view'] 
    },
    {
      selector: '#login',
      sliders: ['#register-view', '#login-view'] 
    },
    {
      selector: '#login-btn',
      sliders: ['#login-view'] 
    }
  ].forEach(clicker => {
    $(clicker.selector).on('click', () => {
      // The goal is to call the sliders sequentially.
      // We can create a function that checks to see if there are any more slider animations to do.
      let current = 0;
      let done = () => {
        if(current < clicker.sliders.length) {
          // If there are then do a toggle and pass in the same function so it is called after the slide is complete.
          $(clicker.sliders[current]).slideToggle(SLIDE_TIME_MILLISECONDS, done);
        }
        // If there are no more items to slide, then it won't call 'done()' again and break the loop.
        current++;
      }

      done();
    });
  });
  */

  $('#compose-btn').on('click', ()=> {
    $('#new-tweet').slideToggle( SLIDE_TIME_MILLISECONDS );
  });

  $('#login-view i').on('click', ()=> {
    $('#login-view').slideToggle( SLIDE_TIME_MILLISECONDS );
  });

  $('#register-view i').on('click', ()=> {
    $('#register-view').slideToggle( SLIDE_TIME_MILLISECONDS );
  });

  $('#register').on('click', ()=> {
    $('#login-view').slideToggle( SLIDE_TIME_MILLISECONDS , ()=>{
      $('#register-view').slideToggle( SLIDE_TIME_MILLISECONDS );
    });
  });

  $('#login').on('click', ()=> {
    $('#register-view').slideToggle( SLIDE_TIME_MILLISECONDS , ()=>{
      $('#login-view').slideToggle( SLIDE_TIME_MILLISECONDS );
    });
  });

  $('#login-btn').on('click', ()=> {
    $('#login-view').slideToggle( SLIDE_TIME_MILLISECONDS );
  });

  $('#logout-btn').on('click', ()=> {
    $.ajax({
        type: 'DELETE',
        url: '/users/session'
    }).then((res) => {
      $('#compose-btn').toggle();
      $('#logout-btn').toggle();
      $('#login-btn').toggle();
      let $logoutMssg = $('<span>See you later.</span>');
      Materialize.toast($logoutMssg, 5000);
      console.log('ajax res', res);
    });
  });


  $('#new-tweet form').on('submit', (e) => {
    e.preventDefault();
    let $formData = $('#new-tweet textarea').val().trim();
    if ($formData.length === 0){
      let $emptyTweet = $('<span>Don\'t be a shy birdy... Tweet text area may not be empty.</span>');
      Materialize.toast($emptyTweet, 5000);
    } else if ( $formData.length > TWEET_CHARACTER_MAX ){
      let $tweetOverflow = $(`<span>Aren't you a chatty bird... Tweet exceeds ${TWEET_CHARACTER_MAX} character limit!</span>`);
      Materialize.toast($tweetOverflow, 5000);
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets',
        data: { text: $formData }
      }).then(tweetLoader);
    }
  });

  $('#login-view form').on('submit', (e) => {
    e.preventDefault();
    let $handle = $('#login-view #handle').val().trim();
    let $usrPwd = $('#login-view #usr-pwd').val().trim();
    if ($handle.length === 0 || $usrPwd.length === 0) {
      let $emptyTweet = $('<span>Don\'t be a shy birdy... fill in all login fields.</span>');
      Materialize.toast($emptyTweet, 5000);
      return;
    }
    $.ajax({
      type: 'PUT',
      url: '/users/session',
      data: {
        handle: $handle,
        usrPwd: $usrPwd
      }
    }).then((res) => {
      $('#login-view form').trigger("reset");
      $('#login-view').slideToggle( 'slow', () =>{
        $('#compose-btn').toggle();
        $('#logout-btn').toggle();
        $('#login-btn').toggle();
      });
    }).catch(() => {
      let $authFail = $('<span>Tweet, Tweet... that doesn\'t look right.</span>');
      Materialize.toast($authFail, 5000);
    });
  });

  $('#register-view form').on('submit', (e) => {
    e.preventDefault();
    let $name = $('#register-view #name').val().trim();
    let $handle = $('#register-view #handle').val().trim();
    let $usrPwd = $('#register-view #usr-pwd').val().trim();
    if ($name.length === 0 || $handle.length === 0 || $usrPwd.length === 0) {
      let $emptyTweet = $('<span>Don\'t be a shy birdy... fill in all login fields.</span>');
      Materialize.toast($emptyTweet, 5000);
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/users',
      data: {
        name: $name,
        handle: $handle,
        usrPwd: $usrPwd
      }
    })
    .then((res) => {
      $('#register-view form').trigger("reset");
      $('#register-view').slideToggle( 'slow', () =>{
        $('#compose-btn').toggle();
        $('#logout-btn').toggle();
        $('#login-btn').toggle();
      });
    })
    .catch((res) => {
      let $cuteTweet = $('<span>Tweet, tweet... A little birdy told me that user already exists!</span>');
      Materialize.toast($cuteTweet, 4000);
      let $helpMsg = $('<span>Please choose a different username.</span>');
      Materialize.toast($helpMsg, 8000);
    });
  });

  // Now the character counter doesn't actually have a reference to '140'.
  createCharacterCounter(TWEET_CHARACTER_MAX);
  tweetLoader();

});
