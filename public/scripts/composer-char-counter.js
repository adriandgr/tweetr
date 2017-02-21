

$(document).ready(() => {

  document.addEventListener('input', event => {
    let charCount = event.target.textLength;

    $('.counter').text(() => {
      console.log(this);
      if (140 - charCount < 0) {
        $('.counter').css("color", "red");
      } else {
        $('.counter').css("color", "#244751");
      }
      return 140 - charCount;
    });
  });
});