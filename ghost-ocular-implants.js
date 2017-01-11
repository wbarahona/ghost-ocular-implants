//
// ----------------------------------------------------------------------
//                        GHOST OCULAR IMPLANTS
// ----------------------------------------------------------------------
// A jQuery plugin for Ghost Blog
// Written by: Willmer Barahona
// Contact: wbarahona1@gmail.com
// Website: http://wbarahona.me
// Repo: https://github.com/wbarahona/ghost-ocular-implants
// This plugin will help you find your posts using ghost built in
// API, you must however activate, the API on the ghost admin
// under Labs > Beta Features > Public API
// ----------------------------------------------------------------------
(function( $ ) {
    $.fn.ghostOcularImplants = function ( opts ) {
        var self = this; // well, this
        var internals = {}; // main constructor
        var $doc = $(document); // document cached
        var $body = $('body'); // body cached

        internals.postlist = [];
        internals.searchstring = '';
        internals.searchterms = '';
        internals.settings = $.extend({
            // Default values for the plugin
            resultBox: '#results',
            noresults: '<p>No post name or tags were found</p>',
            template: '<li><a href="{{url}}">{{title}} - tags: [ {{tags}} ] on {{date: MM-DD-YY}}</a></li>'
        }, opts);

        //
        // jQuery Cached vars
        // -------------------------------------------------------------
            var $searchForm = self.parent('form');
            var $searchInput = self;
            var $searchResults = $doc.find(internals.settings.resultBox) || $body;

        //
        // Get posts fn
        // --------------------------------------------------------
            internals.getposts = function () {
                var apiparams = {limit: 'all',  include: 'author,tags', filter: '(page:true,page:false)'};

                $.get(ghost.url.api('posts', apiparams)).done(function (response) {
                    internals.postlist = response.posts;
                });
            };

        //
        // Merge results by both concepts return unique results
        // --------------------------------------------------------
            internals.unique = function(array) {
                var unique = [];
                for (var i = 0; i < array.length; i += 1) {
                    if (unique.indexOf(array[i]) == -1) {
                        unique.push(array[i])
                    }
                }

                return unique;
            };

            internals.mergeResults = function (byTitle, byTag) {
                var arr = [];

                arr.push(byTitle);
                arr.concat(byTag);

                return internals.unique(arr)[0];
            };

        //
        // Empty results fn
        // --------------------------------------------------------
            internals.emptyResults = function () {
                $searchResults.empty();
            };

        //
        // Return post entity value
        // --------------------------------------------------------
            internals.objresolve = function(path, obj) {

                return path.split('.').reduce(function(prev, curr) {
                    return prev ? prev[curr] : undefined
                }, obj || self);
            };

        //
        // Return post tags list
        // --------------------------------------------------------
            internals.returnTagsList = function (post) {
                var taglist = '';
                var tagarr = post.tags;
                var tagsLen = post.tags.length;

                if (tagsLen <= 0) {
                    taglist = 'no tags';
                } else {
                    for (var i = 0; i < tagsLen; ++i) {
                        taglist += tagarr[i].name+', ';
                    }
                    taglist = taglist.slice(0, -2);
                }

                return taglist;
            };

        //
        // Return a pretty date defined by user
        // --------------------------------------------------------
            internals.returnPrettyDate = function (entity, post) {
                var prettydate = '';
                var StringPostdate = post.created_at;
                var DatePostdate = new Date(StringPostdate);
                var dateformat = entity.split(':')[1].slice(1);
                var dateFormatChunks = dateformat.split('-');
                var locale = 'en-us';
                var getDateFunctions = {
                    YY: function (date) {

                        return date.getFullYear().toString().substr(2,2);
                    },
                    YYYY: function (date) {

                        return date.getFullYear();
                    },
                    MM: function (date) {
                        var monthNum = date.getMonth() + 1;

                        if (monthNum < 10) monthNum = '0'+monthNum;

                        return monthNum;
                    },
                    MMM: function (date) {

                        return date.toLocaleString(locale, { month: 'long' });
                    },
                    DD: function (date) {
                        var dateNum = date.getDate();

                        if (dateNum < 10) dateNum = '0'+dateNum;

                        return dateNum;
                    }
                };

                for (var i = 0; i < dateFormatChunks.length; i++) {
                    prettydate += getDateFunctions[dateFormatChunks[i]](DatePostdate) + '-';
                }
                prettydate = prettydate.slice(0, -1);

                return prettydate;
            };

        //
        // Parse template and process it
        // --------------------------------------------------------
            internals.parseTemplate = function (templateStr, postentities) {
                var rx = /\{\{(.*?)\}\}/g;

                return templateStr.replace(rx, function(entity) {
                    var entityName = entity.slice(2,-2);

                    if (entityName === 'tags') {

                        return internals.returnTagsList(postentities);
                    } else if (entityName.includes('date')) {

                        return internals.returnPrettyDate(entityName, postentities);
                    } else {

                        return internals.objresolve(entityName, postentities);
                    }
                });
            };

        //
        // Build results fn
        // --------------------------------------------------------
            internals.buildResults = function (results) {
                var output = '';
                var resLen = results.merged.length;

                internals.emptyResults();
                if (results.merged.length <= 0 && internals.searchterms.length >= 1) {
                    $searchResults.html(internals.settings.noresults);
                } else {
                    for (var i = 0; i < resLen; ++i) {
                        output = internals.parseTemplate(internals.settings.template, results.merged[i]);
                        $searchResults.append(output);
                    }
                }
            };

        //
        // Setup search input listener
        // ------------------------------------------------------------
            internals.find = function (str) {
                var results = { byTitle: [], byTag: [], merged: [] };
                var postTags = [];
                var filteredTags = null;
                var filteredTitles = null;
                var keywords = [];
                var titleKeywords = [];

                keywords = str.split(' ');

                internals.searchstring = str;
                internals.searchterms = keywords;

                //
                // Find results by post title
                // --------------------------------------------------
                results.byTitle = internals.postlist.filter(function (post) {
                    titleKeywords = post.title.split(' ');
                    filteredTitles = titleKeywords.filter(function (titleWord) {
                        return keywords.indexOf(titleWord) >= 0;
                    });

                    return filteredTitles.length > 0;
                });

                //
                // Find results by post tag names
                // --------------------------------------------------
                results.byTag = internals.postlist.filter(function (post) {
                    postTags = post.tags;
                    filteredTags = postTags.filter(function (tag) {
                        return keywords.indexOf(tag.name) >= 0;
                    });

                    return filteredTags.length > 0;
                });

                results.merged = internals.mergeResults(results.byTitle, results.byTag);
                internals.buildResults(results);
            };

        //
        // Setup search input listener
        // ------------------------------------------------------------
            internals.setupSearchInput = function () {

                $searchForm.on('submit', function (event) {
                    event.preventDefault();
                });

                $searchInput.on('keyup', function (event) {
                    var $this = $(this);
                    var thisVal = $this.val();

                    event.preventDefault();

                    if (thisVal === '') {
                        internals.emptyResults();
                    } else {
                        internals.find(thisVal);
                    }
                });
            };

        //
        // Init the plugin
        // ------------------------------------------------------------
            internals.init = function () {
                internals.getposts();
                internals.setupSearchInput();
            };

        return internals.init();
    };
}( jQuery ));
