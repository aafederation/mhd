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
		{
			name: "ADAcompliance",
			prefix: "ADAcompliance-",
			buttonClass: "ADAcompliance-button",
			allSelector: "#selectAllADAcompliance",
			attrName: "data-ADAcompliance",
			selectedPrefix: "sADAcompliance-",
			countPrefix: "cADAcompliance-",
		},
	],
	showItemClass: "show-item",
	filterItemClass: "tf-filter-item",
	activeButtonClass: "active",
	counterSelector: "selectedItemCount",
	populateCount: true,
	setDisabledButtonClass: "disable-button",
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
