/*
 * SuperTag v3.13.2
 * http://supert.ag
 *
 * Copyright (c) 2018 SuperTag Pty Ltd.
 *
 * Date: 22-03-2018 16:52:36 +1100 (Thu, 22 Mar 2018)
 */
(function (window, document, superT, st_undefined) {

    /**!
    * The company to which this SuperTag belongs.
    *
    * @property {String} company
    * @public
    */
    superT.company = "anz";

    /**!
    * The project to which this SuperTag belongs.
    *
    * @property {String} project
    * @public
    */
    superT.project = "anz-com-au";

    /**!
    * The sites within the project.
    *
    * @property {Array} sites
    * @public
    */
    superT.sites = ["pubdev1.bne3-0945d.server-web.com/", "aemlive1-aut1.a1.nonprod.w50v35m6fl.com/personal/credit-cards/", "www.anz.com.au/personal/", "www.anz.com.au/personal/credit-cards/"];

    /**!
    * The brand keywords within the project.
    *
    * @property {Array} brandKeywords
    * @public
    */
    superT.brandKeywords = ["anz"];

    /**!
    * The URL campaign query parameter.
    *
    * @property {String} campaignQueryParameter
    * @public
    */
    superT.campaignQueryParameter = "cid";

    //###- Beginning of the conditional modules section

    //###- Module #80 () -###
    superT.an = {
        /**!
         * The executed tags.
         *
         * Each item in the array is the tag ID of the executed tag.
         *
         * Note: this can be stored in an array because the tag ID is not
         * used as an index into the array, but simply a plain
         * string/integer value pushed onto the array.
         *
         * @property {Array} tags
         * @private
         */
        tags: [],

        /**!
         * The executed containers.
         *
         * Each item in the array is the container ID of the executed
         * container.
         *
         * Note: this can be stored in an array because the container ID is
         * not used as an index into the array, but simply a plain
         * string/integer value pushed onto the array.
         *
         * @property {Array} containers
         * @private
         */
        containers: [],
        /**!
         * The executed rule tags.
         *
         * Each item in the array is a rule tag object.
         *
         * Note: this can be stored in an array because the rule tag is not
         * used as an index into the array, but simply an object pushed onto
         * the array.
         *
         * @property {Array} rules
         * @private
         */
        rules: [],
        /**!
         * The monitored tags matrix.
         *
         * The property name "mtm" is short for "monitored tags matrix".
         *
         * Each row in the matrix is the tag ID of the monitored tag, and
         * along with each row are the properties "start" and "finish" which
         * represent the start and finish time (in milliseconds) of the tag,
         * respectively.
         *
         * Note: this should not be stored in an array since tag IDs will
         * cause the array to substantially large.
         *
         * @property {Object} mtm
         * @private
         */
        mtm: {},

        pushTag: function (tagId) {
            superT.an.tags.push(tagId);
        },

        pushContainer: function (containerId) {
            superT.an.containers.push(containerId);
        },

        startMonitoring: function (id, key) {
            st_tagFiredIds.push(id);
            if (typeof key === st_undefined) {
                key = id;
            }

            superT.an.mtm[key] = {
                "start": new Date().getTime()
            };

            return true;
        },

        finishMonitoring: function (key) {
            if (typeof superT.an.mtm[key] !== st_undefined) {
                superT.an.mtm[key].end = new Date().getTime();
            }

        }
    };

    //###- Module #81 () -###
    superT.tagFiredIds = []; // If error the last tag is probably where the error is
    var st_tagFiredIds = superT.tagFiredIds;

    superT.fireTag = function (tagId, fn, calleeArguments, context, dontPush) {
        if (!dontPush) st_tagFiredIds.push(tagId);
        try {
            return fn.apply(context ? context : this, calleeArguments ? calleeArguments : []);
        } catch (err) {
            typeof superT.processError == 'function' && superT.processError(err, tagId, 1);
            throw err;
        }
    }

    superT.fireBaseContainer = function (tagId, key, fn, multiple) {
        if (typeof superT.an.mtm[key] !== st_undefined && !multiple) {

            return;
        }

        superT.an.startMonitoring(tagId, key);
        superT.fireTag(tagId, fn, null, null, 1);
        superT.an.finishMonitoring(key);
    }

    //###- Module #55 () -###
    /**
         * Determines if the first string, *a*, starts with the second string, *b*.
         *
         * The function is read "*a* starts with *b*".
         *
         * @param {String} a The first string.
         * @param {String} b The second string.
         * @param {Boolean} [lower] Modify to lower case both a and b.
         *
         * @return {Boolean} True if a starts with b, otherwise false.
         *
         * @apidoc superT.startsWith
         */
    superT.startsWith = function (a, b, lower) {
        if (typeof a !== "string" || typeof b !== "string") {
            return false;
        }

        return (lower || 0) ? superT.toLC(a).indexOf(superT.toLC(b)) === 0 : a.indexOf(b) === 0;
    };

    /**
     * Determines if the first value, *a*, equals to the second value, *b*.
     * Use non-strict comparison inside.
     *
     * @param {String} a The first value.
     * @param {String} b The second value.
     * @param {Boolean} [lower] Modify to lower case both a and b (will be applied on strings only).
     *
     * @return {Boolean} True if a starts with b, otherwise false.
     *
     * @apidoc superT.eql
     */
    superT.eql = function (a, b, lower) {
        var a = lower || 0 ? superT.toLC(a) : a, b = lower ? superT.toLC(b) : b;

        return a == b;
    };

    /**
     * Determines if the first string, *a*, ends with the second string, *b*.
     *
     * The function is read "*a* ends with *b*".
     *
     * @param {String} a The first string.
     * @param {String} b The second string.
     * @param {Boolean} [lower] Modify to lower case both a and b (will be applied on strings only).
     *
     * @return {Boolean} True if a ends with b, otherwise false.
     *
     * @apidoc superT.endsWith
     */
    superT.endsWith = function (a, b, lower) {
        var a = lower ? superT.toLC(a) : a,
            b = lower ? superT.toLC(b) : b,
            i = (a ? a.length : 0),
            j = (a ? b.length : 0),
            result = i >= j;

        while (result && i-- && j-- && (result = a.charAt(i) === b.charAt(j)));

        return result;
    };

    //###- Module #56 () -###
    /**
     * Determines if the second string, `needle`, is found in the first string,
     * `hayStack`.
     *
     * The function is read "hay stack contains needle".
     *
     * If the `hayStack` is an array, then the array contains method is performed.
     *
     * @param {String/Array} hayStack The hay stack to search in.
     * @param {String/Mixed} needle The needle to search for.
     * @param {Boolean} [lower] Modify to lower case both haystack and needle.
     *
     * @return {Boolean} True if the needle is found within the hay stack; otherwise false.
     *
     * @apidoc  superT.contains
     */
    superT.contains = function (hayStack, needle, lower) {
        if (!superT.isNotEmpty(hayStack) || !superT.isNotEmpty(needle)) {
            return false;
        } else if (superT.isArray(hayStack)) {
            return superT.Array.contains(hayStack, needle, lower);
        } else if (lower || 0) {
            return superT.toLC(hayStack).indexOf(superT.toLC(needle)) !== -1;
        } else {
            return hayStack.indexOf(needle) !== -1;
        }
    };

    /**!
     * Determines if the second string, `needle`, is NOT found in the first string,
     * `hayStack`.
     *
     * The function is read "hay stack does not contain needle".
     *
     * If the `hayStack` is an array, then the array does not contains method is
     * performed.
     *
     * @param {String/Array} hayStack The hay stack to search in.
     * @param {String/Mixed} needle The needle to search for.
     * @param {Boolean} [lower] Modify to lower case both haystack and needle.
     *
     * @return {Boolean} True if the needle is NOT found within the hay stack; otherwise false.
     *
     * @apidoc  superT.doesNotContain
     */
    superT.doesNotContain = function (hayStack, needle, lower) {
        return !superT.contains(hayStack, needle, lower);
    };

    //###- Module #57 () -###
    superT.an.pushRule = function (ruleTag) {
        if (typeof ruleTag === 'number') { ruleTag = { id: ruleTag } }
        superT.an.rules.push(ruleTag);
    };

    //###- Module #63 () -###
    /**!
     * Generates an ID based on the current timestamp and a random number.
     *
     * @return {String} The ID containing the timestamp and a random number separated by a period.
     */
    superT.genId = function () {
        var t = new Date().getTime(),
        rand = Math.floor(Math.random() * 1000000),
        id = t + "." + rand;

        return id;
    };

    //###- Module #66 () -###
    /**
     * Gets the cookie with provided `cookieName`.
     *
     * @param {String} cookieName The name of the cookie.
     * @param {String} [flags] Modificator for regexp which will be used to find cookie
     *
     * @return {String}
     *
     * @apidoc superT.getCookie
     */
    superT.getCookie = function (cookieName, flags) {
        var c = new RegExp(cookieName + '=([^;]+)', flags);
        var m = c.exec(document.cookie || '');
        return (m && unescape(m[1])) || '';
    };

    //###- Module #67 () -###
    /**
     * Add days to a date or the current date. Can add less than 1 day
     * @param nbDays int float (could be in a string)
     * @param startDate optional now() by default
     * Known issue : if argDate is a invalid string and start by a number, this number will be used.
     */
    superT.getExpiryDate = function (nbDays, startDate) {
        var expireDate = null, expireDays;

        // Figure out the date
        if (typeof nbDays === 'string') {
            parsedArgDate = parseFloat(nbDays);
            if (isNaN(parsedArgDate)) { // Couldn't get a number from this string - just make it a session cookie.
                expireDate = null;
            } else {
                expireDays = parsedArgDate;
            }

        } else if (typeof nbDays === 'number' || typeof nbDays === 'float') {
            // This is the most correct old usage - use it as a number of days in the future
            expireDays = nbDays;
        } else if (typeof nbDays === 'undefined') {
            expireDate = null;
        }

        if (typeof expireDays != 'undefined' && expireDays !== null) {
            if (!startDate) {
                var startDate = new Date();
            }
            // 1440 min/day | 60000 millisecond = 1000*60s = 1min
            expireDate = new Date(startDate.getTime() + expireDays * 1440 * 60000);
        }

        return expireDate;
    };

    /**
     * Get primary domain
     */
    superT.getPrimaryDomain = function () {
        var primary,
            domain = document.domain,
            dom = domain.split('.'),
            len = dom.length,
            concatDom = '',
            defined;

        while (len--) {
            if (typeof dom[len] != 'undefined') {
                concatDom = '.' + dom[len] + concatDom;
                document.cookie = 'superT_te=1; domain=' + concatDom;
                defined = document.cookie.match(/superT_te=1;?/) !== null;
                document.cookie = 'superT_te=; domain=' + concatDom + '; expires=' + new Date(0);

                if (defined) {
                    primary = concatDom;
                    break;
                }
            }
        }

        return primary;
    }

    /**
     * Sets cookie.
     *
     * Third argument options:
     *
     *  - 0 || -1 will delete the cookie
     *  - nothing || null || undefined will set a session cookie
     *  - 1 will set for 1 day
     *  - <1 will set for some hours or minutes
     *
     * @param {String} cookieName The name of the cookie to set.
     * @param {String} value The value of the cookie to set.
     * @param {Date|Number} [dateOrExpireDays] Optional date when cookie will expired or number of the days while cookie will live, default session
     * @param {String} [domain] Domain to attempt to set the cookie for (eg .mysite.com).
     *
     * @return {undefined}
     *
     * @apidoc superT.setCookie
     */
    superT.setCookie = function (cookieName, value, dateOrExpireDays, domain) {
        var cookie = "";

        // Use custom domain if provided, else fall back to the highest level domain (default) or the current domain (with the project setting 'set_cookie_for_subdomains' on)
        domain = domain || superT.getPrimaryDomain();

        if (dateOrExpireDays instanceof Date) {
            expireDate = dateOrExpireDays;
        } else {
            expireDate = superT.getExpiryDate(dateOrExpireDays);
        }

        cookie += cookieName + "=" + escape(value);

        if (domain) {
            cookie += ";domain=" + domain;
        }

        cookie += ";path=/" + (expireDate === null ? "" : ";expires=" + expireDate.toGMTString());
        document.cookie = cookie;
    };

    //###- Module #70 () -###
    /**
     * Gets the query parameter with the given key from the URL.
     * If the given key is `undefined` or `null`, an empty string will be returned.
     *
     * If the URL is not given, window.location.href is used.
     *
     * @param {String} key The key of the query parameter to retrieve.
     * @param {String} url The URL from which to retrieve the query parameter. Default to window.location.href.
     *
     * @return {String} The value of the query parameter, if it exists; otherwise an empty string.
     * @apidoc superT.gqp
     */
    superT.gqp = function (key, url) {
        var result = "";

        if (key !== undefined && key !== null) {
            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            url = url || window.location.href;

            var regexS = "[\\?&]" + key + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(url);

            if (results !== null) {
                result = results[1];
            }
        }

        return result;
    };

    //###- Module #48 () -###
    /*#!
     * Copies all the properties of config to the specified object.
     *
     * @param {Object} object The receiver of the properties.
     * @param {Object} config The source of the properties.
     * @param {Object} defaults A different object that will also be applied for default values.
     * @return {Object} Returns object
     */
    superT.apply = function (object, config, defaults) {
        if (defaults) {
            superT.apply(object, defaults);
        }

        if (object && typeof config === "object") {
            for (var i in config) {
                object[i] = config[i];
            }
        }

        return object;
    };

    //###- Module #58 () -###
    /**!
         * @class superT.Object
         *
         * A set of useful static methods to deal with objects.
         *
         * @class superT.Object
         * @singleton
         */
    superT.Object = {
        /**!
         * Iterate through an object and invoke the given callback function for
         * each iteration. The iteration can be stopped by returning `false` in
         * the callback function. For example:

        var person = {
            name: "Jacky"
            hairColor: "black"
            loves: ["food", "sleeping", "wife"]
        };

        superT.Object.each(person, function(key, value, myself) {
            console.log(key + ":" + value);

            if (key === "hairColor") {
                return false; // stop the iteration
            }
        });

         * @param {Object} object The object to iterate
         * @param {Function} fn The callback function. Passed arguments for each iteration are:

            - {String} `key`
            - {Mixed} `value`
            - {Object} `object` The object itself

         * @param {Object} scope (Optional) The execution scope (`this`) of the callback function
         */
        each: function (object, fn, scope) {
            for (var property in object) {
                if ("function" === typeof object.hasOwnProperty && object.hasOwnProperty(property)) {
                    if (fn.call(scope || object, property, object[property], object) === false) {
                        return;
                    }
                }
            }
        },
        isEmpty: function (obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        }
    };

    //###- Module #59 () -###
    /**!
     * @class superT.Array
     *
     * A set of useful static methods to deal with arrays.
     *
     * @class superT.Array
     * @singleton
     */
    superT.Array = {
        /**
         * Iterates an array or an iterable value and invoke the given callback
         * function for each item.
         *
         *     var countries = ["Vietnam", "Singapore", "United States", "Russia"];
         *
         *     superT.Array.each(countries, function(name, index, countriesItSelf) {
         *         console.log(name);
         *     });
         *
         *     var sum = function() {
         *         var sum = 0;
         *
         *         superT.Array.each(arguments, function(value) {
         *             sum += value;
         *         });
         *
         *         return sum;
         *     };
         *
         *     sum(1, 2, 3); // returns 6
         *
         * The iteration can be stopped by returning false in the function callback.
         *
         *     superT.Array.each(countries, function(name, index, countriesItSelf) {
         *         if (name === "Singapore") {
         *             return false; // break here
         *         }
         *     });
         *
         * @param {Array/NodeList/Mixed} array The value to be iterated. If this
         * argument is not iterable, the callback function is called once.
         * @param {Function} fn The callback function. If it returns false, the iteration stops and this method returns
         * the current `index`. Arguments passed to this callback function are:
         *
         * - `item`     : Mixed - The item at the current `index` in the passed `array`
         * - `index`    : Number - The current `index` within the `array`
         * - `allItems` : Array/NodeList/Mixed - The `array` passed as the first argument to `superT.Array.each`
         *
         * @param {Object} [scope] The scope (`this` reference) in which the specified function is executed.
         * @param {Boolean} [reverse] Reverse the iteration order (loop from the end to the beginning); defaults false.
         *
         * @return {Boolean} See description for the `fn` parameter.
         *
         * @apidoc superT.Array.each
         */
        each: function (array, fn, scope, reverse) {
            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            } else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        /**!
         * Checks whether or not the given `array` contains the specified `item`.
         *
         * @param {Array} array The array to check.
         * @param {Mixed} item The item to look for.
         *
         * @return {Boolean} True if the array contains the item, false otherwise.
         */
        contains: function (array, item) {
            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        /**!
         * Checks if provided value is an array
         *
         * @param value mixed
         */
        isArray: function (value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        },

        /**!
         * Checks if provided value is iterable
         *
         * @param value mixed
         */
        isIterable: function (value) {
            var type = Object.prototype.toString.call(value);
            return type === '[object Array]' || type === '[object HTMLCollection]' || type === '[object NodeList]'
        }
    };

    //###- Module #61 () -###
    /**!
     * Sluggises the given string.
     *
     * The method name "ssb" is short for "string slug builder".
     *
     * The method removes all characters from the given string,
     * excluding alphanumeric, underscores, periods and hyphens.
     *
     * The method also changes the case of the given string to lower.
     *
     * All white space in the string is replaced with a hypen "-".
     *
     * If the given string is undefined or null or empty, it is returned
     * unmodified.
     *
     * @param {String} str The string to sluggise.
     *
     * @return {String} The slugised string if not undefined; otherwise the original string.
     */
    superT.an.ssb = function (str) {
        if (str !== undefined && str !== null && str !== "") {
            str = str.replace(/(\s+)/g, "-").replace(/[^0-9a-zA-Z_\-\.]/g, "").toLowerCase();
        }

        return str;
    };

    //###- Module #64 () -###
    /**
     * Returns original value if not string or lower cased value if string
     *
     * @param {Mixed} val Original value
     * @return {Mixed} The same type as first argument
     */
    superT.toLC = function (val) {
        return 'string' === typeof val ? val.toLowerCase() : val;
    }

    //###- Module #65 () -###
    /**!
     * Returns true if the passed value is a JavaScript Array, false otherwise.
     *
     * @param {Mixed} target The target to test
     * @return {Boolean}
     * @method
     */
    superT.isArray = ("isArray" in Array) ? Array.isArray : function (value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };

    superT.isDefinedNotNull = function (str) {
        return typeof str !== 'undefined' && str !== null;
    };

    superT.isNotEmpty = function (str) {
        return superT.isDefinedNotNull(str) && str !== "";
    }

    //###- Module #45 () -###
    /**
     * Binds event handler to the given element
     *
     * Examples:
     *
     *      superT.bind(theElement, "click", function(e) {
     *          // Handle click
     *          // this will contain link to the element
     *      });
     *
     *      superT.bind(window, "load", function(e) {
     *          // Handle onload
     *      });
     *
     * @param {HTMLElement} elem The element to which the event ought to be bound.
     * @param {String} type The event to bind.
     * @param {Function} fn The function that receives the event notification.
     * @param {Boolean} [useCapture] If true, useCapture indicates that the user wishes to initiate capture. Defaults to false if not provided.
     *
     * @return {undefined}
     *
     * @apidoc superT.bind
     */
    superT.bind = function (elem, type, fn, useCapture) {
        if (elem !== undefined && elem !== null) {
            // In case of bind onload event on window after onload. superT.isReady will be undefined the first time
            if (elem === window && "load" === type && true === superT.isReady) {
                fn();
            } else {
                // For non IE browser, addEventListener passe event by default to the handler, within the handler this = elem
                if (elem.addEventListener) {
                    useCapture = useCapture || false;
                    elem.addEventListener(type, fn, useCapture);
                    // For IE set this and pass the event to the handler
                } else if (elem.attachEvent) {
                    elem.attachEvent("on" + type, function () {
                        /*
                         * Arguments of call :
                         * first will become this in fn event.srcElement = elem
                         * second argument will become the first argument function(event)
                         */
                        fn.call(event.srcElement, event);
                    });
                }
            }
        }
    };

    var loadFn = [],
    isLoaded = superT.isReady = false;
    /**
     * Delay function execution until window is loaded. If window.load was dispatched before
     * all functions are invoked immediately.
     *
     * Examples:
     *
     *      superT.whenLoad(function() {
     *          // function body
     *      });
     *
     * @param {Function} fn The handler function executed when window is loaded
     *
     * @return {undefined}
     *
     * @apidoc superT.whenLoad
     */
    superT.whenLoad = function (callback, tagId) {
        var fn = function () {
            superT.fireTag(tagId, function () {
                callback();
            })
        };
        if (isLoaded) {
            fn();
        } else {
            loadFn.push(fn);
        }
    }

    // JQuery 1.11.0 https://github.com/jquery/jquery/blob/1.11.0/src/core/ready.js

    function load() {
        // Abort if we're already loaded
        if (isLoaded) {
            return;
        }

        // Remember that the page is loaded
        isLoaded = superT.isReady = true;
        for (var i = 0; i < loadFn.length; i++) {
            loadFn[i]();
        }
        loadFn = null;
    }

    if (document.readyState === "complete") {
        load();

        // Standards-based browsers support DOMContentLoaded
    } else {

        function loaded() {
            // Clean-up method for load events
            if (document.addEventListener) {
                window.removeEventListener("load", loaded, false);
            } else {
                window.detachEvent("onload", loaded);
            }
            load();
        }

        superT.bind(window, 'load', loaded)
    }

    //###- Module #8 () -###
    superT.pushActivityTag = function (options) {

        if (options.monitor) {
            superT.an.startMonitoring(options.id);
        }

        // build params

        var params = superT.doubleClickParams || {},
          toStr = function (params) {
              var ret = '';

              superT.Object.each(params, function (key, value) {
                  if (value && value.toString) {
                      ret += ";" + key + "=" + value.toString().replace(/[^a-zA-Z0-9\.\-_]/g, '');
                  }
              });

              return ret;
          };

        superT.apply(params, {
            src: options.advertiserId,
            type: options.type,
            cat: options.cat,
            qty: options.qty,
            cost: options.cost,
            ord: options.orderId,
            num: options.num
        });
        options.params && superT.apply(params, options.params);

        var cont = document.createElement("div"),
          iframe = document.createElement("iframe"),
          src = "https://" + params.src + ".fls.doubleclick.net/activityi";

        cont.setAttribute("style", "display:none");
        cont.setAttribute("id", superT.genId());
        cont.style.display = "none";

        if (options.monitor) {
            superT.bind(iframe, "load", function () {
                superT.an.finishMonitoring(options.id);
            });
        }

        iframe.setAttribute("src", src + toStr(params));
        cont.appendChild(iframe);
        document.getElementsByTagName('body')[0].appendChild(cont);
    }

    //###- Module #17 () -###
    var readyFn = [],
        isReady = false,
        isReadyBound = false;

    /**
     * Delay function execution until DOM content is loaded. If the document's ready state
     * is already "complete", all function are invoked immediately.
     *
     * @param {Function} fn The handler function executed when DOM content is loaded
     *
     * @return {undefined}
     *
     * @apidoc superT.whenReady
     */
    superT.whenReady = function (fn) {
        if (typeof fn !== "function") {
            return;
        }

        if (isReady || superT.isReady) {
            fn();
        } else {
            readyFn.push(fn);

            if (!isReadyBound) {
                isReadyBound = true; // Do it once

                // Handle when the DOM is ready
                function ready() {

                    // Abort if we're already ready
                    if (isReady) {
                        return;
                    }

                    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if (!document.body) {
                        return setTimeout(ready);
                    }

                    // Remember that the DOM is ready
                    isReady = true;
                    for (var i = 0; i < readyFn.length; i++) {
                        readyFn[i]();
                    }
                    readyFn = null;
                }

                // The ready event handler and self cleanup method
                function completed() {
                    if (isReady) {
                        return;
                    }
                    // readyState === "complete" is good enough for us to call the dom ready in oldIE
                    if (document.addEventListener || event.type === "load" || document.readyState === "complete") {
                        detachReady()
                        ready();
                    }
                }

                // Clean-up method for dom ready events
                function detachReady() {
                    if (document.addEventListener) {
                        document.removeEventListener("DOMContentLoaded", completed, false);

                    } else {
                        document.detachEvent("onreadystatechange", completed);
                    }
                }

                if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", completed, false); // Use the handy event callback

                    // If IE event model is used
                } else {
                    // Ensure firing before onload, maybe late but safe also for iframes
                    document.attachEvent("onreadystatechange", completed);

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var top = false;

                    try {
                        top = window.frameElement == null && document.documentElement;
                    } catch (e) { }

                    if (top && top.doScroll) {
                        (function doScrollCheck() {
                            if (isReady) {
                                try {
                                    // Use the trick by Diego Perini
                                    // http://javascript.nwbox.com/IEContentLoaded/
                                    top.doScroll("left");
                                } catch (e) {
                                    return setTimeout(doScrollCheck, 50);
                                }

                                // detach all dom ready events
                                detachReady();

                                // and execute any waiting functions
                                ready();
                            }
                        })();
                    }
                }
                // A fallback to window.onload, that will always work
                // Catch cases where onReady() called after the browser event has already occurred.
                // we once tried to use readyState "interactive" here, but it caused issues like the one
                // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
                superT.whenLoad(completed);
            }
        }
    };

    //###- Module #53 () -###
    /**!
     * Setup "superT.path" to be empty by default.
     */
    superT.path = [];
    superT.an.d1 = superT.an.d2 = superT.an.d3 = "";

    /**!
     * Set the top and second level directories.
     */
    if (window.location.pathname.length > 3) {
        superT.path = window.location.pathname.split("/");

        /**!
         * Now, use the slug function to build directory slugs for the three
         * top level directories.
         *
         * Note: after these statements are executed, both superT.an.d* and
         * superT.path will not contain the original directory strings, but a
         * slugised version.
         */
        superT.an.d1 = superT.path[1] = superT.an.ssb(superT.path[1]);
        superT.an.d2 = superT.path[2] = superT.an.ssb(superT.path[2]);
        superT.an.d3 = superT.path[3] = superT.an.ssb(superT.path[3]);

    }

    //###- Module #95 () -###
    ;
    (typeof window.localStorage == 'undefined') && (function (global) {
        function Storage() { }

        Storage.prototype = {
            clear: function () {
                getKeys(this).forEach(this.removeItem, this);
            },
            constructor: Storage,
            getItem: function () {
                var key = String(arguments[0]);

                return key in this ? this[key] : null;
            },
            key: function () {
                var index = parseInt(arguments[0], 10) || 0;

                return getKeys(this)[index] || null;
            },
            removeItem: function () {
                var key = String(arguments[0]);

                for (key in this) {
                    delete this[key];

                    --this.length;
                }

                updateKeys();
            },
            setItem: function () {
                var key = String(arguments[0]), value = String(arguments[1]);

                if (!(key in this)) {
                    ++this.length;
                }

                this[key] = value;

                updateKeys();
            }
        };

        function getKeys(object) {
            var buffer = [], key;

            for (key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key) && key !== 'length') {
                    buffer.push(key);
                }
            }

            return buffer;
        }

        function updateKeys() {
            var unloadkeys = keys;

            keys = getKeys(localStorage);

            unloadkeys.concat(keys).forEach(function (key) {
                if (key in localStorage) {
                    element.setAttribute(userdata + key, localStorage[key]);
                } else {
                    element.removeAttribute(userdata + key);
                }
            });

            element.setAttribute(userdata, keys.join(','));

            element.save(userdata);
        }

        if (!global.localStorage) {
            var
            // <Global>.localStorage
            localStorage = global.localStorage = new Storage(),
            // set storage element
            element = global.document.lastChild.lastChild.appendChild(global.document.createElement('x-local-storage')),
            // set userdata key and prefix
            userdata = 'userdata',
            keys;

            // proprietary ie local storage
            try {
                element.addBehavior('#default#' + userdata);
                element.load(userdata);
            } catch (error) { }

            // get keys
            keys = element.getAttribute(userdata) ? element.getAttribute(userdata).split(',') : [];

            localStorage.length = keys.length;

            // assign keys to localStorage
            keys.forEach(function (key) {
                localStorage[key] = element.getAttribute(userdata + key);
            });

            global.attachEvent('onunload', updateKeys);
        }
    })(window);

    //###- Module #23 () -###
    /**
     * Selects element matching the given selector.
     *
     * Example:
     *
     *     var theElement = superT.select("#theElementId");
     *
     * Currently, only supports selection based on element ID (i.e. as in
     * the above example).
     *
     * If the element is not found, this method returns `null`.
     * If multiple elements are found, this method return first of them.
     *
     * @param {String} selector The selector query.
     * @param {Element|Object} [context] Optional context to search in. An element or a document. Might be value returned by superT.select. Default value is document.
     *
     * @return {Element|null} The element matching the selector or null if an element was not found.
     *
     * @apidoc  superT.select
     */
    superT.select = function (selector, context) {
        return superT.selectMultiple(selector, context)[0] || null;
    };

    /**
     * Selects elements matching the given selector.
     *
     * Example:
     *
     *     var theElement = superT.selectMultiple(".aClassName", superT.select("#theElementId"));
     *
     * Currently, only supports selection based on element ID and class (i.e. as in
     * the above example).
     *
     * If no elements were found, this method returns an empty array.
     *
     * @param {String} sel The selector query.
     * @param {Element|Object} [context] Optional context to search in. An element or a document. Might be value returned by superT.select. Default value is document.
     *
     * @return {Array} The elements matching the selector.
     *
     * @apidoc  superT.selectMultiple
     */
    superT.selectMultiple = function (sel, context) {
        if (context === null) return [];
        var selFunc;
        context = (context || document);
        sel = sel.match(/^([#\.])?(.*)/);
        selFunc = 'getElement' + (sel[1] ? sel[1] == '#' ? 'ById' : 'sByClassName' : 'sByTagName');
        if (typeof context[selFunc] != 'undefined') {
            sel = context[selFunc](sel[2]);
        } else if (selFunc == 'getElementsByClassName' && context.getElementsByTagName) {
            // Implement getElementsByClassName for old browser <= IE8
            var els = context.getElementsByTagName('*'),
                    cEls = [];
            for (var i = 0; i < els.length; i++) {
                var classes = els[i].className.split(' ');
                for (var j = 0; j < classes.length; j++) {
                    if (classes[j] == sel[2]) {
                        cEls.push(els[i]);
                        break;
                    }
                }
            }

            return cEls;
        }

        // if its a single element, wrap it in array
        sel = sel === null ? [] : (sel.nodeType ? [sel] : sel);

        if (superT.Array.isArray(sel)) {
            return sel;
        }
        try {
            return Array.prototype.slice.call(sel);
        } catch (e) {
            var res = [],
                    l = sel.length;
            while (l--) res[l] = sel[l];
            return res;
        }
    };

    //###- Module #20 () -###
    /**
     * Binds event handler to the given elements.
     *
     * Examples:
     *
     *      superT.bindMultiple([elem, anotherElem], "click", function(e) {
     *          // Handle click
     *          // this contain link to the target element
     *      });
     *
     *      superT.bindMultiple("img", "load", function(e) {
     *          // Bind onload handler for all img elements
     *      });
     *
     * @param {HTMLElement} elemsOrSelector The array of elements to which the event ought to be bound or element selector string
     * @param {String} type The event to bind
     * @param {Function} fn Even handler
     * @param {Boolean} [useCapture] Indicates that the user wishes to initiate capture. If not provided returns false.
     *
     * @return {undefined}
     *
     * @apidoc superT.bindMultiple
     */
    superT.bindMultiple = function (elemsOrSelector, type, fn, useCapture) {
        if (elemsOrSelector !== undefined && elemsOrSelector !== null) {

            // If a string we assume it is a selector
            if (typeof elemsOrSelector === 'string') {
                return superT.bindMultiple(superT.selectMultiple(elemsOrSelector), type, fn, useCapture);

                // superT.Array might not be defined yet
            } else if (superT.Array && superT.Array.isIterable(elemsOrSelector)) {
                superT.Array.each(elemsOrSelector, function (el) {
                    superT.bind(el, type, fn, useCapture);
                });

                return true;
            }
        }

        return false;
    };

    /**
     * Binds event handler to the given elements.
     * Internal function. 
     * Use superT.bind and superT.bindMultiple instead.
     *
     * @apidoc superT.bindEvent
     */
    superT.bindEvent = function (selector, event, tagId, fn) {
        superT.bindMultiple(selector, event, function () {

            superT.fireTag(tagId, fn, arguments, this); // Argument and this are passed from the event
        });
    }

    //###- Module #28 () -###
    !function (superT) {
        if (superT.originalOnerror) {
            return;
        }
        var errorCount = 0,
            onErrorExpectedNext;

        function guessLine(fn) {
            if (typeof superTCode === "undefined") {
                return;
            }

            var source = superTCode.toString(),
                index = source.indexOf(typeof fn === 'string' ? fn : fn.toString());

            if (index > -1) {
                source = source.slice(0, index);
                return source.split('\n').length;
            }

            return;
        }

        function buildStack(err, fn) {
            var functionNameRe = /function\s+([\w$]+)\s*\(?/,
                stack = [],
                depth = 0,
                fnStr,
                line,
                name;

            while (fn && depth < 10) {
                fnStr = fn.toString();
                name = (fnStr.match(functionNameRe) !== null) ? RegExp.$1 : '(anonymous)';
                line = guessLine(fnStr);
                stack.push('at ' + name + ':' + line);

                if (err.line === undefined) {
                    err.line = line;
                }

                fn = fn.caller;
                depth++;
            }

            err.stack = stack.join('\n');
        }

        function parseStack(err, stack) {
            var fileLineColRe = /(?:@| \()([a-zA-Z]+:\/\/.+?):([0-9]+)(?:\:([0-9]+))?\)?$/,
                lines = stack.split('\n'),
                i = 0;

            // Skip lines with error message (Chrome / IE)
            while (lines[i].match(fileLineColRe) === null) i++;

            if (err.file === undefined) {
                err.file = RegExp.$1;
            }

            if (err.line === undefined) {
                err.line = RegExp.$2;
            }

            if (err.col === undefined) {
                err.col = RegExp.$3;
            }
        }

        superT.originalOnerror = function () { }; // Can't be null as window.onerror is

        superT.apply(superT, {
            /**!
             * Maximum number of reported errors per page, prevent flooding logger with too many repeated messages
             * @private
             */
            maxErrors: 10,

            /**!
             * Errors buffer keeps all reported errors
             * @private
             */
            errors: [],
            errorsOrigin: [],

            /**
             * Error logger method
             *
             * @param {Object} err superT error object
             *
             * @return {undefined}
             */
            logError: function (err) {

                err.lastTagId = err.lastTagId || st_tagFiredIds[st_tagFiredIds.length - 1];
                superT.errors.push(err);
                errorCount++;
                // This is where users put their tags
                typeof superT.errorCallback == 'function' && superT.errorCallback(err);
            },

            /**
             * try/catch errors handler
             *
             * @param {Object} err Error object
             *
             * @return {undefined}
             */
            processError: function (e, tagId, isReThrown) {
                if (isReThrown)
                    onErrorExpectedNext = 1; // onError will ignore

                if (errorCount > superT.maxErrors) {
                    return;
                }
                // Process a same error only once
                for (var i in superT.errorsOrigin) {
                    if (superT.errorsOrigin[i] === e) return;
                }
                superT.errorsOrigin.push(e);

                var obj = {
                    handler: 'trycatch',
                    msg: e.message,
                    lastTagId: tagId
                };

                if (e.lineNumber !== undefined) {
                    obj.line = e.lineNumber;
                }

                if (e.columnNumber !== undefined) {
                    obj.col = e.columnNumber;
                }

                if (e.fileName !== undefined) {
                    obj.file = e.fileName;
                }

                if (e.stack) {
                    obj.stack = e.stack;
                    if (!e.file || !e.line || !e.col) {
                        parseStack(obj, e.stack);
                    }
                } else {
                    buildStack(obj, arguments.callee.caller);
                }

                superT.logError(obj);
            },

            /**
             * window.error errors handler
             *
             * @param {String} msg Error message
             * @param {String} file Url of the script where error occured
             * @param {Number} line Line number where error occured
             * @param {Number} col Column number where error occured
             * @param {Object} err Error object
             *
             * @return {undefined}
             */
            onError: function (msg, file, line, col, err) {
                if (onErrorExpectedNext) {
                    onErrorExpectedNext = 0;
                    return; // The error was already processed
                }
                if (errorCount > superT.maxErrors) {
                    return;
                }

                var obj = {
                    handler: 'onerror',
                    msg: msg,
                    file: file,
                    line: line,
                    col: col
                };

                if (err) {
                    obj.stack = err.stack;
                }

                superT.logError(obj);

                typeof superT.originalOnerror === 'function' && superT.originalOnerror.apply(this, arguments);
            },
            bindOnError: function () {
                if (typeof window.onerror === "function") {
                    if (window.onerror === superT.onError) return; // In case we rebind
                    superT.originalOnerror = window.onerror;
                }
                window.onerror = superT.onError;
            }
        });

        superT.bindOnError();
    }(superT);

    //###- End of the modules section

})(window, document, superT, "undefined");

/** //### DATA OBJECTS */

/**! ###--- Tag id: 148229, name: [Includes], description: [The SuperTag includes container is used to contain tags that fire immediately.] ---### */
superT.an.startMonitoring(148229, 'i');

/**! ###--- Tag id: 149048, name: [SiteCatalyst], description: [SiteCatalyst] ---### */

/**! ###--- Tag id: 155498, name: [Instantiate s], description: [] ---### */
//window.s=new AppMeasurement();

/**! ###--- Tag id: 149049, name: [Account configuration], description: [Account configuration] ---### */

/**! ###--- Tag id: 155499, name: [Report Suite ID], description: [] ---### */
function isProduction() {
    var host = window.location.hostname;
    var query = window.location.search;
    if (window.location.search.toLowerCase().indexOf('synthetic=true') > -1 || window.location.search.toLowerCase().indexOf('supert=test') > -1 || superT.getCookie('synthetic') === 'true') {
        superT.setCookie('synthetic', 'true');
        return false;
    } else {
        return (/\.anz\.com/.test(host));
    }
}

var s_account = isProduction() ? 'anzcomprd' : 'anzcomdev';

/**! ###--- Tag id: 149051, name: [Advanced configuration], description: [Advanced configuration] ---### */

/**! ###--- Tag id: 168460, name: [Configuration Settings.], description: [] ---### */
var s = new AppMeasurement();
s.account = s_account;
s.charSet = "utf-8";
s.cookieDomainPeriods = 3;
s.currencyCode = "AUD";
s.trackDownloadLinks = true;
s.trackExternalLinks = true;
s.useForcedLinkTracking = false;
s.trackInlineStats = true;
s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
s.linkInternalFilters = "anz.com,anz.com.au,javascript:,tel:,localhost";
s.linkLeaveQueryString = false;
s.linkTrackVars = "None";
s.linkTrackEvents = "None";

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
s.visitorNamespace = "anz";
s.trackingServer = "info.anz.com";
s.trackingServerSecure = "infos.anz.com";
s.usePlugins = true;

/**! ###--- Tag id: 155673, name: [Set s.visitor], description: [] ---### */
s.visitor = Visitor.getInstance("67A216D751E567B20A490D4C@AdobeOrg");

/**! ###--- Tag id: 159352, name: [s.linkInternalFilters update], description: [] ---### */
s.linkInternalFilters += ',' + window.location.hostname;

/**! ###--- Tag id: 149053, name: [Do plugins], description: [Do plugins] ---### */
var s_doPlugins = function (s) {

    /**! ###--- Tag id: 158833, name: [Page specific configuration.], description: [] ---### */
    try {
        var pageType = s.eVar5 = s.prop5 = digitalData.lib.getPageType();
        if (!s.pageName) s.pageName = s.eVar26 = digitalData.lib.getPageName();
        s.eVar77 = digitalData.lib.getHeading();
        s.eVar78 = s.prop41 = digitalData.lib.getCategory();

        switch (pageType) {
            case 'anzcomau:pagetype/product-category':
                s.products = digitalData.lib.getProductListAll();
                s.events = s.apl(s.events, "event58", ",", 2);
                break;
            case 'anzcomau:pagetype/product':
                s.products = digitalData.lib.getProductListAll();
                s.events = s.apl(s.events, 'prodView', ',', 2);
                break;
            case 'anzcomau:pagetype/shopfront':
                s.products = digitalData.lib.getProductListAll();
                s.events = s.apl(s.events, "event58", ",", 2);
                break;
            default:
                break;
        }

        /* Set Content Hierarchy Variables:  */
        s.prop1 = s.eVar1 = digitalData.lib.getContentHierarchy(1);
        s.prop2 = s.eVar2 = digitalData.lib.getContentHierarchy(2);
        s.channel = s.eVar4 = digitalData.lib.getContentHierarchy(3);
        s.prop3 = s.eVar3 = digitalData.lib.getContentHierarchy(4);
        s.hier1 = digitalData.lib.getContentHierarchy('hierarchy');

        /* Set External Campaign Variable */
        if (!s.campaign) s.campaign = s.eVar62 = s.Util.getQueryParam('cid');

        /* Set Server Variable */
        s.server = window.location.host;

        /* Time Parting */
        s.eVar12 = s.prop12 = s.getTimeParting('s', '+10');

        /* Set Internal Promotion Variable */
        if (!s.eVar15 && !!s.Util.getQueryParam('pid')) {
            s.eVar15 = s.Util.getQueryParam('pid');
            s.events = s.apl(s.events, "event24", ",", 1);
        }

        /* Source Code */
        if (!s.eVar27) {
            if (s.Util.getQueryParam('sourcecode_1')) {
                s.eVar27 = s.Util.getQueryParam('sourcecode_1');
                s.eVar27 = s.getValOnce(s.eVar27, 's_eVar27', 0);
            }
        }

        /* Capture Audience Manager ID */
        s.eVar31 = superT.getCookie('aam_uuid');

        /* New & Repeat Visitors */
        s.eVar42 = s.prop42 = s.getNewRepeat();

        /* Code Version */
        s.eVar63 = digitalData.lib.getVersion();

        /* Previous pageName - must run after pageName set*/
        if (typeof (s.linkType) == 'undefined') {
            s.eVar69 = s.prop47 = s.getPreviousValue(s.pageName, 'anz_gpv_pN');
        }

        // Percentage of page viewed.
        var ppv = s.getPercentPageViewed(s.pageName);
        s.prop70 = ppv[0];
        s.prop71 = ppv[2];

        // Unica passed dimensions
        if (!s.eVar75) s.eVar75 = s.Util.getQueryParam('markid');
        if (!s.eVar76) s.eVar76 = s.Util.getQueryParam('tcd');

        //getPageLoad Time
        var s_loadTime = s_getLoadTime();
        s.prop72 = s_loadTime;
        if (s_loadTime) s.events = s.apl(s.events, 'event29=' + s_loadTime, ',', 1);

        /* AAM Segment Lists */
        if (typeof s_aamAnalyticsSegments != "undefined") s.list3 = s_aamAnalyticsSegments;

        s.manageVars('lowercaseVars');

    } catch (e) {
        console.log('doPlugins threw error: ' + e);
    }

    /**! ###--- Tag id: 157619, name: [Set standard doPlugin Variables], description: [] ---### */

    /**! ###--- Tag id: 194105, name: [NEW Search], description: [] ---### */
    if (!!digitalData && digitalData.pageInfo.heading === "Search" && !!digitalData.search.searchInfo.onsiteSearchTerm) {
        if (digitalData.search.searchInfo.onsiteSearchTerm.length > 0) {
            s.prop7 = s.eVar7 = digitalData.search.searchInfo.onsiteSearchResults;
            s.prop6 = s.eVar6 = digitalData.search.searchInfo.onsiteSearchTerm;
            s.events = "event1";
        }
        if (!!digitalData && digitalData.pageInfo.heading === "Search" && !!digitalData.search.searchInfo.onsiteSearchPosition) {
            s.prop10 = s.eVar19 = digitalData.search.searchInfo.onsiteSearchPosition;
            s.events = "event4";
        }
    }

}
s.doPlugins = s_doPlugins;

/**! ###--- Tag id: 149054, name: [Plugins], description: [Plugins] ---### */

/**! ###--- Tag id: 157824, name: [Utility: Compatibility Plugin], description: [] ---### */
s.wd = window;
s.fl = new Function("x", "l", ""
+ "return x?(''+x).substring(0,l):x;");
s.pt = new Function("x", "d", "f", "a", ""
+ "var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);"
+ "y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+"
+ "d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return''");

/**! ###--- Tag id: 158831, name: [Utility: Util.getQueryParam cleanup], description: [] ---### */
// Remove hash from getQueryParam()
if (!!s.Util && !s.Util.getQueryParamOrig) {
    s.Util.getQueryParamOrig = s.Util.getQueryParam;
    s.Util.getQueryParam = function () {
        return this.getQueryParamOrig.apply(this.getQueryParamOrig, arguments).replace(/#.*/, '');
    }
}

/**! ###--- Tag id: 155502, name: [Plugin: getVisitStart v2.1], description: [] ---### */
// return 1 on start of visit, else 0
s.getVisitStart = new Function("c", ""
+ "var s=this,n,t=new Date;if(typeof s.callType=='function'&&s.callTyp"
+ "e()=='+')return 0;if(!c)c='s_visit';t.setTime(t.getTime()+18e5);n=s"
+ ".c_r(c)?0:1;if(!s.c_w(c,1,t))s.c_w(c,1,0);if(!s.c_r(c))n=0;return n");

/**! ###--- Tag id: 155503, name: [Plugin: getPercentPageViewed v1.73], description: [] ---### */
s.getPercentPageViewed = new Function("n", ""
+ "var s=this,W=window,EL=W.addEventListener,AE=W.attachEvent,E=['load"
+ "','unload','scroll','resize','zoom','keyup','mouseup','touchend','o"
+ "rientationchange','pan'],K='s_ppv',P=K+'l',I=n||s.pageName||documen"
+ "t.location.href;W.s_Obj=s;if(!W.s_PPVevent){s.s_PPVg=function(n,o){"
+ "var c=s.c_r(o?P:K)||'',a=c.indexOf(',')>-1?c.split(',',10):[''],i;a"
+ "[0]=o?unescape(a[0]||''):I;for(i=1;i<9&&(i<a.length||!o);i++)a[i]=a"
+ "[i]?parseInt(a[i])||0:0;if(a.length>9||!o)a[9]=a[9]&&a[9]!='L'&&a[9"
+ "]!='LP'&&a[9]!='PL'?'P':a[9];return a};s.c_w(P,s.c_r(K)||'');s.c_w("
+ "K,escape(I)+',0,0,0,0,0,0,0,0');W.s_PPVevent=function(e){var W=wind"
+ "ow,D=document||{},B=D.body,E=D.documentElement||{},S=window.screen|"
+ "|{},Ho='offsetHeight',Hs='scrollHeight',Ts='scrollTop',Wc='clientWi"
+ "dth',Hc='clientHeight',M=Math,C=100,J='object',N='number',Z=',',s=W"
+ ".s_Obj||W.s||0;e=e&&typeof e==J?e.type||'':'';if(!e.indexOf('on'))e"
+ "=e.substring(2);if(W.s_PPVt&&!e){clearTimeout(s_PPVt);s_PPVt=0}if(s"
+ "&&typeof s==J&&B&&typeof B==J){var h=M.max(B[Hs]||E[Hs],B[Ho]||E[Ho"
+ "],B[Hc]||E[Hc]||1),X=W.innerWidth||E[Wc]||B[Wc]||1,Y=W.innerHeight|"
+ "|E[Hc]||B[Hc]||1,x=S.width||1,y=S.height||1,r=M.round(C*(W.devicePi"
+ "xelRatio||1))/C,b=(D.pageYOffset||E[Ts]||B[Ts]||0)+Y,p=h>0&&b>0?M.r"
+ "ound(C*b/h):1,O=W.orientation,o=!isNaN(O)?M.abs(o)%180:Y>X?0:90,a=s"
+ ".s_PPVg(n),L=(e=='load')||(a[1]<1),t,V=function(u,v,f,n){v=typeof v"
+ "!=N?u:v;v=f||(u>v)?u:v;return n?v:v>C?C:v<0?0:v};if(new RegExp('(iP"
+ "od|iPad|iPhone)').exec((window.navigator&&navigator.userAgent)||'')"
+ "&&o){t=x;x=y;y=t}o=o?'L':'P';a[9]=L||!a[9]?o:a[9].substring(0,1);if"
+ "(a[9]!='L'&&a[9]!='P')a[9]=o;s.c_w(K,escape(a[0])+Z+V(a[1],p,!L)+Z+"
+ "V(a[2],p,L)+Z+V(a[3],b,L,1)+Z+X+Z+Y+Z+x+Z+y+Z+r+Z+a[9]+(a[9]==o?'':"
+ "o))}if(!W.s_PPVt&&e!='unload')W.s_PPVt=setTimeout(W.s_PPVevent,333)"
+ "};for(var f=W.s_PPVevent,i=0;i<E.length;i++)if(EL)EL(E[i],f,false);"
+ "else if(AE)AE('on'+E[i],f);f()};var a=s.s_PPVg(n,1);return!argument"
+ "s.length||n=='-'?a[1]:a");

/**! ###--- Tag id: 155505, name: [Utility: manageVars v1.4], description: [] ---### */
//NOTE: This plugin has been modified. The 'product' var has been removed from list.

s.manageVars = new Function("c", "l", "f", ""
+ "var s=this,vl,la,vla;l=l?l:'';f=f?f:1 ;if(!s[c])return false;vl='pa"
+ "geName,purchaseID,channel,server,pageType,campaign,state,zip,events"
+ ",transactionID';for(var n=1;n<101;n++){vl+=',prop'+n+',eVar"
+ "'+n+',hier'+n;}if(l&&(f==1||f==2)){if(f==1){vl=l;}if(f==2){la=s.spl"
+ "it(l,',');vla=s.split(vl,',');vl='';for(x in la){for(y in vla){if(l"
+ "a[x]==vla[y]){vla[y]='';}}}for(y in vla){vl+=vla[y]?','+vla[y]:'';}"
+ "}s.pt(vl,',',c,0);return true;}else if(l==''&&f==1){s.pt(vl,',',c,0"
+ ");return true;}else{return false;}");
s.clearVars = new Function("t", "var s=this;s[t]='';");
s.lowercaseVars = new Function("t", ""
+ "var s=this;if(s[t]&&t!='events'){s[t]=s[t].toString();if(s[t].index"
+ "Of('D=')!=0){s[t]=s[t].toLowerCase();}}");

/**! ###--- Tag id: 155506, name: [Utility: pt], description: [] ---### */
/*
 * runs function in f argument against list of
 * variables declared in x (delimited by d), with a as an optional
 * argument to be included in f function call
 */
s.pt = new Function("x", "d", "f", "a", ""
+ "var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t"
+ ".substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.length;t=x.substri"
+ "ng(z,x.length);t=z<x.length?t:''}return'';");

/**! ###--- Tag id: 155509, name: [Plugin: getTimeParting 3.4 + Config], description: [] ---### */
/* TimeParting Config */
//time parting configuration for Australia
s._tpDST = {
    2015: '4/5,10/4',
    2016: '4/3,10/2',
    2017: '4/2,10/1',
    2018: '4/1,10/7',
    2019: '4/7,10/6'
}

s.getTimeParting = new Function("e", "t", "" + "var n=this,r;r=new Date('1/1/2000');if(r.getDay()!=6||r.getMonth()!=0){r" + "eturn'Data Not Available'}else{var i,s,o,u,a,f,l,c=['Sunday','Monday','T" + "uesday','Wednesday','Thursday','Friday','Saturday'],h=new Date;t=t?t:0;t" + "=parseFloat(t);if(n._tpDST){var p=n._tpDST[h.getFullYear()].split(/,/);a" + "=new Date(p[0]+'/'+h.getFullYear());f=new Date(p[1]+'/'+h.getFullYear());" + "if(e=='n'&&h>a&&h<f){t=t+1}else if(e=='s'&&(h>f||h<a)){t=t+1}}h=h.getTime" + "()+h.getTimezoneOffset()*6e4;h=new Date(h+36e5*t);i=h.getHours();s=h.getM" + "inutes();s=s<10?'0'+s:s;o=h.getDay();u=' AM';if(i>=12){u=' PM';i=i-12}if(" + "i==0){i=12}o=c[o];l=i+':'+s+u;return l+'|'+o}");

/**! ###--- Tag id: 159084, name: [Utility: split v1.5], description: [] ---### */
/*
* Utility Function: split v1.5 - split a string (JS 1.0 compatible)
 */
s.split = new Function("l", "d", ""
+ "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+ "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/**! ###--- Tag id: 155507, name: [Plugin: getPageName v2.1], description: [] ---### */
s.getPageName = new Function("u", ""
+ "var s=this,v=u?u:''+s.wd.location,x=v.indexOf(':'),y=v.indexOf('/',"
+ "x+4),z=v.indexOf('?'),c=s.pathConcatDelim,e=s.pathExcludeDelim,g=s."
+ "queryVarsList,d=s.siteID,n=d?d:'',q=z<0?'':v.substring(z+1),p=v.sub"
+ "string(y+1,q?z:v.length);z=p.indexOf('#');p=z<0?p:s.fl(p,z);x=e?p.i"
+ "ndexOf(e):-1;p=x<0?p:s.fl(p,x);p+=!p||p.charAt(p.length-1)=='/'?s.d"
+ "efaultPage:'';y=c?c:'/';while(p){x=p.indexOf('/');x=x<0?p.length:x;"
+ "z=s.fl(p,x);if(!s.pt(s.pathExcludeList,',','p_c',z))n+=n?y+z:z;p=p."
+ "substring(x+1)}y=c?c:'?';while(g){x=g.indexOf(',');x=x<0?g.length:x"
+ ";z=s.fl(g,x);z=s.pt(q,'&','p_c',z);if(z){n+=n?y+z:z;y=c?c:'&'}g=g.s"
+ "ubstring(x+1)}return n");

/**! ###--- Tag id: 155508, name: [Plugin: getValOnce_v1.11], description: [] ---### */
s.getValOnce = new Function("v", "c", "e", "t", ""
+ "var s=this,a=new Date,v=v?v:'',c=c?c:'s_gvo',e=e?e:0,i=t=='m'?6000"
+ "0:86400000,k=s.c_r(c);if(v){a.setTime(a.getTime()+e*i);s.c_w(c,v,e"
+ "==0?0:a);}return v==k?'':v");

/**! ###--- Tag id: 155517, name: [Plugin: getNewRepeat 1.2], description: [] ---### */
s.getNewRepeat = new Function("d", "cn", ""
+ "var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:"
+ "'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length="
+ "=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct"
+ "-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N"
+ "ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}");

/**! ###--- Tag id: 157604, name: [Plugin: Append to list], description: [] ---### */
/*
 * Plugin Utility: Append to List v1.2
 */
s.apl = new Function("l", "v", "d", "u", ""
+ "var s=this,m=0;if(!l)l='';if(u){var i,n,a=l.split(d),al=a.length;fo"
+ "r(i=0;i<al;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowe"
+ "rCase()));}}if(!m)l=l?l+d+v:v;return l;");

/**! ###--- Tag id: 159345, name: [Plugin: getPreviousValue v1.0], description: [] ---### */
/*
 * Plugin: getPreviousValue v1.0 - return previous value of designated
 *   variable (requires split utility)
 */
s.getPreviousValue = new Function("v", "c", "el", ""
+ "var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
+ "){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
+ "){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
+ ":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
+ "s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

/**! ###--- Tag id: 168459, name: [Audience Manager Module (v.6.9)], description: [AppMeasurement 2.4.0] ---### */
/* 
====AppMeasurement_Media_Module====

*/

function AppMeasurement_Module_Media(q) {
    var b = this;
    b.s = q;
    q = window;
    q.s_c_in || (q.s_c_il = [], q.s_c_in = 0);
    b._il = q.s_c_il;
    b._in = q.s_c_in;
    b._il[b._in] = b;
    q.s_c_in++;
    b._c = "s_m";
    b.list = [];
    b.open = function (d, c, e, k) {
        var f = {}, a = new Date(), l = "", g;
        c || (c = -1);
        if (d && e) {
            b.list || (b.list = {});
            b.list[d] && b.close(d);
            k && k.id && (l = k.id);
            if (l) for (g in b.list) !Object.prototype[g] && b.list[g] && b.list[g].R == l && b.close(b.list[g].name);
            f.name = d;
            f.length = c;
            f.offset = 0;
            f.e = 0;
            f.playerName = b.playerName ? b.playerName : e;
            f.R = l;
            f.C = 0;
            f.a = 0;
            f.timestamp = Math.floor(a.getTime() / 1e3);
            f.k = 0;
            f.u = f.timestamp;
            f.c = -1;
            f.n = "";
            f.g = -1;
            f.D = 0;
            f.I = {};
            f.G = 0;
            f.m = 0;
            f.f = "";
            f.B = 0;
            f.L = 0;
            f.A = 0;
            f.F = 0;
            f.l = !1;
            f.v = "";
            f.J = "";
            f.K = 0;
            f.r = !1;
            f.H = "";
            f.complete = 0;
            f.Q = 0;
            f.p = 0;
            f.q = 0;
            b.list[d] = f;
        }
    };
    b.openAd = function (d, c, e, k, f, a, l, g) {
        var h = {};
        b.open(d, c, e, g);
        if (h = b.list[d]) h.l = !0, h.v = k, h.J = f, h.K = a, h.H = l;
    };
    b.M = function (d) {
        var c = b.list[d];
        b.list[d] = 0;
        c && c.monitor && clearTimeout(c.monitor.interval);
    };
    b.close = function (d) {
        b.i(d, 0, -1);
    };
    b.play = function (d, c, e, k) {
        var f = b.i(d, 1, c, e, k);
        f && !f.monitor && (f.monitor = {}, f.monitor.update = function () {
            1 == f.k && b.i(f.name, 3, -1);
            f.monitor.interval = setTimeout(f.monitor.update, 1e3);
        }, f.monitor.update());
    };
    b.click = function (d, c) {
        b.i(d, 7, c);
    };
    b.complete = function (d, c) {
        b.i(d, 5, c);
    };
    b.stop = function (d, c) {
        b.i(d, 2, c);
    };
    b.track = function (d) {
        b.i(d, 4, -1);
    };
    b.P = function (d, c) {
        var e = "a.media.", k = d.linkTrackVars, f = d.linkTrackEvents, a = "m_i", l, g = d.contextData, h;
        c.l && (e += "ad.", c.v && (g["a.media.name"] = c.v, g[e + "pod"] = c.J, g[e + "podPosition"] = c.K),
        c.G || (g[e + "CPM"] = c.H));
        c.r && (g[e + "clicked"] = !0, c.r = !1);
        g["a.contentType"] = "video" + (c.l ? "Ad" : "");
        g["a.media.channel"] = b.channel;
        g[e + "name"] = c.name;
        g[e + "playerName"] = c.playerName;
        0 < c.length && (g[e + "length"] = c.length);
        g[e + "timePlayed"] = Math.floor(c.a);
        0 < Math.floor(c.a) && (g[e + "timePlayed"] = Math.floor(c.a));
        c.G || (g[e + "view"] = !0, a = "m_s", b.Heartbeat && b.Heartbeat.enabled && (a = c.l ? b.__primetime ? "mspa_s" : "msa_s" : b.__primetime ? "msp_s" : "ms_s"),
        c.G = 1);
        c.f && (g[e + "segmentNum"] = c.m, g[e + "segment"] = c.f, 0 < c.B && (g[e + "segmentLength"] = c.B),
        c.A && 0 < c.a && (g[e + "segmentView"] = !0));
        !c.Q && c.complete && (g[e + "complete"] = !0, c.S = 1);
        0 < c.p && (g[e + "milestone"] = c.p);
        0 < c.q && (g[e + "offsetMilestone"] = c.q);
        if (k) for (h in g) Object.prototype[h] || (k += ",contextData." + h);
        l = g["a.contentType"];
        d.pe = a;
        d.pev3 = l;
        var q, s;
        if (b.contextDataMapping) for (h in d.events2 || (d.events2 = ""), k && (k += ",events"),
        b.contextDataMapping) if (!Object.prototype[h]) {
            a = h.length > e.length && h.substring(0, e.length) == e ? h.substring(e.length) : "";
            l = b.contextDataMapping[h];
            if ("string" == typeof l) for (q = l.split(","), s = 0; s < q.length; s++) l = q[s],
            "a.contentType" == h ? (k && (k += "," + l), d[l] = g[h]) : "view" == a || "segmentView" == a || "clicked" == a || "complete" == a || "timePlayed" == a || "CPM" == a ? (f && (f += "," + l),
            "timePlayed" == a || "CPM" == a ? g[h] && (d.events2 += (d.events2 ? "," : "") + l + "=" + g[h]) : g[h] && (d.events2 += (d.events2 ? "," : "") + l)) : "segment" == a && g[h + "Num"] ? (k && (k += "," + l),
            d[l] = g[h + "Num"] + ":" + g[h]) : (k && (k += "," + l), d[l] = g[h]); else if ("milestones" == a || "offsetMilestones" == a) h = h.substring(0, h.length - 1),
            g[h] && b.contextDataMapping[h + "s"][g[h]] && (f && (f += "," + b.contextDataMapping[h + "s"][g[h]]),
            d.events2 += (d.events2 ? "," : "") + b.contextDataMapping[h + "s"][g[h]]);
            g[h] && (g[h] = 0);
            "segment" == a && g[h + "Num"] && (g[h + "Num"] = 0);
        }
        d.linkTrackVars = k;
        d.linkTrackEvents = f;
    };
    b.i = function (d, c, e, k, f) {
        var a = {}, l = new Date().getTime() / 1e3, g, h, q = b.trackVars, s = b.trackEvents, t = b.trackSeconds, u = b.trackMilestones, v = b.trackOffsetMilestones, w = b.segmentByMilestones, x = b.segmentByOffsetMilestones, p, n, r = 1, m = {}, y;
        b.channel || (b.channel = b.s.w.location.hostname);
        if (a = d && b.list && b.list[d] ? b.list[d] : 0) if (a.l && (t = b.adTrackSeconds,
        u = b.adTrackMilestones, v = b.adTrackOffsetMilestones, w = b.adSegmentByMilestones,
        x = b.adSegmentByOffsetMilestones), 0 > e && (e = 1 == a.k && 0 < a.u ? l - a.u + a.c : a.c),
        0 < a.length && (e = e < a.length ? e : a.length), 0 > e && (e = 0), a.offset = e,
        0 < a.length && (a.e = a.offset / a.length * 100, a.e = 100 < a.e ? 100 : a.e),
        0 > a.c && (a.c = e), y = a.D, m.name = d, m.ad = a.l, m.length = a.length, m.openTime = new Date(),
        m.openTime.setTime(1e3 * a.timestamp), m.offset = a.offset, m.percent = a.e, m.playerName = a.playerName,
        m.mediaEvent = 0 > a.g ? "OPEN" : 1 == c ? "PLAY" : 2 == c ? "STOP" : 3 == c ? "MONITOR" : 4 == c ? "TRACK" : 5 == c ? "COMPLETE" : 7 == c ? "CLICK" : "CLOSE",
        2 < c || c != a.k && (2 != c || 1 == a.k)) {
            f || (k = a.m, f = a.f);
            if (c) {
                1 == c && (a.c = e);
                if ((3 >= c || 5 <= c) && 0 <= a.g && (r = !1, q = s = "None", a.g != e)) {
                    h = a.g;
                    h > e && (h = a.c, h > e && (h = e));
                    p = u ? u.split(",") : 0;
                    if (0 < a.length && p && e >= h) for (n = 0; n < p.length; n++) (g = p[n] ? parseFloat("" + p[n]) : 0) && h / a.length * 100 < g && a.e >= g && (r = !0,
                    n = p.length, m.mediaEvent = "MILESTONE", a.p = m.milestone = g);
                    if ((p = v ? v.split(",") : 0) && e >= h) for (n = 0; n < p.length; n++) (g = p[n] ? parseFloat("" + p[n]) : 0) && h < g && e >= g && (r = !0,
                    n = p.length, m.mediaEvent = "OFFSET_MILESTONE", a.q = m.offsetMilestone = g);
                }
                if (a.L || !f) {
                    if (w && u && 0 < a.length) {
                        if (p = u.split(",")) for (p.push("100"), n = h = 0; n < p.length; n++) if (g = p[n] ? parseFloat("" + p[n]) : 0) a.e < g && (k = n + 1,
                        f = "M:" + h + "-" + g, n = p.length), h = g;
                    } else if (x && v && (p = v.split(","))) for (p.push("" + (0 < a.length ? a.length : "E")),
                    n = h = 0; n < p.length; n++) if ((g = p[n] ? parseFloat("" + p[n]) : 0) || "E" == p[n]) {
                        if (e < g || "E" == p[n]) k = n + 1, f = "O:" + h + "-" + g, n = p.length;
                        h = g;
                    }
                    f && (a.L = !0);
                }
                (f || a.f) && f != a.f && (a.F = !0, a.f || (a.m = k, a.f = f), 0 <= a.g && (r = !0));
                (2 <= c || 100 <= a.e) && a.c < e && (a.C += e - a.c, a.a += e - a.c);
                if (2 >= c || 3 == c && !a.k) a.n += (1 == c || 3 == c ? "S" : "E") + Math.floor(e),
                a.k = 3 == c ? 1 : c;
                !r && 0 <= a.g && 3 >= c && (t = t ? t : 0) && a.a >= t && (r = !0, m.mediaEvent = "SECONDS");
                a.u = l;
                a.c = e;
            }
            if (!c || 3 >= c && 100 <= a.e) 2 != a.k && (a.n += "E" + Math.floor(e)), c = 0,
            q = s = "None", m.mediaEvent = "CLOSE";
            7 == c && (r = m.clicked = a.r = !0);
            if (5 == c || b.completeByCloseOffset && (!c || 100 <= a.e) && 0 < a.length && e >= a.length - b.completeCloseOffsetThreshold) r = m.complete = a.complete = !0;
            l = m.mediaEvent;
            "MILESTONE" == l ? l += "_" + m.milestone : "OFFSET_MILESTONE" == l && (l += "_" + m.offsetMilestone);
            a.I[l] ? m.eventFirstTime = !1 : (m.eventFirstTime = !0, a.I[l] = 1);
            m.event = m.mediaEvent;
            m.timePlayed = a.C;
            m.segmentNum = a.m;
            m.segment = a.f;
            m.segmentLength = a.B;
            b.monitor && 4 != c && b.monitor(b.s, m);
            b.Heartbeat && b.Heartbeat.enabled && 0 <= a.g && (r = !1);
            0 == c && b.M(d);
            r && a.D == y && (d = {
                contextData: {}
            }, d.linkTrackVars = q, d.linkTrackEvents = s, d.linkTrackVars || (d.linkTrackVars = ""),
            d.linkTrackEvents || (d.linkTrackEvents = ""), b.P(d, a), d.linkTrackVars || (d["!linkTrackVars"] = 1),
            d.linkTrackEvents || (d["!linkTrackEvents"] = 1), b.s.track(d), a.F ? (a.m = k,
            a.f = f, a.A = !0, a.F = !1) : 0 < a.a && (a.A = !1), a.n = "", a.p = a.q = 0, a.a -= Math.floor(a.a),
            a.g = e, a.D++);
        }
        return a;
    };
    b.O = function (d, c, e, k, f) {
        var a = 0;
        if (d && (!b.autoTrackMediaLengthRequired || c && 0 < c)) {
            if (b.list && b.list[d]) a = 1; else if (1 == e || 3 == e) b.open(d, c, "HTML5 Video", f),
            a = 1;
            a && b.i(d, e, k, -1, 0);
        }
    };
    b.attach = function (d) {
        var c, e, k;
        d && d.tagName && "VIDEO" == d.tagName.toUpperCase() && (b.o || (b.o = function (c, a, d) {
            var e, h;
            b.autoTrack && (e = c.currentSrc, (h = c.duration) || (h = -1), 0 > d && (d = c.currentTime),
            b.O(e, h, a, d, c));
        }), c = function () {
            b.o(d, 1, -1);
        }, e = function () {
            b.o(d, 1, -1);
        }, b.j(d, "play", c), b.j(d, "pause", e), b.j(d, "seeking", e), b.j(d, "seeked", c),
        b.j(d, "ended", function () {
            b.o(d, 0, -1);
        }), b.j(d, "timeupdate", c), k = function () {
            d.paused || d.ended || d.seeking || b.o(d, 3, -1);
            setTimeout(k, 1e3);
        }, k());
    };
    b.j = function (b, c, e) {
        b.attachEvent ? b.attachEvent("on" + c, e) : b.addEventListener && b.addEventListener(c, e, !1);
    };
    void 0 == b.completeByCloseOffset && (b.completeByCloseOffset = 1);
    void 0 == b.completeCloseOffsetThreshold && (b.completeCloseOffsetThreshold = 1);
    b.Heartbeat = {};
    b.N = function () {
        var d, c;
        if (b.autoTrack && (d = b.s.d.getElementsByTagName("VIDEO"))) for (c = 0; c < d.length; c++) b.attach(d[c]);
    };
    b.j(q, "load", b.N);
}

/* 

====AppMeasurement_Module_AudienceManagement====

*/
function AppMeasurement_Module_AudienceManagement(d) {
    var a = this;
    a.s = d;
    var b = window;
    b.s_c_in || (b.s_c_il = [], b.s_c_in = 0);
    a._il = b.s_c_il;
    a._in = b.s_c_in;
    a._il[a._in] = a;
    b.s_c_in++;
    a._c = "s_m";
    a.setup = function (c) {
        b.DIL && c && (c.disableDefaultRequest = !0, c.disableScriptAttachment = !0, c.disableCORS = !0,
        c.secureDataCollection = !1, a.instance = b.DIL.create(c), a.tools = b.DIL.tools);
    };
    a.isReady = function () {
        return a.instance ? !0 : !1;
    };
    a.getEventCallConfigParams = function () {
        return a.instance && a.instance.api && a.instance.api.getEventCallConfigParams ? a.instance.api.getEventCallConfigParams() : {};
    };
    a.passData = function (b) {
        a.instance && a.instance.api && a.instance.api.passData && a.instance.api.passData(b);
    };
}

"function" !== typeof window.DIL && (window.DIL = function (e, f) {
    var k = [], g, s;
    e !== Object(e) && (e = {});
    var t, m, F, O, A, y, K, G, P, Q, R, B, C, H, z;
    t = e.partner;
    m = e.containerNSID;
    F = !!e.disableDestinationPublishingIframe;
    O = e.iframeAkamaiHTTPS;
    A = e.mappings;
    y = e.uuidCookie;
    K = !0 === e.enableErrorReporting;
    G = e.visitorService;
    P = e.declaredId;
    Q = !0 === e.removeFinishedScriptsAndCallbacks;
    R = !0 === e.delayAllUntilWindowLoad;
    B = !0 === e.disableIDSyncs;
    C = "undefined" === typeof e.secureDataCollection || !0 === e.secureDataCollection;
    H = !0 === e.useCORSOnly;
    z = "boolean" === typeof e.isCoopSafe ? e.isCoopSafe : null;
    var S, T, L, I, U, V, W, X;
    S = !0 === e.disableScriptAttachment;
    T = !0 === e.disableDefaultRequest;
    L = e.afterResultForDefaultRequest;
    I = e.dpIframeSrc;
    U = !0 === e.testCORS;
    V = !0 === e.useJSONPOnly;
    W = e.visitorConstructor;
    X = !0 === e.disableCORS;
    K && DIL.errorModule.activate();
    var $ = !0 === window._dil_unit_tests;
    (g = f) && k.push(g + "");
    if (!t || "string" !== typeof t) return g = "DIL partner is invalid or not specified in initConfig",
    DIL.errorModule.handleError({
        name: "error",
        message: g,
        filename: "dil.js"
    }), Error(g);
    g = "DIL containerNSID is invalid or not specified in initConfig, setting to default of 0";
    if (m || "number" === typeof m) m = parseInt(m, 10), !isNaN(m) && 0 <= m && (g = "");
    g && (m = 0, k.push(g), g = "");
    s = DIL.getDil(t, m);
    if (s instanceof DIL && s.api.getPartner() === t && s.api.getContainerNSID() === m) return s;
    if (this instanceof DIL) DIL.registerDil(this, t, m); else return new DIL(e, "DIL was not instantiated with the 'new' operator, returning a valid instance with partner = " + t + " and containerNSID = " + m);
    var u = {
        IS_HTTPS: C || "https:" === document.location.protocol,
        POST_MESSAGE_ENABLED: !!window.postMessage,
        COOKIE_MAX_EXPIRATION_DATE: "Tue, 19 Jan 2038 03:14:07 UTC",
        MILLIS_PER_DAY: 864e5,
        DIL_COOKIE_NAME: "AAMC_" + encodeURIComponent(t) + "_" + m,
        FIRST_PARTY_SYNCS: "AMSYNCS",
        FIRST_PARTY_SYNCS_ON_PAGE: "AMSYNCSOP",
        HAS_JSON_STRINGIFY: window.JSON === Object(window.JSON) && "function" === typeof window.JSON.stringify
    }, M = {
        stuffed: {}
    }, p = {}, n = {
        firingQueue: [],
        fired: [],
        firing: !1,
        sent: [],
        errored: [],
        reservedKeys: {
            sids: !0,
            pdata: !0,
            logdata: !0,
            callback: !0,
            postCallbackFn: !0,
            useImageRequest: !0
        },
        callbackPrefix: "demdexRequestCallback",
        firstRequestHasFired: !1,
        useJSONP: !0,
        abortRequests: !1,
        num_of_jsonp_responses: 0,
        num_of_jsonp_errors: 0,
        num_of_cors_responses: 0,
        num_of_cors_errors: 0,
        corsErrorSources: [],
        num_of_img_responses: 0,
        num_of_img_errors: 0,
        toRemove: [],
        removed: [],
        readyToRemove: !1,
        platformParams: {
            d_nsid: m + "",
            d_rtbd: "json",
            d_jsonv: DIL.jsonVersion + "",
            d_dst: "1"
        },
        nonModStatsParams: {
            d_rtbd: !0,
            d_dst: !0,
            d_cts: !0,
            d_rs: !0
        },
        modStatsParams: null,
        adms: {
            TIME_TO_CATCH_ALL_REQUESTS_RELEASE: 2e3,
            calledBack: !1,
            mid: null,
            noVisitorAPI: !1,
            VisitorAPI: null,
            instance: null,
            releaseType: "no VisitorAPI",
            isOptedOut: !0,
            isOptedOutCallbackCalled: !1,
            admsProcessingStarted: !1,
            process: function (a) {
                try {
                    if (!this.admsProcessingStarted) {
                        this.admsProcessingStarted = !0;
                        var b = this, c, d, l, h;
                        if ("function" === typeof a && "function" === typeof a.getInstance) {
                            if (G === Object(G) && (c = G.namespace) && "string" === typeof c) d = a.getInstance(c, {
                                idSyncContainerID: m
                            }); else {
                                this.releaseType = "no namespace";
                                this.releaseRequests();
                                return;
                            }
                            if (d === Object(d) && d instanceof a && "function" === typeof d.isAllowed && "function" === typeof d.getMarketingCloudVisitorID && "function" === typeof d.getCustomerIDs && "function" === typeof d.isOptedOut) {
                                this.VisitorAPI = a;
                                if (!d.isAllowed()) {
                                    this.releaseType = "VisitorAPI not allowed";
                                    this.releaseRequests();
                                    return;
                                }
                                this.instance = d;
                                l = function (a) {
                                    "VisitorAPI" !== b.releaseType && (b.mid = a, b.releaseType = "VisitorAPI", b.releaseRequests());
                                };
                                h = d.getMarketingCloudVisitorID(l);
                                if ("string" === typeof h && h.length) {
                                    l(h);
                                    return;
                                }
                                setTimeout(function () {
                                    "VisitorAPI" !== b.releaseType && (b.releaseType = "timeout", b.releaseRequests());
                                }, this.getLoadTimeout());
                                return;
                            }
                            this.releaseType = "invalid instance";
                        } else this.noVisitorAPI = !0;
                        this.releaseRequests();
                    }
                } catch (e) {
                    this.releaseRequests();
                }
            },
            releaseRequests: function () {
                this.calledBack = !0;
                n.registerRequest();
            },
            getMarketingCloudVisitorID: function () {
                return this.instance ? this.instance.getMarketingCloudVisitorID() : null;
            },
            getMIDQueryString: function () {
                var a = r.isPopulatedString, b = this.getMarketingCloudVisitorID();
                a(this.mid) && this.mid === b || (this.mid = b);
                return a(this.mid) ? "d_mid=" + this.mid + "&" : "";
            },
            getCustomerIDs: function () {
                return this.instance ? this.instance.getCustomerIDs() : null;
            },
            getCustomerIDsQueryString: function (a) {
                if (a === Object(a)) {
                    var b = "", c = [], d = [], l, h;
                    for (l in a) a.hasOwnProperty(l) && (d[0] = l, h = a[l], h === Object(h) && (d[1] = h.id || "",
                    d[2] = h.authState || 0, c.push(d), d = []));
                    if (d = c.length) for (a = 0; a < d; a++) b += "&d_cid_ic=" + q.encodeAndBuildRequest(c[a], "%01");
                    return b;
                }
                return "";
            },
            getIsOptedOut: function () {
                this.instance ? this.instance.isOptedOut([this, this.isOptedOutCallback], this.VisitorAPI.OptOut.GLOBAL, !0) : (this.isOptedOut = !1,
                this.isOptedOutCallbackCalled = !0);
            },
            isOptedOutCallback: function (a) {
                this.isOptedOut = a;
                this.isOptedOutCallbackCalled = !0;
                n.registerRequest();
            },
            getLoadTimeout: function () {
                var a = this.instance;
                if (a) {
                    if ("function" === typeof a.getLoadTimeout) return a.getLoadTimeout();
                    if ("undefined" !== typeof a.loadTimeout) return a.loadTimeout;
                }
                return this.TIME_TO_CATCH_ALL_REQUESTS_RELEASE;
            }
        },
        declaredId: {
            declaredId: {
                init: null,
                request: null
            },
            declaredIdCombos: {},
            setDeclaredId: function (a, b) {
                var c = r.isPopulatedString, d = encodeURIComponent;
                if (a === Object(a) && c(b)) {
                    var l = a.dpid, h = a.dpuuid, e = null;
                    if (c(l) && c(h)) {
                        e = d(l) + "$" + d(h);
                        if (!0 === this.declaredIdCombos[e]) return "setDeclaredId: combo exists for type '" + b + "'";
                        this.declaredIdCombos[e] = !0;
                        this.declaredId[b] = {
                            dpid: l,
                            dpuuid: h
                        };
                        return "setDeclaredId: succeeded for type '" + b + "'";
                    }
                }
                return "setDeclaredId: failed for type '" + b + "'";
            },
            getDeclaredIdQueryString: function () {
                var a = this.declaredId.request, b = this.declaredId.init, c = encodeURIComponent, d = "";
                null !== a ? d = "&d_dpid=" + c(a.dpid) + "&d_dpuuid=" + c(a.dpuuid) : null !== b && (d = "&d_dpid=" + c(b.dpid) + "&d_dpuuid=" + c(b.dpuuid));
                return d;
            }
        },
        registerRequest: function (a) {
            var b = this.firingQueue;
            a === Object(a) && b.push(a);
            this.firing || !b.length || R && !DIL.windowLoaded || (this.adms.isOptedOutCallbackCalled || this.adms.getIsOptedOut(),
            this.adms.calledBack && !this.adms.isOptedOut && this.adms.isOptedOutCallbackCalled && (this.adms.isOptedOutCallbackCalled = !1,
            a = b.shift(), a.src = a.src.replace(/demdex.net\/event\?d_nsid=/, "demdex.net/event?" + this.adms.getMIDQueryString() + "d_nsid="),
            r.isPopulatedString(a.corsPostData) && (a.corsPostData = a.corsPostData.replace(/^d_nsid=/, this.adms.getMIDQueryString() + "d_nsid=")),
            D.fireRequest(a), this.firstRequestHasFired || "script" !== a.tag && "cors" !== a.tag || (this.firstRequestHasFired = !0)));
        },
        processVisitorAPI: function () {
            this.adms.process(W || window.Visitor);
        },
        requestRemoval: function (a) {
            if (!Q) return "removeFinishedScriptsAndCallbacks is not boolean true";
            var b = this.toRemove, c, d;
            a === Object(a) && (c = a.script, d = a.callbackName, (c === Object(c) && "SCRIPT" === c.nodeName || "no script created" === c) && "string" === typeof d && d.length && b.push(a));
            if (this.readyToRemove && b.length) {
                d = b.shift();
                c = d.script;
                d = d.callbackName;
                "no script created" !== c ? (a = c.src, c.parentNode.removeChild(c)) : a = c;
                window[d] = null;
                try {
                    delete window[d];
                } catch (l) { }
                this.removed.push({
                    scriptSrc: a,
                    callbackName: d
                });
                DIL.variables.scriptsRemoved.push(a);
                DIL.variables.callbacksRemoved.push(d);
                return this.requestRemoval();
            }
            return "requestRemoval() processed";
        },
        getCoopQueryString: function () {
            var a = "";
            !0 === z ? a = "&d_coop_safe=1" : !1 === z && (a = "&d_coop_unsafe=1");
            return a;
        }
    };
    s = function () {
        var a = "http://fast.", b = "?d_nsid=" + m + "#" + encodeURIComponent(document.location.href);
        if ("string" === typeof I && I.length) return I + b;
        u.IS_HTTPS && (a = !0 === O ? "https://fast." : "https://");
        return a + t + ".demdex.net/dest5.html" + b;
    };
    var w = {
        THROTTLE_START: 3e4,
        MAX_SYNCS_LENGTH: 649,
        throttleTimerSet: !1,
        id: "destination_publishing_iframe_" + t + "_" + m,
        url: s(),
        onPagePixels: [],
        iframeHost: null,
        getIframeHost: function (a) {
            if ("string" === typeof a) {
                var b = a.split("/");
                if (3 <= b.length) return b[0] + "//" + b[2];
                k.push("getIframeHost: url is malformed: " + a);
                return a;
            }
        },
        iframe: null,
        iframeHasLoaded: !1,
        sendingMessages: !1,
        messages: [],
        messagesPosted: [],
        messagesReceived: [],
        messageSendingInterval: u.POST_MESSAGE_ENABLED ? null : 100,
        ibsDeleted: [],
        jsonForComparison: [],
        jsonDuplicates: [],
        jsonWaiting: [],
        jsonProcessed: [],
        canSetThirdPartyCookies: !0,
        receivedThirdPartyCookiesNotification: !1,
        newIframeCreated: null,
        iframeIdChanged: !1,
        originalIframeHasLoadedAlready: null,
        attachIframe: function () {
            function a() {
                d = document.createElement("iframe");
                d.sandbox = "allow-scripts allow-same-origin";
                d.title = "Adobe ID Syncing iFrame";
                d.id = c.id;
                d.style.cssText = "display: none; width: 0; height: 0;";
                d.src = c.url;
                c.newIframeCreated = !0;
                b();
                document.body.appendChild(d);
            }
            function b() {
                q.addListener(d, "load", function () {
                    d.className = "aamIframeLoaded";
                    c.iframeHasLoaded = !0;
                    c.requestToProcess();
                });
            }
            var c = this, d = document.getElementById(this.id);
            d ? "IFRAME" !== d.nodeName ? (this.id += "_2", this.iframeIdChanged = !0, a()) : (this.newIframeCreated = !1,
            "aamIframeLoaded" !== d.className ? (this.originalIframeHasLoadedAlready = !1, b()) : (this.iframeHasLoaded = this.originalIframeHasLoadedAlready = !0,
            this.iframe = d, this.requestToProcess())) : a();
            this.iframe = d;
        },
        requestToProcess: function (a, b) {
            function c() {
                d.jsonForComparison.push(a);
                d.jsonWaiting.push([a, b]);
            }
            var d = this, l, h;
            l = n.adms.instance;
            a === Object(a) && l === Object(l) && l.idSyncContainerID === m && (w.ibsDeleted.push(a.ibs),
            delete a.ibs);
            if (a && !r.isEmptyObject(a)) if (u.HAS_JSON_STRINGIFY) if (l = JSON.stringify(a.ibs || []),
            h = JSON.stringify(a.dests || []), this.jsonForComparison.length) {
                var e = !1, f, g, k;
                f = 0;
                for (g = this.jsonForComparison.length; f < g; f++) if (k = this.jsonForComparison[f],
                l === JSON.stringify(k.ibs || []) && h === JSON.stringify(k.dests || [])) {
                    e = !0;
                    break;
                }
                e ? this.jsonDuplicates.push(a) : c();
            } else c(); else c();
            (this.receivedThirdPartyCookiesNotification || !u.POST_MESSAGE_ENABLED || this.iframeHasLoaded) && this.jsonWaiting.length && (l = this.jsonWaiting.shift(),
            !1 === this.newIframeCreated && delete l[0].ibs, this.process(l[0], l[1]), this.requestToProcess());
            this.iframeHasLoaded && this.messages.length && !this.sendingMessages && (this.throttleTimerSet || (this.throttleTimerSet = !0,
            setTimeout(function () {
                d.messageSendingInterval = u.POST_MESSAGE_ENABLED ? null : 150;
            }, this.THROTTLE_START)), this.sendingMessages = !0, this.sendMessages());
        },
        processSyncOnPage: function (a) {
            var b, c, d;
            if ((b = a.ibs) && b instanceof Array && (c = b.length)) for (a = 0; a < c; a++) d = b[a],
            d.syncOnPage && this.checkFirstPartyCookie(d, "", "syncOnPage");
        },
        process: function (a, b) {
            var c = encodeURIComponent, d, l, h, e, f, g;
            b === Object(b) && (g = q.encodeAndBuildRequest(["", b.dpid || "", b.dpuuid || ""], ","));
            if ((d = a.dests) && d instanceof Array && (l = d.length)) for (h = 0; h < l; h++) e = d[h],
            f = [c("dests"), c(e.id || ""), c(e.y || ""), c(e.c || "")], this.addMessage(f.join("|"));
            if ((d = a.ibs) && d instanceof Array && (l = d.length)) for (h = 0; h < l; h++) e = d[h],
            f = [c("ibs"), c(e.id || ""), c(e.tag || ""), q.encodeAndBuildRequest(e.url || [], ","), c(e.ttl || ""), "", g, e.fireURLSync ? "true" : "false"],
            e.syncOnPage || (this.canSetThirdPartyCookies ? this.addMessage(f.join("|")) : e.fireURLSync && this.checkFirstPartyCookie(e, f.join("|")));
            this.jsonProcessed.push(a);
        },
        checkFirstPartyCookie: function (a, b, c) {
            var d = (c = "syncOnPage" === c ? !0 : !1) ? u.FIRST_PARTY_SYNCS_ON_PAGE : u.FIRST_PARTY_SYNCS, l = this.getOnPageSyncData(d), h = !1, e = !1, f = Math.ceil(new Date().getTime() / u.MILLIS_PER_DAY);
            l ? (l = l.split("*"), e = this.pruneSyncData(l, a.id, f), h = e.dataPresent, e = e.dataValid,
            h && e || this.fireSync(c, a, b, l, d, f)) : (l = [], this.fireSync(c, a, b, l, d, f));
        },
        getOnPageSyncData: function (a) {
            var b = n.adms.instance;
            return b && "function" === typeof b.idSyncGetOnPageSyncInfo ? b.idSyncGetOnPageSyncInfo() : q.getDilCookieField(a);
        },
        pruneSyncData: function (a, b, c) {
            var d = !1, l = !1, e, f, g;
            if (a instanceof Array) for (f = 0; f < a.length; f++) e = a[f], g = parseInt(e.split("-")[1], 10),
            e.match("^" + b + "-") ? (d = !0, c < g ? l = !0 : (a.splice(f, 1), f--)) : c >= g && (a.splice(f, 1),
            f--);
            return {
                dataPresent: d,
                dataValid: l
            };
        },
        manageSyncsSize: function (a) {
            if (a.join("*").length > this.MAX_SYNCS_LENGTH) for (a.sort(function (a, c) {
                return parseInt(a.split("-")[1], 10) - parseInt(c.split("-")[1], 10);
            }) ; a.join("*").length > this.MAX_SYNCS_LENGTH;) a.shift();
        },
        fireSync: function (a, b, c, d, e, h) {
            function f(a, b, d, c) {
                return function () {
                    g.onPagePixels[a] = null;
                    var e = g.getOnPageSyncData(d), l = [];
                    if (e) {
                        var e = e.split("*"), h, f, k;
                        h = 0;
                        for (f = e.length; h < f; h++) k = e[h], k.match("^" + b.id + "-") || l.push(k);
                    }
                    g.setSyncTrackingData(l, b, d, c);
                };
            }
            var g = this;
            if (a) {
                if ("img" === b.tag) {
                    a = b.url;
                    c = u.IS_HTTPS ? "https:" : "http:";
                    var k, n, v;
                    d = 0;
                    for (k = a.length; d < k; d++) {
                        n = a[d];
                        v = /^\/\//.test(n);
                        var x = new Image();
                        q.addListener(x, "load", f(this.onPagePixels.length, b, e, h));
                        x.src = (v ? c : "") + n;
                        this.onPagePixels.push(x);
                    }
                }
            } else this.addMessage(c), this.setSyncTrackingData(d, b, e, h);
        },
        addMessage: function (a) {
            var b = encodeURIComponent, b = K ? b("---destpub-debug---") : b("---destpub---");
            this.messages.push((u.POST_MESSAGE_ENABLED ? "" : b) + a);
        },
        setSyncTrackingData: function (a, b, c, d) {
            a.push(b.id + "-" + (d + Math.ceil(b.ttl / 60 / 24)));
            this.manageSyncsSize(a);
            q.setDilCookieField(c, a.join("*"));
        },
        sendMessages: function () {
            var a = this, b;
            this.messages.length ? u.POST_MESSAGE_ENABLED ? (b = encodeURIComponent("---destpub-combined---") + this.messages.join("%01"),
            this.postMessage(b), this.messages = [], this.sendingMessages = !1) : (b = this.messages.shift(),
            this.postMessage(b), setTimeout(function () {
                a.sendMessages();
            }, this.messageSendingInterval)) : this.sendingMessages = !1;
        },
        postMessage: function (a) {
            DIL.xd.postMessage(a, this.url, this.iframe.contentWindow);
            this.messagesPosted.push(a);
        },
        receiveMessage: function (a) {
            var b = /^---destpub-to-parent---/;
            "string" === typeof a && b.test(a) && (b = a.replace(b, "").split("|"), "canSetThirdPartyCookies" === b[0] && (this.canSetThirdPartyCookies = "true" === b[1] ? !0 : !1,
            this.receivedThirdPartyCookiesNotification = !0, this.requestToProcess()), this.messagesReceived.push(a));
        }
    }, N = {
        traits: function (a) {
            r.isValidPdata(a) && (p.sids instanceof Array || (p.sids = []), q.extendArray(p.sids, a));
            return this;
        },
        pixels: function (a) {
            r.isValidPdata(a) && (p.pdata instanceof Array || (p.pdata = []), q.extendArray(p.pdata, a));
            return this;
        },
        logs: function (a) {
            r.isValidLogdata(a) && (p.logdata !== Object(p.logdata) && (p.logdata = {}), q.extendObject(p.logdata, a));
            return this;
        },
        customQueryParams: function (a) {
            r.isEmptyObject(a) || q.extendObject(p, a, n.reservedKeys);
            return this;
        },
        signals: function (a, b) {
            var c, d = a;
            if (!r.isEmptyObject(d)) {
                if (b && "string" === typeof b) for (c in d = {}, a) a.hasOwnProperty(c) && (d[b + c] = a[c]);
                q.extendObject(p, d, n.reservedKeys);
            }
            return this;
        },
        declaredId: function (a) {
            n.declaredId.setDeclaredId(a, "request");
            return this;
        },
        result: function (a) {
            "function" === typeof a && (p.callback = a);
            return this;
        },
        afterResult: function (a) {
            "function" === typeof a && (p.postCallbackFn = a);
            return this;
        },
        useImageRequest: function () {
            p.useImageRequest = !0;
            return this;
        },
        clearData: function () {
            p = {};
            return this;
        },
        submit: function () {
            D.submitRequest(p);
            p = {};
            return this;
        },
        getPartner: function () {
            return t;
        },
        getContainerNSID: function () {
            return m;
        },
        getEventLog: function () {
            return k;
        },
        getState: function () {
            var a = {}, b = {};
            q.extendObject(a, n, {
                callbackPrefix: !0,
                useJSONP: !0,
                registerRequest: !0
            });
            q.extendObject(b, w, {
                attachIframe: !0,
                requestToProcess: !0,
                process: !0,
                sendMessages: !0
            });
            return {
                initConfig: e,
                pendingRequest: p,
                otherRequestInfo: a,
                destinationPublishingInfo: b
            };
        },
        idSync: function (a) {
            if (B) return "Error: id syncs have been disabled";
            if (a !== Object(a) || "string" !== typeof a.dpid || !a.dpid.length) return "Error: config or config.dpid is empty";
            if ("string" !== typeof a.url || !a.url.length) return "Error: config.url is empty";
            var b = a.url, c = a.minutesToLive, d = encodeURIComponent, e = w, h, b = b.replace(/^https:/, "").replace(/^http:/, "");
            if ("undefined" === typeof c) c = 20160; else if (c = parseInt(c, 10), isNaN(c) || 0 >= c) return "Error: config.minutesToLive needs to be a positive number";
            h = q.encodeAndBuildRequest(["", a.dpid, a.dpuuid || ""], ",");
            a = ["ibs", d(a.dpid), "img", d(b), c, "", h];
            e.addMessage(a.join("|"));
            n.firstRequestHasFired && e.requestToProcess();
            return "Successfully queued";
        },
        aamIdSync: function (a) {
            if (B) return "Error: id syncs have been disabled";
            if (a !== Object(a) || "string" !== typeof a.dpuuid || !a.dpuuid.length) return "Error: config or config.dpuuid is empty";
            a.url = "//dpm.demdex.net/ibs:dpid=" + a.dpid + "&dpuuid=" + a.dpuuid;
            return this.idSync(a);
        },
        passData: function (a) {
            if (r.isEmptyObject(a)) return "Error: json is empty or not an object";
            w.ibsDeleted.push(a.ibs);
            delete a.ibs;
            D.defaultCallback(a);
            return a;
        },
        getPlatformParams: function () {
            return n.platformParams;
        },
        getEventCallConfigParams: function () {
            var a = n, b = a.modStatsParams, c = a.platformParams, d;
            if (!b) {
                b = {};
                for (d in c) c.hasOwnProperty(d) && !a.nonModStatsParams[d] && (b[d.replace(/^d_/, "")] = c[d]);
                !0 === z ? b.coop_safe = 1 : !1 === z && (b.coop_unsafe = 1);
                a.modStatsParams = b;
            }
            return b;
        },
        setAsCoopSafe: function () {
            z = !0;
            return this;
        },
        setAsCoopUnsafe: function () {
            z = !1;
            return this;
        }
    }, D = {
        corsMetadata: function () {
            var a = "none", b = !0;
            "undefined" !== typeof XMLHttpRequest && XMLHttpRequest === Object(XMLHttpRequest) && ("withCredentials" in new XMLHttpRequest() ? a = "XMLHttpRequest" : new Function("/*@cc_on return /^10/.test(@_jscript_version) @*/")() ? a = "XMLHttpRequest" : "undefined" !== typeof XDomainRequest && XDomainRequest === Object(XDomainRequest) && (b = !1),
            0 < Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") && (b = !1));
            return {
                corsType: a,
                corsCookiesEnabled: b
            };
        }(),
        getCORSInstance: function () {
            return "none" === this.corsMetadata.corsType ? null : new window[this.corsMetadata.corsType]();
        },
        submitRequest: function (a) {
            n.registerRequest(D.createQueuedRequest(a));
            return !0;
        },
        createQueuedRequest: function (a) {
            var b = n, c, d = a.callback, e = "img", h;
            if (!r.isEmptyObject(A)) {
                var f, g, k;
                for (f in A) A.hasOwnProperty(f) && (g = A[f], null != g && "" !== g && f in a && !(g in a || g in n.reservedKeys) && (k = a[f],
                null != k && "" !== k && (a[g] = k)));
            }
            r.isValidPdata(a.sids) || (a.sids = []);
            r.isValidPdata(a.pdata) || (a.pdata = []);
            r.isValidLogdata(a.logdata) || (a.logdata = {});
            a.logdataArray = q.convertObjectToKeyValuePairs(a.logdata, "=", !0);
            a.logdataArray.push("_ts=" + new Date().getTime());
            "function" !== typeof d && (d = this.defaultCallback);
            b.useJSONP = !0 !== a.useImageRequest;
            b.useJSONP && (e = "script", c = b.callbackPrefix + "_" + m + "_" + new Date().getTime());
            b = this.makeRequestSrcData(a, c);
            V && !H || !(h = this.getCORSInstance()) || (e = "cors");
            return {
                tag: e,
                src: b.src,
                corsSrc: b.corsSrc,
                internalCallbackName: c,
                callbackFn: d,
                postCallbackFn: a.postCallbackFn,
                useImageRequest: !!a.useImageRequest,
                requestData: a,
                corsInstance: h,
                corsPostData: b.corsPostData
            };
        },
        defaultCallback: function (a, b) {
            w.processSyncOnPage(a);
            var c, d, e, h, f, g, k, m, v;
            if ((c = a.stuff) && c instanceof Array && (d = c.length)) for (e = 0; e < d; e++) if ((h = c[e]) && h === Object(h)) {
                f = h.cn;
                g = h.cv;
                k = h.ttl;
                if ("undefined" === typeof k || "" === k) k = Math.floor(q.getMaxCookieExpiresInMinutes() / 60 / 24);
                m = h.dmn || "." + document.domain.replace(/^www\./, "");
                v = h.type;
                f && (g || "number" === typeof g) && ("var" !== v && (k = parseInt(k, 10)) && !isNaN(k) && q.setCookie(f, g, 1440 * k, "/", m, !1),
                M.stuffed[f] = g);
            }
            c = a.uuid;
            r.isPopulatedString(c) && !r.isEmptyObject(y) && (d = y.path, "string" === typeof d && d.length || (d = "/"),
            e = parseInt(y.days, 10), isNaN(e) && (e = 100), q.setCookie(y.name || "aam_did", c, 1440 * e, d, y.domain || "." + document.domain.replace(/^www\./, ""), !0 === y.secure));
            F || n.abortRequests || w.requestToProcess(a, b);
        },
        makeRequestSrcData: function (a, b) {
            a.sids = r.removeEmptyArrayValues(a.sids || []);
            a.pdata = r.removeEmptyArrayValues(a.pdata || []);
            var c = n, d = c.platformParams, e = q.encodeAndBuildRequest(a.sids, ","), h = q.encodeAndBuildRequest(a.pdata, ","), f = (a.logdataArray || []).join("&");
            delete a.logdataArray;
            var g = u.IS_HTTPS ? "https://" : "http://", k = c.declaredId.getDeclaredIdQueryString(), p = c.adms.instance ? c.adms.getCustomerIDsQueryString(c.adms.getCustomerIDs()) : "", v;
            v = [];
            var x, E, s, Y;
            for (x in a) if (!(x in c.reservedKeys) && a.hasOwnProperty(x)) if (E = a[x], x = encodeURIComponent(x),
            E instanceof Array) for (s = 0, Y = E.length; s < Y; s++) v.push(x + "=" + encodeURIComponent(E[s])); else v.push(x + "=" + encodeURIComponent(E));
            v = v.length ? "&" + v.join("&") : "";
            e = "d_nsid=" + d.d_nsid + c.getCoopQueryString() + k + p + (e.length ? "&d_sid=" + e : "") + (h.length ? "&d_px=" + h : "") + (f.length ? "&d_ld=" + encodeURIComponent(f) : "");
            d = "&d_rtbd=" + d.d_rtbd + "&d_jsonv=" + d.d_jsonv + "&d_dst=" + d.d_dst;
            g = g + t + ".demdex.net/event";
            h = c = g + "?" + e + (c.useJSONP ? d + "&d_cb=" + (b || "") : "") + v;
            2048 < c.length && (c = c.substring(0, 2048).substring(0, c.lastIndexOf("&")));
            return {
                corsSrc: g + "?" + (U ? "testcors=1&d_nsid=" + m + "&" : "") + "_ts=" + new Date().getTime(),
                src: c,
                originalSrc: h,
                corsPostData: e + d + v,
                isDeclaredIdCall: "" !== k
            };
        },
        fireRequest: function (a) {
            if ("img" === a.tag) this.fireImage(a); else {
                var b = n.declaredId, b = b.declaredId.request || b.declaredId.init || {}, b = {
                    dpid: b.dpid || "",
                    dpuuid: b.dpuuid || ""
                };
                "script" === a.tag ? this.fireScript(a, b) : "cors" === a.tag && this.fireCORS(a, b);
            }
        },
        fireImage: function (a) {
            var b = n, c, d;
            b.abortRequests || (b.firing = !0, c = new Image(0, 0), b.sent.push(a), c.onload = function () {
                b.firing = !1;
                b.fired.push(a);
                b.num_of_img_responses++;
                b.registerRequest();
            }, d = function (d) {
                g = "imgAbortOrErrorHandler received the event of type " + d.type;
                k.push(g);
                b.abortRequests = !0;
                b.firing = !1;
                b.errored.push(a);
                b.num_of_img_errors++;
                b.registerRequest();
            }, c.addEventListener ? (c.addEventListener("error", d, !1), c.addEventListener("abort", d, !1)) : c.attachEvent && (c.attachEvent("onerror", d),
            c.attachEvent("onabort", d)), c.src = a.src);
        },
        fireScript: function (a, b) {
            var c = this, d = n, e, h, f = a.src, m = a.postCallbackFn, q = "function" === typeof m, p = a.internalCallbackName;
            d.abortRequests || (d.firing = !0, window[p] = function (c) {
                try {
                    c !== Object(c) && (c = {});
                    B && (w.ibsDeleted.push(c.ibs), delete c.ibs);
                    var e = a.callbackFn;
                    d.firing = !1;
                    d.fired.push(a);
                    d.num_of_jsonp_responses++;
                    e(c, b);
                    q && m(c, b);
                } catch (f) {
                    f.message = "DIL jsonp callback caught error with message " + f.message;
                    g = f.message;
                    k.push(g);
                    f.filename = f.filename || "dil.js";
                    f.partner = t;
                    DIL.errorModule.handleError(f);
                    try {
                        e({
                            error: f.name + "|" + f.message
                        }, b), q && m({
                            error: f.name + "|" + f.message
                        }, b);
                    } catch (l) { }
                } finally {
                    d.requestRemoval({
                        script: h,
                        callbackName: p
                    }), d.registerRequest();
                }
            }, S || H ? (d.firing = !1, d.requestRemoval({
                script: "no script created",
                callbackName: p
            })) : (h = document.createElement("script"), h.addEventListener && h.addEventListener("error", function (b) {
                d.requestRemoval({
                    script: h,
                    callbackName: p
                });
                g = "jsonp script tag error listener received the event of type " + b.type + " with src " + f;
                c.handleScriptError(g, a);
            }, !1), h.type = "text/javascript", h.src = f, e = DIL.variables.scriptNodeList[0],
            e.parentNode.insertBefore(h, e)), d.sent.push(a), d.declaredId.declaredId.request = null);
        },
        fireCORS: function (a, b) {
            var c = this, d = n, e = this.corsMetadata.corsType, f = a.corsSrc, m = a.corsInstance, q = a.corsPostData, p = a.postCallbackFn, s = "function" === typeof p;
            if (!d.abortRequests && !X) {
                d.firing = !0;
                try {
                    m.open("post", f, !0), "XMLHttpRequest" === e && (m.withCredentials = !0, m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
                    m.onreadystatechange = function () {
                        if (4 === this.readyState && 200 === this.status) a: {
                            var e;
                            try {
                                if (e = JSON.parse(this.responseText), e !== Object(e)) {
                                    c.handleCORSError(a, b, "Response is not JSON");
                                    break a;
                                }
                            } catch (f) {
                                c.handleCORSError(a, b, "Error parsing response as JSON");
                                break a;
                            }
                            B && (w.ibsDeleted.push(e.ibs), delete e.ibs);
                            try {
                                var h = a.callbackFn;
                                d.firing = !1;
                                d.fired.push(a);
                                d.num_of_cors_responses++;
                                h(e, b);
                                s && p(e, b);
                            } catch (l) {
                                l.message = "DIL handleCORSResponse caught error with message " + l.message;
                                g = l.message;
                                k.push(g);
                                l.filename = l.filename || "dil.js";
                                l.partner = t;
                                DIL.errorModule.handleError(l);
                                try {
                                    h({
                                        error: l.name + "|" + l.message
                                    }, b), s && p({
                                        error: l.name + "|" + l.message
                                    }, b);
                                } catch (m) { }
                            } finally {
                                d.registerRequest();
                            }
                        }
                    }), m.onerror = function () {
                        c.handleCORSError(a, b, "onerror");
                    }, m.ontimeout = function () {
                        c.handleCORSError(a, b, "ontimeout");
                    }, m.send(q);
                } catch (r) {
                    this.handleCORSError(a, b, "try-catch");
                }
                d.sent.push(a);
                d.declaredId.declaredId.request = null;
            }
        },
        handleCORSError: function (a, b, c) {
            n.num_of_cors_errors++;
            n.corsErrorSources.push(c);
            "ontimeout" === c || H || (a.tag = "script", this.fireScript(a, b));
        },
        handleScriptError: function (a, b) {
            n.num_of_jsonp_errors++;
            this.handleRequestError(a, b);
        },
        handleRequestError: function (a, b) {
            var c = n;
            k.push(a);
            c.abortRequests = !0;
            c.firing = !1;
            c.errored.push(b);
            c.registerRequest();
        }
    }, r = {
        isValidPdata: function (a) {
            return a instanceof Array && this.removeEmptyArrayValues(a).length ? !0 : !1;
        },
        isValidLogdata: function (a) {
            return !this.isEmptyObject(a);
        },
        isEmptyObject: function (a) {
            if (a !== Object(a)) return !0;
            for (var b in a) if (a.hasOwnProperty(b)) return !1;
            return !0;
        },
        removeEmptyArrayValues: function (a) {
            for (var b = 0, c = a.length, d, e = [], b = 0; b < c; b++) d = a[b], "undefined" !== typeof d && null !== d && "" !== d && e.push(d);
            return e;
        },
        isPopulatedString: function (a) {
            return "string" === typeof a && a.length;
        }
    }, q = {
        addListener: function () {
            if (document.addEventListener) return function (a, b, c) {
                a.addEventListener(b, function (a) {
                    "function" === typeof c && c(a);
                }, !1);
            };
            if (document.attachEvent) return function (a, b, c) {
                a.attachEvent("on" + b, function (a) {
                    "function" === typeof c && c(a);
                });
            };
        }(),
        convertObjectToKeyValuePairs: function (a, b, c) {
            var d = [], e, f;
            b || (b = "=");
            for (e in a) a.hasOwnProperty(e) && (f = a[e], "undefined" !== typeof f && null !== f && "" !== f && d.push(e + b + (c ? encodeURIComponent(f) : f)));
            return d;
        },
        encodeAndBuildRequest: function (a, b) {
            return this.map(a, function (a) {
                return encodeURIComponent(a);
            }).join(b);
        },
        map: function (a, b) {
            if (Array.prototype.map) return a.map(b);
            if (void 0 === a || null === a) throw new TypeError();
            var c = Object(a), d = c.length >>> 0;
            if ("function" !== typeof b) throw new TypeError();
            for (var e = Array(d), f = 0; f < d; f++) f in c && (e[f] = b.call(b, c[f], f, c));
            return e;
        },
        filter: function (a, b) {
            if (!Array.prototype.filter) {
                if (void 0 === a || null === a) throw new TypeError();
                var c = Object(a), d = c.length >>> 0;
                if ("function" !== typeof b) throw new TypeError();
                for (var e = [], f = 0; f < d; f++) if (f in c) {
                    var g = c[f];
                    b.call(b, g, f, c) && e.push(g);
                }
                return e;
            }
            return a.filter(b);
        },
        getCookie: function (a) {
            a += "=";
            var b = document.cookie.split(";"), c, d, e;
            c = 0;
            for (d = b.length; c < d; c++) {
                for (e = b[c]; " " === e.charAt(0) ;) e = e.substring(1, e.length);
                if (0 === e.indexOf(a)) return decodeURIComponent(e.substring(a.length, e.length));
            }
            return null;
        },
        setCookie: function (a, b, c, d, e, f) {
            var g = new Date();
            c && (c *= 6e4);
            document.cookie = a + "=" + encodeURIComponent(b) + (c ? ";expires=" + new Date(g.getTime() + c).toUTCString() : "") + (d ? ";path=" + d : "") + (e ? ";domain=" + e : "") + (f ? ";secure" : "");
        },
        extendArray: function (a, b) {
            return a instanceof Array && b instanceof Array ? (Array.prototype.push.apply(a, b),
            !0) : !1;
        },
        extendObject: function (a, b, c) {
            var d;
            if (a === Object(a) && b === Object(b)) {
                for (d in b) !b.hasOwnProperty(d) || !r.isEmptyObject(c) && d in c || (a[d] = b[d]);
                return !0;
            }
            return !1;
        },
        getMaxCookieExpiresInMinutes: function () {
            return (new Date(u.COOKIE_MAX_EXPIRATION_DATE).getTime() - new Date().getTime()) / 1e3 / 60;
        },
        getCookieField: function (a, b) {
            var c = this.getCookie(a), d = decodeURIComponent;
            if ("string" === typeof c) {
                var c = c.split("|"), e, f;
                e = 0;
                for (f = c.length - 1; e < f; e++) if (d(c[e]) === b) return d(c[e + 1]);
            }
            return null;
        },
        getDilCookieField: function (a) {
            return this.getCookieField(u.DIL_COOKIE_NAME, a);
        },
        setCookieField: function (a, b, c) {
            var d = this.getCookie(a), e = !1, f = encodeURIComponent;
            b = f(b);
            c = f(c);
            if ("string" === typeof d) {
                var d = d.split("|"), g, f = 0;
                for (g = d.length - 1; f < g; f++) if (d[f] === b) {
                    d[f + 1] = c;
                    e = !0;
                    break;
                }
                e || (f = d.length, d[f] = b, d[f + 1] = c);
            } else d = [b, c];
            this.setCookie(a, d.join("|"), this.getMaxCookieExpiresInMinutes(), "/", this.getDomain(), !1);
        },
        setDilCookieField: function (a, b) {
            return this.setCookieField(u.DIL_COOKIE_NAME, a, b);
        },
        getDomain: function (a) {
            !a && window.location && (a = window.location.hostname);
            if (a) if (/^[0-9.]+$/.test(a)) a = ""; else {
                var b = a.split("."), c = b.length - 1, d = c - 1;
                1 < c && 2 >= b[c].length && (2 === b[c - 1].length || 0 > ",DOMAIN_2_CHAR_EXCEPTIONS,".indexOf("," + b[c] + ",")) && d--;
                if (0 < d) for (a = ""; c >= d;) a = b[c] + (a ? "." : "") + a, c--;
            }
            return a;
        }
    };
    "error" === t && 0 === m && q.addListener(window, "load", function () {
        DIL.windowLoaded = !0;
    });
    var Z = !1, J = function () {
        Z || (Z = !0, n.registerRequest(), aa(), F || n.abortRequests || w.attachIframe(),
        n.readyToRemove = !0, n.requestRemoval());
    }, aa = function () {
        F || setTimeout(function () {
            T || n.firstRequestHasFired || ("function" === typeof L ? N.afterResult(L).submit() : N.submit());
        }, DIL.constants.TIME_TO_DEFAULT_REQUEST);
    };
    C = document;
    "error" !== t && (DIL.windowLoaded ? J() : "complete" !== C.readyState && "loaded" !== C.readyState ? q.addListener(window, "load", function () {
        DIL.windowLoaded = !0;
        J();
    }) : (DIL.windowLoaded = !0, J()));
    if ("error" !== t) try {
        DIL.xd.receiveMessage(function (a) {
            w.receiveMessage(a.data);
        }, w.getIframeHost(w.url));
    } catch (ba) { }
    n.declaredId.setDeclaredId(P, "init");
    n.processVisitorAPI();
    this.api = N;
    this.getStuffedVariable = function (a) {
        var b = M.stuffed[a];
        b || "number" === typeof b || (b = q.getCookie(a)) || "number" === typeof b || (b = "");
        return b;
    };
    this.validators = r;
    this.helpers = q;
    this.constants = u;
    this.log = k;
    $ && (this.pendingRequest = p, this.requestController = n, this.setDestinationPublishingUrl = s,
    this.destinationPublishing = w, this.requestProcs = D, this.variables = M, this.callWindowLoadFunctions = J);
}, function () {
    var e = document, f;
    null == e.readyState && e.addEventListener && (e.readyState = "loading", e.addEventListener("DOMContentLoaded", f = function () {
        e.removeEventListener("DOMContentLoaded", f, !1);
        e.readyState = "complete";
    }, !1));
}(), DIL.extendStaticPropertiesAndMethods = function (e) {
    var f;
    if (e === Object(e)) for (f in e) e.hasOwnProperty(f) && (this[f] = e[f]);
}, DIL.extendStaticPropertiesAndMethods({
    version: "6.11",
    jsonVersion: 1,
    constants: {
        TIME_TO_DEFAULT_REQUEST: 50
    },
    variables: {
        scriptNodeList: document.getElementsByTagName("script"),
        scriptsRemoved: [],
        callbacksRemoved: []
    },
    windowLoaded: !1,
    dils: {},
    isAddedPostWindowLoad: function (e) {
        this.windowLoaded = "function" === typeof e ? !!e() : "boolean" === typeof e ? e : !0;
    },
    create: function (e) {
        try {
            return new DIL(e);
        } catch (f) {
            throw Error("Error in attempt to create DIL instance with DIL.create(): " + f.message);
        }
    },
    registerDil: function (e, f, k) {
        f = f + "$" + k;
        f in this.dils || (this.dils[f] = e);
    },
    getDil: function (e, f) {
        var k;
        "string" !== typeof e && (e = "");
        f || (f = 0);
        k = e + "$" + f;
        return k in this.dils ? this.dils[k] : Error("The DIL instance with partner = " + e + " and containerNSID = " + f + " was not found");
    },
    dexGetQSVars: function (e, f, k) {
        f = this.getDil(f, k);
        return f instanceof this ? f.getStuffedVariable(e) : "";
    },
    xd: {
        postMessage: function (e, f, k) {
            var g = 1;
            f && (window.postMessage ? k.postMessage(e, f.replace(/([^:]+:\/\/[^\/]+).*/, "$1")) : f && (k.location = f.replace(/#.*$/, "") + "#" + +new Date() + g++ + "&" + e));
        },
        receiveMessage: function (e, f) {
            var k;
            try {
                if (window.postMessage) if (e && (k = function (g) {
                    if ("string" === typeof f && g.origin !== f || "[object Function]" === Object.prototype.toString.call(f) && !1 === f(g.origin)) return !1;
                    e(g);
                }), window.addEventListener) window[e ? "addEventListener" : "removeEventListener"]("message", k, !1); else window[e ? "attachEvent" : "detachEvent"]("onmessage", k);
            } catch (g) { }
        }
    }
}), DIL.errorModule = function () {
    var e = DIL.create({
        partner: "error",
        containerNSID: 0,
        disableDestinationPublishingIframe: !0
    }), f = {
        harvestererror: 14138,
        destpuberror: 14139,
        dpmerror: 14140,
        generalerror: 14137,
        error: 14137,
        noerrortypedefined: 15021,
        evalerror: 15016,
        rangeerror: 15017,
        referenceerror: 15018,
        typeerror: 15019,
        urierror: 15020
    }, k = !1;
    return {
        activate: function () {
            k = !0;
        },
        handleError: function (g) {
            if (!k) return "DIL error module has not been activated";
            g !== Object(g) && (g = {});
            var s = g.name ? (g.name + "").toLowerCase() : "", t = [];
            g = {
                name: s,
                filename: g.filename ? g.filename + "" : "",
                partner: g.partner ? g.partner + "" : "no_partner",
                site: g.site ? g.site + "" : document.location.href,
                message: g.message ? g.message + "" : ""
            };
            t.push(s in f ? f[s] : f.noerrortypedefined);
            e.api.pixels(t).logs(g).useImageRequest().submit();
            return "DIL error report sent";
        },
        pixelMap: f
    };
}(), DIL.tools = {}, DIL.modules = {
    helpers: {
        handleModuleError: function (e, f, k) {
            var g = "";
            f = f || "Error caught in DIL module/submodule: ";
            e === Object(e) ? g = f + (e.message || "err has no message") : (g = f + "err is not a valid object",
            e = {});
            e.message = g;
            k instanceof DIL && (e.partner = k.api.getPartner());
            DIL.errorModule.handleError(e);
            return this.errorMessage = g;
        }
    }
});

s.loadModule("AudienceManagement");
s.AudienceManagement.setup({
    "partner": "anz",
    "containerNSID": 0,
    "uuidCookie": {
        "name": "aam_uuid",
        "days": 30
    }
});

/**! ###--- Tag id: 159082, name: [AppMeasurement 2.4.0], description: [Updating to AppMeasurement 2.4.0] ---### */
/* 
==== AppMeasurement Code Base====
*/

/*
 Start ActivityMap Module

 The following module enables ActivityMap tracking in Adobe Analytics. ActivityMap
 allows you to view data overlays on your links and content to understand how
 users engage with your web site. If you do not intend to use ActivityMap, you
 can remove the following block of code from your AppMeasurement.js file.
 Additional documentation on how to configure ActivityMap is available at:
 https://marketing.adobe.com/resources/help/en_US/analytics/activitymap/getting-started-admins.html
*/
function AppMeasurement_Module_ActivityMap(f) {
    function g(a, d) {
        var b, c, n;
        if (a && d && (b = e.c[d] || (e.c[d] = d.split(",")))) for (n = 0; n < b.length && (c = b[n++]) ;) if (-1 < a.indexOf(c)) return null;
        p = 1;
        return a;
    }
    function q(a, d, b, c, e) {
        var g, h;
        if (a.dataset && (h = a.dataset[d])) g = h; else if (a.getAttribute) if (h = a.getAttribute("data-" + b)) g = h; else if (h = a.getAttribute(b)) g = h;
        if (!g && f.useForcedLinkTracking && e && (g = "", d = a.onclick ? "" + a.onclick : "")) {
            b = d.indexOf(c);
            var l, k;
            if (0 <= b) {
                for (b += 10; b < d.length && 0 <= "= \t\r\n".indexOf(d.charAt(b)) ;) b++;
                if (b < d.length) {
                    h = b;
                    for (l = k = 0; h < d.length && (";" != d.charAt(h) || l) ;) l ? d.charAt(h) != l || k ? k = "\\" == d.charAt(h) ? !k : 0 : l = 0 : (l = d.charAt(h),
                    '"' != l && "'" != l && (l = 0)), h++;
                    if (d = d.substring(b, h)) a.e = new Function("s", "var e;try{s.w." + c + "=" + d + "}catch(e){}"),
                    a.e(f);
                }
            }
        }
        return g || e && f.w[c];
    }
    function r(a, d, b) {
        var c;
        return (c = e[d](a, b)) && (p ? (p = 0, c) : g(k(c), e[d + "Exclusions"]));
    }
    function s(a, d, b) {
        var c;
        if (a && !(1 === (c = a.nodeType) && (c = a.nodeName) && (c = c.toUpperCase()) && t[c]) && (1 === a.nodeType && (c = a.nodeValue) && (d[d.length] = c),
        b.a || b.t || b.s || !a.getAttribute || ((c = a.getAttribute("alt")) ? b.a = c : (c = a.getAttribute("title")) ? b.t = c : "IMG" == ("" + a.nodeName).toUpperCase() && (c = a.getAttribute("src") || a.src) && (b.s = c)),
        (c = a.childNodes) && c.length)) for (a = 0; a < c.length; a++) s(c[a], d, b);
    }
    function k(a) {
        if (null == a || void 0 == a) return a;
        try {
            return a.replace(RegExp("^[\\s\\n\\f\\r\\t\t-\r   ᠎ - \u2028\u2029 　\ufeff]+", "mg"), "").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r   ᠎ - \u2028\u2029 　\ufeff]+$", "mg"), "").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r   ᠎ - \u2028\u2029 　\ufeff]{1,}", "mg"), " ").substring(0, 254);
        } catch (d) { }
    }
    var e = this;
    e.s = f;
    var m = window;
    m.s_c_in || (m.s_c_il = [], m.s_c_in = 0);
    e._il = m.s_c_il;
    e._in = m.s_c_in;
    e._il[e._in] = e;
    m.s_c_in++;
    e._c = "s_m";
    e.c = {};
    var p = 0, t = {
        SCRIPT: 1,
        STYLE: 1,
        LINK: 1,
        CANVAS: 1
    };
    e._g = function () {
        var a, d, b, c = f.contextData, e = f.linkObject;
        (a = f.pageName || f.pageURL) && (d = r(e, "link", f.linkName)) && (b = r(e, "region")) && (c["a.activitymap.page"] = a.substring(0, 255),
        c["a.activitymap.link"] = 128 < d.length ? d.substring(0, 128) : d, c["a.activitymap.region"] = 127 < b.length ? b.substring(0, 127) : b,
        c["a.activitymap.pageIDType"] = f.pageName ? 1 : 0);
    };
    e.link = function (a, d) {
        var b;
        if (d) b = g(k(d), e.linkExclusions); else if ((b = a) && !(b = q(a, "sObjectId", "s-object-id", "s_objectID", 1))) {
            var c, f;
            (f = g(k(a.innerText || a.textContent), e.linkExclusions)) || (s(a, c = [], b = {
                a: void 0,
                t: void 0,
                s: void 0
            }), (f = g(k(c.join("")))) || (f = g(k(b.a ? b.a : b.t ? b.t : b.s ? b.s : void 0))) || !(c = (c = a.tagName) && c.toUpperCase ? c.toUpperCase() : "") || ("INPUT" == c || "SUBMIT" == c && a.value ? f = g(k(a.value)) : "IMAGE" == c && a.src && (f = g(k(a.src)))));
            b = f;
        }
        return b;
    };
    e.region = function (a) {
        for (var d, b = e.regionIDAttribute || "id"; a && (a = a.parentNode) ;) {
            if (d = q(a, b, b, b)) return d;
            if ("BODY" == a.nodeName) return "BODY";
        }
    };
}

/* End ActivityMap Module */
/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

AppMeasurement for JavaScript version: 2.4.0
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.adobe.com/marketing-cloud.html
*/
function AppMeasurement(r) {
    var a = this;
    a.version = "2.4.0";
    var k = window;
    k.s_c_in || (k.s_c_il = [], k.s_c_in = 0);
    a._il = k.s_c_il;
    a._in = k.s_c_in;
    a._il[a._in] = a;
    k.s_c_in++;
    a._c = "s_c";
    var p = k.AppMeasurement.Pb;
    p || (p = null);
    var n = k, m, s;
    try {
        for (m = n.parent, s = n.location; m && m.location && s && "" + m.location != "" + s && n.location && "" + m.location != "" + n.location && m.location.host == s.host;) n = m,
        m = n.parent;
    } catch (u) { }
    a.F = function (a) {
        try {
            console.log(a);
        } catch (b) { }
    };
    a.Ma = function (a) {
        return "" + parseInt(a) == "" + a;
    };
    a.replace = function (a, b, d) {
        return !a || 0 > a.indexOf(b) ? a : a.split(b).join(d);
    };
    a.escape = function (c) {
        var b, d;
        if (!c) return c;
        c = encodeURIComponent(c);
        for (b = 0; 7 > b; b++) d = "+~!*()'".substring(b, b + 1), 0 <= c.indexOf(d) && (c = a.replace(c, d, "%" + d.charCodeAt(0).toString(16).toUpperCase()));
        return c;
    };
    a.unescape = function (c) {
        if (!c) return c;
        c = 0 <= c.indexOf("+") ? a.replace(c, "+", " ") : c;
        try {
            return decodeURIComponent(c);
        } catch (b) { }
        return unescape(c);
    };
    a.wb = function () {
        var c = k.location.hostname, b = a.fpCookieDomainPeriods, d;
        b || (b = a.cookieDomainPeriods);
        if (c && !a.Ea && !/^[0-9.]+$/.test(c) && (b = b ? parseInt(b) : 2, b = 2 < b ? b : 2,
        d = c.lastIndexOf("."), 0 <= d)) {
            for (; 0 <= d && 1 < b;) d = c.lastIndexOf(".", d - 1), b--;
            a.Ea = 0 < d ? c.substring(d) : c;
        }
        return a.Ea;
    };
    a.c_r = a.cookieRead = function (c) {
        c = a.escape(c);
        var b = " " + a.d.cookie, d = b.indexOf(" " + c + "="), f = 0 > d ? d : b.indexOf(";", d);
        c = 0 > d ? "" : a.unescape(b.substring(d + 2 + c.length, 0 > f ? b.length : f));
        return "[[B]]" != c ? c : "";
    };
    a.c_w = a.cookieWrite = function (c, b, d) {
        var f = a.wb(), e = a.cookieLifetime, g;
        b = "" + b;
        e = e ? ("" + e).toUpperCase() : "";
        d && "SESSION" != e && "NONE" != e && ((g = "" != b ? parseInt(e ? e : 0) : -60) ? (d = new Date(),
        d.setTime(d.getTime() + 1e3 * g)) : 1 == d && (d = new Date(), g = d.getYear(),
        d.setYear(g + 5 + (1900 > g ? 1900 : 0))));
        return c && "NONE" != e ? (a.d.cookie = a.escape(c) + "=" + a.escape("" != b ? b : "[[B]]") + "; path=/;" + (d && "SESSION" != e ? " expires=" + d.toGMTString() + ";" : "") + (f ? " domain=" + f + ";" : ""),
        a.cookieRead(c) == b) : 0;
    };
    a.L = [];
    a.ia = function (c, b, d) {
        if (a.Fa) return 0;
        a.maxDelay || (a.maxDelay = 250);
        var f = 0, e = new Date().getTime() + a.maxDelay, g = a.d.visibilityState, h = ["webkitvisibilitychange", "visibilitychange"];
        g || (g = a.d.webkitVisibilityState);
        if (g && "prerender" == g) {
            if (!a.ja) for (a.ja = 1, d = 0; d < h.length; d++) a.d.addEventListener(h[d], function () {
                var c = a.d.visibilityState;
                c || (c = a.d.webkitVisibilityState);
                "visible" == c && (a.ja = 0, a.delayReady());
            });
            f = 1;
            e = 0;
        } else d || a.p("_d") && (f = 1);
        f && (a.L.push({
            m: c,
            a: b,
            t: e
        }), a.ja || setTimeout(a.delayReady, a.maxDelay));
        return f;
    };
    a.delayReady = function () {
        var c = new Date().getTime(), b = 0, d;
        for (a.p("_d") ? b = 1 : a.xa() ; 0 < a.L.length;) {
            d = a.L.shift();
            if (b && !d.t && d.t > c) {
                a.L.unshift(d);
                setTimeout(a.delayReady, parseInt(a.maxDelay / 2));
                break;
            }
            a.Fa = 1;
            a[d.m].apply(a, d.a);
            a.Fa = 0;
        }
    };
    a.setAccount = a.sa = function (c) {
        var b, d;
        if (!a.ia("setAccount", arguments)) if (a.account = c, a.allAccounts) for (b = a.allAccounts.concat(c.split(",")),
        a.allAccounts = [], b.sort(), d = 0; d < b.length; d++) 0 != d && b[d - 1] == b[d] || a.allAccounts.push(b[d]); else a.allAccounts = c.split(",");
    };
    a.foreachVar = function (c, b) {
        var d, f, e, g, h = "";
        e = f = "";
        if (a.lightProfileID) d = a.P, (h = a.lightTrackVars) && (h = "," + h + "," + a.na.join(",") + ","); else {
            d = a.g;
            if (a.pe || a.linkType) h = a.linkTrackVars, f = a.linkTrackEvents, a.pe && (e = a.pe.substring(0, 1).toUpperCase() + a.pe.substring(1),
            a[e] && (h = a[e].Nb, f = a[e].Mb));
            h && (h = "," + h + "," + a.H.join(",") + ",");
            f && h && (h += ",events,");
        }
        b && (b = "," + b + ",");
        for (f = 0; f < d.length; f++) e = d[f], (g = a[e]) && (!h || 0 <= h.indexOf("," + e + ",")) && (!b || 0 <= b.indexOf("," + e + ",")) && c(e, g);
    };
    a.r = function (c, b, d, f, e) {
        var g = "", h, l, k, q, m = 0;
        "contextData" == c && (c = "c");
        if (b) {
            for (h in b) if (!(Object.prototype[h] || e && h.substring(0, e.length) != e) && b[h] && (!d || 0 <= d.indexOf("," + (f ? f + "." : "") + h + ","))) {
                k = !1;
                if (m) for (l = 0; l < m.length; l++) h.substring(0, m[l].length) == m[l] && (k = !0);
                if (!k && ("" == g && (g += "&" + c + "."), l = b[h], e && (h = h.substring(e.length)),
                0 < h.length)) if (k = h.indexOf("."), 0 < k) l = h.substring(0, k), k = (e ? e : "") + l + ".",
                m || (m = []), m.push(k), g += a.r(l, b, d, f, k); else if ("boolean" == typeof l && (l = l ? "true" : "false"),
                l) {
                    if ("retrieveLightData" == f && 0 > e.indexOf(".contextData.")) switch (k = h.substring(0, 4),
                    q = h.substring(4), h) {
                        case "transactionID":
                            h = "xact";
                            break;

                        case "channel":
                            h = "ch";
                            break;

                        case "campaign":
                            h = "v0";
                            break;

                        default:
                            a.Ma(q) && ("prop" == k ? h = "c" + q : "eVar" == k ? h = "v" + q : "list" == k ? h = "l" + q : "hier" == k && (h = "h" + q,
                            l = l.substring(0, 255)));
                    }
                    g += "&" + a.escape(h) + "=" + a.escape(l);
                }
            }
            "" != g && (g += "&." + c);
        }
        return g;
    };
    a.usePostbacks = 0;
    a.zb = function () {
        var c = "", b, d, f, e, g, h, l, k, q = "", m = "", n = e = "";
        if (a.lightProfileID) b = a.P, (q = a.lightTrackVars) && (q = "," + q + "," + a.na.join(",") + ","); else {
            b = a.g;
            if (a.pe || a.linkType) q = a.linkTrackVars, m = a.linkTrackEvents, a.pe && (e = a.pe.substring(0, 1).toUpperCase() + a.pe.substring(1),
            a[e] && (q = a[e].Nb, m = a[e].Mb));
            q && (q = "," + q + "," + a.H.join(",") + ",");
            m && (m = "," + m + ",", q && (q += ",events,"));
            a.events2 && (n += ("" != n ? "," : "") + a.events2);
        }
        if (a.visitor && a.visitor.getCustomerIDs) {
            e = p;
            if (g = a.visitor.getCustomerIDs()) for (d in g) Object.prototype[d] || (f = g[d],
            "object" == typeof f && (e || (e = {}), f.id && (e[d + ".id"] = f.id), f.authState && (e[d + ".as"] = f.authState)));
            e && (c += a.r("cid", e));
        }
        a.AudienceManagement && a.AudienceManagement.isReady() && (c += a.r("d", a.AudienceManagement.getEventCallConfigParams()));
        for (d = 0; d < b.length; d++) {
            e = b[d];
            g = a[e];
            f = e.substring(0, 4);
            h = e.substring(4);
            g || ("events" == e && n ? (g = n, n = "") : "marketingCloudOrgID" == e && a.visitor && (g = a.visitor.marketingCloudOrgID));
            if (g && (!q || 0 <= q.indexOf("," + e + ","))) {
                switch (e) {
                    case "customerPerspective":
                        e = "cp";
                        break;

                    case "marketingCloudOrgID":
                        e = "mcorgid";
                        break;

                    case "supplementalDataID":
                        e = "sdid";
                        break;

                    case "timestamp":
                        e = "ts";
                        break;

                    case "dynamicVariablePrefix":
                        e = "D";
                        break;

                    case "visitorID":
                        e = "vid";
                        break;

                    case "marketingCloudVisitorID":
                        e = "mid";
                        break;

                    case "analyticsVisitorID":
                        e = "aid";
                        break;

                    case "audienceManagerLocationHint":
                        e = "aamlh";
                        break;

                    case "audienceManagerBlob":
                        e = "aamb";
                        break;

                    case "authState":
                        e = "as";
                        break;

                    case "pageURL":
                        e = "g";
                        255 < g.length && (a.pageURLRest = g.substring(255), g = g.substring(0, 255));
                        break;

                    case "pageURLRest":
                        e = "-g";
                        break;

                    case "referrer":
                        e = "r";
                        break;

                    case "vmk":
                    case "visitorMigrationKey":
                        e = "vmt";
                        break;

                    case "visitorMigrationServer":
                        e = "vmf";
                        a.ssl && a.visitorMigrationServerSecure && (g = "");
                        break;

                    case "visitorMigrationServerSecure":
                        e = "vmf";
                        !a.ssl && a.visitorMigrationServer && (g = "");
                        break;

                    case "charSet":
                        e = "ce";
                        break;

                    case "visitorNamespace":
                        e = "ns";
                        break;

                    case "cookieDomainPeriods":
                        e = "cdp";
                        break;

                    case "cookieLifetime":
                        e = "cl";
                        break;

                    case "variableProvider":
                        e = "vvp";
                        break;

                    case "currencyCode":
                        e = "cc";
                        break;

                    case "channel":
                        e = "ch";
                        break;

                    case "transactionID":
                        e = "xact";
                        break;

                    case "campaign":
                        e = "v0";
                        break;

                    case "latitude":
                        e = "lat";
                        break;

                    case "longitude":
                        e = "lon";
                        break;

                    case "resolution":
                        e = "s";
                        break;

                    case "colorDepth":
                        e = "c";
                        break;

                    case "javascriptVersion":
                        e = "j";
                        break;

                    case "javaEnabled":
                        e = "v";
                        break;

                    case "cookiesEnabled":
                        e = "k";
                        break;

                    case "browserWidth":
                        e = "bw";
                        break;

                    case "browserHeight":
                        e = "bh";
                        break;

                    case "connectionType":
                        e = "ct";
                        break;

                    case "homepage":
                        e = "hp";
                        break;

                    case "events":
                        n && (g += ("" != g ? "," : "") + n);
                        if (m) for (h = g.split(","), g = "", f = 0; f < h.length; f++) l = h[f], k = l.indexOf("="),
                        0 <= k && (l = l.substring(0, k)), k = l.indexOf(":"), 0 <= k && (l = l.substring(0, k)),
                        0 <= m.indexOf("," + l + ",") && (g += (g ? "," : "") + h[f]);
                        break;

                    case "events2":
                        g = "";
                        break;

                    case "contextData":
                        c += a.r("c", a[e], q, e);
                        g = "";
                        break;

                    case "lightProfileID":
                        e = "mtp";
                        break;

                    case "lightStoreForSeconds":
                        e = "mtss";
                        a.lightProfileID || (g = "");
                        break;

                    case "lightIncrementBy":
                        e = "mti";
                        a.lightProfileID || (g = "");
                        break;

                    case "retrieveLightProfiles":
                        e = "mtsr";
                        break;

                    case "deleteLightProfiles":
                        e = "mtsd";
                        break;

                    case "retrieveLightData":
                        a.retrieveLightProfiles && (c += a.r("mts", a[e], q, e));
                        g = "";
                        break;

                    default:
                        a.Ma(h) && ("prop" == f ? e = "c" + h : "eVar" == f ? e = "v" + h : "list" == f ? e = "l" + h : "hier" == f && (e = "h" + h,
                        g = g.substring(0, 255)));
                }
                g && (c += "&" + e + "=" + ("pev" != e.substring(0, 3) ? a.escape(g) : g));
            }
            "pev3" == e && a.e && (c += a.e);
        }
        return c;
    };
    a.D = function (a) {
        var b = a.tagName;
        if ("undefined" != "" + a.Sb || "undefined" != "" + a.Ib && "HTML" != ("" + a.Ib).toUpperCase()) return "";
        b = b && b.toUpperCase ? b.toUpperCase() : "";
        "SHAPE" == b && (b = "");
        b && (("INPUT" == b || "BUTTON" == b) && a.type && a.type.toUpperCase ? b = a.type.toUpperCase() : !b && a.href && (b = "A"));
        return b;
    };
    a.Ia = function (a) {
        var b = k.location, d = a.href ? a.href : "", f, e, g;
        f = d.indexOf(":");
        e = d.indexOf("?");
        g = d.indexOf("/");
        d && (0 > f || 0 <= e && f > e || 0 <= g && f > g) && (e = a.protocol && 1 < a.protocol.length ? a.protocol : b.protocol ? b.protocol : "",
        f = b.pathname.lastIndexOf("/"), d = (e ? e + "//" : "") + (a.host ? a.host : b.host ? b.host : "") + ("/" != d.substring(0, 1) ? b.pathname.substring(0, 0 > f ? 0 : f) + "/" : "") + d);
        return d;
    };
    a.M = function (c) {
        var b = a.D(c), d, f, e = "", g = 0;
        return b && (d = c.protocol, f = c.onclick, !c.href || "A" != b && "AREA" != b || f && d && !(0 > d.toLowerCase().indexOf("javascript")) ? f ? (e = a.replace(a.replace(a.replace(a.replace("" + f, "\r", ""), "\n", ""), "\t", ""), " ", ""),
        g = 2) : "INPUT" == b || "SUBMIT" == b ? (c.value ? e = c.value : c.innerText ? e = c.innerText : c.textContent && (e = c.textContent),
        g = 3) : "IMAGE" == b && c.src && (e = c.src) : e = a.Ia(c), e) ? {
            id: e.substring(0, 100),
            type: g
        } : 0;
    };
    a.Qb = function (c) {
        for (var b = a.D(c), d = a.M(c) ; c && !d && "BODY" != b;) if (c = c.parentElement ? c.parentElement : c.parentNode) b = a.D(c),
        d = a.M(c);
        d && "BODY" != b || (c = 0);
        c && (b = c.onclick ? "" + c.onclick : "", 0 <= b.indexOf(".tl(") || 0 <= b.indexOf(".trackLink(")) && (c = 0);
        return c;
    };
    a.Hb = function () {
        var c, b, d = a.linkObject, f = a.linkType, e = a.linkURL, g, h;
        a.oa = 1;
        d || (a.oa = 0, d = a.clickObject);
        if (d) {
            c = a.D(d);
            for (b = a.M(d) ; d && !b && "BODY" != c;) if (d = d.parentElement ? d.parentElement : d.parentNode) c = a.D(d),
            b = a.M(d);
            b && "BODY" != c || (d = 0);
            if (d && !a.linkObject) {
                var l = d.onclick ? "" + d.onclick : "";
                if (0 <= l.indexOf(".tl(") || 0 <= l.indexOf(".trackLink(")) d = 0;
            }
        } else a.oa = 1;
        !e && d && (e = a.Ia(d));
        e && !a.linkLeaveQueryString && (g = e.indexOf("?"), 0 <= g && (e = e.substring(0, g)));
        if (!f && e) {
            var m = 0, q = 0, n;
            if (a.trackDownloadLinks && a.linkDownloadFileTypes) for (l = e.toLowerCase(), g = l.indexOf("?"),
            h = l.indexOf("#"), 0 <= g ? 0 <= h && h < g && (g = h) : g = h, 0 <= g && (l = l.substring(0, g)),
            g = a.linkDownloadFileTypes.toLowerCase().split(","), h = 0; h < g.length; h++) (n = g[h]) && l.substring(l.length - (n.length + 1)) == "." + n && (f = "d");
            if (a.trackExternalLinks && !f && (l = e.toLowerCase(), a.La(l) && (a.linkInternalFilters || (a.linkInternalFilters = k.location.hostname),
            g = 0, a.linkExternalFilters ? (g = a.linkExternalFilters.toLowerCase().split(","),
            m = 1) : a.linkInternalFilters && (g = a.linkInternalFilters.toLowerCase().split(",")),
            g))) {
                for (h = 0; h < g.length; h++) n = g[h], 0 <= l.indexOf(n) && (q = 1);
                q ? m && (f = "e") : m || (f = "e");
            }
        }
        a.linkObject = d;
        a.linkURL = e;
        a.linkType = f;
        if (a.trackClickMap || a.trackInlineStats) a.e = "", d && (f = a.pageName, e = 1,
        d = d.sourceIndex, f || (f = a.pageURL, e = 0), k.s_objectID && (b.id = k.s_objectID,
        d = b.type = 1), f && b && b.id && c && (a.e = "&pid=" + a.escape(f.substring(0, 255)) + (e ? "&pidt=" + e : "") + "&oid=" + a.escape(b.id.substring(0, 100)) + (b.type ? "&oidt=" + b.type : "") + "&ot=" + c + (d ? "&oi=" + d : "")));
    };
    a.Ab = function () {
        var c = a.oa, b = a.linkType, d = a.linkURL, f = a.linkName;
        b && (d || f) && (b = b.toLowerCase(), "d" != b && "e" != b && (b = "o"), a.pe = "lnk_" + b,
        a.pev1 = d ? a.escape(d) : "", a.pev2 = f ? a.escape(f) : "", c = 1);
        a.abort && (c = 0);
        if (a.trackClickMap || a.trackInlineStats || a.ActivityMap) {
            var b = {}, d = 0, e = a.cookieRead("s_sq"), g = e ? e.split("&") : 0, h, l, k, e = 0;
            if (g) for (h = 0; h < g.length; h++) l = g[h].split("="), f = a.unescape(l[0]).split(","),
            l = a.unescape(l[1]), b[l] = f;
            f = a.account.split(",");
            h = {};
            for (k in a.contextData) k && !Object.prototype[k] && "a.activitymap." == k.substring(0, 14) && (h[k] = a.contextData[k],
            a.contextData[k] = "");
            a.e = a.r("c", h) + (a.e ? a.e : "");
            if (c || a.e) {
                c && !a.e && (e = 1);
                for (l in b) if (!Object.prototype[l]) for (k = 0; k < f.length; k++) for (e && (g = b[l].join(","),
                g == a.account && (a.e += ("&" != l.charAt(0) ? "&" : "") + l, b[l] = [], d = 1)),
                h = 0; h < b[l].length; h++) g = b[l][h], g == f[k] && (e && (a.e += "&u=" + a.escape(g) + ("&" != l.charAt(0) ? "&" : "") + l + "&u=0"),
                b[l].splice(h, 1), d = 1);
                c || (d = 1);
                if (d) {
                    e = "";
                    h = 2;
                    !c && a.e && (e = a.escape(f.join(",")) + "=" + a.escape(a.e), h = 1);
                    for (l in b) !Object.prototype[l] && 0 < h && 0 < b[l].length && (e += (e ? "&" : "") + a.escape(b[l].join(",")) + "=" + a.escape(l),
                    h--);
                    a.cookieWrite("s_sq", e);
                }
            }
        }
        return c;
    };
    a.Bb = function () {
        if (!a.Lb) {
            var c = new Date(), b = n.location, d, f, e = f = d = "", g = "", h = "", l = "1.2", k = a.cookieWrite("s_cc", "true", 0) ? "Y" : "N", m = "", p = "";
            if (c.setUTCDate && (l = "1.3", (0).toPrecision && (l = "1.5", c = [], c.forEach))) {
                l = "1.6";
                f = 0;
                d = {};
                try {
                    f = new Iterator(d), f.next && (l = "1.7", c.reduce && (l = "1.8", l.trim && (l = "1.8.1",
                    Date.parse && (l = "1.8.2", Object.create && (l = "1.8.5")))));
                } catch (r) { }
            }
            d = screen.width + "x" + screen.height;
            e = navigator.javaEnabled() ? "Y" : "N";
            f = screen.pixelDepth ? screen.pixelDepth : screen.colorDepth;
            g = a.w.innerWidth ? a.w.innerWidth : a.d.documentElement.offsetWidth;
            h = a.w.innerHeight ? a.w.innerHeight : a.d.documentElement.offsetHeight;
            try {
                a.b.addBehavior("#default#homePage"), m = a.b.Rb(b) ? "Y" : "N";
            } catch (s) { }
            try {
                a.b.addBehavior("#default#clientCaps"), p = a.b.connectionType;
            } catch (t) { }
            a.resolution = d;
            a.colorDepth = f;
            a.javascriptVersion = l;
            a.javaEnabled = e;
            a.cookiesEnabled = k;
            a.browserWidth = g;
            a.browserHeight = h;
            a.connectionType = p;
            a.homepage = m;
            a.Lb = 1;
        }
    };
    a.Q = {};
    a.loadModule = function (c, b) {
        var d = a.Q[c];
        if (!d) {
            d = k["AppMeasurement_Module_" + c] ? new k["AppMeasurement_Module_" + c](a) : {};
            a.Q[c] = a[c] = d;
            d.eb = function () {
                return d.ib;
            };
            d.jb = function (b) {
                if (d.ib = b) a[c + "_onLoad"] = b, a.ia(c + "_onLoad", [a, d], 1) || b(a, d);
            };
            try {
                Object.defineProperty ? Object.defineProperty(d, "onLoad", {
                    get: d.eb,
                    set: d.jb
                }) : d._olc = 1;
            } catch (f) {
                d._olc = 1;
            }
        }
        b && (a[c + "_onLoad"] = b, a.ia(c + "_onLoad", [a, d], 1) || b(a, d));
    };
    a.p = function (c) {
        var b, d;
        for (b in a.Q) if (!Object.prototype[b] && (d = a.Q[b]) && (d._olc && d.onLoad && (d._olc = 0,
        d.onLoad(a, d)), d[c] && d[c]())) return 1;
        return 0;
    };
    a.Db = function () {
        var c = Math.floor(1e13 * Math.random()), b = a.visitorSampling, d = a.visitorSamplingGroup, d = "s_vsn_" + (a.visitorNamespace ? a.visitorNamespace : a.account) + (d ? "_" + d : ""), f = a.cookieRead(d);
        if (b) {
            b *= 100;
            f && (f = parseInt(f));
            if (!f) {
                if (!a.cookieWrite(d, c)) return 0;
                f = c;
            }
            if (f % 1e4 > b) return 0;
        }
        return 1;
    };
    a.R = function (c, b) {
        var d, f, e, g, h, l;
        for (d = 0; 2 > d; d++) for (f = 0 < d ? a.Aa : a.g, e = 0; e < f.length; e++) if (g = f[e],
        (h = c[g]) || c["!" + g]) {
            if (!b && ("contextData" == g || "retrieveLightData" == g) && a[g]) for (l in a[g]) h[l] || (h[l] = a[g][l]);
            a[g] = h;
        }
    };
    a.Va = function (c, b) {
        var d, f, e, g;
        for (d = 0; 2 > d; d++) for (f = 0 < d ? a.Aa : a.g, e = 0; e < f.length; e++) g = f[e],
        c[g] = a[g], b || c[g] || (c["!" + g] = 1);
    };
    a.vb = function (a) {
        var b, d, f, e, g, h = 0, l, k = "", m = "";
        if (a && 255 < a.length && (b = "" + a, d = b.indexOf("?"), 0 < d && (l = b.substring(d + 1),
        b = b.substring(0, d), e = b.toLowerCase(), f = 0, "http://" == e.substring(0, 7) ? f += 7 : "https://" == e.substring(0, 8) && (f += 8),
        d = e.indexOf("/", f), 0 < d && (e = e.substring(f, d), g = b.substring(d), b = b.substring(0, d),
        0 <= e.indexOf("google") ? h = ",q,ie,start,search_key,word,kw,cd," : 0 <= e.indexOf("yahoo.co") && (h = ",p,ei,"),
        h && l)))) {
            if ((a = l.split("&")) && 1 < a.length) {
                for (f = 0; f < a.length; f++) e = a[f], d = e.indexOf("="), 0 < d && 0 <= h.indexOf("," + e.substring(0, d) + ",") ? k += (k ? "&" : "") + e : m += (m ? "&" : "") + e;
                k && m ? l = k + "&" + m : m = "";
            }
            d = 253 - (l.length - m.length) - b.length;
            a = b + (0 < d ? g.substring(0, d) : "") + "?" + l;
        }
        return a;
    };
    a.ab = function (c) {
        var b = a.d.visibilityState, d = ["webkitvisibilitychange", "visibilitychange"];
        b || (b = a.d.webkitVisibilityState);
        if (b && "prerender" == b) {
            if (c) for (b = 0; b < d.length; b++) a.d.addEventListener(d[b], function () {
                var b = a.d.visibilityState;
                b || (b = a.d.webkitVisibilityState);
                "visible" == b && c();
            });
            return !1;
        }
        return !0;
    };
    a.ea = !1;
    a.J = !1;
    a.lb = function () {
        a.J = !0;
        a.j();
    };
    a.ca = !1;
    a.V = !1;
    a.hb = function (c) {
        a.marketingCloudVisitorID = c;
        a.V = !0;
        a.j();
    };
    a.fa = !1;
    a.W = !1;
    a.mb = function (c) {
        a.visitorOptedOut = c;
        a.W = !0;
        a.j();
    };
    a.Z = !1;
    a.S = !1;
    a.Xa = function (c) {
        a.analyticsVisitorID = c;
        a.S = !0;
        a.j();
    };
    a.ba = !1;
    a.U = !1;
    a.Za = function (c) {
        a.audienceManagerLocationHint = c;
        a.U = !0;
        a.j();
    };
    a.aa = !1;
    a.T = !1;
    a.Ya = function (c) {
        a.audienceManagerBlob = c;
        a.T = !0;
        a.j();
    };
    a.$a = function (c) {
        a.maxDelay || (a.maxDelay = 250);
        return a.p("_d") ? (c && setTimeout(function () {
            c();
        }, a.maxDelay), !1) : !0;
    };
    a.da = !1;
    a.I = !1;
    a.xa = function () {
        a.I = !0;
        a.j();
    };
    a.isReadyToTrack = function () {
        var c = !0, b = a.visitor, d, f, e;
        a.ea || a.J || (a.ab(a.lb) ? a.J = !0 : a.ea = !0);
        if (a.ea && !a.J) return !1;
        b && b.isAllowed() && (a.ca || a.marketingCloudVisitorID || !b.getMarketingCloudVisitorID || (a.ca = !0,
        a.marketingCloudVisitorID = b.getMarketingCloudVisitorID([a, a.hb]), a.marketingCloudVisitorID && (a.V = !0)),
        a.fa || a.visitorOptedOut || !b.isOptedOut || (a.fa = !0, a.visitorOptedOut = b.isOptedOut([a, a.mb]),
        a.visitorOptedOut != p && (a.W = !0)), a.Z || a.analyticsVisitorID || !b.getAnalyticsVisitorID || (a.Z = !0,
        a.analyticsVisitorID = b.getAnalyticsVisitorID([a, a.Xa]), a.analyticsVisitorID && (a.S = !0)),
        a.ba || a.audienceManagerLocationHint || !b.getAudienceManagerLocationHint || (a.ba = !0,
        a.audienceManagerLocationHint = b.getAudienceManagerLocationHint([a, a.Za]), a.audienceManagerLocationHint && (a.U = !0)),
        a.aa || a.audienceManagerBlob || !b.getAudienceManagerBlob || (a.aa = !0, a.audienceManagerBlob = b.getAudienceManagerBlob([a, a.Ya]),
        a.audienceManagerBlob && (a.T = !0)), c = a.ca && !a.V && !a.marketingCloudVisitorID,
        b = a.Z && !a.S && !a.analyticsVisitorID, d = a.ba && !a.U && !a.audienceManagerLocationHint,
        f = a.aa && !a.T && !a.audienceManagerBlob, e = a.fa && !a.W, c = c || b || d || f || e ? !1 : !0);
        a.da || a.I || (a.$a(a.xa) ? a.I = !0 : a.da = !0);
        a.da && !a.I && (c = !1);
        return c;
    };
    a.o = p;
    a.u = 0;
    a.callbackWhenReadyToTrack = function (c, b, d) {
        var f;
        f = {};
        f.qb = c;
        f.pb = b;
        f.nb = d;
        a.o == p && (a.o = []);
        a.o.push(f);
        0 == a.u && (a.u = setInterval(a.j, 100));
    };
    a.j = function () {
        var c;
        if (a.isReadyToTrack() && (a.kb(), a.o != p)) for (; 0 < a.o.length;) c = a.o.shift(),
        c.pb.apply(c.qb, c.nb);
    };
    a.kb = function () {
        a.u && (clearInterval(a.u), a.u = 0);
    };
    a.fb = function (c) {
        var b, d, f = p, e = p;
        if (!a.isReadyToTrack()) {
            b = [];
            if (c != p) for (d in f = {}, c) f[d] = c[d];
            e = {};
            a.Va(e, !0);
            b.push(f);
            b.push(e);
            a.callbackWhenReadyToTrack(a, a.track, b);
            return !0;
        }
        return !1;
    };
    a.xb = function () {
        var c = a.cookieRead("s_fid"), b = "", d = "", f;
        f = 8;
        var e = 4;
        if (!c || 0 > c.indexOf("-")) {
            for (c = 0; 16 > c; c++) f = Math.floor(Math.random() * f), b += "0123456789ABCDEF".substring(f, f + 1),
            f = Math.floor(Math.random() * e), d += "0123456789ABCDEF".substring(f, f + 1),
            f = e = 16;
            c = b + "-" + d;
        }
        a.cookieWrite("s_fid", c, 1) || (c = 0);
        return c;
    };
    a.t = a.track = function (c, b) {
        var d, f = new Date(), e = "s" + Math.floor(f.getTime() / 108e5) % 10 + Math.floor(1e13 * Math.random()), g = f.getYear(), g = "t=" + a.escape(f.getDate() + "/" + f.getMonth() + "/" + (1900 > g ? g + 1900 : g) + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds() + " " + f.getDay() + " " + f.getTimezoneOffset());
        a.visitor && a.visitor.getAuthState && (a.authState = a.visitor.getAuthState());
        a.p("_s");
        a.fb(c) || (b && a.R(b), c && (d = {}, a.Va(d, 0), a.R(c)), a.Db() && !a.visitorOptedOut && (a.analyticsVisitorID || a.marketingCloudVisitorID || (a.fid = a.xb()),
        a.Hb(), a.usePlugins && a.doPlugins && a.doPlugins(a), a.account && (a.abort || (a.trackOffline && !a.timestamp && (a.timestamp = Math.floor(f.getTime() / 1e3)),
        f = k.location, a.pageURL || (a.pageURL = f.href ? f.href : f), a.referrer || a.Wa || (f = a.Util.getQueryParam("adobe_mc_ref", null, null, !0),
        a.referrer = f || void 0 === f ? void 0 === f ? "" : f : n.document.referrer), a.Wa = 1,
        a.referrer = a.vb(a.referrer), a.p("_g")), a.Ab() && !a.abort && (a.visitor && !a.supplementalDataID && a.visitor.getSupplementalDataID && (a.supplementalDataID = a.visitor.getSupplementalDataID("AppMeasurement:" + a._in, a.expectSupplementalData ? !1 : !0)),
        a.Bb(), g += a.zb(), a.Gb(e, g), a.p("_t"), a.referrer = ""))), c && a.R(d, 1));
        a.abort = a.supplementalDataID = a.timestamp = a.pageURLRest = a.linkObject = a.clickObject = a.linkURL = a.linkName = a.linkType = k.s_objectID = a.pe = a.pev1 = a.pev2 = a.pev3 = a.e = a.lightProfileID = 0;
    };
    a.za = [];
    a.registerPreTrackCallback = function (c) {
        for (var b = [], d = 1; d < arguments.length; d++) b.push(arguments[d]);
        "function" == typeof c ? a.za.push([c, b]) : a.debugTracking && a.F("DEBUG: Non function type passed to registerPreTrackCallback");
    };
    a.cb = function (c) {
        a.wa(a.za, c);
    };
    a.ya = [];
    a.registerPostTrackCallback = function (c) {
        for (var b = [], d = 1; d < arguments.length; d++) b.push(arguments[d]);
        "function" == typeof c ? a.ya.push([c, b]) : a.debugTracking && a.F("DEBUG: Non function type passed to registerPostTrackCallback");
    };
    a.bb = function (c) {
        a.wa(a.ya, c);
    };
    a.wa = function (c, b) {
        if ("object" == typeof c) for (var d = 0; d < c.length; d++) {
            var f = c[d][0], e = c[d][1];
            e.unshift(b);
            if ("function" == typeof f) try {
                f.apply(null, e);
            } catch (g) {
                a.debugTracking && a.F(g.message);
            }
        }
    };
    a.tl = a.trackLink = function (c, b, d, f, e) {
        a.linkObject = c;
        a.linkType = b;
        a.linkName = d;
        e && (a.l = c, a.A = e);
        return a.track(f);
    };
    a.trackLight = function (c, b, d, f) {
        a.lightProfileID = c;
        a.lightStoreForSeconds = b;
        a.lightIncrementBy = d;
        return a.track(f);
    };
    a.clearVars = function () {
        var c, b;
        for (c = 0; c < a.g.length; c++) if (b = a.g[c], "prop" == b.substring(0, 4) || "eVar" == b.substring(0, 4) || "hier" == b.substring(0, 4) || "list" == b.substring(0, 4) || "channel" == b || "events" == b || "eventList" == b || "products" == b || "productList" == b || "purchaseID" == b || "transactionID" == b || "state" == b || "zip" == b || "campaign" == b) a[b] = void 0;
    };
    a.tagContainerMarker = "";
    a.Gb = function (c, b) {
        var d, f = a.trackingServer;
        d = "";
        var e = a.dc, g = "sc.", h = a.visitorNamespace;
        f ? a.trackingServerSecure && a.ssl && (f = a.trackingServerSecure) : (h || (h = a.account,
        f = h.indexOf(","), 0 <= f && (h = h.substring(0, f)), h = h.replace(/[^A-Za-z0-9]/g, "")),
        d || (d = "2o7.net"), e = e ? ("" + e).toLowerCase() : "d1", "2o7.net" == d && ("d1" == e ? e = "112" : "d2" == e && (e = "122"),
        g = ""), f = h + "." + e + "." + g + d);
        d = a.ssl ? "https://" : "http://";
        e = a.AudienceManagement && a.AudienceManagement.isReady() || 0 != a.usePostbacks;
        d += f + "/b/ss/" + a.account + "/" + (a.mobile ? "5." : "") + (e ? "10" : "1") + "/JS-" + a.version + (a.Kb ? "T" : "") + (a.tagContainerMarker ? "-" + a.tagContainerMarker : "") + "/" + c + "?AQB=1&ndh=1&pf=1&" + (e ? "callback=s_c_il[" + a._in + "].doPostbacks&et=1&" : "") + b + "&AQE=1";
        a.cb(d);
        a.tb(d);
        a.ka();
    };
    a.Ua = /{(%?)(.*?)(%?)}/;
    a.Ob = RegExp(a.Ua.source, "g");
    a.ub = function (c) {
        if ("object" == typeof c.dests) for (var b = 0; b < c.dests.length; ++b) {
            var d = c.dests[b];
            if ("string" == typeof d.c && "aa." == d.id.substr(0, 3)) for (var f = d.c.match(a.Ob), e = 0; e < f.length; ++e) {
                var g = f[e], h = g.match(a.Ua), k = "";
                "%" == h[1] && "timezone_offset" == h[2] ? k = new Date().getTimezoneOffset() : "%" == h[1] && "timestampz" == h[2] && (k = a.yb());
                d.c = d.c.replace(g, a.escape(k));
            }
        }
    };
    a.yb = function () {
        var c = new Date(), b = new Date(6e4 * Math.abs(c.getTimezoneOffset()));
        return a.k(4, c.getFullYear()) + "-" + a.k(2, c.getMonth() + 1) + "-" + a.k(2, c.getDate()) + "T" + a.k(2, c.getHours()) + ":" + a.k(2, c.getMinutes()) + ":" + a.k(2, c.getSeconds()) + (0 < c.getTimezoneOffset() ? "-" : "+") + a.k(2, b.getUTCHours()) + ":" + a.k(2, b.getUTCMinutes());
    };
    a.k = function (a, b) {
        return (Array(a + 1).join(0) + b).slice(-a);
    };
    a.ta = {};
    a.doPostbacks = function (c) {
        if ("object" == typeof c) if (a.ub(c), "object" == typeof a.AudienceManagement && "function" == typeof a.AudienceManagement.isReady && a.AudienceManagement.isReady() && "function" == typeof a.AudienceManagement.passData) a.AudienceManagement.passData(c); else if ("object" == typeof c && "object" == typeof c.dests) for (var b = 0; b < c.dests.length; ++b) {
            var d = c.dests[b];
            "object" == typeof d && "string" == typeof d.c && "string" == typeof d.id && "aa." == d.id.substr(0, 3) && (a.ta[d.id] = new Image(),
            a.ta[d.id].alt = "", a.ta[d.id].src = d.c);
        }
    };
    a.tb = function (c) {
        a.i || a.Cb();
        a.i.push(c);
        a.ma = a.C();
        a.Sa();
    };
    a.Cb = function () {
        a.i = a.Eb();
        a.i || (a.i = []);
    };
    a.Eb = function () {
        var c, b;
        if (a.ra()) {
            try {
                (b = k.localStorage.getItem(a.pa())) && (c = k.JSON.parse(b));
            } catch (d) { }
            return c;
        }
    };
    a.ra = function () {
        var c = !0;
        a.trackOffline && a.offlineFilename && k.localStorage && k.JSON || (c = !1);
        return c;
    };
    a.Ja = function () {
        var c = 0;
        a.i && (c = a.i.length);
        a.q && c++;
        return c;
    };
    a.ka = function () {
        if (a.q && (a.B && a.B.complete && a.B.G && a.B.va(), a.q)) return;
        a.Ka = p;
        if (a.qa) a.ma > a.O && a.Qa(a.i), a.ua(500); else {
            var c = a.ob();
            if (0 < c) a.ua(c); else if (c = a.Ga()) a.q = 1, a.Fb(c), a.Jb(c);
        }
    };
    a.ua = function (c) {
        a.Ka || (c || (c = 0), a.Ka = setTimeout(a.ka, c));
    };
    a.ob = function () {
        var c;
        if (!a.trackOffline || 0 >= a.offlineThrottleDelay) return 0;
        c = a.C() - a.Pa;
        return a.offlineThrottleDelay < c ? 0 : a.offlineThrottleDelay - c;
    };
    a.Ga = function () {
        if (0 < a.i.length) return a.i.shift();
    };
    a.Fb = function (c) {
        if (a.debugTracking) {
            var b = "AppMeasurement Debug: " + c;
            c = c.split("&");
            var d;
            for (d = 0; d < c.length; d++) b += "\n\t" + a.unescape(c[d]);
            a.F(b);
        }
    };
    a.gb = function () {
        return a.marketingCloudVisitorID || a.analyticsVisitorID;
    };
    a.Y = !1;
    var t;
    try {
        t = JSON.parse('{"x":"y"}');
    } catch (w) {
        t = null;
    }
    t && "y" == t.x ? (a.Y = !0, a.X = function (a) {
        return JSON.parse(a);
    }) : k.$ && k.$.parseJSON ? (a.X = function (a) {
        return k.$.parseJSON(a);
    }, a.Y = !0) : a.X = function () {
        return null;
    };
    a.Jb = function (c) {
        var b, d, f;
        a.gb() && 2047 < c.length && ("undefined" != typeof XMLHttpRequest && (b = new XMLHttpRequest(),
        "withCredentials" in b ? d = 1 : b = 0), b || "undefined" == typeof XDomainRequest || (b = new XDomainRequest(),
        d = 2), b && (a.AudienceManagement && a.AudienceManagement.isReady() || 0 != a.usePostbacks) && (a.Y ? b.Ba = !0 : b = 0));
        !b && a.Ta && (c = c.substring(0, 2047));
        !b && a.d.createElement && (0 != a.usePostbacks || a.AudienceManagement && a.AudienceManagement.isReady()) && (b = a.d.createElement("SCRIPT")) && "async" in b && ((f = (f = a.d.getElementsByTagName("HEAD")) && f[0] ? f[0] : a.d.body) ? (b.type = "text/javascript",
        b.setAttribute("async", "async"), d = 3) : b = 0);
        b || (b = new Image(), b.alt = "", b.abort || "undefined" === typeof k.InstallTrigger || (b.abort = function () {
            b.src = p;
        }));
        b.Da = function () {
            try {
                b.G && (clearTimeout(b.G), b.G = 0);
            } catch (a) { }
        };
        b.onload = b.va = function () {
            a.bb(c);
            b.Da();
            a.sb();
            a.ga();
            a.q = 0;
            a.ka();
            if (b.Ba) {
                b.Ba = !1;
                try {
                    a.doPostbacks(a.X(b.responseText));
                } catch (d) { }
            }
        };
        b.onabort = b.onerror = b.Ha = function () {
            b.Da();
            (a.trackOffline || a.qa) && a.q && a.i.unshift(a.rb);
            a.q = 0;
            a.ma > a.O && a.Qa(a.i);
            a.ga();
            a.ua(500);
        };
        b.onreadystatechange = function () {
            4 == b.readyState && (200 == b.status ? b.va() : b.Ha());
        };
        a.Pa = a.C();
        if (1 == d || 2 == d) {
            var e = c.indexOf("?");
            f = c.substring(0, e);
            e = c.substring(e + 1);
            e = e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/, "");
            1 == d ? (b.open("POST", f, !0), b.send(e)) : 2 == d && (b.open("POST", f), b.send(e));
        } else if (b.src = c, 3 == d) {
            if (a.Na) try {
                f.removeChild(a.Na);
            } catch (g) { }
            f.firstChild ? f.insertBefore(b, f.firstChild) : f.appendChild(b);
            a.Na = a.B;
        }
        b.G = setTimeout(function () {
            b.G && (b.complete ? b.va() : (a.trackOffline && b.abort && b.abort(), b.Ha()));
        }, 5e3);
        a.rb = c;
        a.B = k["s_i_" + a.replace(a.account, ",", "_")] = b;
        if (a.useForcedLinkTracking && a.K || a.A) a.forcedLinkTrackingTimeout || (a.forcedLinkTrackingTimeout = 250),
        a.ha = setTimeout(a.ga, a.forcedLinkTrackingTimeout);
    };
    a.sb = function () {
        if (a.ra() && !(a.Oa > a.O)) try {
            k.localStorage.removeItem(a.pa()), a.Oa = a.C();
        } catch (c) { }
    };
    a.Qa = function (c) {
        if (a.ra()) {
            a.Sa();
            try {
                k.localStorage.setItem(a.pa(), k.JSON.stringify(c)), a.O = a.C();
            } catch (b) { }
        }
    };
    a.Sa = function () {
        if (a.trackOffline) {
            if (!a.offlineLimit || 0 >= a.offlineLimit) a.offlineLimit = 10;
            for (; a.i.length > a.offlineLimit;) a.Ga();
        }
    };
    a.forceOffline = function () {
        a.qa = !0;
    };
    a.forceOnline = function () {
        a.qa = !1;
    };
    a.pa = function () {
        return a.offlineFilename + "-" + a.visitorNamespace + a.account;
    };
    a.C = function () {
        return new Date().getTime();
    };
    a.La = function (a) {
        a = a.toLowerCase();
        return 0 != a.indexOf("#") && 0 != a.indexOf("about:") && 0 != a.indexOf("opera:") && 0 != a.indexOf("javascript:") ? !0 : !1;
    };
    a.setTagContainer = function (c) {
        var b, d, f;
        a.Kb = c;
        for (b = 0; b < a._il.length; b++) if ((d = a._il[b]) && "s_l" == d._c && d.tagContainerName == c) {
            a.R(d);
            if (d.lmq) for (b = 0; b < d.lmq.length; b++) f = d.lmq[b], a.loadModule(f.n);
            if (d.ml) for (f in d.ml) if (a[f]) for (b in c = a[f], f = d.ml[f], f) !Object.prototype[b] && ("function" != typeof f[b] || 0 > ("" + f[b]).indexOf("s_c_il")) && (c[b] = f[b]);
            if (d.mmq) for (b = 0; b < d.mmq.length; b++) f = d.mmq[b], a[f.m] && (c = a[f.m],
            c[f.f] && "function" == typeof c[f.f] && (f.a ? c[f.f].apply(c, f.a) : c[f.f].apply(c)));
            if (d.tq) for (b = 0; b < d.tq.length; b++) a.track(d.tq[b]);
            d.s = a;
            break;
        }
    };
    a.Util = {
        urlEncode: a.escape,
        urlDecode: a.unescape,
        cookieRead: a.cookieRead,
        cookieWrite: a.cookieWrite,
        getQueryParam: function (c, b, d, f) {
            var e, g = "";
            b || (b = a.pageURL ? a.pageURL : k.location);
            d = d ? d : "&";
            if (!c || !b) return g;
            b = "" + b;
            e = b.indexOf("?");
            if (0 > e) return g;
            b = d + b.substring(e + 1) + d;
            if (!f || !(0 <= b.indexOf(d + c + d) || 0 <= b.indexOf(d + c + "=" + d))) {
                e = b.indexOf("#");
                0 <= e && (b = b.substr(0, e) + d);
                e = b.indexOf(d + c + "=");
                if (0 > e) return g;
                b = b.substring(e + d.length + c.length + 1);
                e = b.indexOf(d);
                0 <= e && (b = b.substring(0, e));
                0 < b.length && (g = a.unescape(b));
                return g;
            }
        }
    };
    a.H = "supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL customerPerspective referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
    a.g = a.H.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));
    a.na = "timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");
    a.P = a.na.slice(0);
    a.Aa = "account allAccounts debugTracking visitor visitorOptedOut trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData usePostbacks registerPreTrackCallback registerPostTrackCallback AudienceManagement".split(" ");
    for (m = 0; 250 >= m; m++) 76 > m && (a.g.push("prop" + m), a.P.push("prop" + m)),
    a.g.push("eVar" + m), a.P.push("eVar" + m), 6 > m && a.g.push("hier" + m), 4 > m && a.g.push("list" + m);
    m = "pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest marketingCloudOrgID".split(" ");
    a.g = a.g.concat(m);
    a.H = a.H.concat(m);
    a.ssl = 0 <= k.location.protocol.toLowerCase().indexOf("https");
    a.charSet = "UTF-8";
    a.contextData = {};
    a.offlineThrottleDelay = 0;
    a.offlineFilename = "AppMeasurement.offline";
    a.Pa = 0;
    a.ma = 0;
    a.O = 0;
    a.Oa = 0;
    a.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
    a.w = k;
    a.d = k.document;
    try {
        if (a.Ta = !1, navigator) {
            var v = navigator.userAgent;
            if ("Microsoft Internet Explorer" == navigator.appName || 0 <= v.indexOf("MSIE ") || 0 <= v.indexOf("Trident/") && 0 <= v.indexOf("Windows NT 6")) a.Ta = !0;
        }
    } catch (x) { }
    a.ga = function () {
        a.ha && (k.clearTimeout(a.ha), a.ha = p);
        a.l && a.K && a.l.dispatchEvent(a.K);
        a.A && ("function" == typeof a.A ? a.A() : a.l && a.l.href && (a.d.location = a.l.href));
        a.l = a.K = a.A = 0;
    };
    a.Ra = function () {
        a.b = a.d.body;
        a.b ? (a.v = function (c) {
            var b, d, f, e, g;
            if (!(a.d && a.d.getElementById("cppXYctnr") || c && c["s_fe_" + a._in])) {
                if (a.Ca) if (a.useForcedLinkTracking) a.b.removeEventListener("click", a.v, !1); else {
                    a.b.removeEventListener("click", a.v, !0);
                    a.Ca = a.useForcedLinkTracking = 0;
                    return;
                } else a.useForcedLinkTracking = 0;
                a.clickObject = c.srcElement ? c.srcElement : c.target;
                try {
                    if (!a.clickObject || a.N && a.N == a.clickObject || !(a.clickObject.tagName || a.clickObject.parentElement || a.clickObject.parentNode)) a.clickObject = 0; else {
                        var h = a.N = a.clickObject;
                        a.la && (clearTimeout(a.la), a.la = 0);
                        a.la = setTimeout(function () {
                            a.N == h && (a.N = 0);
                        }, 1e4);
                        f = a.Ja();
                        a.track();
                        if (f < a.Ja() && a.useForcedLinkTracking && c.target) {
                            for (e = c.target; e && e != a.b && "A" != e.tagName.toUpperCase() && "AREA" != e.tagName.toUpperCase() ;) e = e.parentNode;
                            if (e && (g = e.href, a.La(g) || (g = 0), d = e.target, c.target.dispatchEvent && g && (!d || "_self" == d || "_top" == d || "_parent" == d || k.name && d == k.name))) {
                                try {
                                    b = a.d.createEvent("MouseEvents");
                                } catch (l) {
                                    b = new k.MouseEvent();
                                }
                                if (b) {
                                    try {
                                        b.initMouseEvent("click", c.bubbles, c.cancelable, c.view, c.detail, c.screenX, c.screenY, c.clientX, c.clientY, c.ctrlKey, c.altKey, c.shiftKey, c.metaKey, c.button, c.relatedTarget);
                                    } catch (m) {
                                        b = 0;
                                    }
                                    b && (b["s_fe_" + a._in] = b.s_fe = 1, c.stopPropagation(), c.stopImmediatePropagation && c.stopImmediatePropagation(),
                                    c.preventDefault(), a.l = c.target, a.K = b);
                                }
                            }
                        }
                    }
                } catch (n) {
                    a.clickObject = 0;
                }
            }
        }, a.b && a.b.attachEvent ? a.b.attachEvent("onclick", a.v) : a.b && a.b.addEventListener && (navigator && (0 <= navigator.userAgent.indexOf("WebKit") && a.d.createEvent || 0 <= navigator.userAgent.indexOf("Firefox/2") && k.MouseEvent) && (a.Ca = 1,
        a.useForcedLinkTracking = 1, a.b.addEventListener("click", a.v, !0)), a.b.addEventListener("click", a.v, !1))) : setTimeout(a.Ra, 30);
    };
    a.Ra();
    r ? a.setAccount(r) : a.F("Error, missing Report Suite ID in AppMeasurement initialization");
    a.loadModule("ActivityMap");
}

function s_gi(r) {
    var a, k = window.s_c_il, p, n, m = r.split(","), s, u, t = 0;
    if (k) for (p = 0; !t && p < k.length;) {
        a = k[p];
        if ("s_c" == a._c && (a.account || a.oun)) if (a.account && a.account == r) t = 1; else for (n = a.account ? a.account : a.oun,
        n = a.allAccounts ? a.allAccounts : n.split(","), s = 0; s < m.length; s++) for (u = 0; u < n.length; u++) m[s] == n[u] && (t = 1);
        p++;
    }
    t || (a = new AppMeasurement(r));
    return a;
}

AppMeasurement.getInstance = s_gi;

window.s_objectID || (window.s_objectID = 0);

function s_pgicq() {
    var r = window, a = r.s_giq, k, p, n;
    if (a) for (k = 0; k < a.length; k++) p = a[k], n = s_gi(p.oun), n.setAccount(p.un),
    n.setTagContainer(p.tagContainerName);
    r.s_giq = 0;
}

s_pgicq();

/**! ###--- Tag id: 171755, name: [Configuration], description: [] ---### */
(function () {
    var domains = ["anz.com", "anz.com.au"],
        params = {
            "allowLinker": true,
            "cookieDomain": "auto"
        };

    if ((true === superT.liveTesting)) {
        superT.UniUrl = '//www.google-analytics.com/analytics_debug.js';
    } else {
        superT.UniUrl = '//www.google-analytics.com/analytics.js';
    }

    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] ||
        function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o), m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', superT.UniUrl, 'ga');

    if ((true === superT.liveTesting)) {
        ga('create', "UA-87342948-1", params);
    } else {
        ga('create', "UA-87342948-1", params);
    } ga('require', 'linker');
    ga('linker:autoLink', domains); ga('require', 'displayfeatures');
})();

