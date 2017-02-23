/*
 * Client-side JS logic for counting 140 characters
 * jQuery is already loaded
 */

$(document).ready(() => {
  document.addEventListener('input', event => {
    let charCount = event.target.textLength;

    $('.counter').text(() => {
      if (140 - charCount < 0) {
        $('.counter').css("color", "red");
      } else {
        $('.counter').css("color", "#244751");
      }
      return 140 - charCount;
    });
  });
});
