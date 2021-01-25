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
		panel.style.maxHeight = panel.scrollHeight + "px";
	}
}

(function () {
	let x = document.getElementById("psychotherapy-options");

	let psychotherapy = document.getElementById("service-psychotherapy");
	psychotherapy.addEventListener("click", handleVis);

	function handleVis() {
		if (x.style.display === "none") {
			x.style.display = "block";
			let psychotherapyPill = document.getElementById(
				"pill-service-psychotherapy"
			);
			psychotherapyPill.addEventListener("click", toggleVis);
		} else {
			x.style.display = "none";
		}
	}

	function toggleVis() {
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}
})();
