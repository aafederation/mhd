var htfConfig = {
  //FILTER DECLARATION FOR JAVASCRIPT
  filters: [
    {
      name: "tag",
      prefix: "tag-",
      buttonClass: "tag-button",
      allSelector: "#selectAlltag",
      attrName: "data-tag",
      selectedPrefix: "stag-",
      countPrefix: "ctag-",
    },
    {
      name: "borough",
      prefix: "borough-",
      buttonClass: "borough-button",
      allSelector: "#selectAllborough",
      attrName: "data-borough",
      selectedPrefix: "sborough-",
      countPrefix: "cborough-",
    },
    {
      name: "service",
      prefix: "service-",
      buttonClass: "service-button",
      allSelector: "#selectAllservice",
      attrName: "data-service",
      selectedPrefix: "sservice-",
      countPrefix: "cservice-",
    },
    {
      name: "nonClinicalService",
      prefix: "nonClinicalService-",
      buttonClass: "nonClinicalService-button",
      allSelector: "#selectAllnonClinicalService",
      attrName: "data-nonClinicalService",
      selectedPrefix: "snonClinicalService-",
      countPrefix: "cnonClinicalService-",
    },
    {
      name: "staffGender",
      prefix: "staffGender-",
      buttonClass: "staffGender-button",
      allSelector: "#selectAllstaffGender",
      attrName: "data-staffGender",
      selectedPrefix: "sstaffGender-",
      countPrefix: "cstaffGender-",
    },
    {
      name: "ageGroup",
      prefix: "ageGroup-",
      buttonClass: "ageGroup-button",
      allSelector: "#selectAllageGroup",
      attrName: "data-ageGroup",
      selectedPrefix: "sageGroup-",
      countPrefix: "cageGroup-",
    },
    {
      name: "specialty",
      prefix: "specialty-",
      buttonClass: "specialty-button",
      allSelector: "#selectAllspecialty",
      attrName: "data-specialty",
      selectedPrefix: "sspecialty-",
      countPrefix: "cspecialty-",
    },
    {
      name: "type",
      prefix: "type-",
      buttonClass: "type-button",
      allSelector: "#selectAlltype",
      attrName: "data-type",
      selectedPrefix: "stype-",
      countPrefix: "ctype-",
    },
    {
      name: "language",
      prefix: "language-",
      buttonClass: "language-button",
      allSelector: "#selectAlllanguage",
      attrName: "data-language",
      selectedPrefix: "slanguage-",
      countPrefix: "clanguage-",
    },
    {
      name: "payment",
      prefix: "payment-",
      buttonClass: "payment-button",
      allSelector: "#selectAllpayment",
      attrName: "data-payment",
      selectedPrefix: "spayment-",
      countPrefix: "cpayment-",
    },
  ],
  showItemClass: "show-item",
  filterItemClass: "tf-filter-item",
  activeButtonClass: "active",
  counterSelector: "selectedItemCount",
  populateCount: true,
  setDisabledButtonClass: "disable-button",
  noCountButtonClass: "no-count-button",
  showMapClass: "show-map",
  readMore: "read-more",
};
var htf = new HugoTagsFilter(htfConfig);

function toggleAcc(el) {
  el.classList.toggle("active");
  var panel = el.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    // panel.style.maxHeight = panel.scrollHeight + "px";
    panel.style.maxHeight = "400px";
  }
}

(function () {
  //1. Get handles to elements
  let filterPageOverlay = document.getElementById("filter-page-overlay");
  // let showFilterButton = document.getElementById("show-filter-button");
  let mainFilter = document.getElementById("main-filter");
  //Clear all filters id handle
  let clearAllFilters = document.getElementById("clear-all-filters");

  //2. Add eventlisteners
  // showFilterButton.addEventListener("click", function () {
  //   toggleVis(mainFilter);
  //   toggleVis(filterPageOverlay);

  //   if (this.textContent.toUpperCase() === "SHOW FILTER") {
  //     this.textContent = "HIDE FILTER";
  //   } else {
  //     this.textContent = "SHOW FILTER";
  //   }
  // });
  //Eventlistener to clear all filters
  clearAllFilters.addEventListener("click", function () {
    htf.showCheckFromSearch();
  });

  //3. Helper functions
  function handleVis(el) {
    if (el.classList.contains("display-none")) {
      let psychotherapyPill = document.getElementById(
        "pill-service-psychotherapy"
      );
      psychotherapyPill.addEventListener("click", function () {
        toggleVis(el);
      });
    }
    toggleVis(el);
  }

  function toggleVis(el) {
    el.classList.toggle("display-none");
  }
})();
