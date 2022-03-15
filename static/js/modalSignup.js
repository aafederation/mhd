(function () {
  //Get from localstorage value for if modal has been displayed
  let signupModalDisplayed = localStorage.getItem("signupModalDisplayed");

  //Only execute rest of code if modal has not been displayed before
  if (!signupModalDisplayed) {
    //1. variables
    //1.1 local vars

    //1.2 handles to document elements
    //handle for modal
    const modal = document.querySelector(".modal");
    //set property to display modal
    modal.style.display = "block";

    //handle for x-button
    const xModalClose = document.querySelector(".x-modal-close");
    //handle for signup button
    const buttonJoinUs = document.querySelector(".button-join-us");

    //2. add events
    //2.1 for x
    xModalClose.addEventListener("click", function () {
      closeDisplay(modal);
    });
    //2.2 for join button
    buttonJoinUs.addEventListener("click", function () {
      closeDisplay(modal);
    });
  }

  //3. methods
  function closeDisplay(el) {
    //first hide the modal
    el.style.display = "none";
    //then set localstorage for value of signupModalDisplayed to true
    localStorage.setItem("signupModalDisplayed", true);
  }
})();
