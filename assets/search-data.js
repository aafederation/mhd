'use strict';

(function () {
  const indexCfg = {{ with i18n "bookSearchConfig" }}
    {{ . }};
  {{ else }}
   {};
  {{ end }}

  indexCfg.doc = {
    id: 'id',
    field: ['title', 'content', 'tag', 'borough','language'],
    store: ['title', 'href', 'section', 'content', 'tag', 'borough', 'language', 'payment', 'ADAcompliance', 'locations', 'website'],
  };

  const index = FlexSearch.create('balance', indexCfg);
  window.bookSearchIndex = index;

  {{- $pages := where .Site.Pages "Kind" "in" (slice "page" "section") -}}
  {{- $pages = where $pages "Params.booksearchexclude" "!=" true -}}
  {{- $pages = where $pages "Content" "not in" (slice nil "") -}}

  {{ range $index, $page := $pages }}
  index.add({
    'id': {{ $index }},
    'href': '{{ $page.RelPermalink }}',
    'title': {{ (partial "docs/title" $page) | jsonify }},
    'section': {{ (partial "docs/title" $page.Parent) | jsonify }},
    'content': {{ $page.Plain | jsonify }},
		'tag': {{ with $page.Params.tags }}{{print `"`}}{{ range . }}{{ print . | replaceRE "[.]" "_" | urlize }}{{print " "}}{{ end }}{{print `"`}}{{ else }} {{ "no-tag" | jsonify }} {{ end }},
		'borough': {{ with $page.Params.boroughs }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-borough" | jsonify}} {{ end }},
		'language': {{ with $page.Params.languages }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-language"|jsonify}}{{ end }},
		'payment':  {{ with $page.Params.payment_types }}{{print `"`}}{{ range . }}{{ . | replaceRE "[.]" "_" | urlize }} {{ end }}{{print `"`}}{{ else }} {{"no-payment"|jsonify}}{{ end }},
		'ADAcompliance': {{ with $page.Params.ada_compliant }}{{ . |urlize|jsonify }}{{ else }}{{ "false"|jsonify }}{{ end }},
		'locations': {{ $page.Params.locations | jsonify }},
		'website': {{ $page.Params.website | jsonify }},

  });
  {{- end -}}
})();
