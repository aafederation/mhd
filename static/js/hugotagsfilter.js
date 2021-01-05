/**
 * @name 'Hugo Tags Filter'
 * @version 1.2.2
 * @license MIT
 * @author PointyFar
 */

class HugoTagsFilter {
	constructor(config) {
		var defaultFilters = [
			{
				name: "tag",
				prefix: "tft-",
				buttonClass: "tft-button",
				allSelector: "#tfSelectAllTags",
				attrName: "data-tags",
			},
			{
				name: "section",
				prefix: "tfs-",
				buttonClass: "tfs-button",
				allSelector: "#tfSelectAllSections",
				attrName: "data-section",
			},
		];

		this.FILTERS = config && config.filters ? config.filters : defaultFilters;
		this.showItemClass = config && config.showItemClass ? config.showItemClass : "tf-show";
		this.showMapClass = config && config.showMapClass ? config.showMapClass : "show-map";
		this.activeButtonClass = config && config.activeButtonClass ? config.activeButtonClass : "active";
		this.filterItemClass = config && config.filterItemClass ? config.filterItemClass : "tf-filter-item";
		this.counterSelector = config && config.counterSelector ? config.counterSelector : "selectedItemCount";
		this.readMore = config && config.readMore ? config.readMore : "read-more";

		this.populateCount = config && config.populateCount ? config.populateCount : false;
		this.setDisabledButtonClass = config && config.setDisabledButtonClass ? config.setDisabledButtonClass : false;

		this.filterItems = document.getElementsByClassName(this.filterItemClass);
		this.selectedItemCount = 0;
		this.itemsShown = 0;
		this.itemsToShow = 6;
		this.itemsToShowIncrement = this.itemsToShow;

		this.filterValues = {};

		this.showCheckFromSearch();
	}

	initFilterCount(fvc, isInitial) {
		/**
		 * Initialise count = selected
		 */
		if (isInitial) {
			for (var k in fvc) {
				for (var x = 0; x < this.filterItems.length; x++) {
					var attrs = this.getAttrs(k, this.filterItems[x]);
					for (var l = 0; l < attrs.length; l++) {
						fvc[k][attrs[l]].count++;
						fvc[k][attrs[l]].selected++;
					}
				}
			}
		} else {
			var showing = document.getElementsByClassName(this.showItemClass);
			for (var k in fvc) {
				for (var k2 in fvc[k]) {
					fvc[k][k2].selected = 0;
				}
			}
			for (var l = 0; l < showing.length; l++) {
				for (k in fvc) {
					var attrs = this.getAttrs(k, showing[l]);
					for (var m = 0; m < attrs.length; m++) {
						fvc[k][attrs[m]].selected++;
					}
				}
			}
		}

		return fvc;
	}

	populateCounters(fvc) {
		if (this.populateCount) {
			for (var i = 0; i < this.FILTERS.length; i++) {
				var fname = this.FILTERS[i]["name"];
				var cp = this.FILTERS[i]["countPrefix"];
				var sp = this.FILTERS[i]["selectedPrefix"];

				if (cp || sp) {
					for (var k in fvc[fname]) {
						if (cp) {
							var cel = document.getElementById(`${cp}${k}`);
							cel.textContent = fvc[fname][k].count;
						}
						if (sp) {
							var sel = document.getElementById(`${sp}${k}`);
							sel.textContent = fvc[fname][k].selected;
							if (this.setDisabledButtonClass) {
								if (sel.textContent == 0) {
									this.addClassIfMissing(
										document.getElementById(this.FILTERS[i]["prefix"] + k),
										this.setDisabledButtonClass
									);
								} else {
									this.delClassIfPresent(
										document.getElementById(this.FILTERS[i]["prefix"] + k),
										this.setDisabledButtonClass
									);
								}
							}
						}
					}
				}
			}
		}
	}

	/**
	 * getAttrs - returns an array of data-attr attributes of an element elem
	 */
	getAttrs(attr, elem) {
		return elem
			.getAttribute("data-" + attr)
			.split(" ")
			.filter(function (el) {
				return el.length > 0;
			});
	}

	showAll(filter) {
		for (var i = 0; i < this.FILTERS.length; i++) {
			if (filter) {
				if (this.FILTERS[i]["name"] === filter) {
					this.FILTERS[i]["selected"] = [];
				}
			} else {
				this.FILTERS[i]["selected"] = [];
			}
		}
		this.showCheck(filter);
	}

	checkFilter(tag, tagType) {
		/* Selects clicked button.*/
		var selectedBtn = document.querySelector(`#${tagType}${tag}`);

		for (var i = 0; i < this.FILTERS.length; i++) {
			if (this.FILTERS[i]["prefix"] === tagType) {
				if (this.FILTERS[i]["selected"].indexOf(tag) >= 0) {
					/* already selected, deselect tag */
					this.FILTERS[i]["selected"].splice(tag, 1);
					this.delClassIfPresent(selectedBtn, this.activeButtonClass);
				} else {
					/* add tag to selected list */
					this.FILTERS[i]["selected"].push(tag);
					this.addClassIfMissing(selectedBtn, this.activeButtonClass);
				}
				this.delClassIfPresent(document.querySelector(this.FILTERS[i]["allSelector"]), this.activeButtonClass);
				this.showCheck(this.FILTERS[i]["name"]);
			}
		}
	}

