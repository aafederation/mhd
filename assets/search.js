'use strict';

{{ $searchDataFile := printf "%s.search-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}
{{ $defaultLatLng := site.Params.defaultLatLng }}


(function () {
	const idForFilterResults = "#mhd-tiles-search-result";
  const input = Array.from(document.querySelectorAll('#book-search-input')).filter(x=>x.offsetParent)[0];
  const filterResults = document.querySelector(idForFilterResults);
  const originalResults = [];

	//mapboxgl related variables
	mapboxgl.accessToken = "pk.eyJ1IjoiYWJ0cm93IiwiYSI6ImNqejhtbTF2ajE4OTIzbm5samloN2p3MGYifQ.bwAHnbFp6KAZgUmpv3-f8A";
	let providers={
      "type": "FeatureCollection",
      "features": []
	};
	let map;

	//icons to show in the mapbox markers
	const iconURLs = {
	  hotels: '/img/icon/D9574Cu.png',
	  restaurants: '/img/icon/cqR6pUI.png',
	  activities: '/img/icon/WbMOfMl.png',
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

			//then show our all results
			showAllResults();
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
			card.feature = makeFeature(card);
			providers.features.push(card.feature);
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
		//1. first remove all the current results shown
    while (filterResults.firstChild) {
      filterResults.removeChild(filterResults.firstChild);
    }
		//1.a also hide all markers
		providers.features.forEach(
			(feature) => feature.markerEl.classList.remove(htfConfig.showMapClass)
		);

		//2.a if input string is empty
    if (!input.value) {
			//then just show all the results
			showAllResults()
			//and return
      return;
    }

    const searchHits = window.bookSearchIndex.search(input.value, 10);
		//2. then loop through the search hits 
    searchHits.forEach(
			function (page) {
				//append the card to the filter result element in the dom
				filterResults.appendChild(makeSearchResultCard(page));
    	}
		);
		//3. then re-calculate the filter
		htf.showCheckFromSearch();
  }


  /**
   * Function to show all the results
   */
  function showAllResults() {
		//1. first remove all the current results shown
    while (filterResults.firstChild) {
      filterResults.removeChild(filterResults.firstChild);
    }

		//2. then loop through the original result 
		originalResults.forEach( 
			(page) => {
				//and attach them to the filterResults
				filterResults.appendChild(makeSearchResultCard(page));
			}
		)
		//3. then re-calculate the filter
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
		let h3 = clone.querySelector("h3");
		let moreInfo = clone.querySelector("h4");
		let addressRow = clone.querySelector("#address-row");
		let address = clone.querySelector(".address");
		let services = clone.querySelector(".services");
		let clinicalServicesRow = clone.querySelector("#clinical-services-row");
		let nonClinicalServices = clone.querySelector(".non-clinical-services");
		let nonClinicalServicesRow = clone.querySelector("#non-clinical-services-row");
		let phoneRow = clone.querySelector("#phone-row");
		let phone = clone.querySelector(".phone");
		let emailRow = clone.querySelector("#email-row");
		let email = clone.querySelector(".email");
		let websiteRow = clone.querySelector("#website-row");
		let website = clone.querySelector(".website");
		let trainingsRow = clone.querySelector("#trainings-row");
		let trainings = clone.querySelector(".trainings");
		let credentialsRow = clone.querySelector("#credentials-row");
		let credentials = clone.querySelector(".credentials");
		let directions = clone.querySelector(".directions");
		let providerType = clone.querySelector(".provider-type");
		let providerHeader = clone.querySelector("#provider-header");

		h3.textContent = myPage.title;
		
		if (myPage.location.address) {
			address.textContent = myPage.location.address;
		} else addressRow.remove();

		if (myPage.location.services.length > 0) {
			services.textContent = myPage.location.services.join(", ");
		} else clinicalServicesRow.remove();
		if (myPage.location.non_clinical_services.length > 0) {
			nonClinicalServices.textContent = myPage.location.non_clinical_services.join(", ");
		} else nonClinicalServicesRow.remove();
		if (myPage.location.phone_number) {
			phone.textContent = myPage.location.phone_number;
		} else phoneRow.remove();
		if (myPage.email) {
			email.innerHTML = `<a href="mailto: ${myPage.email}" class="link-pointer" data-variant="invert" target="_blank">${myPage.email}</a>`
		} else emailRow.remove();
		if (myPage.website) {
			website.textContent = myPage.website;
			website.onclick = function () { window.open(myPage.website); };
		} else websiteRow.remove();
		if (myPage.location.trainings) {
			trainings.textContent = myPage.location.trainings;
		} else trainingsRow.remove();
		if (myPage.location.credentials && myPage.location.credentials.length > 0) {
			credentials.textContent = myPage.location.credentials.join(", ");
		} else credentialsRow.remove();
		if (['individual', 'individual-provider'].some(i => myPage.tag.includes(i))) {
			providerType.textContent = "Individual Provider";
			providerHeader.classList.add("bg-individual", "color-individual-invert");
		} else {
			providerType.textContent = "Organization";
			providerHeader.classList.add("bg-organization", "color-organization-invert");
		}

		mainDiv.classList.add("show-item");
		mainDiv.id = "listing-" + myPage.id;
		mainDiv.setAttribute("data-tag", myPage.tag);
		mainDiv.setAttribute("data-borough", myPage.borough);
		mainDiv.setAttribute("data-service", myPage.service);
		mainDiv.setAttribute("data-nonclinicalservice", myPage.nonClinicalService);
		mainDiv.setAttribute("data-staffgender", myPage.staffGender);
		mainDiv.setAttribute("data-ageGroup", myPage.ageGroup);
		mainDiv.setAttribute("data-specialty", myPage.specialty);
		mainDiv.setAttribute("data-type", myPage.type);
		mainDiv.setAttribute("data-language", myPage.language);
		mainDiv.setAttribute("data-payment", myPage.payment);
		mainDiv.setAttribute("data-adacompliance", myPage.ADAcompliance);
		moreInfo.onclick=function() {
			window.name="parent";
			window.open(myPage.href);
		};
		if (myPage.location.latLng) {
			h3.onclick = onClickGoToMap(myPage.id);
			directions.onclick=function() {window.open("https://www.google.com/maps/dir/?api=1&destination="+ myPage.feature.properties.mappingAddress);};
		} else {
			directions.remove();
			h3.setAttribute("data-variant", "disabled");
		}

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
	 	// const aafCoords = [-73.91511627368108, 40.69551604585044]; // Coords to show maximum service providers
	 	const aafCoords = [-75.90, 42.50]; // Coords to center of NY State

		map = new mapboxgl.Map({
			container: "map",
			center: aafCoords,
			zoom: 6, // starting zoom
			style: "mapbox://styles/mapbox/streets-v11", // mapbox has different styles
		});

    map.on('load', function (e) {
      /* Add the data to your map as a source */
			map.addSource('places', {
				type: "geojson",
				data: providers
			})

		  /* For each feature in the GeoJSON object above: */
		  providers.features.forEach(function(feature) {
		  	let marker = buildMarker("activities", feature)
		    marker.addTo(map);
		  });

			htf.showCheckFromSearch();

    });
	}

	/**
	 * buildMarker - builds and returns a marker 
	 * based on the type and coordinates passed as parameters
   */
	function buildMarker(type, feature) {
	  if (!iconURLs.hasOwnProperty(type)) {
	    type = 'activities';
	  }
	  const markerEl = document.createElement('div');
		markerEl.className = 'marker';
		if (feature.properties.showFeature === false) {
			markerEl.classList.add('hide-map');
		}
		markerEl.id = 'marker-' + feature.properties.id;
	  markerEl.style.backgroundImage = `url(${iconURLs[type]})`;
		markerEl.onclick = onClickGoToMap(feature.properties.id);

		feature.markerEl = markerEl;
	  return new mapboxgl.Marker(markerEl)
				.setLngLat(feature.geometry.coordinates);
	};

  /**
   * makeFeature - returns a json object 
	 * encoded as a GeoJson for mapbox
   * from the page parameter
   */
  function makeFeature(page) {
		let coords = '{{ $defaultLatLng }}';
		let showFeature = true;
		if(page.location.latLng) {
			coords = page.location.latLng.split(',');
		} else {
			coords = coords.split(',');
			showFeature = false;
		}
		
		const feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          coords[1].trim(),
          coords[0].trim()
        ]
      },
      "properties": {
        "id": page.id,
        "title": page.title,
        "href": page.href,
        "address": page.location.address,
				"mappingAddress": page.title + "+" + page.location.address + "+" + page.borough,
				 showFeature
      }
    }

		return feature;
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

	  var popup = new mapboxgl.Popup({ offset: 15, closeOnClick: false, focusAfterOpen:true, className:"red-tip" })
	    .setLngLat(currentFeature.geometry.coordinates)
	    .setHTML('<h3><a target="_blank" href="' + currentFeature.properties.href + '">' + currentFeature.properties.title + '</a></h3><br>' +
	      '<h4><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + currentFeature.properties.mappingAddress + '">' + currentFeature.properties.address + '</h4>')
	    .addTo(map);
	}

	/**
	 * onclick on the card that flies to the map
	 */
	function onClickGoToMap(pageId) {

		const clickedListing = providers.features[pageId];

		return function() {
  		flyToStore(clickedListing);

			setTimeout(() => {
				createPopUp(clickedListing);
			}, 500);

		  
			//var activeItem = document.getElementsByClassName('active');
		  //if (activeItem[0]) {
		  //  activeItem[0].classList.remove('active');
		  //}
		  //this.classList.add('active');
		}
	}

})();
