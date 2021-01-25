'use strict';

(function () {
  const indexCfg = {{ with i18n "bookSearchConfig" }}
    {{ . }};
  {{ else }}
   {};
  {{ end }}

  indexCfg.doc = {
    id: 'id',
    field: ['borough','language','service','nonClinicalService','title','tag','content'],
    store: ['title', 'href', 'section', 'content', 'tag', 'borough', 'language', 'payment', 'ADAcompliance', 'location', 'website', 'service'],
  };

  const index = FlexSearch.create('balance', indexCfg);
  window.bookSearchIndex = index;

	let indexCount = 0;

  {{- $pages := where .Site.Pages "Kind" "in" (slice "page" "section") -}}
  {{- $pages = where $pages "Params.booksearchexclude" "!=" true -}}
  {{- $pages = where $pages "Content" "not in" (slice nil "") -}}

  {{ range $index, $page := $pages }}
		{{ range $location := $page.Params.locations}}
		  index.add({
		    'id': indexCount,
		    'href': '{{ $page.RelPermalink }}',
		    'title': {{ (partial "docs/title" $page) | jsonify }},
		    'section': {{ (partial "docs/title" $page.Parent) | jsonify }},
		    'content': {{ $page.Plain | jsonify }},
				'tag': {{ with $page.Params.tags }}{{print `"`}}{{ range . }}{{ print . | replaceRE "[.]" "_" | urlize }}{{print " "}}{{ end }}{{print `"`}}{{ else }} {{ "no-tag" | jsonify }} {{ end }},
				'borough': {{ with $location.boroughs }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-borough" | jsonify}} {{ end }},
				'language': {{ with $page.Params.languages }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-language"|jsonify}}{{ end }},
				'payment':  {{ with $page.Params.payment_types }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-payment"|jsonify}}{{ end }},
				'ADAcompliance': {{ with $page.Params.ada_compliant }}{{ . |urlize|jsonify }}{{ else }}{{ "false"|jsonify }}{{ end }},
				'location': {{ $location | jsonify }},
				'website': {{ with $page.Params.website }}{{ if not (hasPrefix (lower $page.Params.website) `http`) }}{{print `//` $page.Params.website | jsonify }}{{ else }}{{ $page.Params.website | jsonify }}{{ end }}{{ else }}""{{ end }},
				'service': {{ with $location.services }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-service" | jsonify}} {{ end }},
				'nonClinicalService': {{ with $location.non_clinical_services }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{" " | jsonify}}{{ end }},
		  });
			indexCount++;
	  {{- end -}}
  {{- end -}}
})();
