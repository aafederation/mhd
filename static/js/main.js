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
			name: "languages",
			prefix: "language-",
			buttonClass: "language-button",
			allSelector: "#selectAllLanguages",
			attrName: "data-languages",
			selectedPrefix: "slanguages-",
			countPrefix: "clanguages-",
		},
		{
			name: "payments",
			prefix: "payment-",
			buttonClass: "payment-button",
			allSelector: "#selectAllPayments",
			attrName: "data-payments",
			selectedPrefix: "spayments-",
			countPrefix: "cpayments-",
		},
		{
			name: "ADAcompliants",
			prefix: "ADAcompliant-",
			buttonClass: "ADAcompliant-button",
			allSelector: "#selectAllADAcompliants",
			attrName: "data-ADAcompliants",
			selectedPrefix: "sADAcompliants-",
			countPrefix: "cADAcompliants-",
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
