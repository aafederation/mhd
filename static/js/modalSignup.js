(function () {
  //1. variables
  //1.1 local vars

  //1.2 handles to document elements
  //handle for modal
  let modal = document.querySelector(".modal");
  //handle for x-button
  let xModalClose = document.querySelector(".x-modal-close");
  //handle for signup button
  let buttonJoinUs = document.querySelector(".button-join-us");

  //2. add events
  //2.1 for x
  xModalClose.addEventListener("click", function () {
    modal.style.display = "none";
  });
  //2.2 for join button
  buttonJoinUs.addEventListener("click", function () {
    modal.style.display = "none";
  });

  //3. methods
  function toggleClass(el, className) {
    el.classList.toggle(className);
  }
})();
