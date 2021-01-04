'use strict';

{{ $searchDataFile := printf "%s.search-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

(function () {
	const idForFilterResults = "#mhd-tiles-search-result";
  const input = document.querySelector('#book-search-input');
  const filterResults = document.querySelector(idForFilterResults);
  const originalResults = [];

	//mapboxgl related variables
	mapboxgl.accessToken = "pk.eyJ1IjoiYWJ0cm93IiwiYSI6ImNqejhtbTF2ajE4OTIzbm5samloN2p3MGYifQ.bwAHnbFp6KAZgUmpv3-f8A";
	let providers;
	let map;

	//icons to show in the mapbox markers
	const iconURLs = {
	  hotels: 'http://i.imgur.com/D9574Cu.png',
	  restaurants: 'http://i.imgur.com/cqR6pUI.png',
	  activities: 'http://i.imgur.com/WbMOfMl.png',
	};

	//setup map and data
	preInit();

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

	/**
	 * setup map and data
	 */
  function preInit() {
	  loadScript('{{ "js/flexsearch.min.js" | relURL }}');

    loadScript('{{ $searchData.RelPermalink }}', function () {
			//load all results into elements to show in the results screen
			//when the search bar is empty
			createAllResults();

			//call function to show the map
			showMap();
    });

  }

  function init() {
    input.removeEventListener('focus', init); // init once
    throttledSearch();
  }

	/**
	 * createAllResults function -
	 * load all results from the search index into originalResults array
	 * to show in search results element when the search bar is empty
	 */
  function createAllResults() {
		for (const property in window.bookSearchIndex.l) {
			let card = window.bookSearchIndex.l[property];
			card.id = property;
			originalResults.push(card);
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
		//a.href = myPage.href;
		a.href = "#";
		a.id = "link-" + myPage.id;
		a.textContent = myPage.title;
		mainDiv.classList.add("show-item");
		mainDiv.id = "listing-" + myPage.id;
		mainDiv.setAttribute("data-tag", myPage.tag);
		mainDiv.setAttribute("data-borough", myPage.borough);
		mainDiv.setAttribute("data-language", myPage.language);
		mainDiv.setAttribute("data-payment", myPage.payment);
		mainDiv.setAttribute("data-adacompliance", myPage.ADAcompliance);
		const clickFunc = onClickGoToMap(myPage);
		mainDiv.onclick = clickFunc;

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

	/**
	 * showMap - takes care of showing the mapbox map
	 * with the the coordinates of the service providers
	 * currently showing in the results
   */
	 function showMap() {
	 	const aafCoords = [-74.00601627368108, 40.70481604585044];
		providers = getProviders();

		map = new mapboxgl.Map({
			container: "map",
			center: aafCoords, // FullStack coordinates
			zoom: 9, // starting zoom
			style: "mapbox://styles/mapbox/streets-v11", // mapbox has different styles
		});

    map.on('load', function (e) {
      /* Add the data to your map as a source */
			map.addSource('places', {
				type: "geojson",
				data: providers
			})

		  /* For each feature in the GeoJSON object above: */
		  providers.features.forEach(function(marker) {
		  	let mark = buildMarker("activities", marker.geometry.coordinates)
		    mark.addTo(map);
		  });

    });
		const marker = buildMarker("activities", aafCoords);
		marker.addTo(map);
	}

	/**
	 * buildMarker - builds and returns a marker 
	 * based on the type and coordinates passed as parameters
   */
	function buildMarker(type, coords) {
	  if (!iconURLs.hasOwnProperty(type)) {
	    type = 'activities';
	  }
	  const markerEl = document.createElement('div');
		markerEl.className = 'marker';
	  markerEl.style.backgroundImage = `url(${iconURLs[type]})`;
	  return new mapboxgl.Marker(markerEl)
				.setLngLat(coords)
				.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    			.setHTML('<h3><a href="/mhd/university-settlement/">University Settlement</a></h3><p>come learn something</p>')
				);
	};

  /**
   * getProviders - returns a json object of all providers
   * in the format expected by mapbox
   */
  function getProviders() {
    const providers = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -74.0212758446735,
              40.63230551173878
            ]
          },
          "properties": {
	          "id": 0,
            "phoneFormatted": "(202) 234-7336",
            "phone": "2022347336",
            "address": "1471 P St NW",
            "city": "Arab American Association",
            "country": "United States",
            "crossStreet": "at 15th St NW",
            "postalCode": "20005",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              -73.81661790234168,
              40.755357177776546
            ]
          },
          "properties": {
          	"id": 1,
            "phoneFormatted": "(202) 507-8357",
            "phone": "2025078357",
            "address": "2221 I St NW",
            "city": "Flushing Hospital Medical Center",
            "country": "United States",
            "crossStreet": "at 22nd St NW",
            "postalCode": "20037",
            "state": "D.C."
          }
        }
      ]
    };
    return providers;
	}

	/**
	 * fly to the clicked coordinate
	 */
	function flyToStore(currentFeature) {
	  map.flyTo({
	    center: currentFeature.geometry.coordinates,
	    zoom: 11
	  });
	}

	/**
	 * create popup that pops up on the map
	 */
	function createPopUp(currentFeature) {
	  var popUps = document.getElementsByClassName('mapboxgl-popup');
	  /** Check if there is already a popup on the map and if so, remove it */
	  if (popUps[0]) popUps[0].remove();

	  var popup = new mapboxgl.Popup({ closeOnClick: false })
	    .setLngLat(currentFeature.geometry.coordinates)
	    .setHTML('<h3>Service Provider</h3>' +
	      '<h4>' + currentFeature.properties.address + '</h4>')
	    .addTo(map);
	}

	/**
	 * onclick on the card that flies to the map
	 */
	function onClickGoToMap(page) {

		const clickedListing = providers.features[page.id];

		return function() {
  		flyToStore(clickedListing);

			setTimeout(() => {
				createPopUp(clickedListing);
			}, 1000);

		  
			var activeItem = document.getElementsByClassName('active');
		  if (activeItem[0]) {
		    activeItem[0].classList.remove('active');
		  }
		  this.classList.add('active');
		}
	}

})();
