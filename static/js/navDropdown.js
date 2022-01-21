(function () {
  //1. variables
  //1.1 constants
  const MENUOPENCLASS = "dl-menuopen";

  //1.2 handles to document elements
  //handles for menu dropdowns
  let menuButton = document.getElementById("dl-menu-button");
  let menuOptions = document.getElementById("dl-menu-options");

  //2. add events
  //for menu
  menuButton.addEventListener("click", function () {
    toggleClass(menuOptions, MENUOPENCLASS);
  });

  //3. methods
  function toggleClass(el, className) {
    el.classList.toggle(className);
  }
})();