!function (window, document, superT) {
    var st_an_pushRule = superT.an.pushRule;

    /**! ###--- Tag id: 148230, name: [Functions], description: [The SuperTag functions container is used to group all function containers.] ---### */
    superT.an.startMonitoring(148230, 'fn');

    /**! ###--- Tag id: 189230, name: [FUNCTION: Ajax Page View], description: [function doAjaxPageView()] ---### */
    superT.doAjaxPageView = function () {
        return superT.fireTag(189230, function () {

            /**! ###--- Tag id: 189232, name: [SiteCatalyst: Ajax Page View], description: [Custom Javascript] ---### */
            if (s) {
                s.t();
            }

            /**! ###--- Tag id: 189233, name: [Clear SiteCatalyst Variables], description: [] ---### */
            s.manageVars('clearVars');

        }, arguments, this);
    }

    /**! ###--- Tag id: 148231, name: [Top], description: [The SuperTag top container is used to contain tags that fire before the page has finished rendering.] ---### */
    superT.t = function (multiple) {
        superT.fireBaseContainer(148231, 't', function () {
            superT.topTime = new Date().getTime();

            /**! ###--- Tag id: 178727, name: [Qualtrics: Site Intercept - new account], description: [updated 04/09/2017 (new code)] ---### */
            (function () {
                var g = function (e, h, f, g) {
                    this.get = function (a) {
                        for (var a = a + "=", c = document.cookie.split(";"), b = 0, e = c.length; b < e; b++) {
                            for (var d = c[b];
                                " " == d.charAt(0) ;) d = d.substring(1, d.length);
                            if (0 == d.indexOf(a)) return d.substring(a.length, d.length)
                        }
                        return null
                    };
                    this.set = function (a, c) {
                        var b = "",
                            b = new Date;
                        b.setTime(b.getTime() + 6048E5);
                        b = "; expires=" + b.toGMTString();
                        document.cookie = a + "=" + c + b + "; path=/; "
                    };
                    this.check = function () {
                        var a = this.get(f);
                        if (a) a = a.split(":");
                        else if (100 != e) "v" == h && (e = Math.random() >= e / 100 ? 0 : 100), a = [h, e, 0], this.set(f, a.join(":"));
                        else return !0;
                        var c = a[1];
                        if (100 == c) return !0;
                        switch (a[0]) {
                            case "v":
                                return !1;
                            case "r":
                                return c = a[2] % Math.floor(100 / c), a[2]++, this.set(f, a.join(":")), !c
                        }
                        return !0
                    };
                    this.go = function () {
                        if (this.check()) {
                            var a = document.createElement("script");
                            a.type = "text/javascript";
                            a.src = g + "&t=" + (new Date()).getTime();
                            document.body && document.body.appendChild(a)
                        }
                    };
                    this.start = function () {
                        var a = this;
                        window.addEventListener ? window.addEventListener("load", function () {
                            a.go()
                        }, !1) : window.attachEvent && window.attachEvent("onload", function () {
                            a.go()
                        })
                    }
                };
                try {
                    console.log('executed');
                    (new g(100, "r", "QSI_S_ZN_38gZUpfeZke4Elv", "//zn38gzupfezke4elv-anz.siteintercept.qualtrics.com/WRSiteInterceptEngine/?Q_ZID=ZN_38gZUpfeZke4Elv&Q_LOC=" + encodeURIComponent(window.location.href))).start()
                }
                catch (i) { console.log(i); }
            })();

        }, multiple);
    }

    /**! ###--- Tag id: 148232, name: [Bottom], description: [The SuperTag bottom container is used to contain tags that fire after the page has finished rendering.] ---### */
    superT.b = function (multiple) {
        superT.fireBaseContainer(148232, 'b', function () {

            /**! ###--- Tag id: 159060, name: [digitalData.lib], description: [] ---### */
            if (typeof digitalData == 'string') window.digitalData = JSON.parse(digitalData);
            if (typeof digitalData != 'object') {
                window.digitalData = { events: [] };
            }

            window.digitalData.lib = (function () {
                var dd = digitalData;

                var _sendClickRecord = function (type, btnName, limit) {
                    if (typeof btnName == 'string') {
                        btnName = btnName.replace(/ /g, '-').toLowerCase();
                    }
                    else {
                        console.log('digitalData.lib.analyticsClick - you must pass a string');
                        return false;
                    }
                    var setLimit = typeof limit != 'undefined' ? parseInt(limit) : 0;

                    var clickTagVarMapping = {
                        'ContactTag': {
                            events: 'event5',
                            eVar11: btnName
                        },
                        'LeadTag': {
                            events: 'event16',
                            eVar28: btnName,
                            prop28: btnName
                        },
                        'CalculatorTag': {
                            events: 'event9',
                            eVar22: btnName,
                            prop22: btnName
                        },
                        'ButtonTag': {
                            events: 'event11',
                            eVar24: getPageName() + ':' + btnName,
                            prop24: getPageName() + ':' + btnName
                        },
                        'AssistTag': {
                            events: 'event20',
                            eVar28: btnName,
                            prop28: btnName
                        },
                        'LeadStart': {
                            events: 'event19',
                            eVar28: btnName,
                            prop28: btnName
                        },
                        'RegistrationStart': {
                            events: 'event6',
                            eVar48: btnName,
                            prop31: btnName
                        },
                        'RegistrationComplete': {
                            events: 'event7',
                            eVar48: btnName,
                            prop31: btnName
                        },
                        'ServiceStart': {
                            events: 'event25',
                            eVar48: btnName,
                            prop31: btnName
                        },
                    };

                    var execute;
                    if (setLimit === 1) {
                        execute = oncePerSession(clickTagVarMapping[type].events, btnName);
                    }
                    else if (setLimit === 2) {
                        execute = oncePerSession(window.location.pathname + '--' + clickTagVarMapping[type].events, btnName);
                    }
                    else {
                        execute = true;
                    }

                    if (execute) {
                        var recordType = clickTagVarMapping[type];
                        var linkTrackVars = [];
                        for (var i in recordType) {
                            eval('s.' + i + '="' + recordType[i] + '"');
                            linkTrackVars.push(i);
                        }
                        s.linkTrackVars = linkTrackVars.join();
                        s.linkTrackEvents = s.events;
                        s.tl(true, 'o', btnName);

                        for (var i in recordType) {
                            eval('s.' + i + '=""');
                        }
                        s.linkTrackVars = '';
                        s.linkTrackEvents = '';
                    }
                };

                var click = {
                    contactTag: function (btnText, limit) {
                        _sendClickRecord('ContactTag', btnText, limit);
                    },
                    leadTag: function (btnText, limit) {
                        _sendClickRecord('LeadTag', btnText, limit);
                    },
                    calculatorTag: function (btnText, limit) {
                        _sendClickRecord('CalculatorTag', btnText, limit);
                    },
                    buttonTag: function (btnText, limit) {
                        _sendClickRecord('ButtonTag', btnText, limit);
                    },
                    assistTag: function (btnText, limit) {
                        _sendClickRecord('AssistTag', btnText, limit);
                    },
                    leadStart: function (btnText, limit) {
                        _sendClickRecord('LeadStart', btnText, limit);
                    },
                    registrationStart: function (btnText, limit) {
                        _sendClickRecord('RegistrationStart', btnText, limit);
                    },
                    registrationComplete: function (btnText, limit) {
                        _sendClickRecord('RegistrationComplete', btnText, limit);
                    },
                    serviceStart: function (btnText, limit) {
                        _sendClickRecord('ServiceStart', btnText, limit);
                    }
                };

                var getProductListAll = function () {
                    var productList = [];
                    for (var i in dd.products) {
                        productList.push(';' + i.replace(/.*\/([^\/]*)\/[^\/]*$/, '$1').replace('personalloans', 'personal-loans') + ':' + dd.products[i].productName);
                    }
                    return productList.join(',');
                };

                var getPageName = function () {
                    var pageName;
                    if (!!dd.pageInfo && !!dd.pageInfo.pageId && dd.pageInfo.pageId.length > 0) {
                        pageName = dd.pageInfo.pageId
                        if (pageName.indexOf('/content/anzcomau/en/') === 0) {
                            pageName = pageName.replace('/content/anzcomau/en/', '');
                        }
                        else if (pageName.indexOf('/content/anzcomau-') === 0) {
                            pageName = pageName.replace('/content/anzcomau-', '').replace('/en', '');
                        }
                        pageName = pageName.replace(/\//g, ':');
                    }
                    else {
                        s.siteID = ""; // leftmost value in pagename
                        s.defaultPage = "";
                        s.queryVarsList = "";
                        s.pathExcludeDelim = ";";
                        s.pathConcatDelim = ":";
                        s.pathExcludeList = "";
                        pageName = s.getPageName();
                    }
                    return unescape(pageName.toLowerCase());
                };

                var getPageType = function () {
                    try {
                        var pageType = dd.pageCategory.pageType.replace('pagetype:', '');
                        return pageType;
                    }
                    catch (e) {
                        return 'unknown';
                    }
                };

                var getHeading = function () {
                    try {
                        var heading = dd.pageInfo.heading;
                        return heading;
                    }
                    catch (e) {
                        return '';
                    }
                };

                var getCategory = function () {
                    try {
                        var category = dd.pageCategory.primaryCategory.replace('line-of-business:', '');
                        return category;
                    }
                    catch (e) {
                        return '';
                    }
                };

                var getContentHierarchy = function (level) {
                    level = parseInt(level);
                    if (isNaN(level)) level = 0;
                    if (!!window.s) {
                        var pageName = !!s.pageName && s.pageName.length > 0 ? s.pageName : this.getPageName();
                        var pageNameArray = pageName.split(':');
                        if (level === 0) return pageNameArray.join('|');
                        if (level <= pageNameArray.length) {
                            return pageNameArray.slice(0, level).join(':');
                        }
                        else {
                            return '';
                        }
                    }
                    return false;
                };

                var getVersion = function () {
                    var s_dlpro;
                    if (document.location.protocol === 'http:') s_dlpro = ':http';
                    else if (document.location.protocol === 'https:') s_dlpro = ':https';
                    else s_dlpro = ':' + document.location.protocol;
                    return superT.version + ":" + s.version + ":AEM" + s_dlpro;
                };

                var oncePerSession = function (event, dimval) {
                    dimval = dimval || 'generic';
                    var localKeyName = 's_fi_' + event + '_' + dimval;
                    var localValue = typeof sessionStorage == 'object' ? sessionStorage.getItem(localKeyName) : null;
                    if (localValue !== null) {
                        return false;
                    }
                    else {
                        if (typeof sessionStorage == 'object') sessionStorage.setItem(localKeyName, 'true');
                        return true;
                    }
                };

                if (typeof digitalData.events == 'undefined') {
                    digitalData.events = [];
                }

                var costCalc = function () {
                    if (!!dd.events && dd.events.length > 0 && dd.events[0].event == "costCalc") {
                        s.contextData['evt_costCalc'] = "1";
                        s.contextData['evt_propertyPrice'] = digitalData.events[0].propertyPrice;
                        s.contextData['evt_contribution'] = digitalData.events[0].contribution;
                        s.linkTrackVars = "contextData.evt_propertyPrice,contextData.evt_costCalc,contextData.evt_contribution";
                        s.tl(true, 'o', 'costCalc');
                    }
                };

                return {
                    click: click,
                    getProductListAll: getProductListAll,
                    getPageName: getPageName,
                    getPageType: getPageType,
                    getHeading: getHeading,
                    getCategory: getCategory,
                    getContentHierarchy: getContentHierarchy,
                    getVersion: getVersion,
                    oncePerSession: oncePerSession,
                    costCalc: costCalc
                };
            })();

            /**! ###--- Tag id: 149075, name: [Trigger Tracking Request], description: [Trigger Tracking Request] ---### */
            s.t();

            /**! ###--- Tag id: 157596, name: [FIX: AEM JS fixes.], description: [] ---### */
            // Requested by Andrew Nobel on 19/11/2015

            $(document).ready(function () { $('body').on('click', '.accordion__trigger, .image-text--small .heading, .image-text--top .heading', function (e) { setTimeout(function () { $('body').trigger('disclaimerInit'); }, 50); }); $('a[data-dis-attr]').css({ "display": "inline-block", "min-width": "10px", "height": "10px" }); });

            $(document).ready(function () {
                var interval = setInterval(function () {
                    if (!$('#overview .owl-stage').is(':empty') || !$('.compare__category').length) {
                        return;
                    }
                    if ($('.compare--selector:hidden').length > 0) {
                        $('.compare--mobile .btn').click();
                        setTimeout(function () { $('#platinum_cards_only').click(); }, 50);
                        setTimeout(function () { $('.show').click(); }, 1000);
                    } else {
                        $('#featured_cards_only').click();
                    }

                    clearInterval(interval);
                }, 50);
            });

            // Requested by Kravtsova, Olga on 17/06/2016
            $(function () {
                if ($('html').hasClass('lt-ie9') && $('.product-tiles--information').length) {
                    $('.product-tiles--information .product-title--text:not(.mobile-only)').css({ 'min-height': '85px', 'height': '85px' });
                }
            });

            $(".tab-item").on('click.tab-item', function () {
                if ($("html").hasClass("lt-ie9") && $(".product-tiles--information").length) {
                    $(".product-tiles--information .product-title--text:not(.mobile-only)").css({
                        'min-height': "85px", 'height': "85px"
                    });
                }
            });

            /**! ###--- Tag id: 157618, name: [Click Event Bindings], description: [] ---### */
            var path = window.location.pathname;

            // Data Click Track
            $('body').on('click', '[data-clicktrack]', function () {
                digitalData.lib.click.buttonTag($(this).data('clicktrack'));
            });

            // Tab Clicks
            $('body').on('mousedown', '[id^="tab-"]:not([id*="content"]):not(.active)', function () {
                var tabText = 'tab-' + $(this).find('h2,h3,h4').text();
                digitalData.lib.click.buttonTag(tabText);
            });

            // Footer Contact Links
            $('body').on('mousedown', 'ul.contactus a', function () {
                var headerText = digitalData.lib.getPageType() + ':' + $(this).prev('p').text();
                digitalData.lib.click.contactTag(headerText);
            });

            // Calculator Click: Credit Cards Compare
            if (path.indexOf('/credit-cards/compare-cards') > -1) {
                $('body').on('mousedown', 'div.compare--selector.clearfix,div#overview .owl-stage', function () {
                    digitalData.lib.click.calculatorTag('credit-cards:compare-cards', 1);
                });
            }

            // Calculator Click: Help Select a Card
            if (path.indexOf('/credit-cards/calculators-tools/finder') > -1) {
                $('body').on('click', 'div.findcc__question.first', function () {
                    digitalData.lib.click.calculatorTag('credit-cards:finder', 1);
                });
            }

            //
            // Personal Loans
            //

            // How much can I borrow.
            if (path.indexOf('/personal-loans/calculators-tools/how-much-can-i-borrow') > -1) {
                $('body > div.container.box--white.padding-top--40px.padding-bottom--0px > div > div > div.container__main > div > div > div').click(function () {
                    digitalData.lib.click.calculatorTag('personal-loans:how-much-can-i-borrow', 1);
                });
            }

            // Repayments Calculator.
            if (path.indexOf('/personal/personal-loans/calculators-tools/repayments') > -1) {
                $('body > main > div.container.box--white.padding-top--40px.padding-bottom--20px > div > div > div.container__main > div > div > div.container__main > div select,#loan,input.loan').click(function () {
                    digitalData.lib.click.calculatorTag('personal-loans:repayments-calculator', 1);
                });
            }

            // Compare Personal Loans.
            if (path.indexOf('/personal/personal-loans/compare-personal-loan') > -1) {
                $('body').on('click', '#overview > div.owl-stage-outer > div', function () {
                    digitalData.lib.click.calculatorTag('personal-loans:compare-personal-loans', 1);
                });
            }

            //
            // Home Loans
            //

            // Repayments Calculator.
            if (path.indexOf('/personal/home-loans/calculators-tools/calculate-repayments') > -1) {
                $('body > main > div.container.box--white.padding-top--40px.padding-bottom--20px > div > div > div.container__main > div > div > div.container__main > div select,#loan,input.loan,div.repay__question li').click(function () {
                    digitalData.lib.click.calculatorTag('home-loans:repayments-calculator', 1);
                });
            }

            // How much can I borrow.
            if (path.indexOf('/personal/home-loans/calculators-tools/much-borrow') > -1) {
                $('div.borrow--homeloan li,div.borrow--homeloan input').click(function () {
                    digitalData.lib.click.calculatorTag('home-loans:how-much-can-i-borrow', 1);
                });
            }

            // Embedded Tabs - How Much Could I Borrow / What Could Repayments Be (Personal Loans & Home Loans)

            if ((path.indexOf('/personal/personal-loans') > -1 && /(\/car-loans|fixed-rate|variable-rate|boats-caravans-motorbikes-trucks|weddings-special-occassions|travel-holidays|renovations|debt-consolidation)/.test(path)) || (path.indexOf('/personal/home-loans') > -1)) {
                $('[id^="tab-content-"] input,[id^="tab-content-"] #loan,[id^="tab-content-"] select').click(function () {
                    var node = $('[id^="tab-content-1"]').parent().prev().find('li.active h3').text();
                    if (node.length > 0) digitalData.lib.click.calculatorTag(path.split('/')[2] + ':' + node, 2);
                });
            }

            if (path.indexOf('/personal/personal-loans/secured-car-loan') > -1) {
                $('[id^="tab-content-1"] input,[id^="tab-content-1"] #loan,[id^="tab-content-1"] select').click(function () {
                    var node = $('[id^="tab-content-1"]').parent().prev().find('li.active h3').text();
                    if (node.length > 0) digitalData.lib.click.calculatorTag('personal-loans:' + node, 2);
                });
            }

            if (path.indexOf('/personal/personal-loans') > -1 && /(\/car-loans|debt-consolidation|renovations|travel-holidays|weddings-special-occassions|boats-caravans-motorbikes-trucks)/.test(path)) {
                var targetNode = $('a[name="choose"]').parents('div.grid').find('a,input');
                $(targetNode).click(function () {
                    digitalData.lib.click.calculatorTag('personal-loans:choose-loan-to-fit-needs', 2);
                });
            }

            /**! ###--- Tag id: 171756, name: [Track Pageview], description: [] ---### */
            ga('send', 'pageview', s.pageName);

            "function" === typeof superT.events && superT.events();

            if ("undefined" !== typeof superT.topTime) {
                superT.an.tb = new Date().getTime() - superT.topTime;
            }
        }, multiple);
    };

    /**! ###--- Tag id: 148233, name: [Low priority], description: [The SuperTag low priority container is used to contain tags that fire after the page has finished rendering and after the primary bottom container has executed.] ---### */
    superT.b2 = function (multiple) {
        superT.fireBaseContainer(148233, 'b2', function () {

            /**! ###--- Tag id: 159193, name: [Universal Remarketing], description: [] ---### */
            superT.pushActivityTag({
                advertiserId: "3636033", type: "globa0", cat: "anz-s0", orderId: superT.genId(), params: { u1: s.products, u2: s.pageName, u4: superT.gqp("CLASS"), u5: document.location.href }
            });

            /**! ###--- Tag id: 159194, name: [ANZ Remarketing], description: [ANZ Remarketing] ---### */
            new Image().src = "//googleads.g.doubleclick.net/pagead/viewthroughconversion/" + "1049917176" + "/?value=0&guid=ON&script=0";

            /**! ###--- Tag id: 161234, name: [Facebook Custom Audience], description: [] ---### */
            !function (f, b, e, v, n, t, s) {
                if (f.fbq) return; n = f.fbq = function () {
                    n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                }; if (!f._fbq) f._fbq = n;
                n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
            }(window,
            document, 'script', '//connect.facebook.net/en_US/fbevents.js');

            fbq('init', "644681518944292");
            fbq('track', 'PageView');

            /**! ###--- Tag id: 182085, name: [UserZoom Site Intercept (Global)], description: [UserZoom Site Intercept - CX] ---### */
            (function () {
                var uz = document.createElement('script'); uz.type = 'text/javascript'; uz.async = true; uz.charset = 'utf-8';
                uz.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn4.userzoom.com/files/js/QzgzOFQx.js?t=uz_til&cuid=1006FB6E79DAE311BEDA0022196C4538';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uz, s);
            })();

            /**! ###--- Tag id: 167067, name: [Not Dev], description: [] ---### */
            if (superT.doesNotContain(document.location.href, "nonprod", 1)) {
                st_an_pushRule(167067);

                /**! ###--- Tag id: 165701, name: [Twitter universal website tag], description: [] ---### */
                ! function (e, n, u, a) {
                    var s, t;
                    e.twq || (a = e.twq = function () {
                        a.exe ? a.exe.apply(a, arguments) :
                          a.queue.push(arguments);
                    }, a.version = '1',
                      a.queue = [],
                      t = n.createElement(u),
                      t.async = !0, t.src = '//static.ads-twitter.com/uwt.js',
                      s = n.getElementsByTagName(u)[0],
                      s.parentNode.insertBefore(t, s))
                }(window, document, 'script');
                // Insert Twitter Pixel ID and Standard Event data below
                twq('init', 'nxgrl');
                twq('track', 'PageView');

                /**! ###--- Tag id: 175543, name: [Linkedin Audience Insights tag], description: [] ---### */
                _linkedin_data_partner_id = "50165";
                (function () {
                    var s = document.getElementsByTagName("script")[0];
                    var b = document.createElement("script");
                    b.type = "text/javascript"; b.async = true;
                    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                    s.parentNode.insertBefore(b, s);
                })();
            }

            /**! ###--- Tag id: 170906, name: [SECTION: Home Loans], description: [] ---### */
            if (superT.contains(document.location.pathname, "home-loans", 1)) {
                st_an_pushRule(170906);

                /**! ###--- Tag id: 172049, name: [Generic Home Loans Section - Exponential], description: [] ---### */
                superT.pushActivityTag({
                    advertiserId: "3631402", type: "homel00", cat: "homel01x", orderId: superT.genId()
                });
            }

            /**! ###--- Tag id: 171270, name: [PRODUCT: Personal Loans - Fixed Rate], description: [] ---### */
            if (superT.contains(document.location.href, "personal/personal-loans/fixed-rate", 1)) {
                st_an_pushRule(171270);

                /**! ###--- Tag id: 171269, name: [Personal Loans - Retargeting - eDM - eGentic], description: [] ---### */
                superT.pushActivityTag({
                    advertiserId: "3631404", type: "perso00", cat: "plcam00", orderId: superT.genId()
                });
            }

            /**! ###--- Tag id: 175279, name: [Page: Bank Account], description: [] ---### */
            if (superT.eql(document.location.pathname, "/personal/bank-accounts/", 1)) {
                st_an_pushRule(175279);

                /**! ###--- Tag id: 175285, name: [ANZ Everyday Banking - General (Retargeting / Insights)], description: [ANZ Everyday Banking - General (Retargeting / Insights)] ---### */
                var queryString = (-1 === "//s.tribalfusion.com/i.cid?c=736793".indexOf("?")) ? "?" : "&";

                try {
                    queryString += "d=" + encodeURIComponent("30");
                    queryString += "&";
                } catch (e) { }
                try {
                    queryString += "page=" + encodeURIComponent("landingPage");
                } catch (e) { }

                new Image().src = "////s.tribalfusion.com/i.cid?c=736793" + queryString;

                /**! ###--- Tag id: 175283, name: [ANZ Everyday Banking - General (Audience LAL)], description: [ANZ Everyday Banking - General (Audience LAL)] ---### */
                var queryString = (-1 === "//s.tribalfusion.com/ti.ad?client=736793".indexOf("?")) ? "?" : "&";

                try {
                    queryString += "ev=" + encodeURIComponent("1");
                } catch (e) { }

                new Image().src = "////s.tribalfusion.com/ti.ad?client=736793" + queryString;
            }

            /**! ###--- Tag id: 175280, name: [PRODUCT: Bank Account - Access Advantage], description: [] ---### */
            if (superT.contains(document.location.href, "https://www.anz.com.au/personal/bank-accounts/everyday-accounts/access-advantage/", 1)) {
                st_an_pushRule(175280);

                /**! ###--- Tag id: 175282, name: [ANZ Everyday Banking - General (Retargeting / Insights)], description: [ANZ Everyday Banking - General (Retargeting / Insights)] ---### */
                var queryString = (-1 === "//s.tribalfusion.com/i.cid?c=736793".indexOf("?")) ? "?" : "&";

                try {
                    queryString += "d=" + encodeURIComponent("30");
                    queryString += "&";
                } catch (e) { }
                try {
                    queryString += "page=" + encodeURIComponent("landingPage");
                } catch (e) { }

                new Image().src = "////s.tribalfusion.com/i.cid?c=736793" + queryString;

                /**! ###--- Tag id: 175286, name: [ANZ Everyday Banking - General (Audience LAL)], description: [ANZ Everyday Banking - General (Audience LAL)] ---### */
                var queryString = (-1 === "//s.tribalfusion.com/ti.ad?client=736793".indexOf("?")) ? "?" : "&";

                try {
                    queryString += "ev=" + encodeURIComponent("1");
                } catch (e) { }

                new Image().src = "////s.tribalfusion.com/ti.ad?client=736793" + queryString;
            }

            /**! ###--- Tag id: 175281, name: [PRODUCT: Bank Account - Access Basic], description: [] ---### */
            if (superT.contains(document.location.href, "https://www.anz.com.au/personal/bank-accounts/everyday-accounts/access-basic/", 1)) {
                st_an_pushRule(175281);

                /**! ###--- Tag id: 175284, name: [ANZ Everyday Banking - General (Retargeting / Insights)], description: [ANZ Everyday Banking - General (Retargeting / Insights)] ---### */
                var queryString = (-1 === "//s.tribalfusion.com/i.cid?c=736793&d".indexOf("?")) ? "?" : "&";

                try {
                    queryString += "d=" + encodeURIComponent("30");
                    queryString += "&";
                } catch (e) { }
                try {
                    queryString += "page=" + encodeURIComponent("landingPage");
                } catch (e) { }

                new Image().src = "////s.tribalfusion.com/i.cid?c=736793&d" + queryString;

                /**! ###--- Tag id: 175287, name: [ANZ Everyday Banking - General (Audience LAL)], description: [ANZ Everyday Banking - General (Audience LAL)] ---### */
                var queryString = (-1 === "//s.tribalfusion.com/ti.ad?client=736793".indexOf("?")) ? "?" : "&";

                try {
                    queryString += "ev=" + encodeURIComponent("1");
                } catch (e) { }

                new Image().src = "////s.tribalfusion.com/ti.ad?client=736793" + queryString;
            }

            /**! ###--- Tag id: 175513, name: [Home Loans-  Exponential tag], description: [] ---### */
            if (superT.eql(document.location.pathname, "/personal/home-loans/", 1) || superT.eql(document.location.pathname, "/personal/home-loans/calculators-tools/", 1) || superT.eql(document.location.pathname, "/personal/home-loans/calculators-tools/calculate-repayments/", 1)) {
                st_an_pushRule(175513);

                /**! ###--- Tag id: 175512, name: [Exponential tag], description: [Exponential tag for Home Loans] ---### */
                var queryString = (-1 === "//s.tribalfusion.com/i.cid?c=738663".indexOf("?")) ? "?" : "&";

                try {
                    queryString += "d=" + encodeURIComponent("30");
                    queryString += "&";
                } catch (e) { }
                try {
                    queryString += "page=" + encodeURIComponent("landingPage");
                } catch (e) { }

                new Image().src = "////s.tribalfusion.com/i.cid?c=738663" + queryString;
            }

            /**! ###--- Tag id: 211444, name: [FORM: BladeBay Enquiry Submission], description: [] ---### */
            if (superT.contains(document.location.pathname, "/business/products/merchants-payments/eftpos-machines/bladepay/enquiry/form-success", 1)) {
                st_an_pushRule(211444);

                /**! ###--- Tag id: 211443, name: [BladePay OLE - Form Complete], description: [] ---### */
                superT.pushActivityTag({
                    advertiserId: "3631406", type: "small0", cat: "smbiz00d", orderId: superT.genId()
                });
            }
        }, multiple);
    };

    superT.fireB2OnReady = true;

    /**! ###--- Tag id: 148234, name: [Events], description: [The SuperTag events container is used to group all event containers.] ---### */

    superT.events = function (multiple) {
        return superT.fireBaseContainer(148234, 'e', function () {

            /**! ###--- Tag id: 180089, name: [IB Login Click (primary nav)], description: [] ---### */
            superT.bindEvent(".login", "click", 180089, function (e) {
                var _self = this;

                /**! ###--- Tag id: 180090, name: [IB Logon Button Click - Google Analytics], description: [] ---### */
                ga('send', 'pageview', superT.an.d1 + '/ib-login');

            });

            /**! ###--- Tag id: 179303, name: [Logon Button Click (CSS Class)], description: [] ---### */
            superT.bindEvent(".logon_btn", "click", 179303, function (e) {
                var _self = this;

                /**! ###--- Tag id: 177600, name: [Google Analytics VPV – IBLogin], description: [] ---### */
                ga('send', 'pageview', superT.an.d1 + '/ib-login');

            });

        }, multiple);
    }

    if (typeof superT.t === 'function') {
        superT.t();
    }

    superT.whenReady(function () {
        if (typeof superT.b === 'function') {
            superT.b();
        }
    });

    if (true === superT.fireB2OnReady) {
        superT.whenReady(function () {
            if (typeof superT.b === 'function') {
                superT.b2();
            }
        });
    } else {
        superT.whenLoad(function () {
            if (typeof superT.b === 'function') {
                superT.b2();
            }
        });
    }
}(window, document, superT);