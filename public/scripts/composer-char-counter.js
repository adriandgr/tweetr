/*
 * Client-side JS logic for counting 140 characters
 * jQuery is already loaded
 */

function createCharacterCounter(max) {
  // By switching this to a function, and passing max in we can move the invocation to the 'main' ready function.
  // This means we can have a constant that uses the same tweet counter limit for the messages and the live counter.
  document.addEventListener('input', event => {
    // Switching from charCount to charRemaining we have all th information we need with fewer operations.
    let charRemaining = max - event.target.textLength;
    // I can use that information to store the state of the css based on a condition.
    let color = (charRemaining < 0) ? "red" : "#244751";

    // Not entirely sure how jQuery actually handles this, but in case it is a costly operation maybe I should cache the lookup result. 
    let counter = $('.counter');

    // Clearly I'm changing the css and then the contents of the element.
    counter.css("color", color);
    counter.text(charRemaining);
  });
}
