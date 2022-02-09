'use strict';

(function () {
  const indexCfg = {{ with i18n "bookSearchConfig" }}
    {{ . }};
  {{ else }}
   {};
  {{ end }}

  indexCfg.doc = {
    id: 'id',
    field: ['borough','language','service','specialty','type','nonClinicalService','title','tag','staffGender','ageGroup','content'],
    store: ['title', 'href', 'section', 'content', 'tag', 'borough', 'language', 'payment', 'ADAcompliance', 'location', 'website', 'service','specialty','type','nonClinicalService','staffGender','ageGroup','email'],
  };

  const index = FlexSearch.create('balance', indexCfg);
  window.bookSearchIndex = index;

	let indexCount = 0;

  {{- $pages := where .Site.Pages "Kind" "in" (slice "page" "section") -}}
  {{- $pages = where $pages "Params.booksearchexclude" "!=" true -}}

  {{ range $index, $page := $pages }}
		{{ range $location := $page.Params.locations}}
		  index.add({
		    'id': indexCount,
		    'href': '{{ $page.RelPermalink }}',
		    'title': {{ (partial "functions/title" $page) | jsonify }},
		    'section': {{ (partial "functions/title" $page.Parent) | jsonify }},
		    'content': {{ $page.Plain | jsonify }},
		    'email': {{ $page.Params.email | jsonify }},
				'tag': {{ with $page.Params.tags }}{{print `"`}}{{ range . }}{{ print . | replaceRE "[.]" "_" | urlize }}{{print " "}}{{ end }}{{print `"`}}{{ else }} {{ "no-tag" | jsonify }} {{ end }},
				'borough': {{ with $location.boroughs }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-borough" | jsonify}} {{ end }},
				'language': {{ with $location.languages }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-language"|jsonify}}{{ end }},
				'payment':  {{ with $page.Params.payment_types }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-payment"|jsonify}}{{ end }},
				'ADAcompliance': {{ with $page.Params.ada_compliant }}{{ . |urlize|jsonify }}{{ else }}{{ "false"|jsonify }}{{ end }},
				'location': {{ $location | jsonify }},
				'website': {{ with $page.Params.website }}{{ if not (hasPrefix (lower $page.Params.website) `http`) }}{{print `//` $page.Params.website | jsonify }}{{ else }}{{ $page.Params.website | jsonify }}{{ end }}{{ else }}""{{ end }},
				'service': {{ with $location.services }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-service" | jsonify}} {{ end }},
				'specialty': {{ with $location.psychotherapy_specialties }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-specialty" | jsonify}} {{ end }},
				'type': {{ with $location.psychotherapy_types }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-type" | jsonify}} {{ end }},
				'nonClinicalService': {{ with $location.non_clinical_services }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-nonClinicalService" | jsonify}}{{ end }},
				'staffGender': {{ with $location.staff_gender }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-staffGender" | jsonify}}{{ end }},
				'ageGroup':  {{ with $page.Params.age_groups }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-ageGroup"|jsonify}}{{ end }},
		  });
			indexCount++;
	  {{- end -}}
  {{- end -}}
})();