	/**
	 * showCheckFromSearch: Applies "show" class to items containing selected tags
	 * from the search api
	 */
	showCheckFromSearch() {
		this.filterItems = document.getElementsByClassName(this.filterItemClass);
		this.filterValues = {};
		this.selectedItemCount = 0;
		this.itemsShown = 0;

		for (var i = 0; i < this.FILTERS.length; i++) {
			this.FILTERS[i]["buttonTotal"] = document.getElementsByClassName(this.FILTERS[i]["buttonClass"]).length;
			this.FILTERS[i]["selected"] = [];
			this.FILTERS[i]["values"] = [];
			var fv = document.getElementsByClassName(this.FILTERS[i]["buttonClass"]);

			/**
			 * Build index of all filter values and their counts
			 */
			this.filterValues[this.FILTERS[i]["name"]] = [];
			for (var j = 0; j < fv.length; j++) {
				var v = fv[j].id.replace(this.FILTERS[i]["prefix"], "");
				this.filterValues[this.FILTERS[i]["name"]][v] = { count: 0, selected: 0 };
			}
		}

		this.showCheck(this.FILTERS[0]["name"], true);
	}

	/**
	 * showCheck - Applies "show" class to items containing selected tags
	 */
	showCheck(filter, isInitial) {
		/* If no tags/licenses selected, or all tags selected, SHOW ALL and DESELECT ALL BUTTONS. */
		for (var i = 0; i < this.FILTERS.length; i++) {
			if (this.FILTERS[i]["name"] === filter) {
				if (
					this.FILTERS[i]["selected"].length === 0 ||
					this.FILTERS[i]["selected"].length === this.FILTERS[i]["buttonTotal"]
				) {
					var iBtns = document.getElementsByClassName(this.FILTERS[i]["buttonClass"]);
					for (var j = 0; j < iBtns.length; j++) {
						this.delClassIfPresent(iBtns[j], this.activeButtonClass);
					}
					this.addClassIfMissing(document.querySelector(this.FILTERS[i]["allSelector"]), this.activeButtonClass);
				}
			}
		}

		this.selectedItemCount = 0;
		this.itemsShown = 0;
		this.showMoreResultsButton(false);

		for (var i = 0; i < this.filterItems.length; i++) {
			/* First remove "show" class */
			this.delClassIfPresent(this.filterItems[i], this.showItemClass);

			var visibility = 0;
			/* show item only if visibility is true for all filters */
			for (var j = 0; j < this.FILTERS.length; j++) {
				if (
					this.checkVisibility(
						this.FILTERS[j]["selected"],
						this.filterItems[i].getAttribute(this.FILTERS[j]["attrName"])
					)
				) {
					visibility++;
				}
			}
			/* Then check if "show" class should be applied */
			if (visibility === this.FILTERS.length) {
				if (!this.filterItems[i].classList.contains(this.showItemClass)) {
					this.selectedItemCount++;
					this.addClassIfMissing(this.filterItems[i], this.showItemClass);
				}
			}
		}

		if (document.getElementById(this.counterSelector)) {
			document.getElementById(this.counterSelector).textContent = `${this.selectedItemCount}`;
		}

		this.checkButtonCounts(isInitial);
		// check if show more results button needs to be called
		this.checkShowMoreResultsButton();
	}

	checkButtonCounts(isInitial) {
		this.filterValues = this.initFilterCount(this.filterValues, isInitial);
		this.populateCounters(this.filterValues);
	}

	/**
	 * checkVisibility - Tests if attribute is included in list.
	 */
	checkVisibility(list, dataAttr) {
		/* Returns TRUE if list is empty or attribute is in list */
		if (list.length > 0) {
			for (var v = 0; v < list.length; v++) {
				var arr = dataAttr.split(" ").filter(function (el) {
					return el.length > 0;
				});
				if (arr.indexOf(list[v]) >= 0) {
					return true;
				}
			}
			return false;
		} else {
			return true;
		}
	}

	addClassIfMissing(el, cn) {
		if (!el.classList.contains(cn)) {
			el.classList.add(cn);

			// this case is for the items being shown
			if (el.classList.contains(this.filterItemClass)) {
				//add show map class to marker
				const marker = this.getMarker(el);
				marker.classList.add(this.showMapClass);
				// hide items if result is more than items per page
				// then we will show the 'Fetch More' option here
				if (this.itemsShown >= this.itemsToShow) {
					el.classList.add(this.readMore);
					marker.classList.add(this.readMore);
				} else this.itemsShown++;
			}
			// this case is for filters
			else {
				// only if we are adding the active class
				if (cn.toLowerCase().trim() === "active") {
					// this case checks for the ALL vs the other options
					// check if element has selectAlltag
					if (
						el.getAttribute("id").substring(0, 9).trim().toLowerCase() ===
						this.FILTERS[0]["allSelector"].substring(1, 10).trim().toLowerCase()
					) {
						// do nothing if selectall
					} else {
						// if other options, then add the filter pill
						this.addPillButton(el);
					}
				}
			}
		}
	}

