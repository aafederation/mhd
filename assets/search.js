'use strict';

{{ $searchDataFile := printf "%s.search-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

(function () {
	const idForFilterResults = "#mhd-tiles-search-result";
  const input = document.querySelector('#book-search-input');
  const filterResults = document.querySelector(idForFilterResults);
  const originalResults = [];

  if (!input) {
    return
  }

	/**
	 * throttled search
	 */
  const throttledSearch = throttledSearchCreator();
  //const throttledSearch = throttle(search, 1000);

  input.addEventListener('focus', init);
  input.addEventListener('keyup', throttledSearch);

  document.addEventListener('keypress', focusSearchFieldOnKeyPress);

  /**
   * @param {Event} event
   */
  function focusSearchFieldOnKeyPress(event) {
    if (input === document.activeElement) {
      return;
    }

    const characterPressed = String.fromCharCode(event.charCode);
    if (!isHotkey(characterPressed)) {
      return;
    }

    input.focus();
    event.preventDefault();
  }

  /**
   * @param {String} character
   * @returns {Boolean} 
   */
  function isHotkey(character) {
    const dataHotkeys = input.getAttribute('data-hotkeys') || '';
    return dataHotkeys.indexOf(character) >= 0;
  }

  function init() {
    input.removeEventListener('focus', init); // init once
    input.required = true;

    loadScript('{{ "js/flexsearch.min.js" | relURL }}');
    loadScript('{{ $searchData.RelPermalink }}', function () {
      input.required = false;
      throttledSearch();
			//load all results into elements to show in the results screen
			//when the search bar is empty
			createAllResults();
    });
  }

	/**
	 * createAllResults function -
	 * load all results from the search index into originalResults array
	 * to show in search results element when the search bar is empty
	 */
  function createAllResults() {
		for (const property in window.bookSearchIndex.l) {
			originalResults.push(window.bookSearchIndex.l[property]);
		}
	}

	/**
	 * throttle function - will only call function
	 * once every so many seconds
	 * we are not using this.  this is more generic implementation
	 */
  function throttle(func, time) {
		let running = false;

		return function(...args) {
			if (!running) {
				running = true;
				setTimeout(() => {
					running = false; 
				}, time);
				return func(...args);
			} 
		}
	}

	/**
	 * throttled search
	 * when called, it only runs once every so many seconds
	 * at the end of every timeout, 
	 * if the input string is different from last run
	 * then run the search function one last time
	 */
  function throttledSearchCreator() {
		let running = false;
		let time = 1000;
		let runInput = "";

		return function() {
			if (!running) {
				running = true;
				setTimeout(() => {
					running = false; 
					if(runInput !== input.value) {
						runInput = input.value;
						search();
					}
				}, time);
				runInput = input.value;
				search();
			} 
		}
	}

  function search() {
    while (filterResults.firstChild) {
      filterResults.removeChild(filterResults.firstChild);
    }

		//if input string is empty
    if (!input.value) {
			//then loop through the original result 
			originalResults.forEach( 
				(card) => {
					//and attach them to the filterResults
					filterResults.appendChild(makeSearchResultCard(card));
				}
			)
			//then re-calculate the filter
			htf.showCheckFromSearch();
      return;
    }

    const searchHits = window.bookSearchIndex.search(input.value, 10);
    searchHits.forEach(function (page) {
			//make the card for the search result
			let resultCard = makeSearchResultCard(page);

			//then append the card to the filter result element in the dom
			filterResults.appendChild(resultCard);
    });
		htf.showCheckFromSearch();
  }

  /**
   * Function to create a single service provider class
   */
  function makeSearchResultCard(myPage) {
		//look at the template on main-body.html
		let template = document.querySelector('#searchResultCard');
		let clone = template.content.cloneNode(true);
		let mainDiv = clone.querySelector(".tf-filter-item");
		let h6 = clone.querySelector("h6");
		let a = clone.querySelector("a");
		let tag = clone.querySelector("tag");


		h6.textContent = myPage.section;
		a.href = myPage.href;
		a.textContent = myPage.title;
		mainDiv.classList.add("show-item");
		mainDiv.setAttribute("data-tag", myPage.tag);
		mainDiv.setAttribute("data-borough", myPage.borough);
		mainDiv.setAttribute("data-language", myPage.language);
		mainDiv.setAttribute("data-payment", myPage.payment);
		mainDiv.setAttribute("data-adacompliance", myPage.ADAcompliance);

		return clone;
	}

  /**
   * @param {String} src 
   * @param {Function} callback 
   */
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.defer = true;
    script.async = false;
    script.src = src;
    script.onload = callback;

    document.head.appendChild(script);
  }
})();