	delClassIfPresent(el, cn) {
		if (el.classList.contains(cn)) {
			el.classList.remove(cn);

			// this case is for the items being shown
			if (el.classList.contains(this.filterItemClass)) {
				el.classList.remove(this.readMore);

				//also handle the marker
				//1. first find the marker
				const marker = this.getMarker(el);
				//2. then remove the classes
				marker.classList.remove(this.showMapClass, this.readMore);
				//3. remove popups if they are up
				var popUps = document.getElementsByClassName("mapboxgl-popup");
				/** Check if there is already a popup on the map and if so, remove it */
				if (popUps[0]) popUps[0].remove();
			}
			// this case is for filters
			else {
				// only if we are removing the active class
				if (cn.toLowerCase().trim() === "active") {
					// this case checks for the ALL vs the other options
					// check if selectalltag
					if (
						el.getAttribute("id").substring(0, 9).trim().toLowerCase() ===
						this.FILTERS[0]["allSelector"].substring(1, 10).trim().toLowerCase()
					) {
						//do nothing if selectall
					} else {
						//if other options, then remove the filter pill
						const btnToRemove = document.getElementById("pill-" + el.getAttribute("id"));
						btnToRemove.remove();
					}
				}
			}
		}
	}

	/**
	 * function to return marker element from dom
	 * for a given element
	 * @param {el} the element for which to find the marker
	 */
	getMarker(el) {
		const markerId = `#marker-${el.id.split("-")[1]}`;
		const marker = document.querySelector(markerId);

		if (!marker) return document.createElement("div");
		return marker;
	}

	/**
	 * addPillButton - Put filter buttons on top
	 */
	addPillButton(el) {
		const filterId = el.getAttribute("id");
		const newBtnPrefix = "pill";
		const newBtnId = newBtnPrefix + "-" + filterId;
		const newBtnClassList = "button";
		const containerDivId = `#filter-refine-${newBtnPrefix}s`;
		const onClickFunc = el.getAttribute("onclick");

		const containerDiv = document.querySelector(containerDivId);
		const newBtn = document.createElement("button");
		const newBtnContent = document.createTextNode(filterId);

		newBtn.appendChild(newBtnContent);
		newBtn.classList.add(newBtnClassList);
		newBtn.setAttribute("data-size", newBtnPrefix);
		newBtn.setAttribute("id", newBtnId);
		newBtn.setAttribute("onclick", onClickFunc);

		containerDiv.appendChild(newBtn);
	}

	/**
	 * checkShowMoreResultsButton - call show more results button only if required
	 */
	checkShowMoreResultsButton() {
		// if the paginated items shown is less than the selected items
		// then display the show more results button
		if (this.itemsShown < this.selectedItemCount) this.showMoreResultsButton(true);
		else this.showMoreResultsButton(false);
	}

	/**
	 * showMoreResultsButton - to show or hide the show more results button
	 */
	showMoreResultsButton(flag) {
		const showMoreButton = document.getElementById("show-more-button");
		if (flag) {
			showMoreButton.classList.remove("hide-show-more-button");
		} else {
			showMoreButton.classList.add("hide-show-more-button");
		}
	}

	/**
	 * showMoreResults - paginate to show more results
	 */
	showMoreResults() {
		this.itemsToShow += this.itemsToShowIncrement;
		let newShowMoreCount = 0;

		// now loop through the filter items
		for (var i = 0; i < this.filterItems.length; i++) {
			// if item contains class to showitem and read-more
			if (
				this.filterItems[i].classList.contains(this.showItemClass) &&
				this.filterItems[i].classList.contains(this.readMore)
			) {
				// then up to the itemsToShowIncrement, remove the read-more class
				if (newShowMoreCount < this.itemsToShowIncrement) {
					this.filterItems[i].classList.remove(this.readMore);

					//also remove read-more from marker
					const marker = this.getMarker(this.filterItems[i]);
					marker.classList.remove(this.readMore);

					//now increment the counters
					newShowMoreCount++;
					this.itemsShown++;
				}
				// once the count is reached
				else {
					// check to see if show more results button needs to be show
					this.checkShowMoreResultsButton();
					// then exit from the function
					return;
				}
			}
		}

		// if function runs all the way through, then
		//check to see if show more results button still needs to be shown
		this.checkShowMoreResultsButton();
	}
}

window["HugoTagsFilter"] = HugoTagsFilter;
