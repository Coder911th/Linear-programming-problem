var global =
webpackJsonpglobal([1],{

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
(function() {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/*** EXPORTS FROM exports-loader ***/
module.exports = global.fetch;
}.call(global));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(66)))

/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (configurable, data, m, n, object, size) {switch (object){
case 'row':
for (let j = 0; j < n - 1; j++)
{
pug_html = pug_html + "\u003Cinput" + (" type=\"text\" placeholder=\"0\""+pug.attr("size", size, true, true)) + "\u003E\u003Cspan\u003Ex\u003Csub\u003E" + (pug.escape(null == (pug_interp = j + 1) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E\u003C\u002Fspan\u003E";
if (j !== n - 2) {
pug_html = pug_html + "\u003Cspan\u003E+\u003C\u002Fspan\u003E";
}
}
pug_html = pug_html + "\u003Cspan\u003E=\u003C\u002Fspan\u003E\u003Cinput" + (" type=\"text\" placeholder=\"0\""+pug.attr("size", size, true, true)) + "\u003E";
  break;
case 'table':
pug_html = pug_html + "\u003Cdiv\u003E";
for (let j = 0; j < n - 1; j++)
{
pug_html = pug_html + "\u003Cinput" + (" type=\"text\""+pug.attr("placeholder", configurable && "0", true, true)+pug.attr("size", size, true, true)+pug.attr("value", data && data[0][j], true, true)) + "\u003E\u003Cspan\u003Ex\u003Csub\u003E" + (pug.escape(null == (pug_interp = j + 1) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E\u003C\u002Fspan\u003E";
if (j === n - 2) {
pug_html = pug_html + "\u003Cspan\u003E--\u003E\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan\u003E+\u003C\u002Fspan\u003E";
}
}
let variants = ['min', 'max'];
pug_html = pug_html + "\u003Cselect type=\"select-one\"\u003E";
// iterate variants
;(function(){
  var $$obj = variants;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var variant = $$obj[pug_index0];
pug_html = pug_html + "\u003Coption" + (pug.attr("value", variant, true, true)+pug.attr("selected", data && variant === data[0][n - 1], true, true)) + "\u003E" + (pug.escape(null == (pug_interp = variant) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var variant = $$obj[pug_index0];
pug_html = pug_html + "\u003Coption" + (pug.attr("value", variant, true, true)+pug.attr("selected", data && variant === data[0][n - 1], true, true)) + "\u003E" + (pug.escape(null == (pug_interp = variant) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
for (let i = 1; i < m; i++)
{
pug_html = pug_html + "\u003Cdiv\u003E";
for (let j = 0; j < n - 1; j++)
{
pug_html = pug_html + "\u003Cinput" + (" type=\"text\""+pug.attr("placeholder", configurable && "0", true, true)+pug.attr("size", size, true, true)+pug.attr("value", data && data[i][j], true, true)) + "\u003E\u003Cspan\u003Ex\u003Csub\u003E" + (pug.escape(null == (pug_interp = j + 1) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E\u003C\u002Fspan\u003E";
if (j !== n - 2) {
pug_html = pug_html + "\u003Cspan\u003E+\u003C\u002Fspan\u003E";
}
}
pug_html = pug_html + "\u003Cspan\u003E=\u003C\u002Fspan\u003E\u003Cinput" + (" type=\"text\""+pug.attr("placeholder", configurable && "0", true, true)+pug.attr("size", size, true, true)+pug.attr("value", data && data[i][n - 1], true, true)) + "\u003E\u003C\u002Fdiv\u003E";
}
  break;
}}.call(this,"configurable" in locals_for_with?locals_for_with.configurable:typeof configurable!=="undefined"?configurable:undefined,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"m" in locals_for_with?locals_for_with.m:typeof m!=="undefined"?m:undefined,"n" in locals_for_with?locals_for_with.n:typeof n!=="undefined"?n:undefined,"object" in locals_for_with?locals_for_with.object:typeof object!=="undefined"?object:undefined,"size" in locals_for_with?locals_for_with.size:typeof size!=="undefined"?size:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (n) {pug_html = pug_html + ("x\u003Csub\u003Ei\u003C\u002Fsub\u003E ⩾ 0, i = 1, ..., " + (pug.escape(null == (pug_interp = n - 1) ? "" : pug_interp)));}.call(this,"n" in locals_for_with?locals_for_with.n:typeof n!=="undefined"?n:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pug_has_own_property = Object.prototype.hasOwnProperty;

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = pug_merge;
function pug_merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = pug_merge(attrs, a[i]);
    }
    return attrs;
  }

  for (var key in b) {
    if (key === 'class') {
      var valA = a[key] || [];
      a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
    } else if (key === 'style') {
      var valA = pug_style(a[key]);
      var valB = pug_style(b[key]);
      a[key] = valA + valB;
    } else {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Process array, object, or string as a string of classes delimited by a space.
 *
 * If `val` is an array, all members of it and its subarrays are counted as
 * classes. If `escaping` is an array, then whether or not the item in `val` is
 * escaped depends on the corresponding item in `escaping`. If `escaping` is
 * not an array, no escaping is done.
 *
 * If `val` is an object, all the keys whose value is truthy are counted as
 * classes. No escaping is done.
 *
 * If `val` is a string, it is counted as a class. No escaping is done.
 *
 * @param {(Array.<string>|Object.<string, boolean>|string)} val
 * @param {?Array.<string>} escaping
 * @return {String}
 */
exports.classes = pug_classes;
function pug_classes_array(val, escaping) {
  var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
  for (var i = 0; i < val.length; i++) {
    className = pug_classes(val[i]);
    if (!className) continue;
    escapeEnabled && escaping[i] && (className = pug_escape(className));
    classString = classString + padding + className;
    padding = ' ';
  }
  return classString;
}
function pug_classes_object(val) {
  var classString = '', padding = '';
  for (var key in val) {
    if (key && val[key] && pug_has_own_property.call(val, key)) {
      classString = classString + padding + key;
      padding = ' ';
    }
  }
  return classString;
}
function pug_classes(val, escaping) {
  if (Array.isArray(val)) {
    return pug_classes_array(val, escaping);
  } else if (val && typeof val === 'object') {
    return pug_classes_object(val);
  } else {
    return val || '';
  }
}

/**
 * Convert object or string to a string of CSS styles delimited by a semicolon.
 *
 * @param {(Object.<string, string>|string)} val
 * @return {String}
 */

exports.style = pug_style;
function pug_style(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    var out = '';
    for (var style in val) {
      /* istanbul ignore else */
      if (pug_has_own_property.call(val, style)) {
        out = out + style + ':' + val[style] + ';';
      }
    }
    return out;
  } else {
    val += '';
    if (val[val.length - 1] !== ';') 
      return val + ';';
    return val;
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = pug_attr;
function pug_attr(key, val, escaped, terse) {
  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
    return '';
  }
  if (val === true) {
    return ' ' + (terse ? key : key + '="' + key + '"');
  }
  if (typeof val.toJSON === 'function') {
    val = val.toJSON();
  }
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
    if (!escaped && val.indexOf('"') !== -1) {
      return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
    }
  }
  if (escaped) val = pug_escape(val);
  return ' ' + key + '="' + val + '"';
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} terse whether to use HTML5 terse boolean attributes
 * @return {String}
 */
exports.attrs = pug_attrs;
function pug_attrs(obj, terse){
  var attrs = '';

  for (var key in obj) {
    if (pug_has_own_property.call(obj, key)) {
      var val = obj[key];

      if ('class' === key) {
        val = pug_classes(val);
        attrs = pug_attr(key, val, false, terse) + attrs;
        continue;
      }
      if ('style' === key) {
        val = pug_style(val);
      }
      attrs += pug_attr(key, val, false, terse);
    }
  }

  return attrs;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var pug_match_html = /["&<>]/;
exports.escape = pug_escape;
function pug_escape(_html){
  var html = '' + _html;
  var regexResult = pug_match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the pug in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @param {String} str original source
 * @api private
 */

exports.rethrow = pug_rethrow;
function pug_rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || __webpack_require__(344).readFileSync(filename, 'utf8')
  } catch (ex) {
    pug_rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Pug') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};


/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(339);

__webpack_require__(340);

__webpack_require__(341);

var _BasisView = __webpack_require__(94);

var _BasisView2 = _interopRequireDefault(_BasisView);

var _Stack = __webpack_require__(95);

var _Stack2 = _interopRequireDefault(_Stack);

var _InputView = __webpack_require__(64);

var _InputView2 = _interopRequireDefault(_InputView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Подгружаем стек


// Подгружаем тулбар
// Подключаем базовые стили страницы
var solution = document.getElementById('solution-wrap');

// Подгружаем представление ввода данных


// Погружаем генератор чекбоксов в тулбар


// Блокируем выделение текста вне полей ввода


window.views = new _Stack2.default(new _InputView2.default(true, 3, 3, 2, null).into(solution));
new _BasisView2.default(window.views[0].n - 1);

/***/ }),

/***/ 339:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Блокировка выделения текста вне полей ввода
document.addEventListener('mousedown', function (event) {
    var target = event.target;
    if (target instanceof HTMLInputElement === false && target instanceof HTMLSelectElement === false) {
        event.preventDefault();
    }
}, false);

/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(fetch) {

__webpack_require__(342);

var _Popups = __webpack_require__(93);

var _Popups2 = _interopRequireDefault(_Popups);

var _InputView = __webpack_require__(64);

var _InputView2 = _interopRequireDefault(_InputView);

var _FunctionGraph = __webpack_require__(360);

var _FunctionGraph2 = _interopRequireDefault(_FunctionGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Подгружаем представление с вводом задачи линейного программирования
var creeper = document.getElementById('creeper'),
    myBasisView = document.getElementById('my-basis'),
    dragStart = null,
    offset = void 0;

/*
*   Заставляем ползунок двигаться
*/


// Подгружаем представление графика функций


// Подгружаем popup'ы
creeper.onmousedown = function (event) {
    offset = document.getElementById('rangebar').getBoundingClientRect().left;
    dragStart = event.pageX - creeper.getBoundingClientRect().left;
};

document.addEventListener('mousemove', function (event) {
    if (dragStart === null) {
        return;
    }

    var dif = event.pageX - offset - dragStart;

    if (dif >= 0 && dif <= 190) {
        creeper.style.left = dif + 'px';
        window.views.forEach(function (view) {
            if (typeof view !== 'string') {
                view.resize(Math.floor(dif / 5 + 1));
            }
        });
    }
}, false);

document.addEventListener('mouseup', function () {
    return dragStart = null;
}, false);

/*
*   Появление и исчезновение полей ввода собвственного базиса
*/
document.getElementById('personal-basis').onclick = function () {
    return myBasisView.classList.remove('hidden');
};

document.getElementById('artificial-base-method').onclick = function () {
    return myBasisView.classList.add('hidden');
};

// Получаем необходимые для взаимодействия элементы
var load = document.getElementById('load'),
    save = document.getElementById('save');

/* Кнопка "ЗАГРУЗИТЬ" */
load.onclick = function () {
    _Popups2.default.waiting();

    // Отправка запроса на сервер
    fetch('/files-list').then(function (res) {
        if (res.status != 200) {
            throw res;
        }

        return res.json();
    }).then(function (json) {
        if (json.message) {
            // Вывод сообщения об ошибке на стороне сервера
            _Popups2.default.showMessage(json.message);
        } else {
            // Скрытие представления ожидания загрузки
            // отображение представления каталога
            // Показать каталог
            _Popups2.default.openFileLoadView(json.files);
        }
    }).catch(function (err) {
        if (err.status) {
            _Popups2.default.showMessage(err.status + ': ' + err.statusText);
        } else {
            _Popups2.default.showMessage(err.toString());
        }
    });
};

/* Кнопка "СОХРАНИТЬ" */
save.onclick = _Popups2.default.openFileSaveView;

/* Кнопка "ВЫЙТИ"*/
var solution = document.getElementById('solution-wrap');
document.getElementById('exit').onclick = function (e) {
    // Возвращаемся к начальному экрану с сохранением введенной матрицы
    var newInputView = new _InputView2.default(window.views[0]); // special for IE
    solution.innerHTML = '';
    window.views.replace(newInputView.into(solution));
    document.querySelector('.toolbar').classList.remove('hide');
    solution.classList.remove('solving');
    // Скрываем панельку с предложением выхода
    document.getElementById('final-pane').classList.add('hidden');
};

// Создаём представление графика функций
window.graphic = new _FunctionGraph2.default(document.body, 340, 100);

/* Кнопка "ПОКАЗАТЬ ГРАФИК" */
document.getElementById('show-graph').onclick = function (e) {
    window.graphic.show();
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(131)))

/***/ }),

/***/ 342:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 343:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (files) {for (let i = 0; i < files.length; i++)
{
pug_html = pug_html + "\u003Cdiv class=\"file\"\u003E" + (pug.escape(null == (pug_interp = files[i]) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
}}.call(this,"files" in locals_for_with?locals_for_with.files:typeof files!=="undefined"?files:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 344:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 345:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (n) {for (let i = 0; i < n; i++)
{
pug_html = pug_html + "\u003Clabel\u003E\u003Cinput" + (" type=\"checkbox\""+pug.attr("name", 'b' + (i + 1), true, true)) + "\u003Ex\u003Csub\u003E" + (pug.escape(null == (pug_interp = i + 1) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E\u003C\u002Flabel\u003E";
}}.call(this,"n" in locals_for_with?locals_for_with.n:typeof n!=="undefined"?n:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 346:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 347:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 348:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (configurable) {pug_html = pug_html + "\u003Cfieldset" + (" class=\"InputView\""+pug.attr("disabled", !configurable, true, true)) + "\u003E\u003Cdiv\u003E" + (null == (pug_interp = __webpack_require__(132).call(this, locals)) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
if (configurable) {
pug_html = pug_html + "\u003Cdiv\u003E\u003Ccanvas class=\"arrow left\" width=\"50\" height=\"20\"\u003E\u003C\u002Fcanvas\u003E\u003Ccanvas class=\"arrow right\" width=\"50\" height=\"20\"\u003E\u003C\u002Fcanvas\u003E\u003Ccanvas class=\"arrow up\" width=\"50\" height=\"20\"\u003E\u003C\u002Fcanvas\u003E\u003Ccanvas class=\"arrow down\" width=\"50\" height=\"20\"\u003E\u003C\u002Fcanvas\u003E\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003Cdiv\u003E" + (null == (pug_interp = __webpack_require__(133).call(this, locals)) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E\u003C\u002Ffieldset\u003E";}.call(this,"configurable" in locals_for_with?locals_for_with.configurable:typeof configurable!=="undefined"?configurable:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 349:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addArrow = addArrow;
exports.removeArrow = removeArrow;
// Процедура рисования стрелки
function drawArrow(item) {
    item.beginPath();
    item.moveTo(0, 5);
    item.lineTo(30, 5);
    item.lineTo(30, 0);
    item.lineTo(50, 10);
    item.lineTo(30, 20);
    item.lineTo(30, 15);
    item.lineTo(0, 15);
    item.closePath();
    item.fill();
}

var arrows = [],
    // 2D контексты холстов
pressed = [],
    // Соотвествующие контекстам состояния нажатия кнопок
pressedColor = '#AB3030',
    notPressedColor = '#753838';

document.addEventListener('mouseup', function () {
    pressed.forEach(function (item, index) {
        if (!item) {
            return;
        }

        arrows[index].fillStyle = pressedColor;
        drawArrow(arrows[index]);
        pressed[index] = false;
    });
}, false);

// Зарегистрировать стрелку. Теперь она будет отрисовываться в canvas
function addArrow(canvas) {
    var context = canvas.getContext('2d'),
        index = arrows.length;

    arrows.push(context);
    pressed.push(false);

    context.fillStyle = pressedColor;
    drawArrow(context);

    canvas.addEventListener('mousedown', function () {
        context.fillStyle = notPressedColor;
        drawArrow(context);
        pressed[index] = true;
    }, false);
}

// Удаление зарегистрированного обработчика стрелки по его canvas
function removeArrow(canvas) {
    var context = canvas.getContext('2d');
    arrows.forEach(function (arrow, index) {
        if (arrow === context) {
            arrows.splice(index, 1);
            pressed.splice(index, 1);
            canvas.parentElement.removeChild(canvas);
        }
    });
}

/***/ }),

/***/ 350:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = solve;

var _InputView = __webpack_require__(64);

var _InputView2 = _interopRequireDefault(_InputView);

var _SimplexTable = __webpack_require__(351);

var _SimplexTable2 = _interopRequireDefault(_SimplexTable);

var _TransitionView = __webpack_require__(354);

var _TransitionView2 = _interopRequireDefault(_TransitionView);

var _MatrixView = __webpack_require__(357);

var _MatrixView2 = _interopRequireDefault(_MatrixView);

var _fraction = __webpack_require__(65);

var _fraction2 = _interopRequireDefault(_fraction);

var _DOMFor = __webpack_require__(96);

var _Stack = __webpack_require__(95);

var _Stack2 = _interopRequireDefault(_Stack);

var _Popups = __webpack_require__(93);

var _Popups2 = _interopRequireDefault(_Popups);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var colors = ['167, 525, 0', // Весенний бутон
'255, 36, 0', // Алый
'165, 38, 10', // Бисмарк-фуриозо
'75, 0, 130', // Индиго
'153, 102, 204', // Аметистовый
'127, 255, 212', // Аквамариновый
'250, 231, 181', // Бананомания
'237, 60, 202', // Амарантовый маджента
'255, 220, 51', // Блестящий зеленовато-желтый
'181, 121, 0', // Глубокий желтый
'66, 170, 255', // Голубой
'0, 0, 0', // Черный
'0, 255, 0', // Зеленый
'33, 66, 30', // Миртовый
'252, 15, 192', // Ярко-розовый
'245, 64, 33' // Транспортный оранжевый
];

var views = void 0,
    // Актуальные представления
graphic = void 0,
    // График функций
linearForm = void 0,
    // Линейная форма
maxTask = false,
    // Задача на максимум?
solution = document.getElementById('solution-wrap'),
    toolbar = document.querySelector('.toolbar'),
    prev = document.getElementById('prev'),
    auto = document.getElementById('auto'),
    finalPane = document.getElementById('final-pane'),
    showGraph = document.getElementById('show-graph'),
    exit = document.getElementById('exit');

// Генерация сообщения с ответом на задачу
function getLastMessage(data, left, top) {
    var n = top.length,
        m = left.length,
        x = [];

    for (var i = 1; i <= n + m; i++) {
        var rowIndex = left.indexOf(i);
        if (rowIndex > -1) {
            x.push(data[rowIndex][n]);
        } else {
            x.push(0);
        }
    }

    return '\u0417\u0430\u0434\u0430\u0447\u0430 \u0440\u0435\u0448\u0435\u043D\u0430! f(' + x.join(', ') + ') = ' + (maxTask ? data[m][n] : data[m][n].reflect);
}

// Добавление нового представления симплекс-таблицы к решению
function addNewSimplexTableView(view, step, lookBasis) {
    // Поиск возможных опорных элементов в новой таблице
    var referenceElements = _SimplexTable2.default.getReferenceElements(view.left.length + 1, view.top.length + 1, view.data, view.left, lookBasis, views[0].n - 1);

    var message = null,
        refElems = referenceElements;
    switch (referenceElements.code) {
        case 1:
            if (maxTask) {
                message = 'Линейная форма неограничена сверху!';
            } else {
                message = 'Линейная форма неограничена снизу!';
            }
            refElems = null;
            break;
        case 2:
            if (!lookBasis) {
                message = getLastMessage(view.data, view.left, view.top);
            }
            break;
        case 3:
            if (lookBasis) {
                message = 'Система несовместна!';
                refElems = null;
            } else {
                message = getLastMessage(view.data, view.left, view.top);
            }
            break;
        case 4:
            if (lookBasis) {
                message = 'Задача неразрешима! Нет возможности выполнить холостой шаг.';
                refElems = null;
            }
            break;
    }

    // Создаём новое представление симплекс-таблицы
    views.push(new _SimplexTable2.default(lookBasis, step, view.data, view.top, view.left, views[0].size, refElems, message).into(solution));

    if (message) {
        // Показываем панельку с предложением выйти
        finalPane.classList.remove('hidden');
        auto.disabled = true;

        if (!lookBasis && views[0].n - views[0].m <= 2) {
            /* Решение задачи подошло к концу и мы можем вывести график */

            /* Очищаем график */
            graphic.reset();
            /* Добавляем функции в график */
            var tv = null;
            // Ищем в решении TransitionView
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = views[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    if (v instanceof _TransitionView2.default) {
                        tv = v;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var data = tv.data,
                top = tv.top,
                left = tv.left,
                lf = tv.bottomRow;

            /*  Решаем двумерную графическую задачу линейного программирования
                для данных, записанных в TransitionView */
            for (var i = 0; i < data.length; i++) {
                graphic.add({
                    type: 'half-plane',
                    y: -data[i][0].toInt(),
                    k: data[i][1].toInt(),
                    b: -data[i][2].toInt(),
                    color: colors[i]
                });
            }

            graphic.add({
                type: 'line',
                y: lf[0].toInt(),
                k: -lf[1].toInt(),
                b: 0,
                color: '0, 0, 255'
            });

            graphic.nameY = 'x' + top[0];
            graphic.nameX = 'x' + top[1];

            /* Перерисовываем график */
            graphic.redraw();

            /* Активируем отображение график */
            showGraph.disabled = false;
        }
    }

    // Если нашли базис
    if (referenceElements.code == 2 && lookBasis) {
        var _data = view.data.slice(0, view.data.length - 1);

        views.push(new _TransitionView2.default(_data, view.top, view.left, linearForm).into(solution));

        // Создаём симплекс таблицу для рассчётов
        addNewSimplexTableView({
            data: _data.concat([views.top.bottomRow]),
            left: view.left,
            top: view.top
        }, 0, false);
    }
}

// Обработчик кнопки "Назад/Выйти"
prev.onclick = function () {
    // Скрываем график функций
    graphic.hide();

    if (views.length === 3 || views.length > 3 && views[views.length - 3] instanceof _MatrixView2.default) {
        // Нажимаем на кнопку выйти
        exit.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    } else {
        // Делаем шаг назад
        solution.removeChild(views.pop().view);
        var top = views.top;

        if (top instanceof _TransitionView2.default) {
            solution.removeChild(views.pop().view);
            solution.removeChild(views.pop().view);
            top = views.top;
        }

        if (!finalPane.classList.contains('hidden')) {
            finalPane.classList.add('hidden');
            showGraph.disabled = true;
            auto.disabled = false;
        }

        solution.removeChild(views.pop().view);
        addNewSimplexTableView(top, top.step, top.lookBasis);

        // Прокручиваем к последнему представлению страницы
        views.top.view.scrollIntoView(false);
    }
};

// Автовыбор опорного элемента
auto.onclick = function () {
    var variants = document.querySelectorAll('.reference-element');
    variants[Math.floor(variants.length * Math.random())].dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    }));
};

// Обработчик ручного выбора опорного элемента
solution.onclick = function (event) {
    if (!event.target.classList.contains('reference-element')) {
        return;
    }

    var target = event.target;

    var _target$dataset$index = target.dataset.indexes.split(','),
        _target$dataset$index2 = _slicedToArray(_target$dataset$index, 2),
        row = _target$dataset$index2[0],
        col = _target$dataset$index2[1];

    // Удаляем возможность выбора опорого элемента,
    // выделяем выбранный опорный элемент, его строку и столбец особым цветом


    (0, _DOMFor.SimplexTable)(views.top.view.firstElementChild, function (elem, i, j) {
        elem.classList.remove('reference-element');
        if (i == row) {
            elem.classList.add('selected-element');
        } else if (j == col) {
            elem.classList.add('selected-element');
        }
    });

    // Выделяем выбранный элемент
    target.classList.add('selected-element');

    var top = views.top;
    var nextTableData = _SimplexTable2.default.step(top, +row, +col);

    addNewSimplexTableView(nextTableData, top.step + 1, top.lookBasis);

    // Прокручиваем к последнему представлению страницы
    views.top.view.scrollIntoView(false);
};

function solve(input) {
    // Получаем актуальные представления
    views = window.views;

    // Получаем представление графика функций
    graphic = window.graphic;

    // Отключаем конфигурирование представления ввода данных
    input.view.disabled = true;
    // Удаляем обработчики со стрелок
    input.removeArrowsHandlers();

    // Изменяем тулбар
    toolbar.classList.add('hide');
    solution.classList.add('solving');
    auto.disabled = false;
    showGraph.disabled = true;

    // Получаем выходные данные и делаем их первичную обработку
    var data = input.getData(true),
        m = input.m,
        n = input.n;

    // Если задача на максимум, сводим её к задаче на минимум
    var taskTypeIndex = data[0].length - 1;
    if (data[0][taskTypeIndex] === 'max') {
        maxTask = true;
        for (var i = 0; i < data[0].length - 1; i++) {
            data[0][i] = data[0][i].mul(_fraction2.default.minusOne);
        }

        data[0][taskTypeIndex] = data[0][taskTypeIndex] = 'min';
    } else {
        maxTask = false;
    }

    /* Делаем так, чтобы в столбце свободных членов находились
       неотрицательные значения */
    for (var _i = 0; _i < m; _i++) {
        if (data[_i][n - 1] < 0) {
            for (var j = 0; j < n; j++) {
                data[_i][j] = data[_i][j].mul(_fraction2.default.minusOne);
            }
        }
    }

    /* Выводим откоректированное входное представление
       Все дроби упрощены, в столбце свободных членов неотрицательные
       значения */
    views.push(new _InputView2.default(false, m, n, input.size, data).into(solution));

    /*  Удаляем из data линейную форму и сохраняем её в linearForm
        до окончания вычислений в симплекс-таблице */
    linearForm = data.splice(0, 1)[0];

    // Special for Microsoft (IE, Edge) (Как бы не переназывали IE, в душе он всегда IE)
    var basisSettings = void 0;
    if (document.forms.settings.basis[0].checked) {
        basisSettings = document.forms.settings.basis[0].value;
    } else {
        basisSettings = document.forms.settings.basis[1].value;
    }

    if (basisSettings === 'МИБ') {
        // Метод искусственного базиса
        var top = [],
            left = [],
            p = [];

        // Записываем в массив top индексы x, находящиеся сверху таблицы
        for (var _i2 = 1; _i2 < n; _i2++) {
            top.push(_i2);
        }

        // Записываем в массив left индексы x, находящиеся в левом столбце таблицы
        for (var _i3 = n; _i3 < n + m - 1; _i3++) {
            left.push(_i3);
        }

        // Подсчитываем нижнюю строку p как суммы соответствующих столбцов
        // умноженных на минус единицу
        for (var _i4 = 0; _i4 < n; _i4++) {
            var sum = _fraction2.default.zero;
            for (var _j = 0; _j < m - 1; _j++) {
                sum = sum.add(data[_j][_i4]);
            }
            p.push(sum.mul(_fraction2.default.minusOne));
        }

        data.push(p);

        // Создаём первичное представление симплекс-таблицы
        addNewSimplexTableView({
            data: data, left: left, top: top
        }, 0, true);
    } else {
        // Свои базисные переменные

        // Первичное отображение матрицы
        views.push(new _MatrixView2.default(data).into(solution));

        var _left = [],
            // Базисные переменные
        _top = [],
            // Небазисные переменные
        temp = [],
            /*  Временное хранилище для переменных, которые не
                могут быть базисными */
        checkBoxes = document.forms.settings;

        // Распределяем переменные на базисные и нет
        for (var _i6 = 0; _i6 < n - 1; _i6++) {
            if (checkBoxes['b' + (_i6 + 1)].checked) {
                _left.push(_i6 + 1);
            } else {
                _top.push(_i6 + 1);
            }
        }

        /*  В left указаны индексы иксов (от единицы),
            которые выбраны базисными
            В top аналогично для небазисных */

        var matrix = [],
            // Матрица
        /*  Коэффициент для зануления элемента в столбце или
            получение единицы при делении строки */
        coefficient = void 0,
            currentRow = 0,

        // Кол-во строк в матрице
        rows = data.length,

        // Кол-во столбцов в матрице с учётом столбца свободных членов
        cols = data[0].length,
            k = void 0,
            _i5 = void 0,
            _j2 = void 0;

        // Глубокое копирование матрицы data
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var row = _step2.value;

                matrix.push(Array.from(row));
            }

            /*  Пройдёмся по всем столбцам, соответствующим базисным переменным
                из left */
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        for (_i5 = 0; _i5 < _left.length; _i5++) {

            // Индекс текущего столбца с базисной переменной
            var colIndex = _left[_i5] - 1;

            /*  Поиск ненулевого элемента в i-м стобце ниже
                и в самой currentRow строке */
            for (k = currentRow; k < rows; k++) {
                if (!matrix[k][colIndex].isZero) {
                    break;
                }
            }

            /*  Если в данном базисном столбце остались только нули ниже и
                в строке currentRow, то left[i] - не может быть базисной переменной, поэтому ищем в top другой базиную переменную
                переменную */
            if (k === rows) {
                if (_top.length == 0) {
                    // TODO: Если не осталось небазисных переменных на замену
                    _Popups2.default.showMessage('Система линейно зависима! Пожалуйста, введите линейно независимую систему!');
                    prev.value = 'ВЫЙТИ';
                    auto.disabled = true;
                    return;
                }

                /*  Перемещаем текущую базисную переменную во временный массив
                    небазисных переменных и сразу же вставляем в массив
                    базсных переменных произвольную небазисную.
                    С этой вставленной переменной начинаем следующую итерацию */
                temp.push.apply(temp, _toConsumableArray(_left.splice(_i5, 1, _top.shift())));
                _i5--;
                continue;
            }
            /*  Меняем строки местами так, чтобы в currentRow текущего
                столбцам был не ноль. В k-ой строке не ноль. */


            /*  Поделим всю строку currentRow
                на элемент [currentRow][colIndex],
                чтобы получить единицу в этом элементе */
            var _ref = [matrix[k], matrix[currentRow]];
            matrix[currentRow] = _ref[0];
            matrix[k] = _ref[1];
            coefficient = matrix[currentRow][colIndex];
            for (k = 0; k < cols; k++) {
                matrix[currentRow][k] = matrix[currentRow][k].div(coefficient);
            }

            /*  Зануляем все ячейки, находящиеся ниже или выше,
                чем matrix[currentRow][colIndex] */

            // Для всех строчек данного столбца colIndex
            for (k = 0; k < rows; k++) {
                if (k === currentRow) {
                    /*  Кроме строки currentRow,
                        в которой должна находиться единица */
                    continue;
                }

                // Вычисляем коэффициент для k-ой строки
                coefficient = matrix[k][colIndex];

                // Элементов k-ой строки
                for (_j2 = 0; _j2 < cols; _j2++) {
                    matrix[k][_j2] = matrix[k][_j2].sub(coefficient.mul(matrix[currentRow][_j2]));
                }
            }

            // С текущей строчкой разобрались, переходим к следующей
            currentRow++;

            // Отображаем промежуточные результаты
            views.push(new _MatrixView2.default(matrix).into(solution));
        }

        // С методом Гаусса закончили
        _top = _top.concat(temp);

        // Формируем data для отправки в TansitionView
        data = [];
        for (var _i7 = 0; _i7 < _left.length; _i7++) {
            // Формируем строки таблицы
            var _row = [];
            for (var _j3 = 0; _j3 < _top.length; _j3++) {
                // Формируем ячейки
                _row.push(matrix[_i7][_top[_j3] - 1]);
            }
            // Добавляем свободный член строки
            _row.push(matrix[_i7][cols - 1]);

            data.push(_row);
        }

        views.push(new _TransitionView2.default(data, _top, _left, linearForm).into(solution));

        // Создаём симплекс таблицу для рассчётов
        addNewSimplexTableView({
            data: data.concat([views.top.bottomRow]),
            left: _left,
            top: _top
        }, 0, false);

        views.top.view.scrollIntoView(false);
    }

    // Если авторешение
    if (!document.forms.settings.step_to_step.checked) {
        var elem = document.querySelector('.reference-element'),
            click = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        while (elem) {
            elem.dispatchEvent(click);
            elem = document.querySelector('.reference-element');
        }
    }
}

/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Внутренние зависимости


// Внешние зависимости


__webpack_require__(352);

var _SimplexTable = __webpack_require__(353);

var _SimplexTable2 = _interopRequireDefault(_SimplexTable);

var _DOMFor = __webpack_require__(96);

var _fraction = __webpack_require__(65);

var _fraction2 = _interopRequireDefault(_fraction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimplexTable = function () {
    function SimplexTable(lookBasis, step, data, top, left, size, referenceElements, message) {
        _classCallCheck(this, SimplexTable);

        var wrap = document.createElement('div');
        wrap.innerHTML = (0, _SimplexTable2.default)({
            step: step,
            data: data,
            top: top,
            left: left,
            size: size,
            referenceElements: referenceElements,
            message: message
        });

        this.lookBasis = lookBasis;
        this.step = step;
        this.n = top.length;
        this.data = data;
        this.top = top;
        this.left = left;
        this.size = size;
        this.view = wrap.firstElementChild;
    }

    _createClass(SimplexTable, [{
        key: 'into',
        value: function into(destination) {
            destination.appendChild(this.view);
            return this;
        }

        // Изменение размеров ячеек

    }, {
        key: 'resize',
        value: function resize(size) {
            // TODO: delete: DOMFor(this.view.firstElementChild, (elem) => elem.size = size);
            this.size = size;
        }

        // Поиск возможных опорных элементов

    }], [{
        key: 'getReferenceElements',
        value: function getReferenceElements(m, n, data, left, lookBasis, maxN) {
            var pCol = [],
                pRow = [],
                code = 0; // CODE: OK


            // Поиск столбцов с p[i] < 0, занесение индексов таких столбцов в pCol
            for (var i = 0; i < n - 1; i++) {
                if (data[m - 1][i].isNegative) {
                    pCol.push(i);
                }
            }

            if (pCol.length === 0) {
                // В нижней строке не найдено отрицательных значений
                // (исключая самый последний столбец)
                if (data[m - 1][n - 1].isZero) {
                    // CODE: Вычисления закончены. Элемент в правом нижнем углу
                    // равен нулю
                    code = 2;

                    // Проверка необходимости выполнения холостого шага
                    for (var _i = 0; _i < left.length; _i++) {
                        if (lookBasis && left[_i] > maxN) {
                            // Необходим холостой шаг в строке left[i]
                            pCol.push(left[_i]);
                            pRow = [];

                            // Проверка возможности выполнения холостого шага
                            for (var j = 0; j < top.length; j++) {
                                if (!data[left[_i]][j].isZero) {
                                    // Необходимо выполнить холостой шаг для опорного элемента data[left[i]][j]
                                    pRow.push(j);
                                }
                            }

                            if (pRow.length === 0) {
                                // Холостой шаг выполнить невозможно => Задача неразрешима
                                code = 4;
                            }
                        }
                    }
                } else {
                    // CODE: Вычисления закончены. Число в правом нижнем углу
                    // не равно нулю
                    code = 3;
                }
            } else {

                // pCol[i] - номер столбца, где внизу p < 0
                // pRow[i] - номер строки, в которой минимальное отношение в этом
                // столбце, или undefined, если оно в недопустимой строке
                for (var _i2 = 0, iLen = pCol.length; _i2 < iLen; _i2++) {
                    var min = null,
                        positive = false;

                    // Поиск минимума отношения bi/ai в столбце pCol[i]
                    for (var _j = 0; _j < m - 1; _j++) {
                        if (data[_j][pCol[_i2]].isPositive) {
                            positive = true;

                            var ratio = data[_j][n - 1].div(data[_j][pCol[_i2]]);
                            if (!min) {
                                min = ratio;
                            } else {
                                if (ratio.compare(min) < 0) {
                                    min = ratio;
                                }
                            }
                        }
                    }

                    if (!positive) {
                        // CODE: Найден столбец из отрицательных элементов
                        code = 1;
                    }

                    // Массив индексов строк, которые в данном столбце
                    // могут быть опорными элементами
                    pRow[_i2] = [];

                    // Поиск всех минимумов в столбце
                    for (var _j2 = 0; _j2 < m - 1; _j2++) {
                        if (lookBasis && left[_j2] < n) {
                            // Этот элемент уже перенесён из первой строки в первый
                            // столбик
                            continue;
                        }

                        if (data[_j2][pCol[_i2]].isPositive) {
                            var _ratio = data[_j2][n - 1].div(data[_j2][pCol[_i2]]);
                            if (_ratio.compare(min) == 0) {
                                pRow[_i2].push(_j2);
                            }
                        }
                    }
                }
            }

            // data[pRow[i][k]][pCol[i]] - опорные элементы,
            // если !pRow[i].empty(),
            // i = (0, pCol.length - 1)
            return {
                code: code,
                rows: pRow,
                cols: pCol,
                length: pRow.length
            };
        }

        // Делаем шаг относительно представления view
        // с опорным элементом (row, col)

    }, {
        key: 'step',
        value: function step(view, row, col) {
            // Работаем с новой конфигурацией представления
            var data = [],
                top = Array.from(view.top),
                left = Array.from(view.left);

            // Выполняем глубокое копирование data
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = view.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _row = _step.value;

                    data.push(Array.from(_row));
                }

                // Пересчитываем строку опорного элемента, кроме самого опороного
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            for (var k = 0; k <= top.length; k++) {
                if (k != col) {
                    data[row][k] = data[row][k].div(data[row][col]);
                }
            }

            for (var i = 0; i <= left.length; i++) {
                for (var j = 0; j <= top.length; j++) {
                    if (j == col || i == row) {
                        // Если элемент в том же столбце или строке, что и опорный,
                        // то пока не его пересчитываем
                        continue;
                    } else {
                        data[i][j] = data[i][j].sub(data[i][col].mul(data[row][j]));
                    }
                }
            }

            // Меняем местами индексы иксов сверху и слева относительно
            // опорного элемента
            var _ref = [left[row], top[col]];
            top[col] = _ref[0];
            left[row] = _ref[1];


            if (view.lookBasis) {
                // Если метод искусственного базиса, то удаляем столбец col
                top.splice(col, 1);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _row2 = _step2.value;

                        _row2.splice(col, 1);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else {
                // Пересчитывам столбец col
                for (var _k = 0; _k <= left.length; _k++) {
                    if (_k == row) {
                        // Пока не трогаем опорный элемент
                        continue;
                    } else {
                        data[_k][col] = data[_k][col].div(data[row][col].mul(_fraction2.default.minusOne));
                    }
                }

                // Пересчитываем опорных элемент
                data[row][col] = _fraction2.default.one.div(data[row][col]);
            }

            return { data: data, top: top, left: left };
        }
    }]);

    return SimplexTable;
}();

exports.default = SimplexTable;

/***/ }),

/***/ 352:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (data, left, message, referenceElements, step, top, undefinIed) {let topLen = top.length,
    leftLen = left.length;
pug_html = pug_html + "\u003Cfieldset class=\"SimplexTable\"\u003E\u003Ctable\u003E\u003Ctr\u003E\u003Ctd\u003Ex\u003Csup\u003E(" + (pug.escape(null == (pug_interp = step) ? "" : pug_interp)) + ")\u003C\u002Fsup\u003E\u003C\u002Ftd\u003E";
for (let j = 0; j < topLen; j++)
{
pug_html = pug_html + "\u003Ctd\u003Ex\u003Csub\u003E" + (pug.escape(null == (pug_interp = top[j]) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E\u003C\u002Ftd\u003E";
}
pug_html = pug_html + "\u003Ctd\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
for (let i = 0; i < leftLen; i++)
{
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003Ex\u003Csub\u003E" + (pug.escape(null == (pug_interp = left[i]) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E\u003C\u002Ftd\u003E";
for (let j = 0; j <= topLen; j++)
{
let inputClassName = undefinIed,
    indexes = undefined;
if (referenceElements != null)
    for (let k = 0; k < referenceElements.length; k++)
        for (let row = 0; row < referenceElements.rows[k].length; row++)
            if (
                referenceElements.rows[k][row] == i &&
                referenceElements.cols[k] == j
            ) {
                inputClassName = 'reference-element';
                indexes = referenceElements.rows[k][row] + ',' + referenceElements.cols[k];
                break;
            }
pug_html = pug_html + "\u003Ctd" + (pug.attr("class", pug.classes([inputClassName], [true]), false, true)+pug.attr("data-indexes", indexes, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = data[i][j]) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
}
pug_html = pug_html + "\u003C\u002Ftr\u003E";
}
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E\u003C\u002Ftd\u003E";
for (let j = 0; j <= topLen; j++)
{
pug_html = pug_html + "\u003Ctd\u003E" + (pug.escape(null == (pug_interp = data[leftLen][j]) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
}
pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Ftable\u003E";
if (message) {
pug_html = pug_html + "\u003Cdiv class=\"message\"\u003E" + (pug.escape(null == (pug_interp = message) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003C\u002Ffieldset\u003E";}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"left" in locals_for_with?locals_for_with.left:typeof left!=="undefined"?left:undefined,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"referenceElements" in locals_for_with?locals_for_with.referenceElements:typeof referenceElements!=="undefined"?referenceElements:undefined,"step" in locals_for_with?locals_for_with.step:typeof step!=="undefined"?step:undefined,"top" in locals_for_with?locals_for_with.top:typeof top!=="undefined"?top:undefined,"undefinIed" in locals_for_with?locals_for_with.undefinIed:typeof undefinIed!=="undefined"?undefinIed:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Внутренние зависимости


// Внешние зависимости


var _TransitionView = __webpack_require__(355);

var _TransitionView2 = _interopRequireDefault(_TransitionView);

__webpack_require__(356);

var _fraction = __webpack_require__(65);

var _fraction2 = _interopRequireDefault(_fraction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransitionView = function () {
    function TransitionView(data, top, left, linearForm) {
        _classCallCheck(this, TransitionView);

        // Сохраняем данные
        this.data = data;
        this.top = top;
        this.left = left;

        // Инициализируем нижнюю строку симплекс таблицы нулями
        var bottomRow = [];
        var topLen = top.length;
        for (var i = 0; i < topLen; i++) {
            bottomRow.push(linearForm[top[i] - 1]);
        }
        bottomRow.push(new _fraction2.default(0, 1));

        for (var row = 0; row < left.length; row++) {
            for (var _i = 0; _i < topLen; _i++) {
                bottomRow[_i] = bottomRow[_i].sub(linearForm[left[row] - 1].mul(data[row][_i]));
            }

            bottomRow[topLen] = bottomRow[topLen].add(linearForm[left[row] - 1].mul(data[row][topLen]));
        }

        this.bottomRow = bottomRow;

        var wrap = document.createElement('div');
        wrap.innerHTML = (0, _TransitionView2.default)({
            data: data, top: top, left: left, linearForm: linearForm, bottomRow: bottomRow
        });

        wrap.className = 'TransitionView';
        this.view = wrap;

        this.bottomRow[topLen] = this.bottomRow[topLen].mul(_fraction2.default.minusOne);
    }

    _createClass(TransitionView, [{
        key: 'into',
        value: function into(destionation) {
            destionation.appendChild(this.view);
            return this;
        }
    }, {
        key: 'resize',
        value: function resize() {
            return;
        }
    }]);

    return TransitionView;
}();

exports.default = TransitionView;

/***/ }),

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (bottomRow, data, left, linearForm, top) {let isFirst;
pug_mixins["format"] = pug_interp = function(data, index, first){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if ((data.isZero)) {
pug_html = pug_html + "\u003Creturn\u003E\u003C\u002Freturn\u003E";
}
else {
if ((index != null || index == null && !data.isZero)) {
if ((data.isPositive)) {
if ((!first)) {
pug_html = pug_html + "&nbsp;+";
}
}
else {
pug_html = pug_html + "&nbsp;-";
}
if ((!first)) {
pug_html = pug_html + "&nbsp;";
}
if ((index == null)) {
pug_html = pug_html + (pug.escape(null == (pug_interp = data.abs) ? "" : pug_interp));
}
else {
if ((!data.isOne)) {
pug_html = pug_html + (pug.escape(null == (pug_interp = data.abs) ? "" : pug_interp));
}
pug_html = pug_html + "x\u003Csub\u003E" + (pug.escape(null == (pug_interp = index) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E";
}
if ((first)) {
isFirst = false;
}
}
}
};
for (let i = 0; i < left.length; i++)
{
isFirst = true;
pug_html = pug_html + "\u003Cp\u003Ex\u003Csub\u003E" + (pug.escape(null == (pug_interp = left[i]) ? "" : pug_interp)) + "\u003C\u002Fsub\u003E = ";
pug_mixins["format"](data[i][0].reflect, top[0], isFirst);
for (let j = 1; j <= top.length; j++)
{
if ((j == top.length)) {
pug_mixins["format"](data[i][j], top[j], isFirst);
}
else {
pug_mixins["format"](data[i][j].reflect, top[j], isFirst);
}
}
pug_html = pug_html + "\u003C\u002Fp\u003E";
}
pug_html = pug_html + "\u003Chr\u003E\u003Cdiv class=\"linear-form\"\u003E";
isFirst = true;
pug_html = pug_html + "\u003Cp\u003EL(x) = ";
pug_mixins["format"](linearForm[0], 1, isFirst);
for (let i = 1; i < linearForm.length - 1; i++)
{
pug_mixins["format"](linearForm[i], i + 1, isFirst);
}
pug_html = pug_html + "&nbsp;=\u003C\u002Fp\u003E";
isFirst = true;
pug_html = pug_html + "\u003Cp\u003E&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ";
pug_mixins["format"](bottomRow[0], top[0], isFirst);
for (let i = 1; i < bottomRow.length; i++)
{
pug_mixins["format"](bottomRow[i], top[i], isFirst);
}
pug_html = pug_html + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";}.call(this,"bottomRow" in locals_for_with?locals_for_with.bottomRow:typeof bottomRow!=="undefined"?bottomRow:undefined,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"left" in locals_for_with?locals_for_with.left:typeof left!=="undefined"?left:undefined,"linearForm" in locals_for_with?locals_for_with.linearForm:typeof linearForm!=="undefined"?linearForm:undefined,"top" in locals_for_with?locals_for_with.top:typeof top!=="undefined"?top:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 356:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 357:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MatrixView = __webpack_require__(358);

var _MatrixView2 = _interopRequireDefault(_MatrixView);

__webpack_require__(359);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MatrixView = function () {
    function MatrixView(matrix) {
        var isFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, MatrixView);

        var wrap = document.createElement('div');
        wrap.innerHTML = (0, _MatrixView2.default)({
            matrix: matrix, isFirst: isFirst
        });
        this.view = wrap.firstElementChild;
    }

    _createClass(MatrixView, [{
        key: 'resize',
        value: function resize() {
            return;
        }
    }, {
        key: 'into',
        value: function into(destination) {
            destination.appendChild(this.view);
            return this;
        }
    }]);

    return MatrixView;
}();

exports.default = MatrixView;

/***/ }),

/***/ 358:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (matrix) {pug_html = pug_html + "\u003Cdiv class=\"matrix-view\"\u003E\u003Cfieldset disabled\u003E\u003Ctable\u003E\u003Ctbody\u003E";
for (let row = 0; row < matrix.length; row++)
{
pug_html = pug_html + "\u003Ctr\u003E";
for (let data = 0; data < matrix[row].length; data++)
{
pug_html = pug_html + "\u003Ctd\u003E" + (pug.escape(null == (pug_interp = matrix[row][data]) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
}
pug_html = pug_html + "\u003C\u002Ftr\u003E";
}
pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Ffieldset\u003E\u003C\u002Fdiv\u003E";}.call(this,"matrix" in locals_for_with?locals_for_with.matrix:typeof matrix!=="undefined"?matrix:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 359:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 360:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _markup = __webpack_require__(361);

var _markup2 = _interopRequireDefault(_markup);

var _func = __webpack_require__(362);

var _func2 = _interopRequireDefault(_func);

__webpack_require__(363);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCALE = 50;

var FunctionGraph = function () {
    function FunctionGraph(destination) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var _this = this;

        var nameX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'x';
        var nameY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'y';

        _classCallCheck(this, FunctionGraph);

        // Сохраняем имена осей
        this.nameX = nameX;
        this.nameY = nameY;

        // Вставляем граф в разметку
        destination.insertAdjacentHTML('beforeend', (0, _markup2.default)());
        this.context = destination.lastElementChild.firstElementChild.getContext('2d');

        if (!this.context) {
            return console.log('Не удалось получить контекст графика функций!');
        }

        /* Модернизируем стандарные методы рисования для отображения графиков */
        this.context.moveTo = function (x, y) {
            this.__proto__.moveTo.call(this, y, x);
        };

        this.context.lineTo = function (x, y) {
            this.__proto__.lineTo.call(this, y, x);
        };

        // Устанавливаем начальную позицию
        this.context.canvas.parentNode.style.top = y + 'px';
        this.context.canvas.parentNode.style.left = x + 'px';

        // Добавляем возможность изменения области видимости в графике
        var drag = false,
            dragStartX = void 0,
            dragStartY = void 0;

        this.offsetX = 0;
        this.offsetY = 0;

        this.context.canvas.onmousedown = function (e) {
            dragStartX = e.offsetX - _this.offsetX;
            dragStartY = e.offsetY - _this.offsetY;
            drag = true;
        };

        this.context.canvas.onmouseup = function (e) {
            return drag = false;
        };

        var lastWidth = 0;
        this.context.canvas.onmousemove = function (e) {
            if (drag) {
                _this.offsetX = e.offsetX - dragStartX;
                _this.offsetY = e.offsetY - dragStartY;
                _this.redraw();
            }

            var c = _this.context,
                w = _this.context.canvas.width,
                h = _this.context.canvas.height;

            /* Вывод координат мыши */
            var s = ((e.offsetX - _this.offsetX - w / 2) / _this.scale / SCALE).toFixed(3) + '; ' + (-(e.offsetY - _this.offsetY - h / 2) / _this.scale / SCALE).toFixed(3);

            // Очищаем область для вывода новых координат мыши
            c.fillStyle = 'white';
            c.fillRect(w, h, -lastWidth, -12);
            lastWidth = c.measureText(s).width;

            // Выводим координаты мыши на холсте
            c.fillStyle = 'black';
            c.textAlign = 'right';
            c.textBaseline = 'bottom';
            c.fillText(s, w, h);
        };

        // Добавляем возможность масштабирования графика
        this.scale = 1;
        this.context.canvas.addEventListener('wheel', function (e) {
            e.preventDefault();

            if (e.deltaY > 0) {
                if (_this.scale > 0.2) {
                    _this.scale /= 1.2;
                }
            } else {
                if (_this.scale < 5) {
                    _this.scale *= 1.2;
                }
            }

            _this.redraw();
            _this.context.canvas.onmousemove(e);
        }, true);

        /* Устанавливаем параметры шрифта */
        this.context.font = '10pt Segoe UI';

        /* Хранилище отрисовываемых линий */
        this.storage = [];

        this.redraw();
    }

    // Добавление функции в гарфик


    _createClass(FunctionGraph, [{
        key: 'add',
        value: function add(func) {
            this.storage.push(func);
            if (func.y == 0 && func.k == 0) return;

            this.context.canvas.parentElement.querySelector('.functions').insertAdjacentHTML('beforeend', (0, _func2.default)({
                y: func.y,
                k: func.k,
                b: func.b,
                color: func.color,
                nameX: this.nameX,
                nameY: this.nameY
            }));
        }

        // Сброс настроект графа

    }, {
        key: 'reset',
        value: function reset() {
            this.storage = [];
            this.offsetX = this.offsetY = 0;
            this.scaleX = this.scaleY = 1;
            this.redraw();
            this.context.canvas.parentElement.querySelector('.functions').innerHTML = '';
        }

        // Показать график

    }, {
        key: 'show',
        value: function show() {
            this.context.canvas.parentElement.classList.remove('hidden');
        }

        // Скрыть график

    }, {
        key: 'hide',
        value: function hide() {
            this.context.canvas.parentElement.classList.add('hidden');
        }

        // Перерисовка графика

    }, {
        key: 'redraw',
        value: function redraw() {
            var c = this.context,
                w = this.context.canvas.width,
                h = this.context.canvas.height,
                offsetX = this.offsetX,
                offsetY = this.offsetY,
                scale = this.scale,
                nameY = this.nameY,
                nameX = this.nameX,
                max = (Math.max(Math.abs(this.offsetX), Math.abs(this.offsetY)) + Math.max(w, h)) / scale;

            /* Функция очищающая график */
            function clear() {
                c.fillStyle = 'white';
                c.fillRect(-max, -max, 2 * max, 2 * max);
            }

            /* Функция рисующая оси координат */
            function drawAxes() {
                c.strokeStyle = 'black';
                c.lineWidth = 2;
                c.beginPath();

                // Рисуем вертикальную ось
                c.moveTo(0, -h / 2 - max);
                c.lineTo(0, h / 2 + max);

                // Рисуем горизонтальную ось
                c.moveTo(-w / 2 - max, 0);
                c.lineTo(w / 2 + max, 0);

                // Отрисовываем
                c.stroke();
                c.lineWidth = 1;
            }

            /* Функция рисующая пометки на осях координат */
            function drawScaleLabels() {
                c.strokeStyle = 'black';
                c.fillStyle = 'black';
                c.lineWidth = 2;
                c.beginPath();

                /* Подсчитываем количество пометок, которое необходимо отрисовать
                   в каждую сторону относительно начала координат */
                var n = Math.floor(max / SCALE);

                // Рисуем пометки
                for (var i = -n; i <= n; i++) {
                    if (i === 0) continue;

                    // на вертикальной оси
                    c.moveTo(-4, i * SCALE);
                    c.lineTo(4, i * SCALE);

                    // на горизонтальной оси
                    c.moveTo(i * SCALE, -4);
                    c.lineTo(i * SCALE, 4);
                }

                c.rotate(Math.PI / 2);
                // Подписываем пометки на вертикальной оси
                c.textAlign = 'left';
                c.textBaseline = 'middle';
                for (var _i = -n; _i <= n; _i++) {
                    if (_i === 0) continue;

                    c.fillText(-_i, 10, _i * SCALE, 40);
                }

                // Подписываем пометки на горизонтальной оси
                c.textAlign = 'center';
                c.textBaseline = 'top';
                for (var _i2 = -n; _i2 <= n; _i2++) {
                    if (_i2 === 0) continue;

                    c.fillText(_i2, _i2 * SCALE, 12, 40);
                }
                // Рисуем ноль в начале координат
                c.fillText('0', 12, 5);

                c.rotate(-Math.PI / 2);

                // Отрисовываем
                c.stroke();
                c.lineWidth = 1;
            }

            /* Функция рисующая сетку */
            function drawGrid() {
                c.strokeStyle = 'rgb(210, 210, 210)';
                c.beginPath();

                /* Подсчитываем количество линий, которые необходимо отрисовать
                   в каждую сторону относительно начала координат */
                var n = Math.floor(max / SCALE);

                // Рисуем пометки
                for (var i = -n; i <= n; i++) {
                    if (i === 0) continue;

                    // на вертикальной оси
                    c.moveTo(-max, i * SCALE);
                    c.lineTo(max, i * SCALE);

                    // на горизонтальной оси
                    c.moveTo(i * SCALE, -max);
                    c.lineTo(i * SCALE, max);
                }

                c.stroke();
            }

            /* Функция прямой y = kx+b */
            function lineFunction(line, x) {
                return (line.k / line.y * x + line.b / line.y) * SCALE;
            }

            /* Сохраняем текущее состояние системы координат */
            c.save();

            /* Переносим начало координат холста в начало виртуальных координат */
            c.translate(this.offsetX + w / 2, this.offsetY + h / 2);

            /* Поворачиваем систему координат
               на 90 градусов против часовой стрелки */
            c.rotate(-Math.PI / 2);

            /* Масштабируем систему координат */
            c.scale(scale, scale);

            /* Очищаем фон */
            clear();

            /* Рисуем сетку */
            drawGrid();

            /* Рисуем оси координат */
            drawAxes();

            /* Делаем пометки масштаба на осях координат */
            drawScaleLabels();

            /* Отрисовка линий и полуплоскостей */
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.storage[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var line = _step.value;

                    /* Задаём цвет линии и полуплоскости */
                    c.strokeStyle = 'rgba(' + line.color + ', 1)';
                    c.fillStyle = 'rgba(' + line.color + ', 0.1)';

                    c.beginPath();

                    if (line.type == 'line') {
                        c.lineWidth = 3;
                        c.moveTo(line.k * SCALE, -line.y * SCALE);
                        c.lineTo(0, 0);
                    } else {
                        c.lineWidth = 1;
                    }

                    if (line.y !== 0) {
                        /* Рисуем прямую */
                        var Fmin = lineFunction(line, -max),
                            Fmax = lineFunction(line, max);

                        c.moveTo(-max * SCALE, Fmin);
                        c.lineTo(max * SCALE, Fmax);

                        if (line.type === 'half-plane') {
                            /* Рисуем полуплоскость */
                            if (line.y > 0) {
                                if (line.k > 0) {
                                    c.lineTo(-max, max);
                                } else {
                                    if (line.k == 0) {
                                        c.lineTo(max, max);
                                        c.lineTo(-max, max);
                                    } else {
                                        c.lineTo(max, max);
                                    }
                                }
                            } else {
                                if (line.k > 0) {
                                    c.lineTo(-max, -max);
                                } else {
                                    if (line.k == 0) {
                                        c.lineTo(max, -max);
                                        c.lineTo(-max, -max);
                                    } else {
                                        c.lineTo(max, -max);
                                    }
                                }
                            }
                        }
                    } else {
                        /* Рисуем x = const */
                        c.moveTo(-line.b / line.k * SCALE, max);
                        c.lineTo(-line.b / line.k * SCALE, -max);

                        if (line.type === 'half-plane') {
                            /* Рисуем полуплоскость */
                            if (line.k > 0) {
                                c.lineTo(-max, -max);
                                c.lineTo(-max, max);
                            } else {
                                if (line.k == 0) {
                                    continue;
                                }
                                c.lineTo(max, -max);
                                c.lineTo(max, max);
                            }
                        }
                    }

                    c.closePath();
                    c.fill(); /* Заливаем полуплоскость */
                    c.stroke(); /* Отрисовываем линию */
                }

                /* Восстанавливаем изначальное состояние системы координат */
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            c.restore();

            /* Подписываем оси */
            c.beginPath();
            c.strokeStyle = 'black';
            c.__proto__.moveTo.call(c, 60, h - 10);
            c.__proto__.lineTo.call(c, 10, h - 10);
            c.__proto__.lineTo.call(c, 10, h - 60);
            c.textAlign = 'right';
            c.textBaseline = 'bottom';
            c.fillText(nameX, 60, h - 10); // Горизонтальная
            c.textAlign = 'left';
            c.fillText(nameY, 15, h - 50); // Вертикальная
            c.stroke();
        }
    }]);

    return FunctionGraph;
}();

/* Добавляем обработку перетаскивания графиков функций */


exports.default = FunctionGraph;
var draggable = null,
    offsetX = void 0,
    offsetY = void 0;

document.addEventListener('mousedown', function (e) {
    var target = e.target;
    if (target instanceof HTMLDivElement === false) return;
    if (!target.classList.contains('function-graph-wrap')) return;

    var position = target.getBoundingClientRect();
    offsetX = e.pageX - position.left;
    offsetY = e.pageY - position.top;
    draggable = target;
    draggable.classList.add('grabbing');
}, false);

document.addEventListener('mousemove', function (e) {
    if (draggable) {
        draggable.style.left = e.pageX - offsetX + 'px';
        draggable.style.top = e.pageY - offsetY + 'px';
    }
});

document.addEventListener('mouseup', function (e) {
    if (draggable) {
        draggable.classList.remove('grabbing');
        draggable = null;
    }
}, false);

/* Кнопка закрытия графа */
document.addEventListener('click', function (e) {
    if (e.target.id === 'cancel-graph') {
        e.target.parentElement.classList.add('hidden');
    }
}, false);

/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"function-graph-wrap hidden\"\u003E\u003Ccanvas class=\"function-graph\" width=\"500\" height=\"500\"\u003E\u003C\u002Fcanvas\u003E\u003Cdiv class=\"functions\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton id=\"cancel-graph\" type=\"button\"\u003Ex\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ 362:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(27);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (b, color, k, nameX, nameY, y) {pug_mixins["format"] = pug_interp = function(a, x){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if (x == null) {
if (a == 0) {
pug_html = pug_html + "\u003Creturn\u003E\u003C\u002Freturn\u003E";
}
else {
if (a > 0) {
pug_html = pug_html + "\u003Cspan\u003E&nbsp+&nbsp" + (pug.escape(null == (pug_interp = a) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan\u003E&nbsp;-&nbsp" + (pug.escape(null == (pug_interp = a * -1) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
}
}
else {
if (a == 0) {
pug_html = pug_html + "\u003Cspan\u003E0\u003C\u002Fspan\u003E";
}
else {
if (a == 1) {
pug_html = pug_html + "\u003Cspan\u003E" + (pug.escape(null == (pug_interp = x) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
else {
if (a == -1) {
pug_html = pug_html + "\u003Cspan\u003E" + (pug.escape(null == (pug_interp = '-' + x) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan\u003E" + (pug.escape(null == (pug_interp = a + x) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
}
}
}
};
pug_html = pug_html + "\u003Cdiv class=\"func\"\u003E";
if (color == '0, 0, 255') {
pug_html = pug_html + "\u003Cspan" + (" class=\"color\""+pug.attr("style", pug.style({
            background: 'rgba(' + color + ', 1)'
        }), true, true)) + "\u003E\u003C\u002Fspan\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = 'n (' + k + '; ' + -y + ')') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan" + (" class=\"color\""+pug.attr("style", pug.style({
            background: 'rgba(' + color + ', 0.1)'
        }), true, true)) + "\u003E\u003C\u002Fspan\u003E";
pug_mixins["format"](y, nameY);
pug_html = pug_html + "\u003Cspan\u003E&nbsp⩾&nbsp\u003C\u002Fspan\u003E";
pug_mixins["format"](k, nameX);
pug_mixins["format"](b, null);
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";}.call(this,"b" in locals_for_with?locals_for_with.b:typeof b!=="undefined"?b:undefined,"color" in locals_for_with?locals_for_with.color:typeof color!=="undefined"?color:undefined,"k" in locals_for_with?locals_for_with.k:typeof k!=="undefined"?k:undefined,"nameX" in locals_for_with?locals_for_with.nameX:typeof nameX!=="undefined"?nameX:undefined,"nameY" in locals_for_with?locals_for_with.nameY:typeof nameY!=="undefined"?nameY:undefined,"y" in locals_for_with?locals_for_with.y:typeof y!=="undefined"?y:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 363:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Внутренние зависимости


// Внешние зависимости


__webpack_require__(347);

var _InputView = __webpack_require__(348);

var _InputView2 = _interopRequireDefault(_InputView);

var _add = __webpack_require__(132);

var _add2 = _interopRequireDefault(_add);

var _lastCondition = __webpack_require__(133);

var _lastCondition2 = _interopRequireDefault(_lastCondition);

var _DOMFor = __webpack_require__(96);

var _arrow = __webpack_require__(349);

var _solver = __webpack_require__(350);

var _solver2 = _interopRequireDefault(_solver);

var _fraction = __webpack_require__(65);

var _fraction2 = _interopRequireDefault(_fraction);

var _BasisView = __webpack_require__(94);

var _BasisView2 = _interopRequireDefault(_BasisView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputView = function () {
    function InputView(configurable, m, n, size) {
        var _this = this;

        var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        _classCallCheck(this, InputView);

        if (configurable instanceof InputView) {
            m = configurable.m;
            n = configurable.n;
            size = configurable.size, data = configurable.getData();
        }

        var temp = document.createElement('div');
        temp.innerHTML = (0, _InputView2.default)({
            object: 'table',
            configurable: configurable,
            m: m,
            n: n,
            data: data,
            size: size
        });

        this.configurable = configurable;
        this.size = size;
        this.m = m;
        this.n = n;
        this.view = temp.firstElementChild;

        if (configurable) {
            // Стрелки
            var arrowsBlock = this.view.lastElementChild.previousSibling;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = arrowsBlock.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var canvas = _step.value;

                    (0, _arrow.addArrow)(canvas);
                    switch (true) {
                        case canvas.classList.contains('left'):
                            canvas.onclick = function () {
                                if (_this.n > 3) {
                                    _this.removeCol();
                                    new _BasisView2.default(_this.n - 1, _this.m - 1);
                                }
                            };
                            break;
                        case canvas.classList.contains('right'):
                            canvas.onclick = function () {
                                if (_this.n < 17) {
                                    _this.addCol();
                                    new _BasisView2.default(_this.n - 1, _this.m - 1);
                                }
                            };
                            break;
                        case canvas.classList.contains('up'):
                            canvas.onclick = function () {
                                if (_this.m > 3) {
                                    _this.removeRow();
                                    new _BasisView2.default(_this.n - 1, _this.m - 1);
                                }
                            };
                            break;
                        case canvas.classList.contains('down'):
                            canvas.onclick = function () {
                                if (_this.m < 17) {
                                    _this.addRow();
                                    new _BasisView2.default(_this.n - 1, _this.m - 1);
                                }
                            };
                            break;
                    }
                }

                // Снятие флага плохого ввода с поля при попытке что-то туда ввести
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.view.addEventListener('input', function (event) {
                return event.target.classList.remove('bad-input');
            }, false);

            // Блокировка ввода пробелов
            this.view.addEventListener('keydown', function (event) {
                return event.code === 'Space' ? event.preventDefault() : undefined;
            });

            // Блокировка вставки пробелов из буфера обмена
            this.view.addEventListener('paste', function (event) {
                var text = void 0,
                    target = event.target;

                event.preventDefault();
                if (target instanceof HTMLInputElement === false) {
                    return;
                }

                text = event.clipboardData.getData('text').replace(/ /g, '');
                target.value = target.value.slice(0, target.selectionStart) + text + target.value.slice(target.selectionEnd);
            });

            // Обработчик кнопки посчитать
            document.getElementById('count').onclick = function () {
                if (document.forms.settings.basis.value == 'СБП' && !_BasisView2.default.isValidForm(_this.m - 1)) {
                    return;
                }

                var badInput = false;
                (0, _DOMFor.InputView)(_this.view.firstElementChild, function (elem, i, j) {
                    if (elem.value.length === 0 || i === 0 && j === _this.n - 1) {
                        return;
                    }

                    if (!/(^(-)??\d+?([.,]\d+?)??$)|(^(-)??\d+?\/\d+?$)/.test(elem.value)) {
                        elem.classList.add('bad-input');
                        badInput = true;
                    }
                });

                if (!badInput) {
                    (0, _solver2.default)(_this);
                }
            };

            // Обработчик кнопки сброс
            document.getElementById('reset').onclick = function () {
                (0, _DOMFor.InputView)(document.getElementById('solution-wrap').firstElementChild.firstElementChild, function (elem, i, j) {
                    if (i == 0 && j == _this.n - 1) {
                        elem.value = 'min';
                    } else {
                        elem.value = '';
                        elem.classList.remove('bad-input');
                    }
                });
            };
        }
    }

    // Помещает представление в конец destination


    _createClass(InputView, [{
        key: 'into',
        value: function into(destination) {
            destination.appendChild(this.view);
            return this;
        }

        // Изменить размер полей ввода представления на size

    }, {
        key: 'resize',
        value: function resize(size) {
            var _this2 = this;

            (0, _DOMFor.InputView)(this.view.firstElementChild, function (elem, i, j) {
                if (i !== 0 || j !== _this2.n - 1) {
                    elem.size = size;
                }
            });
            this.size = size;
        }

        // Получить данные из представления в виде массива
        // Если dataToNextStep = true, то создаёт дроби (Fraction),
        // иначе возвращает строковые значения

    }, {
        key: 'getData',
        value: function getData() {
            var _this3 = this;

            var dataToNextStep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var data = [];
            var lastI = -1;
            (0, _DOMFor.InputView)(this.view.firstElementChild, function (elem, i, j) {
                if (lastI < i) {
                    data.push([]);
                    lastI = i;
                }

                if (!dataToNextStep || i === 0 && j === _this3.n - 1) {
                    return data[i].push(elem.value);
                }

                var inputValue = elem.value,
                    index = inputValue.indexOf('/');

                if (index > -1) {
                    // Обычная дробь
                    data[i].push(new _fraction2.default(+inputValue.slice(0, index), +inputValue.slice(index + 1)));
                } else {
                    index = inputValue.indexOf('.');
                    if (index == -1) {
                        index = inputValue.indexOf(',');
                    }

                    if (index > -1) {
                        // Десятичная дробь
                        var before = +inputValue.slice(0, index),
                            after = +inputValue.slice(index + 1);

                        var denominator = Math.pow(10, after.toString().length);

                        if (before[0] === '-') {
                            data[i].push(new _fraction2.default(-(-before * denominator + after), denominator));
                        } else {
                            data[i].push(new _fraction2.default(before * denominator + after, denominator));
                        }
                    } else {
                        // Целое число
                        data[i].push(new _fraction2.default(+inputValue, 1));
                    }
                }
            });

            return data;
        }
    }, {
        key: 'addRow',
        value: function addRow() {
            var row = document.createElement('div');
            row.innerHTML = (0, _add2.default)({
                object: 'row',
                n: this.n,
                size: this.size
            });
            this.m++;
            this.view.firstElementChild.appendChild(row);
        }
    }, {
        key: 'removeRow',
        value: function removeRow() {
            this.view.firstElementChild.removeChild(this.view.firstElementChild.lastElementChild);
            this.m--;
        }
    }, {
        key: 'addCol',
        value: function addCol() {
            var _this4 = this;

            var data = this.getData();
            data.forEach(function (array) {
                return array.splice(_this4.n - 1, 0, '');
            });

            this.view.firstElementChild.innerHTML = (0, _add2.default)({
                object: 'table',
                configurable: this.configurable,
                n: ++this.n,
                m: this.m,
                size: this.size,
                data: data
            });

            this.view.lastElementChild.innerHTML = (0, _lastCondition2.default)({
                n: this.n
            });
        }
    }, {
        key: 'removeCol',
        value: function removeCol() {
            var _this5 = this;

            var data = this.getData();
            data.forEach(function (array) {
                return array.splice(_this5.n - 2, 1);
            });

            this.view.firstElementChild.innerHTML = (0, _add2.default)({
                object: 'table',
                configurable: this.configurable,
                n: --this.n,
                m: this.m,
                size: this.size,
                data: data
            });

            this.view.lastElementChild.innerHTML = (0, _lastCondition2.default)({
                n: this.n
            });
        }
    }, {
        key: 'removeArrowsHandlers',
        value: function removeArrowsHandlers() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Array.from(this.view.lastElementChild.previousSibling.children)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var arrow = _step2.value;

                    (0, _arrow.removeArrow)(arrow);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }]);

    return InputView;
}();

exports.default = InputView;

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: Опущены проверки наличия аргументов и соответствия их типов

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fraction = function () {
    function Fraction(numerator, denominator) {
        _classCallCheck(this, Fraction);

        if (denominator === 0) {
            var error = new Error('Знаменатель дроби не может быть равен нулю!');
            window.alert(error.message);
            throw error;
        }

        if (denominator < 0) {
            denominator *= -1;
            numerator *= -1;
        }

        this.numerator = numerator;
        this.denominator = denominator;
    }

    // Упростить дробь


    _createClass(Fraction, [{
        key: 'simplify',
        value: function simplify() {
            var a = Math.abs(this.numerator),
                b = this.denominator;

            if (a === 0) {
                return this;
            }

            while (b !== 0) {
                var _ref = [b, a % b];
                a = _ref[0];
                b = _ref[1];
            }

            this.numerator /= a;
            this.denominator /= a;
            return this;
        }

        // Сложение дробей

    }, {
        key: 'add',
        value: function add(term) {
            return new Fraction(this.numerator * term.denominator + this.denominator * term.numerator, this.denominator * term.denominator).simplify();
        }

        // Вычитание дробей

    }, {
        key: 'sub',
        value: function sub(term) {
            return new Fraction(this.numerator * term.denominator - this.denominator * term.numerator, this.denominator * term.denominator).simplify();
        }

        // Перемножение дробей

    }, {
        key: 'mul',
        value: function mul(term) {
            return new Fraction(this.numerator * term.numerator, this.denominator * term.denominator).simplify();
        }

        // Деление дробей

    }, {
        key: 'div',
        value: function div(term) {
            return new Fraction(this.numerator * term.denominator, this.denominator * term.numerator).simplify();
        }

        /* Сравнение дробей
        *   this > term, ret > 0
        *   this = term, ret = 0
        *   this < term, ret < 0
        */

    }, {
        key: 'compare',
        value: function compare(term) {
            return this.sub(term).numerator;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.toString();
        }

        // Получение ответа в виде строки

    }, {
        key: 'toString',
        value: function toString() {
            this.simplify();
            return this.denominator === 1 || this.numerator === 0 ? this.numerator : this.numerator + '/' + this.denominator;
        }

        // Получение обычного числа

    }, {
        key: 'toInt',
        value: function toInt() {
            return +this.numerator / +this.denominator;
        }

        // Проверка равенства дроби нулю

    }, {
        key: 'isZero',
        get: function get() {
            return this.numerator === 0;
        }

        // Положительна ли дробь?

    }, {
        key: 'isPositive',
        get: function get() {
            return this.numerator > 0;
        }

        // Отрицательная дробь?

    }, {
        key: 'isNegative',
        get: function get() {
            return this.numerator < 0;
        }

        // Возвращает модуль дроби

    }, {
        key: 'abs',
        get: function get() {
            return this.isNegative ? this.mul(Fraction.minusOne) : this;
        }

        // Равна ли дробь единице?

    }, {
        key: 'isOne',
        get: function get() {
            return this.abs.compare(Fraction.one) === 0;
        }

        // Возвращает дробь умноженную на минус единицу

    }, {
        key: 'reflect',
        get: function get() {
            return this.mul(minusOne);
        }

        // Возвращает ноль (дробью)

    }], [{
        key: 'zero',
        get: function get() {
            return zero;
        }

        // Возвращает единицу (дробью)

    }, {
        key: 'one',
        get: function get() {
            return one;
        }

        // Возвращает минус единицу (дробью)

    }, {
        key: 'minusOne',
        get: function get() {
            return minusOne;
        }
    }]);

    return Fraction;
}();

exports.default = Fraction;


var zero = new Fraction(0, 1),
    one = new Fraction(1, 1),
    minusOne = new Fraction(-1, 1);

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(fetch) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filesList = __webpack_require__(343);

var _filesList2 = _interopRequireDefault(_filesList);

var _BasisView = __webpack_require__(94);

var _BasisView2 = _interopRequireDefault(_BasisView);

var _Stack = __webpack_require__(95);

var _Stack2 = _interopRequireDefault(_Stack);

var _InputView = __webpack_require__(64);

var _InputView2 = _interopRequireDefault(_InputView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var filesPopup = document.getElementById('files-popup'),
    filesPopupWrap = filesPopup.querySelector('.list'),
    popupWrap = document.getElementById('popup-wrap'),
    waitingPopup = document.getElementById('waiting-popup'),
    waitingPopupMessage = waitingPopup.querySelector('.message'),
    waitingPopupCancel = waitingPopup.querySelector('.cancel'),
    fileSavePopup = document.getElementById('file-save'),
    fileSavePopupSend = document.getElementById('send'),
    fileSaveName = document.getElementById('save-name'),
    bgBlock = document.getElementById('background-block'),
    solution = document.getElementById('solution-wrap');

// Установка обработчиков закрытия popup'ов
popupWrap.onclick = function (event) {
    if (!event.target.classList.contains('cancel')) {
        return;
    }

    bgBlock.classList.add('hidden');
    filesPopup.classList.add('hidden');
    waitingPopup.classList.add('hidden');
    waitingPopupCancel.classList.add('hidden');
    fileSavePopup.classList.add('hidden');
};

/* Загрузка файла из списка */
filesPopupWrap.onclick = function (event) {
    var target = event.target;
    if (!target.classList.contains('file')) {
        return;
    }

    filesPopup.classList.add('hidden'); // Скрываем список файлов
    Popups.waiting(); // Показываем окно ожидания

    fetch('/files/' + target.textContent).then(function (res) {
        if (res.status != 200) {
            throw res;
        }

        return res.json();
    }).then(function (json) {

        var m = json.length,
            n = json[0].length;

        if (n < 3 || n > 17 || m < 3 || m > 17) {
            throw new Error();
        }

        solution.innerHTML = '';
        window.views = new _Stack2.default(new _InputView2.default(true, m, n, 2, json).into(solution));
        new _BasisView2.default(n - 1);

        Popups.showMessage('Данные успешно загружены!');
    }).catch(function (err) {
        console.dir(err); // Подробное описание ошибки
        if (err.status) {
            Popups.showMessage(err.status + ': ' + err.statusText);
        } else {
            Popups.showMessage('Загружаемый файл имеет неправильный формат!');
        }
    });
};

/* Кнопка "Сохранить" */
fileSavePopupSend.onclick = function () {
    var name = fileSaveName.value.trim();

    // Скрываем окно сохранения
    fileSavePopup.classList.add('hidden');
    // Показываем окно ожидания
    Popups.waiting();

    if (name === '') {
        Popups.showMessage('Введено пустое имя файла!');
        return;
    }

    fetch('/save', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            name: name,
            file: window.views[0].getData()
        })
    }).then(function (res) {
        if (res.status == 200) {
            Popups.showMessage('Файл успешно сохранён!');
        } else {
            Popups.showMessage('Не удалось сохранить файл!');
        }
    }).catch(function (err) {
        Popups.showMessage(err.toString());
    });
};

var Popups = function () {
    function Popups() {
        _classCallCheck(this, Popups);
    }

    _createClass(Popups, null, [{
        key: 'waiting',
        value: function waiting() {
            // Отображение представления ожидания загрузки
            bgBlock.classList.remove('hidden');
            waitingPopupMessage.textContent = 'Ожидание ответа от сервера...';
            waitingPopupCancel.classList.add('hidden');
            waitingPopup.classList.remove('hidden');
        }

        // Вывести сообщение с возможностью закрытия popup

    }, {
        key: 'showMessage',
        value: function showMessage(msg) {
            bgBlock.classList.remove('hidden');
            waitingPopup.classList.remove('hidden');

            waitingPopupMessage.textContent = msg;
            waitingPopupCancel.classList.remove('hidden');
        }
    }, {
        key: 'openFileLoadView',
        value: function openFileLoadView(files) {
            // Скрытие представления ожидания загрузки
            waitingPopup.classList.add('hidden');
            // отображение представления каталога
            filesPopup.classList.remove('hidden');
            // Показать каталог
            filesPopupWrap.innerHTML = (0, _filesList2.default)({ files: files });
        }
    }, {
        key: 'openFileSaveView',
        value: function openFileSaveView() {
            bgBlock.classList.remove('hidden');
            fileSavePopup.classList.remove('hidden');
        }
    }]);

    return Popups;
}();

exports.default = Popups;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(131)))

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Внутренние зависимости


// Внешние зависимости


var _BasisView = __webpack_require__(345);

var _BasisView2 = _interopRequireDefault(_BasisView);

__webpack_require__(346);

var _Popups = __webpack_require__(93);

var _Popups2 = _interopRequireDefault(_Popups);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BasisView = function () {
    function BasisView(n) {
        _classCallCheck(this, BasisView);

        this.n = n;
        document.getElementById('my-basis').innerHTML = (0, _BasisView2.default)({ n: n });
    }

    _createClass(BasisView, null, [{
        key: 'isValidForm',
        value: function isValidForm(m) {
            var checkBoxes = document.forms.settings,
                amountChecked = 0,
                n = window.views[0].n - 1;

            for (var i = 0; i < n; i++) {
                if (checkBoxes['b' + (i + 1)].checked) {
                    amountChecked++;
                }
            }

            if (amountChecked !== m) {
                _Popups2.default.showMessage('\u0411\u0430\u0437\u0438\u0441 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0440\u043E\u0432\u043D\u043E ' + m + ' \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044Be(\u044B\u0445), \u0430 \u0432\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438 ' + amountChecked + '!');
                return false;
            }

            return true;
        }
    }]);

    return BasisView;
}();

exports.default = BasisView;

/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stack = function (_Array) {
    _inherits(Stack, _Array);

    function Stack() {
        var _ret;

        _classCallCheck(this, Stack);

        var _this = _possibleConstructorReturn(this, (Stack.__proto__ || Object.getPrototypeOf(Stack)).call(this));

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var array = Array.from(args);
        array.__proto__ = Stack.prototype;

        return _ret = array, _possibleConstructorReturn(_this, _ret);
    }

    // Возвращает вершину стека


    _createClass(Stack, [{
        key: "clear",


        // Очищает стек
        value: function clear() {
            while (this.pop()) {}
        }

        // Очищает стек и заменяет его содежимое на args

    }, {
        key: "replace",
        value: function replace() {
            this.clear();

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    this.push(item);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "top",
        get: function get() {
            return this[this.length - 1];
        }
    }]);

    return Stack;
}(Array);

exports.default = Stack;

/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InputView = InputView;
exports.SimplexTable = SimplexTable;
// Проход по представлению InputView
function InputView(root, callback) {
    var rows = root.children;
    for (var rowIndex = 0, rowsLen = rows.length; rowIndex < rowsLen; rowIndex++) {
        var cols = rows[rowIndex].children;
        for (var colIndex = 0, colsLen = cols.length, elemIndex = 0; elemIndex < colsLen; elemIndex++) {
            var elem = cols[elemIndex];
            if (elem instanceof HTMLSpanElement) continue;

            callback(elem, rowIndex, colIndex);
            colIndex++;
        }
    }
}

// Проход по представлению SimplexTable
function SimplexTable(root, callback) {
    var rows = root.rows;
    for (var i = 1, iLen = rows.length; i < iLen; i++) {
        var cells = rows[i].cells;
        for (var j = 1, jLen = cells.length; j < jLen; j++) {
            callback(cells[j], i - 1, j - 1);
        }
    }
}

/***/ })

},[338]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL0lucHV0Vmlldy9hZGQucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvSW5wdXRWaWV3L2xhc3RDb25kaXRpb24ucHVnIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5zY3NzIiwid2VicGFjazovLy8uL2xvZ2ljL3ByZXZlbnRTZWxlY3RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy90b29sYmFyL2luZGV4LmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvdG9vbGJhci90b29sYmFyLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9Qb3B1cHMvZmlsZXMtbGlzdC5wdWciLCJ3ZWJwYWNrOi8vL2ZzIChpZ25vcmVkKSIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL0Jhc2lzVmlldy9CYXNpc1ZpZXcucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvQmFzaXNWaWV3L0Jhc2lzVmlldy5zY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvSW5wdXRWaWV3L0lucHV0Vmlldy5zY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvSW5wdXRWaWV3L0lucHV0Vmlldy5wdWciLCJ3ZWJwYWNrOi8vLy4vbG9naWMvYXJyb3cuanMiLCJ3ZWJwYWNrOi8vLy4vbG9naWMvc29sdmVyLmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvU2ltcGxleFRhYmxlL2luZGV4LmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvU2ltcGxleFRhYmxlL1NpbXBsZXhUYWJsZS5zY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvU2ltcGxleFRhYmxlL1NpbXBsZXhUYWJsZS5wdWciLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9UcmFuc2l0aW9uVmlldy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL1RyYW5zaXRpb25WaWV3L1RyYW5zaXRpb25WaWV3LnB1ZyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL1RyYW5zaXRpb25WaWV3L1RyYW5zaXRpb25WaWV3LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9NYXRyaXhWaWV3L2luZGV4LmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvTWF0cml4Vmlldy9NYXRyaXhWaWV3LnB1ZyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL01hdHJpeFZpZXcvTWF0cml4Vmlldy5zY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvRnVuY3Rpb25HcmFwaC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL0Z1bmN0aW9uR3JhcGgvbWFya3VwLnB1ZyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL0Z1bmN0aW9uR3JhcGgvZnVuYy5wdWciLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9GdW5jdGlvbkdyYXBoL3N0eWxlLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9JbnB1dFZpZXcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbG9naWMvZnJhY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9Qb3B1cHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9CYXNpc1ZpZXcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbG9naWMvU3RhY2suanMiLCJ3ZWJwYWNrOi8vLy4vbG9naWMvRE9NRm9yLmpzIl0sIm5hbWVzIjpbInNvbHV0aW9uIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIndpbmRvdyIsInZpZXdzIiwiaW50byIsIm4iLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ0YXJnZXQiLCJIVE1MSW5wdXRFbGVtZW50IiwiSFRNTFNlbGVjdEVsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNyZWVwZXIiLCJteUJhc2lzVmlldyIsImRyYWdTdGFydCIsIm9mZnNldCIsIm9ubW91c2Vkb3duIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGVmdCIsInBhZ2VYIiwiZGlmIiwic3R5bGUiLCJmb3JFYWNoIiwidmlldyIsInJlc2l6ZSIsIk1hdGgiLCJmbG9vciIsIm9uY2xpY2siLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJsb2FkIiwic2F2ZSIsIndhaXRpbmciLCJmZXRjaCIsInRoZW4iLCJyZXMiLCJzdGF0dXMiLCJqc29uIiwibWVzc2FnZSIsInNob3dNZXNzYWdlIiwib3BlbkZpbGVMb2FkVmlldyIsImZpbGVzIiwiY2F0Y2giLCJlcnIiLCJzdGF0dXNUZXh0IiwidG9TdHJpbmciLCJvcGVuRmlsZVNhdmVWaWV3IiwibmV3SW5wdXRWaWV3IiwiaW5uZXJIVE1MIiwicmVwbGFjZSIsInF1ZXJ5U2VsZWN0b3IiLCJncmFwaGljIiwiYm9keSIsInNob3ciLCJhZGRBcnJvdyIsInJlbW92ZUFycm93IiwiZHJhd0Fycm93IiwiaXRlbSIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsImNsb3NlUGF0aCIsImZpbGwiLCJhcnJvd3MiLCJwcmVzc2VkIiwicHJlc3NlZENvbG9yIiwibm90UHJlc3NlZENvbG9yIiwiaW5kZXgiLCJmaWxsU3R5bGUiLCJjYW52YXMiLCJjb250ZXh0IiwiZ2V0Q29udGV4dCIsImxlbmd0aCIsInB1c2giLCJhcnJvdyIsInNwbGljZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsInNvbHZlIiwiY29sb3JzIiwibGluZWFyRm9ybSIsIm1heFRhc2siLCJ0b29sYmFyIiwicHJldiIsImF1dG8iLCJmaW5hbFBhbmUiLCJzaG93R3JhcGgiLCJleGl0IiwiZ2V0TGFzdE1lc3NhZ2UiLCJkYXRhIiwidG9wIiwibSIsIngiLCJpIiwicm93SW5kZXgiLCJpbmRleE9mIiwiam9pbiIsInJlZmxlY3QiLCJhZGROZXdTaW1wbGV4VGFibGVWaWV3Iiwic3RlcCIsImxvb2tCYXNpcyIsInJlZmVyZW5jZUVsZW1lbnRzIiwiZ2V0UmVmZXJlbmNlRWxlbWVudHMiLCJyZWZFbGVtcyIsImNvZGUiLCJzaXplIiwiZGlzYWJsZWQiLCJyZXNldCIsInR2IiwidiIsImxmIiwiYm90dG9tUm93IiwidHlwZSIsInkiLCJ0b0ludCIsImsiLCJiIiwiY29sb3IiLCJuYW1lWSIsIm5hbWVYIiwicmVkcmF3Iiwic2xpY2UiLCJjb25jYXQiLCJoaWRlIiwiZGlzcGF0Y2hFdmVudCIsIk1vdXNlRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsInBvcCIsImNvbnRhaW5zIiwic2Nyb2xsSW50b1ZpZXciLCJ2YXJpYW50cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyYW5kb20iLCJkYXRhc2V0IiwiaW5kZXhlcyIsInNwbGl0Iiwicm93IiwiY29sIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJlbGVtIiwiaiIsIm5leHRUYWJsZURhdGEiLCJpbnB1dCIsInJlbW92ZUFycm93c0hhbmRsZXJzIiwiZ2V0RGF0YSIsInRhc2tUeXBlSW5kZXgiLCJtdWwiLCJtaW51c09uZSIsImJhc2lzU2V0dGluZ3MiLCJmb3JtcyIsInNldHRpbmdzIiwiYmFzaXMiLCJjaGVja2VkIiwidmFsdWUiLCJwIiwic3VtIiwiemVybyIsInRlbXAiLCJjaGVja0JveGVzIiwibWF0cml4IiwiY29lZmZpY2llbnQiLCJjdXJyZW50Um93Iiwicm93cyIsImNvbHMiLCJBcnJheSIsImZyb20iLCJjb2xJbmRleCIsImlzWmVybyIsInNoaWZ0IiwiZGl2Iiwic3ViIiwic3RlcF90b19zdGVwIiwiY2xpY2siLCJTaW1wbGV4VGFibGUiLCJ3cmFwIiwiY3JlYXRlRWxlbWVudCIsImRlc3RpbmF0aW9uIiwiYXBwZW5kQ2hpbGQiLCJtYXhOIiwicENvbCIsInBSb3ciLCJpc05lZ2F0aXZlIiwiaUxlbiIsIm1pbiIsInBvc2l0aXZlIiwiaXNQb3NpdGl2ZSIsInJhdGlvIiwiY29tcGFyZSIsIm9uZSIsIlRyYW5zaXRpb25WaWV3IiwidG9wTGVuIiwiY2xhc3NOYW1lIiwiZGVzdGlvbmF0aW9uIiwiTWF0cml4VmlldyIsImlzRmlyc3QiLCJTQ0FMRSIsIkZ1bmN0aW9uR3JhcGgiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJsYXN0RWxlbWVudENoaWxkIiwiY29uc29sZSIsImxvZyIsIl9fcHJvdG9fXyIsImNhbGwiLCJwYXJlbnROb2RlIiwiZHJhZyIsImRyYWdTdGFydFgiLCJkcmFnU3RhcnRZIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJlIiwib25tb3VzZXVwIiwibGFzdFdpZHRoIiwib25tb3VzZW1vdmUiLCJjIiwidyIsIndpZHRoIiwiaCIsImhlaWdodCIsInMiLCJzY2FsZSIsInRvRml4ZWQiLCJmaWxsUmVjdCIsIm1lYXN1cmVUZXh0IiwidGV4dEFsaWduIiwidGV4dEJhc2VsaW5lIiwiZmlsbFRleHQiLCJkZWx0YVkiLCJmb250Iiwic3RvcmFnZSIsImZ1bmMiLCJzY2FsZVgiLCJzY2FsZVkiLCJtYXgiLCJhYnMiLCJjbGVhciIsImRyYXdBeGVzIiwic3Ryb2tlU3R5bGUiLCJsaW5lV2lkdGgiLCJzdHJva2UiLCJkcmF3U2NhbGVMYWJlbHMiLCJyb3RhdGUiLCJQSSIsImRyYXdHcmlkIiwibGluZUZ1bmN0aW9uIiwibGluZSIsInRyYW5zbGF0ZSIsIkZtaW4iLCJGbWF4IiwicmVzdG9yZSIsImRyYWdnYWJsZSIsIkhUTUxEaXZFbGVtZW50IiwicG9zaXRpb24iLCJwYWdlWSIsImlkIiwiSW5wdXRWaWV3IiwiY29uZmlndXJhYmxlIiwib2JqZWN0IiwiYXJyb3dzQmxvY2siLCJwcmV2aW91c1NpYmxpbmciLCJjaGlsZHJlbiIsInJlbW92ZUNvbCIsImFkZENvbCIsInJlbW92ZVJvdyIsImFkZFJvdyIsInVuZGVmaW5lZCIsInRleHQiLCJjbGlwYm9hcmREYXRhIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25FbmQiLCJpc1ZhbGlkRm9ybSIsImJhZElucHV0IiwidGVzdCIsImRhdGFUb05leHRTdGVwIiwibGFzdEkiLCJpbnB1dFZhbHVlIiwiYmVmb3JlIiwiYWZ0ZXIiLCJkZW5vbWluYXRvciIsInBvdyIsImFycmF5IiwiRnJhY3Rpb24iLCJudW1lcmF0b3IiLCJlcnJvciIsIkVycm9yIiwiYWxlcnQiLCJhIiwidGVybSIsInNpbXBsaWZ5IiwiZmlsZXNQb3B1cCIsImZpbGVzUG9wdXBXcmFwIiwicG9wdXBXcmFwIiwid2FpdGluZ1BvcHVwIiwid2FpdGluZ1BvcHVwTWVzc2FnZSIsIndhaXRpbmdQb3B1cENhbmNlbCIsImZpbGVTYXZlUG9wdXAiLCJmaWxlU2F2ZVBvcHVwU2VuZCIsImZpbGVTYXZlTmFtZSIsImJnQmxvY2siLCJQb3B1cHMiLCJ0ZXh0Q29udGVudCIsImRpciIsIm5hbWUiLCJ0cmltIiwiaGVhZGVycyIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJmaWxlIiwibXNnIiwiQmFzaXNWaWV3IiwiYW1vdW50Q2hlY2tlZCIsIlN0YWNrIiwiYXJncyIsInByb3RvdHlwZSIsInJvb3QiLCJjYWxsYmFjayIsInJvd3NMZW4iLCJjb2xzTGVuIiwiZWxlbUluZGV4IiwiSFRNTFNwYW5FbGVtZW50IiwiY2VsbHMiLCJqTGVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsbUJBQW1CO0FBQzNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtDQUFrQyxvQkFBb0I7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0NBQXdDLDRCQUE0QjtBQUNwRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1QsOEVBQThFO0FBQzlFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLHVCQUF1QjtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLHVDQUF1QywwQkFBMEI7QUFDakU7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCQUErQiwwQkFBMEIsZUFBZTtBQUN4RTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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RSxJQUFJLENBQVIsRUFBVzBGLE9BQU9wQixLQUFLM0YsTUFBNUIsRUFBb0NxQixJQUFJMEYsSUFBeEMsRUFBOEMxRixHQUE5QyxFQUFtRDtBQUMvQyxZQUFJb08sUUFBUTlKLEtBQUt0RSxDQUFMLEVBQVFvTyxLQUFwQjtBQUNBLGFBQUssSUFBSXBMLElBQUksQ0FBUixFQUFXcUwsT0FBT0QsTUFBTXpQLE1BQTdCLEVBQXFDcUUsSUFBSXFMLElBQXpDLEVBQStDckwsR0FBL0MsRUFBb0Q7QUFDaEQrSyxxQkFBU0ssTUFBTXBMLENBQU4sQ0FBVCxFQUFtQmhELElBQUksQ0FBdkIsRUFBMEJnRCxJQUFJLENBQTlCO0FBQ0g7QUFDSjtBQUNKLEMiLCJmaWxlIjoiLi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKiBJTVBPUlRTIEZST00gaW1wb3J0cy1sb2FkZXIgKioqL1xuKGZ1bmN0aW9uKCkge1xuXG4oZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gICAgXVxuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICAgIH1cblxuICAgIHZhciBpc0FycmF5QnVmZmVyVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgICAgfSwgdGhpcylcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICAgIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSsnLCcrdmFsdWUgOiB2YWx1ZVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG4gIH1cblxuICBmdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBCb2R5SW5pdCB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICAgIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICByZXR1cm4gKG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xKSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICAgIH1cbiAgICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgICB9XG4gICAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7IGJvZHk6IHRoaXMuX2JvZHlJbml0IH0pXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gICAgcmF3SGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSAnc3RhdHVzJyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXMgOiAyMDBcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gICAgfSlcbiAgfVxuICBzZWxmLmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpO1xuXG5cbi8qKiogRVhQT1JUUyBGUk9NIGV4cG9ydHMtbG9hZGVyICoqKi9cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLmZldGNoO1xufS5jYWxsKGdsb2JhbCkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL25vZGVfbW9kdWxlcy9pbXBvcnRzLWxvYWRlcj90aGlzPT5nbG9iYWwhLi4vbm9kZV9tb2R1bGVzL2V4cG9ydHMtbG9hZGVyP2dsb2JhbC5mZXRjaCEuLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGNvbmZpZ3VyYWJsZSwgZGF0YSwgbSwgbiwgb2JqZWN0LCBzaXplKSB7c3dpdGNoIChvYmplY3Qpe1xuY2FzZSAncm93JzpcbmZvciAobGV0IGogPSAwOyBqIDwgbiAtIDE7IGorKylcbntcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCIwXFxcIlwiK3B1Zy5hdHRyKFwic2l6ZVwiLCBzaXplLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0V4XFx1MDAzQ3N1YlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBqICsgMSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnN1YlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXCI7XG5pZiAoaiAhPT0gbiAtIDIpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzcGFuXFx1MDAzRStcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXCI7XG59XG59XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDc3BhblxcdTAwM0U9XFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCIwXFxcIlwiK3B1Zy5hdHRyKFwic2l6ZVwiLCBzaXplLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcIjtcbiAgYnJlYWs7XG5jYXNlICd0YWJsZSc6XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XFx1MDAzRVwiO1xuZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gMTsgaisrKVxue1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2lucHV0XCIgKyAoXCIgdHlwZT1cXFwidGV4dFxcXCJcIitwdWcuYXR0cihcInBsYWNlaG9sZGVyXCIsIGNvbmZpZ3VyYWJsZSAmJiBcIjBcIiwgdHJ1ZSwgdHJ1ZSkrcHVnLmF0dHIoXCJzaXplXCIsIHNpemUsIHRydWUsIHRydWUpK3B1Zy5hdHRyKFwidmFsdWVcIiwgZGF0YSAmJiBkYXRhWzBdW2pdLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0V4XFx1MDAzQ3N1YlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBqICsgMSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnN1YlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXCI7XG5pZiAoaiA9PT0gbiAtIDIpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzcGFuXFx1MDAzRS0tXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcIjtcbn1cbmVsc2Uge1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NwYW5cXHUwMDNFK1xcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcIjtcbn1cbn1cbmxldCB2YXJpYW50cyA9IFsnbWluJywgJ21heCddO1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NlbGVjdCB0eXBlPVxcXCJzZWxlY3Qtb25lXFxcIlxcdTAwM0VcIjtcbi8vIGl0ZXJhdGUgdmFyaWFudHNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gdmFyaWFudHM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJCRsOyBwdWdfaW5kZXgwKyspIHtcbiAgICAgICAgdmFyIHZhcmlhbnQgPSAkJG9ialtwdWdfaW5kZXgwXTtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NvcHRpb25cIiArIChwdWcuYXR0cihcInZhbHVlXCIsIHZhcmlhbnQsIHRydWUsIHRydWUpK3B1Zy5hdHRyKFwic2VsZWN0ZWRcIiwgZGF0YSAmJiB2YXJpYW50ID09PSBkYXRhWzBdW24gLSAxXSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdmFyaWFudCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRm9wdGlvblxcdTAwM0VcIjtcbiAgICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICQkb2JqKSB7XG4gICAgICAkJGwrKztcbiAgICAgIHZhciB2YXJpYW50ID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDb3B0aW9uXCIgKyAocHVnLmF0dHIoXCJ2YWx1ZVwiLCB2YXJpYW50LCB0cnVlLCB0cnVlKStwdWcuYXR0cihcInNlbGVjdGVkXCIsIGRhdGEgJiYgdmFyaWFudCA9PT0gZGF0YVswXVtuIC0gMV0sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHZhcmlhbnQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZvcHRpb25cXHUwMDNFXCI7XG4gICAgfVxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDXFx1MDAyRnNlbGVjdFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjtcbmZvciAobGV0IGkgPSAxOyBpIDwgbTsgaSsrKVxue1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdlxcdTAwM0VcIjtcbmZvciAobGV0IGogPSAwOyBqIDwgbiAtIDE7IGorKylcbntcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcInRleHRcXFwiXCIrcHVnLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBjb25maWd1cmFibGUgJiYgXCIwXCIsIHRydWUsIHRydWUpK3B1Zy5hdHRyKFwic2l6ZVwiLCBzaXplLCB0cnVlLCB0cnVlKStwdWcuYXR0cihcInZhbHVlXCIsIGRhdGEgJiYgZGF0YVtpXVtqXSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFeFxcdTAwM0NzdWJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaiArIDEpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzdWJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVwiO1xuaWYgKGogIT09IG4gLSAyKSB7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDc3BhblxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVwiO1xufVxufVxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NwYW5cXHUwMDNFPVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXRcIiArIChcIiB0eXBlPVxcXCJ0ZXh0XFxcIlwiK3B1Zy5hdHRyKFwicGxhY2Vob2xkZXJcIiwgY29uZmlndXJhYmxlICYmIFwiMFwiLCB0cnVlLCB0cnVlKStwdWcuYXR0cihcInNpemVcIiwgc2l6ZSwgdHJ1ZSwgdHJ1ZSkrcHVnLmF0dHIoXCJ2YWx1ZVwiLCBkYXRhICYmIGRhdGFbaV1bbiAtIDFdLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjtcbn1cbiAgYnJlYWs7XG59fS5jYWxsKHRoaXMsXCJjb25maWd1cmFibGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNvbmZpZ3VyYWJsZTp0eXBlb2YgY29uZmlndXJhYmxlIT09XCJ1bmRlZmluZWRcIj9jb25maWd1cmFibGU6dW5kZWZpbmVkLFwiZGF0YVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguZGF0YTp0eXBlb2YgZGF0YSE9PVwidW5kZWZpbmVkXCI/ZGF0YTp1bmRlZmluZWQsXCJtXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tOnR5cGVvZiBtIT09XCJ1bmRlZmluZWRcIj9tOnVuZGVmaW5lZCxcIm5cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm46dHlwZW9mIG4hPT1cInVuZGVmaW5lZFwiP246dW5kZWZpbmVkLFwib2JqZWN0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vYmplY3Q6dHlwZW9mIG9iamVjdCE9PVwidW5kZWZpbmVkXCI/b2JqZWN0OnVuZGVmaW5lZCxcInNpemVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnNpemU6dHlwZW9mIHNpemUhPT1cInVuZGVmaW5lZFwiP3NpemU6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvSW5wdXRWaWV3L2FkZC5wdWdcbi8vIG1vZHVsZSBpZCA9IDEzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAobikge3B1Z19odG1sID0gcHVnX2h0bWwgKyAoXCJ4XFx1MDAzQ3N1YlxcdTAwM0VpXFx1MDAzQ1xcdTAwMkZzdWJcXHUwMDNFIOKpviAwLCBpID0gMSwgLi4uLCBcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBuIC0gMSkgPyBcIlwiIDogcHVnX2ludGVycCkpKTt9LmNhbGwodGhpcyxcIm5cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm46dHlwZW9mIG4hPT1cInVuZGVmaW5lZFwiP246dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvSW5wdXRWaWV3L2xhc3RDb25kaXRpb24ucHVnXG4vLyBtb2R1bGUgaWQgPSAxMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVnX2hhc19vd25fcHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBwdWdfbWVyZ2U7XG5mdW5jdGlvbiBwdWdfbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IHB1Z19tZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSA9PT0gJ2NsYXNzJykge1xuICAgICAgdmFyIHZhbEEgPSBhW2tleV0gfHwgW107XG4gICAgICBhW2tleV0gPSAoQXJyYXkuaXNBcnJheSh2YWxBKSA/IHZhbEEgOiBbdmFsQV0pLmNvbmNhdChiW2tleV0gfHwgW10pO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICB2YXIgdmFsQSA9IHB1Z19zdHlsZShhW2tleV0pO1xuICAgICAgdmFyIHZhbEIgPSBwdWdfc3R5bGUoYltrZXldKTtcbiAgICAgIGFba2V5XSA9IHZhbEEgKyB2YWxCO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgYXJyYXksIG9iamVjdCwgb3Igc3RyaW5nIGFzIGEgc3RyaW5nIG9mIGNsYXNzZXMgZGVsaW1pdGVkIGJ5IGEgc3BhY2UuXG4gKlxuICogSWYgYHZhbGAgaXMgYW4gYXJyYXksIGFsbCBtZW1iZXJzIG9mIGl0IGFuZCBpdHMgc3ViYXJyYXlzIGFyZSBjb3VudGVkIGFzXG4gKiBjbGFzc2VzLiBJZiBgZXNjYXBpbmdgIGlzIGFuIGFycmF5LCB0aGVuIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGluIGB2YWxgIGlzXG4gKiBlc2NhcGVkIGRlcGVuZHMgb24gdGhlIGNvcnJlc3BvbmRpbmcgaXRlbSBpbiBgZXNjYXBpbmdgLiBJZiBgZXNjYXBpbmdgIGlzXG4gKiBub3QgYW4gYXJyYXksIG5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gKlxuICogSWYgYHZhbGAgaXMgYW4gb2JqZWN0LCBhbGwgdGhlIGtleXMgd2hvc2UgdmFsdWUgaXMgdHJ1dGh5IGFyZSBjb3VudGVkIGFzXG4gKiBjbGFzc2VzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIElmIGB2YWxgIGlzIGEgc3RyaW5nLCBpdCBpcyBjb3VudGVkIGFzIGEgY2xhc3MuIE5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gKlxuICogQHBhcmFtIHsoQXJyYXkuPHN0cmluZz58T2JqZWN0LjxzdHJpbmcsIGJvb2xlYW4+fHN0cmluZyl9IHZhbFxuICogQHBhcmFtIHs/QXJyYXkuPHN0cmluZz59IGVzY2FwaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xhc3NlcyA9IHB1Z19jbGFzc2VzO1xuZnVuY3Rpb24gcHVnX2NsYXNzZXNfYXJyYXkodmFsLCBlc2NhcGluZykge1xuICB2YXIgY2xhc3NTdHJpbmcgPSAnJywgY2xhc3NOYW1lLCBwYWRkaW5nID0gJycsIGVzY2FwZUVuYWJsZWQgPSBBcnJheS5pc0FycmF5KGVzY2FwaW5nKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICBjbGFzc05hbWUgPSBwdWdfY2xhc3Nlcyh2YWxbaV0pO1xuICAgIGlmICghY2xhc3NOYW1lKSBjb250aW51ZTtcbiAgICBlc2NhcGVFbmFibGVkICYmIGVzY2FwaW5nW2ldICYmIChjbGFzc05hbWUgPSBwdWdfZXNjYXBlKGNsYXNzTmFtZSkpO1xuICAgIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgKyBwYWRkaW5nICsgY2xhc3NOYW1lO1xuICAgIHBhZGRpbmcgPSAnICc7XG4gIH1cbiAgcmV0dXJuIGNsYXNzU3RyaW5nO1xufVxuZnVuY3Rpb24gcHVnX2NsYXNzZXNfb2JqZWN0KHZhbCkge1xuICB2YXIgY2xhc3NTdHJpbmcgPSAnJywgcGFkZGluZyA9ICcnO1xuICBmb3IgKHZhciBrZXkgaW4gdmFsKSB7XG4gICAgaWYgKGtleSAmJiB2YWxba2V5XSAmJiBwdWdfaGFzX293bl9wcm9wZXJ0eS5jYWxsKHZhbCwga2V5KSkge1xuICAgICAgY2xhc3NTdHJpbmcgPSBjbGFzc1N0cmluZyArIHBhZGRpbmcgKyBrZXk7XG4gICAgICBwYWRkaW5nID0gJyAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY2xhc3NTdHJpbmc7XG59XG5mdW5jdGlvbiBwdWdfY2xhc3Nlcyh2YWwsIGVzY2FwaW5nKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXR1cm4gcHVnX2NsYXNzZXNfYXJyYXkodmFsLCBlc2NhcGluZyk7XG4gIH0gZWxzZSBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHB1Z19jbGFzc2VzX29iamVjdCh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWwgfHwgJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IG9iamVjdCBvciBzdHJpbmcgdG8gYSBzdHJpbmcgb2YgQ1NTIHN0eWxlcyBkZWxpbWl0ZWQgYnkgYSBzZW1pY29sb24uXG4gKlxuICogQHBhcmFtIHsoT2JqZWN0LjxzdHJpbmcsIHN0cmluZz58c3RyaW5nKX0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy5zdHlsZSA9IHB1Z19zdHlsZTtcbmZ1bmN0aW9uIHB1Z19zdHlsZSh2YWwpIHtcbiAgaWYgKCF2YWwpIHJldHVybiAnJztcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIG91dCA9ICcnO1xuICAgIGZvciAodmFyIHN0eWxlIGluIHZhbCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChwdWdfaGFzX293bl9wcm9wZXJ0eS5jYWxsKHZhbCwgc3R5bGUpKSB7XG4gICAgICAgIG91dCA9IG91dCArIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXSArICc7JztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfSBlbHNlIHtcbiAgICB2YWwgKz0gJyc7XG4gICAgaWYgKHZhbFt2YWwubGVuZ3RoIC0gMV0gIT09ICc7JykgXG4gICAgICByZXR1cm4gdmFsICsgJzsnO1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IHB1Z19hdHRyO1xuZnVuY3Rpb24gcHVnX2F0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmICh2YWwgPT09IGZhbHNlIHx8IHZhbCA9PSBudWxsIHx8ICF2YWwgJiYgKGtleSA9PT0gJ2NsYXNzJyB8fCBrZXkgPT09ICdzdHlsZScpKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmICh2YWwgPT09IHRydWUpIHtcbiAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbC50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YWwgPSB2YWwudG9KU09OKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gSlNPTi5zdHJpbmdpZnkodmFsKTtcbiAgICBpZiAoIWVzY2FwZWQgJiYgdmFsLmluZGV4T2YoJ1wiJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cXCcnICsgdmFsLnJlcGxhY2UoLycvZywgJyYjMzk7JykgKyAnXFwnJztcbiAgICB9XG4gIH1cbiAgaWYgKGVzY2FwZWQpIHZhbCA9IHB1Z19lc2NhcGUodmFsKTtcbiAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVyc2Ugd2hldGhlciB0byB1c2UgSFRNTDUgdGVyc2UgYm9vbGVhbiBhdHRyaWJ1dGVzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBwdWdfYXR0cnM7XG5mdW5jdGlvbiBwdWdfYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBhdHRycyA9ICcnO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAocHVnX2hhc19vd25fcHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHZhciB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT09IGtleSkge1xuICAgICAgICB2YWwgPSBwdWdfY2xhc3Nlcyh2YWwpO1xuICAgICAgICBhdHRycyA9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpICsgYXR0cnM7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKCdzdHlsZScgPT09IGtleSkge1xuICAgICAgICB2YWwgPSBwdWdfc3R5bGUodmFsKTtcbiAgICAgIH1cbiAgICAgIGF0dHJzICs9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhdHRycztcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgcHVnX21hdGNoX2h0bWwgPSAvW1wiJjw+XS87XG5leHBvcnRzLmVzY2FwZSA9IHB1Z19lc2NhcGU7XG5mdW5jdGlvbiBwdWdfZXNjYXBlKF9odG1sKXtcbiAgdmFyIGh0bWwgPSAnJyArIF9odG1sO1xuICB2YXIgcmVnZXhSZXN1bHQgPSBwdWdfbWF0Y2hfaHRtbC5leGVjKGh0bWwpO1xuICBpZiAoIXJlZ2V4UmVzdWx0KSByZXR1cm4gX2h0bWw7XG5cbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgaSwgbGFzdEluZGV4LCBlc2NhcGU7XG4gIGZvciAoaSA9IHJlZ2V4UmVzdWx0LmluZGV4LCBsYXN0SW5kZXggPSAwOyBpIDwgaHRtbC5sZW5ndGg7IGkrKykge1xuICAgIHN3aXRjaCAoaHRtbC5jaGFyQ29kZUF0KGkpKSB7XG4gICAgICBjYXNlIDM0OiBlc2NhcGUgPSAnJnF1b3Q7JzsgYnJlYWs7XG4gICAgICBjYXNlIDM4OiBlc2NhcGUgPSAnJmFtcDsnOyBicmVhaztcbiAgICAgIGNhc2UgNjA6IGVzY2FwZSA9ICcmbHQ7JzsgYnJlYWs7XG4gICAgICBjYXNlIDYyOiBlc2NhcGUgPSAnJmd0Oyc7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogY29udGludWU7XG4gICAgfVxuICAgIGlmIChsYXN0SW5kZXggIT09IGkpIHJlc3VsdCArPSBodG1sLnN1YnN0cmluZyhsYXN0SW5kZXgsIGkpO1xuICAgIGxhc3RJbmRleCA9IGkgKyAxO1xuICAgIHJlc3VsdCArPSBlc2NhcGU7XG4gIH1cbiAgaWYgKGxhc3RJbmRleCAhPT0gaSkgcmV0dXJuIHJlc3VsdCArIGh0bWwuc3Vic3RyaW5nKGxhc3RJbmRleCwgaSk7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgcHVnIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIG9yaWdpbmFsIHNvdXJjZVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gcHVnX3JldGhyb3c7XG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcHVnX3JldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdQdWcnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLy8g0J/QvtC00LrQu9GO0YfQsNC10Lwg0LHQsNC30L7QstGL0LUg0YHRgtC40LvQuCDRgdGC0YDQsNC90LjRhtGLXHJcbmltcG9ydCAnLi9pbmRleC5zY3NzJztcclxuXHJcbi8vINCR0LvQvtC60LjRgNGD0LXQvCDQstGL0LTQtdC70LXQvdC40LUg0YLQtdC60YHRgtCwINCy0L3QtSDQv9C+0LvQtdC5INCy0LLQvtC00LBcclxuaW1wb3J0ICcuL2xvZ2ljL3ByZXZlbnRTZWxlY3RpbmcuanMnO1xyXG5cclxuLy8g0J/QvtC00LPRgNGD0LbQsNC10Lwg0YLRg9C70LHQsNGAXHJcbmltcG9ydCAnLi9jb21wb25lbnRzL3Rvb2xiYXInO1xyXG5cclxuLy8g0J/QvtCz0YDRg9C20LDQtdC8INCz0LXQvdC10YDQsNGC0L7RgCDRh9C10LrQsdC+0LrRgdC+0LIg0LIg0YLRg9C70LHQsNGAXHJcbmltcG9ydCBCYXNpc1ZpZXcgZnJvbSAnLi9jb21wb25lbnRzL0Jhc2lzVmlldyc7XHJcblxyXG4vLyDQn9C+0LTQs9GA0YPQttCw0LXQvCDRgdGC0LXQulxyXG5pbXBvcnQgU3RhY2sgZnJvbSAnLi9sb2dpYy9TdGFjay5qcyc7XHJcblxyXG4vLyDQn9C+0LTQs9GA0YPQttCw0LXQvCDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjQtSDQstCy0L7QtNCwINC00LDQvdC90YvRhVxyXG5pbXBvcnQgSW5wdXRWaWV3IGZyb20gJy4vY29tcG9uZW50cy9JbnB1dFZpZXcnO1xyXG5cclxubGV0IHNvbHV0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvbHV0aW9uLXdyYXAnKTtcclxuXHJcbndpbmRvdy52aWV3cyA9IG5ldyBTdGFjayhcclxuICAgIG5ldyBJbnB1dFZpZXcodHJ1ZSwgMywgMywgMiwgbnVsbCkuaW50byhzb2x1dGlvbilcclxuKTtcclxubmV3IEJhc2lzVmlldyh3aW5kb3cudmlld3NbMF0ubiAtIDEpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2luZGV4LnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDMzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvLyDQkdC70L7QutC40YDQvtCy0LrQsCDQstGL0LTQtdC70LXQvdC40Y8g0YLQtdC60YHRgtCwINCy0L3QtSDQv9C+0LvQtdC5INCy0LLQvtC00LBcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCA9PT0gZmFsc2UgJiZcclxuICAgICAgICB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG59LCBmYWxzZSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xvZ2ljL3ByZXZlbnRTZWxlY3RpbmcuanMiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgJy4vdG9vbGJhci5zY3NzJztcclxuXHJcbi8vINCf0L7QtNCz0YDRg9C20LDQtdC8IHBvcHVwJ9GLXHJcbmltcG9ydCBQb3B1cHMgZnJvbSAnLi4vUG9wdXBzJztcclxuXHJcbi8vINCf0L7QtNCz0YDRg9C20LDQtdC8INC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1INGBINCy0LLQvtC00L7QvCDQt9Cw0LTQsNGH0Lgg0LvQuNC90LXQudC90L7Qs9C+INC/0YDQvtCz0YDQsNC80LzQuNGA0L7QstCw0L3QuNGPXHJcbmltcG9ydCBJbnB1dFZpZXcgZnJvbSAnLi4vSW5wdXRWaWV3JztcclxuXHJcbi8vINCf0L7QtNCz0YDRg9C20LDQtdC8INC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1INCz0YDQsNGE0LjQutCwINGE0YPQvdC60YbQuNC5XHJcbmltcG9ydCBGdW5jdGlvbkdyYXBoIGZyb20gJy4uL0Z1bmN0aW9uR3JhcGgnO1xyXG5cclxubGV0IGNyZWVwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlZXBlcicpLFxyXG4gICAgbXlCYXNpc1ZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXktYmFzaXMnKSxcclxuICAgIGRyYWdTdGFydCA9IG51bGwsXHJcbiAgICBvZmZzZXQ7XHJcblxyXG4vKlxyXG4qICAg0JfQsNGB0YLQsNCy0LvRj9C10Lwg0L/QvtC70LfRg9C90L7QuiDQtNCy0LjQs9Cw0YLRjNGB0Y9cclxuKi9cclxuY3JlZXBlci5vbm1vdXNlZG93biA9IChldmVudCkgPT4ge1xyXG4gICAgb2Zmc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmdlYmFyJykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgIGRyYWdTdGFydCA9IGV2ZW50LnBhZ2VYIC0gY3JlZXBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG59O1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZXZlbnQgPT4ge1xyXG4gICAgaWYgKGRyYWdTdGFydCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGlmID0gZXZlbnQucGFnZVggLSBvZmZzZXQgLSBkcmFnU3RhcnQ7XHJcblxyXG4gICAgaWYgKGRpZiA+PSAwICYmIGRpZiA8PSAxOTApIHtcclxuICAgICAgICBjcmVlcGVyLnN0eWxlLmxlZnQgPSBgJHtkaWZ9cHhgO1xyXG4gICAgICAgIHdpbmRvdy52aWV3cy5mb3JFYWNoKHZpZXcgPT4ge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZpZXcgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlc2l6ZShNYXRoLmZsb29yKGRpZiAvIDUgKyAxKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSwgZmFsc2UpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IGRyYWdTdGFydCA9IG51bGwsIGZhbHNlKTtcclxuXHJcbi8qXHJcbiogICDQn9C+0Y/QstC70LXQvdC40LUg0Lgg0LjRgdGH0LXQt9C90L7QstC10L3QuNC1INC/0L7Qu9C10Lkg0LLQstC+0LTQsCDRgdC+0LHQstGB0YLQstC10L3QvdC+0LPQviDQsdCw0LfQuNGB0LBcclxuKi9cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BlcnNvbmFsLWJhc2lzJykub25jbGljayA9ICgpID0+IG15QmFzaXNWaWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FydGlmaWNpYWwtYmFzZS1tZXRob2QnKS5vbmNsaWNrID0gKCkgPT4gbXlCYXNpc1ZpZXcuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblxyXG4vLyDQn9C+0LvRg9GH0LDQtdC8INC90LXQvtCx0YXQvtC00LjQvNGL0LUg0LTQu9GPINCy0LfQsNC40LzQvtC00LXQudGB0YLQstC40Y8g0Y3Qu9C10LzQtdC90YLRi1xyXG5sZXQgbG9hZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkJyksXHJcbiAgICBzYXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUnKTtcclxuXHJcbi8qINCa0L3QvtC/0LrQsCBcItCX0JDQk9Cg0KPQl9CY0KLQrFwiICovXHJcbmxvYWQub25jbGljayA9ICgpID0+IHtcclxuICAgIFBvcHVwcy53YWl0aW5nKCk7XHJcblxyXG4gICAgLy8g0J7RgtC/0YDQsNCy0LrQsCDQt9Cw0L/RgNC+0YHQsCDQvdCwINGB0LXRgNCy0LXRgFxyXG4gICAgZmV0Y2goJy9maWxlcy1saXN0JylcclxuICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAhPSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IHJlcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihqc29uID0+IHtcclxuICAgICAgICAgICAgaWYgKGpzb24ubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0JLRi9Cy0L7QtCDRgdC+0L7QsdGJ0LXQvdC40Y8g0L7QsSDQvtGI0LjQsdC60LUg0L3QsCDRgdGC0L7RgNC+0L3QtSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgICAgICAgUG9wdXBzLnNob3dNZXNzYWdlKGpzb24ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyDQodC60YDRi9GC0LjQtSDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQvtC20LjQtNCw0L3QuNGPINC30LDQs9GA0YPQt9C60LhcclxuICAgICAgICAgICAgICAgIC8vINC+0YLQvtCx0YDQsNC20LXQvdC40LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0LrQsNGC0LDQu9C+0LPQsFxyXG4gICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLRjCDQutCw0YLQsNC70L7Qs1xyXG4gICAgICAgICAgICAgICAgUG9wdXBzLm9wZW5GaWxlTG9hZFZpZXcoanNvbi5maWxlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyLnN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgUG9wdXBzLnNob3dNZXNzYWdlKGAke2Vyci5zdGF0dXN9OiAke2Vyci5zdGF0dXNUZXh0fWApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgUG9wdXBzLnNob3dNZXNzYWdlKGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuLyog0JrQvdC+0L/QutCwIFwi0KHQntCl0KDQkNCd0JjQotCsXCIgKi9cclxuc2F2ZS5vbmNsaWNrID0gUG9wdXBzLm9wZW5GaWxlU2F2ZVZpZXc7XHJcblxyXG4vKiDQmtC90L7Qv9C60LAgXCLQktCr0JnQotCYXCIqL1xyXG5sZXQgc29sdXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29sdXRpb24td3JhcCcpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhpdCcpLm9uY2xpY2sgPSBlID0+IHtcclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdC80YHRjyDQuiDQvdCw0YfQsNC70YzQvdC+0LzRgyDRjdC60YDQsNC90YMg0YEg0YHQvtGF0YDQsNC90LXQvdC40LXQvCDQstCy0LXQtNC10L3QvdC+0Lkg0LzQsNGC0YDQuNGG0YtcclxuICAgIGxldCBuZXdJbnB1dFZpZXcgPSBuZXcgSW5wdXRWaWV3KHdpbmRvdy52aWV3c1swXSk7IC8vIHNwZWNpYWwgZm9yIElFXHJcbiAgICBzb2x1dGlvbi5pbm5lckhUTUwgPSAnJztcclxuICAgIHdpbmRvdy52aWV3cy5yZXBsYWNlKG5ld0lucHV0Vmlldy5pbnRvKHNvbHV0aW9uKSk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9vbGJhcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcclxuICAgIHNvbHV0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ3NvbHZpbmcnKTtcclxuICAgIC8vINCh0LrRgNGL0LLQsNC10Lwg0L/QsNC90LXQu9GM0LrRgyDRgSDQv9GA0LXQtNC70L7QttC10L3QuNC10Lwg0LLRi9GF0L7QtNCwXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluYWwtcGFuZScpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG59O1xyXG5cclxuLy8g0KHQvtC30LTQsNGR0Lwg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0LPRgNCw0YTQuNC60LAg0YTRg9C90LrRhtC40Llcclxud2luZG93LmdyYXBoaWMgPSBuZXcgRnVuY3Rpb25HcmFwaChkb2N1bWVudC5ib2R5LCAzNDAsIDEwMCk7XHJcblxyXG4vKiDQmtC90L7Qv9C60LAgXCLQn9Ce0JrQkNCX0JDQotCsINCT0KDQkNCk0JjQmlwiICovXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93LWdyYXBoJykub25jbGljayA9IGUgPT4ge1xyXG4gICAgd2luZG93LmdyYXBoaWMuc2hvdygpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL3Rvb2xiYXIvaW5kZXguanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy90b29sYmFyL3Rvb2xiYXIuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMzQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwOzt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChmaWxlcykge2ZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspXG57XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJmaWxlXFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBmaWxlc1tpXSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjtcbn19LmNhbGwodGhpcyxcImZpbGVzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5maWxlczp0eXBlb2YgZmlsZXMhPT1cInVuZGVmaW5lZFwiP2ZpbGVzOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL1BvcHVwcy9maWxlcy1saXN0LnB1Z1xuLy8gbW9kdWxlIGlkID0gMzQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qIChpZ25vcmVkKSAqL1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGZzIChpZ25vcmVkKVxuLy8gbW9kdWxlIGlkID0gMzQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwOzt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChuKSB7Zm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXG57XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDbGFiZWxcXHUwMDNFXFx1MDAzQ2lucHV0XCIgKyAoXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiXCIrcHVnLmF0dHIoXCJuYW1lXCIsICdiJyArIChpICsgMSksIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRXhcXHUwMDNDc3ViXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGkgKyAxKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3ViXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGFiZWxcXHUwMDNFXCI7XG59fS5jYWxsKHRoaXMsXCJuXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5uOnR5cGVvZiBuIT09XCJ1bmRlZmluZWRcIj9uOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL0Jhc2lzVmlldy9CYXNpc1ZpZXcucHVnXG4vLyBtb2R1bGUgaWQgPSAzNDVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvQmFzaXNWaWV3L0Jhc2lzVmlldy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzNDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvSW5wdXRWaWV3L0lucHV0Vmlldy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzNDdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGNvbmZpZ3VyYWJsZSkge3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NmaWVsZHNldFwiICsgKFwiIGNsYXNzPVxcXCJJbnB1dFZpZXdcXFwiXCIrcHVnLmF0dHIoXCJkaXNhYmxlZFwiLCAhY29uZmlndXJhYmxlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVwiICsgKG51bGwgPT0gKHB1Z19pbnRlcnAgPSByZXF1aXJlKFwiLi9hZGQucHVnXCIpLmNhbGwodGhpcywgbG9jYWxzKSkgPyBcIlwiIDogcHVnX2ludGVycCkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiO1xuaWYgKGNvbmZpZ3VyYWJsZSkge1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDY2FudmFzIGNsYXNzPVxcXCJhcnJvdyBsZWZ0XFxcIiB3aWR0aD1cXFwiNTBcXFwiIGhlaWdodD1cXFwiMjBcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGY2FudmFzXFx1MDAzRVxcdTAwM0NjYW52YXMgY2xhc3M9XFxcImFycm93IHJpZ2h0XFxcIiB3aWR0aD1cXFwiNTBcXFwiIGhlaWdodD1cXFwiMjBcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGY2FudmFzXFx1MDAzRVxcdTAwM0NjYW52YXMgY2xhc3M9XFxcImFycm93IHVwXFxcIiB3aWR0aD1cXFwiNTBcXFwiIGhlaWdodD1cXFwiMjBcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGY2FudmFzXFx1MDAzRVxcdTAwM0NjYW52YXMgY2xhc3M9XFxcImFycm93IGRvd25cXFwiIHdpZHRoPVxcXCI1MFxcXCIgaGVpZ2h0PVxcXCIyMFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZjYW52YXNcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7XG59XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XFx1MDAzRVwiICsgKG51bGwgPT0gKHB1Z19pbnRlcnAgPSByZXF1aXJlKFwiLi9sYXN0Q29uZGl0aW9uLnB1Z1wiKS5jYWxsKHRoaXMsIGxvY2FscykpID8gXCJcIiA6IHB1Z19pbnRlcnApICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmZpZWxkc2V0XFx1MDAzRVwiO30uY2FsbCh0aGlzLFwiY29uZmlndXJhYmxlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jb25maWd1cmFibGU6dHlwZW9mIGNvbmZpZ3VyYWJsZSE9PVwidW5kZWZpbmVkXCI/Y29uZmlndXJhYmxlOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL0lucHV0Vmlldy9JbnB1dFZpZXcucHVnXG4vLyBtb2R1bGUgaWQgPSAzNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLy8g0J/RgNC+0YbQtdC00YPRgNCwINGA0LjRgdC+0LLQsNC90LjRjyDRgdGC0YDQtdC70LrQuFxyXG5mdW5jdGlvbiBkcmF3QXJyb3coaXRlbSkge1xyXG4gICAgaXRlbS5iZWdpblBhdGgoKTtcclxuICAgIGl0ZW0ubW92ZVRvKDAsIDUpO1xyXG4gICAgaXRlbS5saW5lVG8oMzAsIDUpO1xyXG4gICAgaXRlbS5saW5lVG8oMzAsIDApO1xyXG4gICAgaXRlbS5saW5lVG8oNTAsIDEwKTtcclxuICAgIGl0ZW0ubGluZVRvKDMwLCAyMCk7XHJcbiAgICBpdGVtLmxpbmVUbygzMCwgMTUpO1xyXG4gICAgaXRlbS5saW5lVG8oMCwgMTUpO1xyXG4gICAgaXRlbS5jbG9zZVBhdGgoKTtcclxuICAgIGl0ZW0uZmlsbCgpO1xyXG59XHJcblxyXG5sZXQgYXJyb3dzID0gW10sICAvLyAyRCDQutC+0L3RgtC10LrRgdGC0Ysg0YXQvtC70YHRgtC+0LJcclxuICAgIHByZXNzZWQgPSBbXSwgLy8g0KHQvtC+0YLQstC10YHRgtCy0YPRjtGJ0LjQtSDQutC+0L3RgtC10LrRgdGC0LDQvCDRgdC+0YHRgtC+0Y/QvdC40Y8g0L3QsNC20LDRgtC40Y8g0LrQvdC+0L/QvtC6XHJcbiAgICBwcmVzc2VkQ29sb3IgPSAnI0FCMzAzMCcsXHJcbiAgICBub3RQcmVzc2VkQ29sb3IgPSAnIzc1MzgzOCc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xyXG4gICAgcHJlc3NlZC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcnJvd3NbaW5kZXhdLmZpbGxTdHlsZSA9IHByZXNzZWRDb2xvcjtcclxuICAgICAgICBkcmF3QXJyb3coYXJyb3dzW2luZGV4XSk7XHJcbiAgICAgICAgcHJlc3NlZFtpbmRleF0gPSBmYWxzZTtcclxuICAgIH0pO1xyXG59LCBmYWxzZSk7XHJcblxyXG4vLyDQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjCDRgdGC0YDQtdC70LrRgy4g0KLQtdC/0LXRgNGMINC+0L3QsCDQsdGD0LTQtdGCINC+0YLRgNC40YHQvtCy0YvQstCw0YLRjNGB0Y8g0LIgY2FudmFzXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBcnJvdyhjYW52YXMpIHtcclxuICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyksXHJcbiAgICAgICAgaW5kZXggPSBhcnJvd3MubGVuZ3RoO1xyXG5cclxuICAgIGFycm93cy5wdXNoKGNvbnRleHQpO1xyXG4gICAgcHJlc3NlZC5wdXNoKGZhbHNlKTtcclxuXHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHByZXNzZWRDb2xvcjtcclxuICAgIGRyYXdBcnJvdyhjb250ZXh0KTtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gbm90UHJlc3NlZENvbG9yO1xyXG4gICAgICAgIGRyYXdBcnJvdyhjb250ZXh0KTtcclxuICAgICAgICBwcmVzc2VkW2luZGV4XSA9IHRydWU7XHJcbiAgICB9LCBmYWxzZSk7XHJcbn1cclxuXHJcbi8vINCj0LTQsNC70LXQvdC40LUg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC90L3QvtCz0L4g0L7QsdGA0LDQsdC+0YLRh9C40LrQsCDRgdGC0YDQtdC70LrQuCDQv9C+INC10LPQviBjYW52YXNcclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFycm93KGNhbnZhcykge1xyXG4gICAgbGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGFycm93cy5mb3JFYWNoKChhcnJvdywgaW5kZXgpID0+IHtcclxuICAgICAgICBpZiAoYXJyb3cgPT09IGNvbnRleHQpIHtcclxuICAgICAgICAgICAgYXJyb3dzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHByZXNzZWQuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgY2FudmFzLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoY2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2dpYy9hcnJvdy5qcyIsImltcG9ydCBJbnB1dFZpZXcgZnJvbSAnLi4vY29tcG9uZW50cy9JbnB1dFZpZXcnO1xyXG5pbXBvcnQgU2ltcGxleFRhYmxlIGZyb20gJy4uL2NvbXBvbmVudHMvU2ltcGxleFRhYmxlJztcclxuaW1wb3J0IFRyYW5zaXRpb25WaWV3IGZyb20gJy4uL2NvbXBvbmVudHMvVHJhbnNpdGlvblZpZXcnO1xyXG5pbXBvcnQgTWF0cml4VmlldyBmcm9tICcuLi9jb21wb25lbnRzL01hdHJpeFZpZXcnO1xyXG5pbXBvcnQgRnJhY3Rpb24gZnJvbSAnLi9mcmFjdGlvbi5qcyc7XHJcbmltcG9ydCB7U2ltcGxleFRhYmxlIGFzIERPTUZvcn0gZnJvbSAnLi9ET01Gb3InO1xyXG5pbXBvcnQgU3RhY2sgZnJvbSAnLi9TdGFjay5qcyc7XHJcbmltcG9ydCBQb3B1cHMgZnJvbSAnLi4vY29tcG9uZW50cy9Qb3B1cHMnO1xyXG5cclxubGV0IGNvbG9ycyA9IFtcclxuICAgICcxNjcsIDUyNSwgMCcsIC8vINCS0LXRgdC10L3QvdC40Lkg0LHRg9GC0L7QvVxyXG4gICAgJzI1NSwgMzYsIDAnLCAvLyDQkNC70YvQuVxyXG4gICAgJzE2NSwgMzgsIDEwJywgLy8g0JHQuNGB0LzQsNGA0Lot0YTRg9GA0LjQvtC30L5cclxuICAgICc3NSwgMCwgMTMwJywgLy8g0JjQvdC00LjQs9C+XHJcbiAgICAnMTUzLCAxMDIsIDIwNCcsIC8vINCQ0LzQtdGC0LjRgdGC0L7QstGL0LlcclxuICAgICcxMjcsIDI1NSwgMjEyJywgLy8g0JDQutCy0LDQvNCw0YDQuNC90L7QstGL0LlcclxuICAgICcyNTAsIDIzMSwgMTgxJywgLy8g0JHQsNC90LDQvdC+0LzQsNC90LjRj1xyXG4gICAgJzIzNywgNjAsIDIwMicsIC8vINCQ0LzQsNGA0LDQvdGC0L7QstGL0Lkg0LzQsNC00LbQtdC90YLQsFxyXG4gICAgJzI1NSwgMjIwLCA1MScsIC8vINCR0LvQtdGB0YLRj9GJ0LjQuSDQt9C10LvQtdC90L7QstCw0YLQvi3QttC10LvRgtGL0LlcclxuICAgICcxODEsIDEyMSwgMCcsIC8vINCT0LvRg9Cx0L7QutC40Lkg0LbQtdC70YLRi9C5XHJcbiAgICAnNjYsIDE3MCwgMjU1JywgLy8g0JPQvtC70YPQsdC+0LlcclxuICAgICcwLCAwLCAwJywgLy8g0KfQtdGA0L3Ri9C5XHJcbiAgICAnMCwgMjU1LCAwJywgLy8g0JfQtdC70LXQvdGL0LlcclxuICAgICczMywgNjYsIDMwJywgLy8g0JzQuNGA0YLQvtCy0YvQuVxyXG4gICAgJzI1MiwgMTUsIDE5MicsIC8vINCv0YDQutC+LdGA0L7Qt9C+0LLRi9C5XHJcbiAgICAnMjQ1LCA2NCwgMzMnIC8vINCi0YDQsNC90YHQv9C+0YDRgtC90YvQuSDQvtGA0LDQvdC20LXQstGL0LlcclxuXTtcclxuXHJcbmxldCB2aWV3cywgLy8g0JDQutGC0YPQsNC70YzQvdGL0LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y9cclxuICAgIGdyYXBoaWMsIC8vINCT0YDQsNGE0LjQuiDRhNGD0L3QutGG0LjQuVxyXG4gICAgbGluZWFyRm9ybSwgLy8g0JvQuNC90LXQudC90LDRjyDRhNC+0YDQvNCwXHJcbiAgICBtYXhUYXNrID0gZmFsc2UsIC8vINCX0LDQtNCw0YfQsCDQvdCwINC80LDQutGB0LjQvNGD0Lw/XHJcbiAgICBzb2x1dGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2x1dGlvbi13cmFwJyksXHJcbiAgICB0b29sYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvb2xiYXInKSxcclxuICAgIHByZXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJldicpLFxyXG4gICAgYXV0byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRvJyksXHJcbiAgICBmaW5hbFBhbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluYWwtcGFuZScpLFxyXG4gICAgc2hvd0dyYXBoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3ctZ3JhcGgnKSxcclxuICAgIGV4aXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhpdCcpO1xyXG5cclxuLy8g0JPQtdC90LXRgNCw0YbQuNGPINGB0L7QvtCx0YnQtdC90LjRjyDRgSDQvtGC0LLQtdGC0L7QvCDQvdCwINC30LDQtNCw0YfRg1xyXG5mdW5jdGlvbiBnZXRMYXN0TWVzc2FnZShkYXRhLCBsZWZ0LCB0b3ApIHtcclxuICAgIGxldCBuID0gdG9wLmxlbmd0aCxcclxuICAgICAgICBtID0gbGVmdC5sZW5ndGgsXHJcbiAgICAgICAgeCA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG4gKyBtOyBpKyspIHtcclxuICAgICAgICBsZXQgcm93SW5kZXggPSBsZWZ0LmluZGV4T2YoaSk7XHJcbiAgICAgICAgaWYgKHJvd0luZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgeC5wdXNoKGRhdGFbcm93SW5kZXhdW25dKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4LnB1c2goMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBg0JfQsNC00LDRh9CwINGA0LXRiNC10L3QsCEgZigke3guam9pbignLCAnKX0pID0gJHttYXhUYXNrID8gZGF0YVttXVtuXSA6IGRhdGFbbV1bbl0ucmVmbGVjdH1gO1xyXG59XHJcblxyXG4vLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQvdC+0LLQvtCz0L4g0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0YHQuNC80L/Qu9C10LrRgS3RgtCw0LHQu9C40YbRiyDQuiDRgNC10YjQtdC90LjRjlxyXG5mdW5jdGlvbiBhZGROZXdTaW1wbGV4VGFibGVWaWV3KHZpZXcsIHN0ZXAsIGxvb2tCYXNpcykge1xyXG4gICAgLy8g0J/QvtC40YHQuiDQstC+0LfQvNC+0LbQvdGL0YUg0L7Qv9C+0YDQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCyINC90L7QstC+0Lkg0YLQsNCx0LvQuNGG0LVcclxuICAgIGxldCByZWZlcmVuY2VFbGVtZW50cyA9IFNpbXBsZXhUYWJsZS5nZXRSZWZlcmVuY2VFbGVtZW50cyhcclxuICAgICAgICB2aWV3LmxlZnQubGVuZ3RoICsgMSxcclxuICAgICAgICB2aWV3LnRvcC5sZW5ndGggKyAxLFxyXG4gICAgICAgIHZpZXcuZGF0YSxcclxuICAgICAgICB2aWV3LmxlZnQsXHJcbiAgICAgICAgbG9va0Jhc2lzLFxyXG4gICAgICAgIHZpZXdzWzBdLm4gLSAxXHJcbiAgICApO1xyXG5cclxuICAgIGxldCBtZXNzYWdlID0gbnVsbCxcclxuICAgICAgICByZWZFbGVtcyA9IHJlZmVyZW5jZUVsZW1lbnRzO1xyXG4gICAgc3dpdGNoIChyZWZlcmVuY2VFbGVtZW50cy5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICBpZiAobWF4VGFzaykge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICfQm9C40L3QtdC50L3QsNGPINGE0L7RgNC80LAg0L3QtdC+0LPRgNCw0L3QuNGH0LXQvdCwINGB0LLQtdGA0YXRgyEnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICfQm9C40L3QtdC50L3QsNGPINGE0L7RgNC80LAg0L3QtdC+0LPRgNCw0L3QuNGH0LXQvdCwINGB0L3QuNC30YMhJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWZFbGVtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgaWYgKCFsb29rQmFzaXMpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBnZXRMYXN0TWVzc2FnZSh2aWV3LmRhdGEsIHZpZXcubGVmdCwgdmlldy50b3ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgaWYgKGxvb2tCYXNpcykge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICfQodC40YHRgtC10LzQsCDQvdC10YHQvtCy0LzQtdGB0YLQvdCwISc7XHJcbiAgICAgICAgICAgICAgICByZWZFbGVtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZ2V0TGFzdE1lc3NhZ2Uodmlldy5kYXRhLCB2aWV3LmxlZnQsIHZpZXcudG9wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIGlmIChsb29rQmFzaXMpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSAn0JfQsNC00LDRh9CwINC90LXRgNCw0LfRgNC10YjQuNC80LAhINCd0LXRgiDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQv9C+0LvQvdC40YLRjCDRhdC+0LvQvtGB0YLQvtC5INGI0LDQsy4nO1xyXG4gICAgICAgICAgICAgICAgcmVmRWxlbXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCh0L7Qt9C00LDRkdC8INC90L7QstC+0LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0YHQuNC80L/Qu9C10LrRgS3RgtCw0LHQu9C40YbRi1xyXG4gICAgdmlld3MucHVzaChcclxuICAgICAgICBuZXcgU2ltcGxleFRhYmxlKFxyXG4gICAgICAgICAgICBsb29rQmFzaXMsXHJcbiAgICAgICAgICAgIHN0ZXAsXHJcbiAgICAgICAgICAgIHZpZXcuZGF0YSxcclxuICAgICAgICAgICAgdmlldy50b3AsXHJcbiAgICAgICAgICAgIHZpZXcubGVmdCxcclxuICAgICAgICAgICAgdmlld3NbMF0uc2l6ZSxcclxuICAgICAgICAgICAgcmVmRWxlbXMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VcclxuICAgICAgICApLmludG8oc29sdXRpb24pXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgICAgLy8g0J/QvtC60LDQt9GL0LLQsNC10Lwg0L/QsNC90LXQu9GM0LrRgyDRgSDQv9GA0LXQtNC70L7QttC10L3QuNC10Lwg0LLRi9C50YLQuFxyXG4gICAgICAgIGZpbmFsUGFuZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICAgICAgICBhdXRvLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKCFsb29rQmFzaXMgJiYgdmlld3NbMF0ubiAtIHZpZXdzWzBdLm0gPD0gMikge1xyXG4gICAgICAgICAgICAvKiDQoNC10YjQtdC90LjQtSDQt9Cw0LTQsNGH0Lgg0L/QvtC00L7RiNC70L4g0Log0LrQvtC90YbRgyDQuCDQvNGLINC80L7QttC10Lwg0LLRi9Cy0LXRgdGC0Lgg0LPRgNCw0YTQuNC6ICovXHJcblxyXG4gICAgICAgICAgICAvKiDQntGH0LjRidCw0LXQvCDQs9GA0LDRhNC40LogKi9cclxuICAgICAgICAgICAgZ3JhcGhpYy5yZXNldCgpO1xyXG4gICAgICAgICAgICAvKiDQlNC+0LHQsNCy0LvRj9C10Lwg0YTRg9C90LrRhtC40Lgg0LIg0LPRgNCw0YTQuNC6ICovXHJcbiAgICAgICAgICAgIGxldCB0diA9IG51bGw7XHJcbiAgICAgICAgICAgIC8vINCY0YnQtdC8INCyINGA0LXRiNC10L3QuNC4IFRyYW5zaXRpb25WaWV3XHJcbiAgICAgICAgICAgIGZvciAobGV0IHYgb2Ygdmlld3MpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2IGluc3RhbmNlb2YgVHJhbnNpdGlvblZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0diA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gdHYuZGF0YSxcclxuICAgICAgICAgICAgICAgIHRvcCA9IHR2LnRvcCxcclxuICAgICAgICAgICAgICAgIGxlZnQgPSB0di5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgbGYgPSB0di5ib3R0b21Sb3c7XHJcblxyXG4gICAgICAgICAgICAvKiAg0KDQtdGI0LDQtdC8INC00LLRg9C80LXRgNC90YPRjiDQs9GA0LDRhNC40YfQtdGB0LrRg9GOINC30LDQtNCw0YfRgyDQu9C40L3QtdC50L3QvtCz0L4g0L/RgNC+0LPRgNCw0LzQvNC40YDQvtCy0LDQvdC40Y9cclxuICAgICAgICAgICAgICAgINC00LvRjyDQtNCw0L3QvdGL0YUsINC30LDQv9C40YHQsNC90L3Ri9GFINCyIFRyYW5zaXRpb25WaWV3ICovXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ3JhcGhpYy5hZGQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdoYWxmLXBsYW5lJyxcclxuICAgICAgICAgICAgICAgICAgICB5OiAtZGF0YVtpXVswXS50b0ludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGs6IGRhdGFbaV1bMV0udG9JbnQoKSxcclxuICAgICAgICAgICAgICAgICAgICBiOiAtZGF0YVtpXVsyXS50b0ludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcnNbaV1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBncmFwaGljLmFkZCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGluZScsXHJcbiAgICAgICAgICAgICAgICB5OiBsZlswXS50b0ludCgpLFxyXG4gICAgICAgICAgICAgICAgazogLWxmWzFdLnRvSW50KCksXHJcbiAgICAgICAgICAgICAgICBiOiAwLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcwLCAwLCAyNTUnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ3JhcGhpYy5uYW1lWSA9IGB4JHt0b3BbMF19YDtcclxuICAgICAgICAgICAgZ3JhcGhpYy5uYW1lWCA9IGB4JHt0b3BbMV19YDtcclxuXHJcbiAgICAgICAgICAgIC8qINCf0LXRgNC10YDQuNGB0L7QstGL0LLQsNC10Lwg0LPRgNCw0YTQuNC6ICovXHJcbiAgICAgICAgICAgIGdyYXBoaWMucmVkcmF3KCk7XHJcblxyXG4gICAgICAgICAgICAvKiDQkNC60YLQuNCy0LjRgNGD0LXQvCDQvtGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQuiAqL1xyXG4gICAgICAgICAgICBzaG93R3JhcGguZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JXRgdC70Lgg0L3QsNGI0LvQuCDQsdCw0LfQuNGBXHJcbiAgICBpZiAocmVmZXJlbmNlRWxlbWVudHMuY29kZSA9PSAyICYmIGxvb2tCYXNpcykge1xyXG4gICAgICAgIGxldCBkYXRhID0gdmlldy5kYXRhLnNsaWNlKDAsIHZpZXcuZGF0YS5sZW5ndGggLSAxKTtcclxuXHJcbiAgICAgICAgdmlld3MucHVzaChuZXcgVHJhbnNpdGlvblZpZXcoXHJcbiAgICAgICAgICAgIGRhdGEsIHZpZXcudG9wLCB2aWV3LmxlZnQsIGxpbmVhckZvcm1cclxuICAgICAgICApLmludG8oc29sdXRpb24pKTtcclxuXHJcblxyXG4gICAgICAgIC8vINCh0L7Qt9C00LDRkdC8INGB0LjQvNC/0LvQtdC60YEg0YLQsNCx0LvQuNGG0YMg0LTQu9GPINGA0LDRgdGB0YfRkdGC0L7QslxyXG4gICAgICAgIGFkZE5ld1NpbXBsZXhUYWJsZVZpZXcoe1xyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLmNvbmNhdChbdmlld3MudG9wLmJvdHRvbVJvd10pLFxyXG4gICAgICAgICAgICBsZWZ0OiB2aWV3LmxlZnQsXHJcbiAgICAgICAgICAgIHRvcDogdmlldy50b3BcclxuICAgICAgICB9LCAwLCBmYWxzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60L3QvtC/0LrQuCBcItCd0LDQt9Cw0LQv0JLRi9C50YLQuFwiXHJcbnByZXYub25jbGljayA9ICgpID0+IHtcclxuICAgIC8vINCh0LrRgNGL0LLQsNC10Lwg0LPRgNCw0YTQuNC6INGE0YPQvdC60YbQuNC5XHJcbiAgICBncmFwaGljLmhpZGUoKTtcclxuXHJcbiAgICBpZiAodmlld3MubGVuZ3RoID09PSAzIHx8IHZpZXdzLmxlbmd0aCA+IDMgJiZcclxuICAgICAgICB2aWV3c1t2aWV3cy5sZW5ndGggLSAzXSBpbnN0YW5jZW9mIE1hdHJpeFZpZXdcclxuICAgICkge1xyXG4gICAgICAgIC8vINCd0LDQttC40LzQsNC10Lwg0L3QsCDQutC90L7Qv9C60YMg0LLRi9C50YLQuFxyXG4gICAgICAgIGV4aXQuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnY2xpY2snLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpZXc6IHdpbmRvd1xyXG4gICAgICAgIH0pKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8g0JTQtdC70LDQtdC8INGI0LDQsyDQvdCw0LfQsNC0XHJcbiAgICAgICAgc29sdXRpb24ucmVtb3ZlQ2hpbGQodmlld3MucG9wKCkudmlldyk7XHJcbiAgICAgICAgbGV0IHRvcCA9IHZpZXdzLnRvcDtcclxuXHJcbiAgICAgICAgaWYgKHRvcCBpbnN0YW5jZW9mIFRyYW5zaXRpb25WaWV3KSB7XHJcbiAgICAgICAgICAgIHNvbHV0aW9uLnJlbW92ZUNoaWxkKHZpZXdzLnBvcCgpLnZpZXcpO1xyXG4gICAgICAgICAgICBzb2x1dGlvbi5yZW1vdmVDaGlsZCh2aWV3cy5wb3AoKS52aWV3KTtcclxuICAgICAgICAgICAgdG9wID0gdmlld3MudG9wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFmaW5hbFBhbmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkge1xyXG4gICAgICAgICAgICBmaW5hbFBhbmUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIHNob3dHcmFwaC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGF1dG8uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNvbHV0aW9uLnJlbW92ZUNoaWxkKHZpZXdzLnBvcCgpLnZpZXcpO1xyXG4gICAgICAgIGFkZE5ld1NpbXBsZXhUYWJsZVZpZXcodG9wLCB0b3Auc3RlcCwgdG9wLmxvb2tCYXNpcyk7XHJcblxyXG4gICAgICAgIC8vINCf0YDQvtC60YDRg9GH0LjQstCw0LXQvCDQuiDQv9C+0YHQu9C10LTQvdC10LzRgyDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjiDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgdmlld3MudG9wLnZpZXcuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8g0JDQstGC0L7QstGL0LHQvtGAINC+0L/QvtGA0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxyXG5hdXRvLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCB2YXJpYW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWZlcmVuY2UtZWxlbWVudCcpO1xyXG4gICAgdmFyaWFudHNbTWF0aC5mbG9vcih2YXJpYW50cy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV0uZGlzcGF0Y2hFdmVudChcclxuICAgICAgICBuZXcgTW91c2VFdmVudCgnY2xpY2snLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpZXc6IHdpbmRvd1xyXG4gICAgICAgIH0pXHJcbiAgICApO1xyXG59O1xyXG5cclxuLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0YDRg9GH0L3QvtCz0L4g0LLRi9Cx0L7RgNCwINC+0L/QvtGA0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxyXG5zb2x1dGlvbi5vbmNsaWNrID0gZXZlbnQgPT4ge1xyXG4gICAgaWYgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZWZlcmVuY2UtZWxlbWVudCcpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBsZXQgW3JvdywgY29sXSA9IHRhcmdldC5kYXRhc2V0LmluZGV4ZXMuc3BsaXQoJywnKTtcclxuXHJcbiAgICAvLyDQo9C00LDQu9GP0LXQvCDQstC+0LfQvNC+0LbQvdC+0YHRgtGMINCy0YvQsdC+0YDQsCDQvtC/0L7RgNC+0LPQviDRjdC70LXQvNC10L3RgtCwLFxyXG4gICAgLy8g0LLRi9C00LXQu9GP0LXQvCDQstGL0LHRgNCw0L3QvdGL0Lkg0L7Qv9C+0YDQvdGL0Lkg0Y3Qu9C10LzQtdC90YIsINC10LPQviDRgdGC0YDQvtC60YMg0Lgg0YHRgtC+0LvQsdC10YYg0L7RgdC+0LHRi9C8INGG0LLQtdGC0L7QvFxyXG4gICAgRE9NRm9yKHZpZXdzLnRvcC52aWV3LmZpcnN0RWxlbWVudENoaWxkLCAoZWxlbSwgaSwgaikgPT4ge1xyXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLWVsZW1lbnQnKTtcclxuICAgICAgICBpZiAoaSA9PSByb3cpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZC1lbGVtZW50Jyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChqID09IGNvbCkge1xyXG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLWVsZW1lbnQnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQktGL0LTQtdC70Y/QtdC8INCy0YvQsdGA0LDQvdC90YvQuSDRjdC70LXQvNC10L3RglxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkLWVsZW1lbnQnKTtcclxuXHJcbiAgICBsZXQgdG9wID0gdmlld3MudG9wO1xyXG4gICAgbGV0IG5leHRUYWJsZURhdGEgPSBTaW1wbGV4VGFibGUuc3RlcCh0b3AsICtyb3csICtjb2wpO1xyXG5cclxuICAgIGFkZE5ld1NpbXBsZXhUYWJsZVZpZXcobmV4dFRhYmxlRGF0YSwgdG9wLnN0ZXAgKyAxLCB0b3AubG9va0Jhc2lzKTtcclxuXHJcbiAgICAvLyDQn9GA0L7QutGA0YPRh9C40LLQsNC10Lwg0Log0L/QvtGB0LvQtdC00L3QtdC80YMg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y4g0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgdmlld3MudG9wLnZpZXcuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc29sdmUoaW5wdXQpIHtcclxuICAgIC8vINCf0L7Qu9GD0YfQsNC10Lwg0LDQutGC0YPQsNC70YzQvdGL0LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y9cclxuICAgIHZpZXdzID0gd2luZG93LnZpZXdzO1xyXG5cclxuICAgIC8vINCf0L7Qu9GD0YfQsNC10Lwg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0LPRgNCw0YTQuNC60LAg0YTRg9C90LrRhtC40LlcclxuICAgIGdyYXBoaWMgPSB3aW5kb3cuZ3JhcGhpYztcclxuXHJcbiAgICAvLyDQntGC0LrQu9GO0YfQsNC10Lwg0LrQvtC90YTQuNCz0YPRgNC40YDQvtCy0LDQvdC40LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0LLQstC+0LTQsCDQtNCw0L3QvdGL0YVcclxuICAgIGlucHV0LnZpZXcuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgLy8g0KPQtNCw0LvRj9C10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQuCDRgdC+INGB0YLRgNC10LvQvtC6XHJcbiAgICBpbnB1dC5yZW1vdmVBcnJvd3NIYW5kbGVycygpO1xyXG5cclxuICAgIC8vINCY0LfQvNC10L3Rj9C10Lwg0YLRg9C70LHQsNGAXHJcbiAgICB0b29sYmFyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcclxuICAgIHNvbHV0aW9uLmNsYXNzTGlzdC5hZGQoJ3NvbHZpbmcnKTtcclxuICAgIGF1dG8uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIHNob3dHcmFwaC5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLy8g0J/QvtC70YPRh9Cw0LXQvCDQstGL0YXQvtC00L3Ri9C1INC00LDQvdC90YvQtSDQuCDQtNC10LvQsNC10Lwg0LjRhSDQv9C10YDQstC40YfQvdGD0Y4g0L7QsdGA0LDQsdC+0YLQutGDXHJcbiAgICBsZXQgZGF0YSA9IGlucHV0LmdldERhdGEodHJ1ZSksXHJcbiAgICAgICAgbSA9IGlucHV0Lm0sXHJcbiAgICAgICAgbiA9IGlucHV0Lm47XHJcblxyXG4gICAgLy8g0JXRgdC70Lgg0LfQsNC00LDRh9CwINC90LAg0LzQsNC60YHQuNC80YPQvCwg0YHQstC+0LTQuNC8INC10ZEg0Log0LfQsNC00LDRh9C1INC90LAg0LzQuNC90LjQvNGD0LxcclxuICAgIGxldCB0YXNrVHlwZUluZGV4ID0gZGF0YVswXS5sZW5ndGggLSAxO1xyXG4gICAgaWYgKGRhdGFbMF1bdGFza1R5cGVJbmRleF0gPT09ICdtYXgnKSB7XHJcbiAgICAgICAgbWF4VGFzayA9IHRydWU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhWzBdLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBkYXRhWzBdW2ldID0gZGF0YVswXVtpXS5tdWwoRnJhY3Rpb24ubWludXNPbmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YVswXVt0YXNrVHlwZUluZGV4XSA9IGRhdGFbMF1bdGFza1R5cGVJbmRleF0gPSAnbWluJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbWF4VGFzayA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qINCU0LXQu9Cw0LXQvCDRgtCw0LosINGH0YLQvtCx0Ysg0LIg0YHRgtC+0LvQsdGG0LUg0YHQstC+0LHQvtC00L3Ri9GFINGH0LvQtdC90L7QsiDQvdCw0YXQvtC00LjQu9C40YHRjFxyXG4gICAgICAg0L3QtdC+0YLRgNC40YbQsNGC0LXQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8gKi9cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGRhdGFbaV1bbiAtIDFdIDwgMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG47IGorKykge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXVtqXSA9IGRhdGFbaV1bal0ubXVsKEZyYWN0aW9uLm1pbnVzT25lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiDQktGL0LLQvtC00LjQvCDQvtGC0LrQvtGA0LXQutGC0LjRgNC+0LLQsNC90L3QvtC1INCy0YXQvtC00L3QvtC1INC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1XHJcbiAgICAgICDQktGB0LUg0LTRgNC+0LHQuCDRg9C/0YDQvtGJ0LXQvdGLLCDQsiDRgdGC0L7Qu9Cx0YbQtSDRgdCy0L7QsdC+0LTQvdGL0YUg0YfQu9C10L3QvtCyINC90LXQvtGC0YDQuNGG0LDRgtC10LvRjNC90YvQtVxyXG4gICAgICAg0LfQvdCw0YfQtdC90LjRjyAqL1xyXG4gICAgdmlld3MucHVzaChuZXcgSW5wdXRWaWV3KGZhbHNlLCBtLCBuLCBpbnB1dC5zaXplLCBkYXRhKVxyXG4gICAgICAgIC5pbnRvKHNvbHV0aW9uKSk7XHJcblxyXG4gICAgLyogINCj0LTQsNC70Y/QtdC8INC40LcgZGF0YSDQu9C40L3QtdC50L3Rg9GOINGE0L7RgNC80YMg0Lgg0YHQvtGF0YDQsNC90Y/QtdC8INC10ZEg0LIgbGluZWFyRm9ybVxyXG4gICAgICAgINC00L4g0L7QutC+0L3Rh9Cw0L3QuNGPINCy0YvRh9C40YHQu9C10L3QuNC5INCyINGB0LjQvNC/0LvQtdC60YEt0YLQsNCx0LvQuNGG0LUgKi9cclxuICAgIGxpbmVhckZvcm0gPSBkYXRhLnNwbGljZSgwLCAxKVswXTtcclxuXHJcblxyXG4gICAgLy8gU3BlY2lhbCBmb3IgTWljcm9zb2Z0IChJRSwgRWRnZSkgKNCa0LDQuiDQsdGLINC90LUg0L/QtdGA0LXQvdCw0LfRi9Cy0LDQu9C4IElFLCDQsiDQtNGD0YjQtSDQvtC9INCy0YHQtdCz0LTQsCBJRSlcclxuICAgIGxldCBiYXNpc1NldHRpbmdzO1xyXG4gICAgaWYgKGRvY3VtZW50LmZvcm1zLnNldHRpbmdzLmJhc2lzWzBdLmNoZWNrZWQpIHtcclxuICAgICAgICBiYXNpc1NldHRpbmdzID0gZG9jdW1lbnQuZm9ybXMuc2V0dGluZ3MuYmFzaXNbMF0udmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJhc2lzU2V0dGluZ3MgPSBkb2N1bWVudC5mb3Jtcy5zZXR0aW5ncy5iYXNpc1sxXS52YWx1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKGJhc2lzU2V0dGluZ3MgPT09ICfQnNCY0JEnKSB7XHJcbiAgICAgICAgLy8g0JzQtdGC0L7QtCDQuNGB0LrRg9GB0YHRgtCy0LXQvdC90L7Qs9C+INCx0LDQt9C40YHQsFxyXG4gICAgICAgIGxldCB0b3AgPSBbXSxcclxuICAgICAgICAgICAgbGVmdCA9IFtdLFxyXG4gICAgICAgICAgICBwID0gW107XHJcblxyXG4gICAgICAgIC8vINCX0LDQv9C40YHRi9Cy0LDQtdC8INCyINC80LDRgdGB0LjQsiB0b3Ag0LjQvdC00LXQutGB0YsgeCwg0L3QsNGF0L7QtNGP0YnQuNC10YHRjyDRgdCy0LXRgNGF0YMg0YLQsNCx0LvQuNGG0YtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICB0b3AucHVzaChpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCX0LDQv9C40YHRi9Cy0LDQtdC8INCyINC80LDRgdGB0LjQsiBsZWZ0INC40L3QtNC10LrRgdGLIHgsINC90LDRhdC+0LTRj9GJ0LjQtdGB0Y8g0LIg0LvQtdCy0L7QvCDRgdGC0L7Qu9Cx0YbQtSDRgtCw0LHQu9C40YbRi1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBuOyBpIDwgbiArIG0gLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgbGVmdC5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICAvLyDQn9C+0LTRgdGH0LjRgtGL0LLQsNC10Lwg0L3QuNC20L3RjtGOINGB0YLRgNC+0LrRgyBwINC60LDQuiDRgdGD0LzQvNGLINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjRhSDRgdGC0L7Qu9Cx0YbQvtCyXHJcbiAgICAgICAgLy8g0YPQvNC90L7QttC10L3QvdGL0YUg0L3QsCDQvNC40L3Rg9GBINC10LTQuNC90LjRhtGDXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHN1bSA9IEZyYWN0aW9uLnplcm87XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbSAtIDE7IGorKykge1xyXG4gICAgICAgICAgICAgICAgc3VtID0gc3VtLmFkZChkYXRhW2pdW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwLnB1c2goc3VtLm11bChGcmFjdGlvbi5taW51c09uZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YS5wdXNoKHApO1xyXG5cclxuICAgICAgICAvLyDQodC+0LfQtNCw0ZHQvCDQv9C10YDQstC40YfQvdC+0LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40LUg0YHQuNC80L/Qu9C10LrRgS3RgtCw0LHQu9C40YbRi1xyXG4gICAgICAgIGFkZE5ld1NpbXBsZXhUYWJsZVZpZXcoe1xyXG4gICAgICAgICAgICBkYXRhLCBsZWZ0LCB0b3BcclxuICAgICAgICB9LCAwLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8g0KHQstC+0Lgg0LHQsNC30LjRgdC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtVxyXG5cclxuICAgICAgICAvLyDQn9C10YDQstC40YfQvdC+0LUg0L7RgtC+0LHRgNCw0LbQtdC90LjQtSDQvNCw0YLRgNC40YbRi1xyXG4gICAgICAgIHZpZXdzLnB1c2gobmV3IE1hdHJpeFZpZXcoZGF0YSkuaW50byhzb2x1dGlvbikpO1xyXG5cclxuICAgICAgICBsZXQgbGVmdCA9IFtdLCAvLyDQkdCw0LfQuNGB0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcbiAgICAgICAgICAgIHRvcCA9IFtdLCAvLyDQndC10LHQsNC30LjRgdC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtVxyXG4gICAgICAgICAgICB0ZW1wID0gW10sIC8qICDQktGA0LXQvNC10L3QvdC+0LUg0YXRgNCw0L3QuNC70LjRidC1INC00LvRjyDQv9C10YDQtdC80LXQvdC90YvRhSwg0LrQvtGC0L7RgNGL0LUg0L3QtVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICDQvNC+0LPRg9GCINCx0YvRgtGMINCx0LDQt9C40YHQvdGL0LzQuCAqL1xyXG4gICAgICAgICAgICBjaGVja0JveGVzID0gZG9jdW1lbnQuZm9ybXMuc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIC8vINCg0LDRgdC/0YDQtdC00LXQu9GP0LXQvCDQv9C10YDQtdC80LXQvdC90YvQtSDQvdCwINCx0LDQt9C40YHQvdGL0LUg0Lgg0L3QtdGCXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGVja0JveGVzW2BiJHtpICsgMX1gXS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0LnB1c2goaSArIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9wLnB1c2goaSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiAg0JIgbGVmdCDRg9C60LDQt9Cw0L3RiyDQuNC90LTQtdC60YHRiyDQuNC60YHQvtCyICjQvtGCINC10LTQuNC90LjRhtGLKSxcclxuICAgICAgICAgICAg0LrQvtGC0L7RgNGL0LUg0LLRi9Cx0YDQsNC90Ysg0LHQsNC30LjRgdC90YvQvNC4XHJcbiAgICAgICAgICAgINCSIHRvcCDQsNC90LDQu9C+0LPQuNGH0L3QviDQtNC70Y8g0L3QtdCx0LDQt9C40YHQvdGL0YUgKi9cclxuXHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IFtdLCAvLyDQnNCw0YLRgNC40YbQsFxyXG4gICAgICAgICAgICAvKiAg0JrQvtGN0YTRhNC40YbQuNC10L3RgiDQtNC70Y8g0LfQsNC90YPQu9C10L3QuNGPINGN0LvQtdC80LXQvdGC0LAg0LIg0YHRgtC+0LvQsdGG0LUg0LjQu9C4XHJcbiAgICAgICAgICAgICAgICDQv9C+0LvRg9GH0LXQvdC40LUg0LXQtNC40L3QuNGG0Ysg0L/RgNC4INC00LXQu9C10L3QuNC4INGB0YLRgNC+0LrQuCAqL1xyXG4gICAgICAgICAgICBjb2VmZmljaWVudCxcclxuICAgICAgICAgICAgY3VycmVudFJvdyA9IDAsXHJcbiAgICAgICAgICAgIC8vINCa0L7Quy3QstC+INGB0YLRgNC+0Log0LIg0LzQsNGC0YDQuNGG0LVcclxuICAgICAgICAgICAgcm93cyA9IGRhdGEubGVuZ3RoLFxyXG4gICAgICAgICAgICAvLyDQmtC+0Lst0LLQviDRgdGC0L7Qu9Cx0YbQvtCyINCyINC80LDRgtGA0LjRhtC1INGBINGD0YfRkdGC0L7QvCDRgdGC0L7Qu9Cx0YbQsCDRgdCy0L7QsdC+0LTQvdGL0YUg0YfQu9C10L3QvtCyXHJcbiAgICAgICAgICAgIGNvbHMgPSBkYXRhWzBdLmxlbmd0aCxcclxuICAgICAgICAgICAgaywgaSwgajtcclxuXHJcbiAgICAgICAgLy8g0JPQu9GD0LHQvtC60L7QtSDQutC+0L/QuNGA0L7QstCw0L3QuNC1INC80LDRgtGA0LjRhtGLIGRhdGFcclxuICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICBtYXRyaXgucHVzaChBcnJheS5mcm9tKHJvdykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogINCf0YDQvtC50LTRkdC80YHRjyDQv9C+INCy0YHQtdC8INGB0YLQvtC70LHRhtCw0LwsINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQvCDQsdCw0LfQuNGB0L3Ri9C8INC/0LXRgNC10LzQtdC90L3Ri9C8XHJcbiAgICAgICAgICAgINC40LcgbGVmdCAqL1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZWZ0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAvLyDQmNC90LTQtdC60YEg0YLQtdC60YPRidC10LPQviDRgdGC0L7Qu9Cx0YbQsCDRgSDQsdCw0LfQuNGB0L3QvtC5INC/0LXRgNC10LzQtdC90L3QvtC5XHJcbiAgICAgICAgICAgIGxldCBjb2xJbmRleCA9IGxlZnRbaV0gLSAxO1xyXG5cclxuICAgICAgICAgICAgLyogINCf0L7QuNGB0Log0L3QtdC90YPQu9C10LLQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQsiBpLdC8INGB0YLQvtCx0YbQtSDQvdC40LbQtVxyXG4gICAgICAgICAgICAgICAg0Lgg0LIg0YHQsNC80L7QuSBjdXJyZW50Um93INGB0YLRgNC+0LrQtSAqL1xyXG4gICAgICAgICAgICBmb3IgKGsgPSBjdXJyZW50Um93OyBrIDwgcm93czsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW1hdHJpeFtrXVtjb2xJbmRleF0uaXNaZXJvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qICDQldGB0LvQuCDQsiDQtNCw0L3QvdC+0Lwg0LHQsNC30LjRgdC90L7QvCDRgdGC0L7Qu9Cx0YbQtSDQvtGB0YLQsNC70LjRgdGMINGC0L7Qu9GM0LrQviDQvdGD0LvQuCDQvdC40LbQtSDQuFxyXG4gICAgICAgICAgICAgICAg0LIg0YHRgtGA0L7QutC1IGN1cnJlbnRSb3csINGC0L4gbGVmdFtpXSAtINC90LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQsdCw0LfQuNGB0L3QvtC5INC/0LXRgNC10LzQtdC90L3QvtC5LCDQv9C+0Y3RgtC+0LzRgyDQuNGJ0LXQvCDQsiB0b3Ag0LTRgNGD0LPQvtC5INCx0LDQt9C40L3Rg9GOINC/0LXRgNC10LzQtdC90L3Rg9GOXHJcbiAgICAgICAgICAgICAgICDQv9C10YDQtdC80LXQvdC90YPRjiAqL1xyXG4gICAgICAgICAgICBpZiAoayA9PT0gcm93cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvcC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86INCV0YHQu9C4INC90LUg0L7RgdGC0LDQu9C+0YHRjCDQvdC10LHQsNC30LjRgdC90YvRhSDQv9C10YDQtdC80LXQvdC90YvRhSDQvdCwINC30LDQvNC10L3Rg1xyXG4gICAgICAgICAgICAgICAgICAgIFBvcHVwcy5zaG93TWVzc2FnZSgn0KHQuNGB0YLQtdC80LAg0LvQuNC90LXQudC90L4g0LfQsNCy0LjRgdC40LzQsCEg0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC70LjQvdC10LnQvdC+INC90LXQt9Cw0LLQuNGB0LjQvNGD0Y4g0YHQuNGB0YLQtdC80YMhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldi52YWx1ZSA9ICfQktCr0JnQotCYJztcclxuICAgICAgICAgICAgICAgICAgICBhdXRvLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogINCf0LXRgNC10LzQtdGJ0LDQtdC8INGC0LXQutGD0YnRg9GOINCx0LDQt9C40YHQvdGD0Y4g0L/QtdGA0LXQvNC10L3QvdGD0Y4g0LLQviDQstGA0LXQvNC10L3QvdGL0Lkg0LzQsNGB0YHQuNCyXHJcbiAgICAgICAgICAgICAgICAgICAg0L3QtdCx0LDQt9C40YHQvdGL0YUg0L/QtdGA0LXQvNC10L3QvdGL0YUg0Lgg0YHRgNCw0LfRgyDQttC1INCy0YHRgtCw0LLQu9GP0LXQvCDQsiDQvNCw0YHRgdC40LJcclxuICAgICAgICAgICAgICAgICAgICDQsdCw0LfRgdC90YvRhSDQv9C10YDQtdC80LXQvdC90YvRhSDQv9GA0L7QuNC30LLQvtC70YzQvdGD0Y4g0L3QtdCx0LDQt9C40YHQvdGD0Y4uXHJcbiAgICAgICAgICAgICAgICAgICAg0KEg0Y3RgtC+0Lkg0LLRgdGC0LDQstC70LXQvdC90L7QuSDQv9C10YDQtdC80LXQvdC90L7QuSDQvdCw0YfQuNC90LDQtdC8INGB0LvQtdC00YPRjtGJ0YPRjiDQuNGC0LXRgNCw0YbQuNGOICovXHJcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2goLi4ubGVmdC5zcGxpY2UoaSwgMSwgdG9wLnNoaWZ0KCkpKTtcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qICDQnNC10L3Rj9C10Lwg0YHRgtGA0L7QutC4INC80LXRgdGC0LDQvNC4INGC0LDQuiwg0YfRgtC+0LHRiyDQsiBjdXJyZW50Um93INGC0LXQutGD0YnQtdCz0L5cclxuICAgICAgICAgICAgICAgINGB0YLQvtC70LHRhtCw0Lwg0LHRi9C7INC90LUg0L3QvtC70YwuINCSIGst0L7QuSDRgdGC0YDQvtC60LUg0L3QtSDQvdC+0LvRjC4gKi9cclxuICAgICAgICAgICAgW21hdHJpeFtjdXJyZW50Um93XSwgbWF0cml4W2tdXSA9IFttYXRyaXhba10sIG1hdHJpeFtjdXJyZW50Um93XV07XHJcblxyXG4gICAgICAgICAgICAvKiAg0J/QvtC00LXQu9C40Lwg0LLRgdGOINGB0YLRgNC+0LrRgyBjdXJyZW50Um93XHJcbiAgICAgICAgICAgICAgICDQvdCwINGN0LvQtdC80LXQvdGCIFtjdXJyZW50Um93XVtjb2xJbmRleF0sXHJcbiAgICAgICAgICAgICAgICDRh9GC0L7QsdGLINC/0L7Qu9GD0YfQuNGC0Ywg0LXQtNC40L3QuNGG0YMg0LIg0Y3RgtC+0Lwg0Y3Qu9C10LzQtdC90YLQtSAqL1xyXG4gICAgICAgICAgICBjb2VmZmljaWVudCA9IG1hdHJpeFtjdXJyZW50Um93XVtjb2xJbmRleF07XHJcbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBjb2xzOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjdXJyZW50Um93XVtrXSA9IG1hdHJpeFtjdXJyZW50Um93XVtrXS5kaXYoY29lZmZpY2llbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiAg0JfQsNC90YPQu9GP0LXQvCDQstGB0LUg0Y/Rh9C10LnQutC4LCDQvdCw0YXQvtC00Y/RidC40LXRgdGPINC90LjQttC1INC40LvQuCDQstGL0YjQtSxcclxuICAgICAgICAgICAgICAgINGH0LXQvCBtYXRyaXhbY3VycmVudFJvd11bY29sSW5kZXhdICovXHJcblxyXG4gICAgICAgICAgICAvLyDQlNC70Y8g0LLRgdC10YUg0YHRgtGA0L7Rh9C10Log0LTQsNC90L3QvtCz0L4g0YHRgtC+0LvQsdGG0LAgY29sSW5kZXhcclxuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHJvd3M7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGsgPT09IGN1cnJlbnRSb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiAg0JrRgNC+0LzQtSDRgdGC0YDQvtC60LggY3VycmVudFJvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAg0LIg0LrQvtGC0L7RgNC+0Lkg0LTQvtC70LbQvdCwINC90LDRhdC+0LTQuNGC0YzRgdGPINC10LTQuNC90LjRhtCwICovXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC60L7RjdGE0YTQuNGG0LjQtdC90YIg0LTQu9GPIGst0L7QuSDRgdGC0YDQvtC60LhcclxuICAgICAgICAgICAgICAgIGNvZWZmaWNpZW50ID0gbWF0cml4W2tdW2NvbEluZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQrdC70LXQvNC10L3RgtC+0LIgay3QvtC5INGB0YLRgNC+0LrQuFxyXG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFtrXVtqXSA9IG1hdHJpeFtrXVtqXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3ViKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29lZmZpY2llbnQubXVsKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdHJpeFtjdXJyZW50Um93XVtqXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDQoSDRgtC10LrRg9GJ0LXQuSDRgdGC0YDQvtGH0LrQvtC5INGA0LDQt9C+0LHRgNCw0LvQuNGB0YwsINC/0LXRgNC10YXQvtC00LjQvCDQuiDRgdC70LXQtNGD0Y7RidC10LlcclxuICAgICAgICAgICAgY3VycmVudFJvdysrO1xyXG5cclxuICAgICAgICAgICAgLy8g0J7RgtC+0LHRgNCw0LbQsNC10Lwg0L/RgNC+0LzQtdC20YPRgtC+0YfQvdGL0LUg0YDQtdC30YPQu9GM0YLQsNGC0YtcclxuICAgICAgICAgICAgdmlld3MucHVzaChuZXcgTWF0cml4VmlldyhtYXRyaXgpLmludG8oc29sdXRpb24pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINChINC80LXRgtC+0LTQvtC8INCT0LDRg9GB0YHQsCDQt9Cw0LrQvtC90YfQuNC70LhcclxuICAgICAgICB0b3AgPSB0b3AuY29uY2F0KHRlbXApO1xyXG5cclxuICAgICAgICAvLyDQpNC+0YDQvNC40YDRg9C10LwgZGF0YSDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuCDQsiBUYW5zaXRpb25WaWV3XHJcbiAgICAgICAgZGF0YSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVmdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvLyDQpNC+0YDQvNC40YDRg9C10Lwg0YHRgtGA0L7QutC4INGC0LDQsdC70LjRhtGLXHJcbiAgICAgICAgICAgIGxldCByb3cgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0b3AubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIC8vINCk0L7RgNC80LjRgNGD0LXQvCDRj9GH0LXQudC60LhcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKG1hdHJpeFtpXVt0b3Bbal0gLSAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGB0LLQvtCx0L7QtNC90YvQuSDRh9C70LXQvSDRgdGC0YDQvtC60LhcclxuICAgICAgICAgICAgcm93LnB1c2gobWF0cml4W2ldW2NvbHMgLSAxXSk7XHJcblxyXG4gICAgICAgICAgICBkYXRhLnB1c2gocm93KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZpZXdzLnB1c2gobmV3IFRyYW5zaXRpb25WaWV3KFxyXG4gICAgICAgICAgICBkYXRhLCB0b3AsIGxlZnQsIGxpbmVhckZvcm1cclxuICAgICAgICApLmludG8oc29sdXRpb24pKTtcclxuXHJcblxyXG4gICAgICAgIC8vINCh0L7Qt9C00LDRkdC8INGB0LjQvNC/0LvQtdC60YEg0YLQsNCx0LvQuNGG0YMg0LTQu9GPINGA0LDRgdGB0YfRkdGC0L7QslxyXG4gICAgICAgIGFkZE5ld1NpbXBsZXhUYWJsZVZpZXcoe1xyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLmNvbmNhdChbdmlld3MudG9wLmJvdHRvbVJvd10pLFxyXG4gICAgICAgICAgICBsZWZ0OiBsZWZ0LFxyXG4gICAgICAgICAgICB0b3A6IHRvcFxyXG4gICAgICAgIH0sIDAsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgdmlld3MudG9wLnZpZXcuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCV0YHQu9C4INCw0LLRgtC+0YDQtdGI0LXQvdC40LVcclxuICAgIGlmICghZG9jdW1lbnQuZm9ybXMuc2V0dGluZ3Muc3RlcF90b19zdGVwLmNoZWNrZWQpIHtcclxuICAgICAgICBsZXQgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UtZWxlbWVudCcpLFxyXG4gICAgICAgICAgICBjbGljayA9IG5ldyBNb3VzZUV2ZW50KCdjbGljaycsIHtcclxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmlldzogd2luZG93XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aGlsZSAoZWxlbSkge1xyXG4gICAgICAgICAgICBlbGVtLmRpc3BhdGNoRXZlbnQoY2xpY2spO1xyXG4gICAgICAgICAgICBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZS1lbGVtZW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xvZ2ljL3NvbHZlci5qcyIsIi8vINCS0L3Rg9GC0YDQtdC90L3QuNC1INC30LDQstC40YHQuNC80L7RgdGC0LhcclxuaW1wb3J0ICcuL1NpbXBsZXhUYWJsZS5zY3NzJztcclxuaW1wb3J0IHZpZXcgZnJvbSAnLi9TaW1wbGV4VGFibGUucHVnJztcclxuXHJcbi8vINCS0L3QtdGI0L3QuNC1INC30LDQstC40YHQuNC80L7RgdGC0LhcclxuaW1wb3J0IHtTaW1wbGV4VGFibGUgYXMgRE9NRm9yfSBmcm9tICcuLi8uLi9sb2dpYy9ET01Gb3IuanMnO1xyXG5pbXBvcnQgRnJhY3Rpb24gZnJvbSAnLi4vLi4vbG9naWMvZnJhY3Rpb24uanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxleFRhYmxlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBsb29rQmFzaXMsXHJcbiAgICAgICAgc3RlcCxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHRvcCxcclxuICAgICAgICBsZWZ0LFxyXG4gICAgICAgIHNpemUsXHJcbiAgICAgICAgcmVmZXJlbmNlRWxlbWVudHMsXHJcbiAgICAgICAgbWVzc2FnZVxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB3cmFwLmlubmVySFRNTCA9IHZpZXcoe1xyXG4gICAgICAgICAgICBzdGVwLFxyXG4gICAgICAgICAgICBkYXRhLFxyXG4gICAgICAgICAgICB0b3AsXHJcbiAgICAgICAgICAgIGxlZnQsXHJcbiAgICAgICAgICAgIHNpemUsXHJcbiAgICAgICAgICAgIHJlZmVyZW5jZUVsZW1lbnRzLFxyXG4gICAgICAgICAgICBtZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9va0Jhc2lzID0gbG9va0Jhc2lzO1xyXG4gICAgICAgIHRoaXMuc3RlcCA9IHN0ZXA7XHJcbiAgICAgICAgdGhpcy5uID0gdG9wLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLnZpZXcgPSB3cmFwLmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIGludG8oZGVzdGluYXRpb24pIHtcclxuICAgICAgICBkZXN0aW5hdGlvbi5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDRgNCw0LfQvNC10YDQvtCyINGP0YfQtdC10LpcclxuICAgIHJlc2l6ZShzaXplKSB7XHJcbiAgICAgICAgLy8gVE9ETzogZGVsZXRlOiBET01Gb3IodGhpcy52aWV3LmZpcnN0RWxlbWVudENoaWxkLCAoZWxlbSkgPT4gZWxlbS5zaXplID0gc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQn9C+0LjRgdC6INCy0L7Qt9C80L7QttC90YvRhSDQvtC/0L7RgNC90YvRhSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIHN0YXRpYyBnZXRSZWZlcmVuY2VFbGVtZW50cyhtLCBuLCBkYXRhLCBsZWZ0LCBsb29rQmFzaXMsIG1heE4pIHtcclxuICAgICAgICBsZXQgcENvbCA9IFtdLFxyXG4gICAgICAgICAgICBwUm93ID0gW10sXHJcbiAgICAgICAgICAgIGNvZGUgPSAwOyAvLyBDT0RFOiBPS1xyXG5cclxuXHJcbiAgICAgICAgLy8g0J/QvtC40YHQuiDRgdGC0L7Qu9Cx0YbQvtCyINGBIHBbaV0gPCAwLCDQt9Cw0L3QtdGB0LXQvdC40LUg0LjQvdC00LXQutGB0L7QsiDRgtCw0LrQuNGFINGB0YLQvtC70LHRhtC+0LIg0LIgcENvbFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVttIC0gMV1baV0uaXNOZWdhdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgcENvbC5wdXNoKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocENvbC5sZW5ndGggPT09IDAgKSB7XHJcbiAgICAgICAgICAgIC8vINCSINC90LjQttC90LXQuSDRgdGC0YDQvtC60LUg0L3QtSDQvdCw0LnQtNC10L3QviDQvtGC0YDQuNGG0LDRgtC10LvRjNC90YvRhSDQt9C90LDRh9C10L3QuNC5XHJcbiAgICAgICAgICAgIC8vICjQuNGB0LrQu9GO0YfQsNGPINGB0LDQvNGL0Lkg0L/QvtGB0LvQtdC00L3QuNC5INGB0YLQvtC70LHQtdGGKVxyXG4gICAgICAgICAgICBpZiAoZGF0YVttIC0gMV1bbiAtIDFdLmlzWmVybykge1xyXG4gICAgICAgICAgICAgICAgLy8gQ09ERTog0JLRi9GH0LjRgdC70LXQvdC40Y8g0LfQsNC60L7QvdGH0LXQvdGLLiDQrdC70LXQvNC10L3RgiDQsiDQv9GA0LDQstC+0Lwg0L3QuNC20L3QtdC8INGD0LPQu9GDXHJcbiAgICAgICAgICAgICAgICAvLyDRgNCw0LLQtdC9INC90YPQu9GOXHJcbiAgICAgICAgICAgICAgICBjb2RlID0gMjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtC4INCy0YvQv9C+0LvQvdC10L3QuNGPINGF0L7Qu9C+0YHRgtC+0LPQviDRiNCw0LPQsFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWZ0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvb2tCYXNpcyAmJiBsZWZ0W2ldID4gbWF4Tikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQndC10L7QsdGF0L7QtNC40Lwg0YXQvtC70L7RgdGC0L7QuSDRiNCw0LMg0LIg0YHRgtGA0L7QutC1IGxlZnRbaV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcENvbC5wdXNoKGxlZnRbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwUm93ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C/0L7Qu9C90LXQvdC40Y8g0YXQvtC70L7RgdGC0L7Qs9C+INGI0LDQs9CwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdG9wLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGFbbGVmdFtpXV1bal0uaXNaZXJvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J3QtdC+0LHRhdC+0LTQuNC80L4g0LLRi9C/0L7Qu9C90LjRgtGMINGF0L7Qu9C+0YHRgtC+0Lkg0YjQsNCzINC00LvRjyDQvtC/0L7RgNC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAgZGF0YVtsZWZ0W2ldXVtqXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBSb3cucHVzaChqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBSb3cubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQpdC+0LvQvtGB0YLQvtC5INGI0LDQsyDQstGL0L/QvtC70L3QuNGC0Ywg0L3QtdCy0L7Qt9C80L7QttC90L4gPT4g0JfQsNC00LDRh9CwINC90LXRgNCw0LfRgNC10YjQuNC80LBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPSA0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQ09ERTog0JLRi9GH0LjRgdC70LXQvdC40Y8g0LfQsNC60L7QvdGH0LXQvdGLLiDQp9C40YHQu9C+INCyINC/0YDQsNCy0L7QvCDQvdC40LbQvdC10Lwg0YPQs9C70YNcclxuICAgICAgICAgICAgICAgIC8vINC90LUg0YDQsNCy0L3QviDQvdGD0LvRjlxyXG4gICAgICAgICAgICAgICAgY29kZSA9IDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gcENvbFtpXSAtINC90L7QvNC10YAg0YHRgtC+0LvQsdGG0LAsINCz0LTQtSDQstC90LjQt9GDIHAgPCAwXHJcbiAgICAgICAgICAgIC8vIHBSb3dbaV0gLSDQvdC+0LzQtdGAINGB0YLRgNC+0LrQuCwg0LIg0LrQvtGC0L7RgNC+0Lkg0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQvtGC0L3QvtGI0LXQvdC40LUg0LIg0Y3RgtC+0LxcclxuICAgICAgICAgICAgLy8g0YHRgtC+0LvQsdGG0LUsINC40LvQuCB1bmRlZmluZWQsINC10YHQu9C4INC+0L3QviDQsiDQvdC10LTQvtC/0YPRgdGC0LjQvNC+0Lkg0YHRgtGA0L7QutC1XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpTGVuID0gcENvbC5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBtaW4gPSBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0J/QvtC40YHQuiDQvNC40L3QuNC80YPQvNCwINC+0YLQvdC+0YjQtdC90LjRjyBiaS9haSDQsiDRgdGC0L7Qu9Cx0YbQtSBwQ29sW2ldXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG0gLSAxOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtqXVtwQ29sW2ldXS5pc1Bvc2l0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYXRpbyA9IGRhdGFbal1bbiAtIDFdLmRpdihkYXRhW2pdW3BDb2xbaV1dKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtaW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbiA9IHJhdGlvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhdGlvLmNvbXBhcmUobWluKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW4gPSByYXRpbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBvc2l0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ09ERTog0J3QsNC50LTQtdC9INGB0YLQvtC70LHQtdGGINC40Lcg0L7RgtGA0LjRhtCw0YLQtdC70YzQvdGL0YUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0JzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0YHRgtGA0L7Quiwg0LrQvtGC0L7RgNGL0LUg0LIg0LTQsNC90L3QvtC8INGB0YLQvtC70LHRhtC1XHJcbiAgICAgICAgICAgICAgICAvLyDQvNC+0LPRg9GCINCx0YvRgtGMINC+0L/QvtGA0L3Ri9C80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAgICAgICAgICAgIHBSb3dbaV0gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQn9C+0LjRgdC6INCy0YHQtdGFINC80LjQvdC40LzRg9C80L7QsiDQsiDRgdGC0L7Qu9Cx0YbQtVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtIC0gMTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvb2tCYXNpcyAmJiBsZWZ0W2pdIDwgbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQrdGC0L7RgiDRjdC70LXQvNC10L3RgiDRg9C20LUg0L/QtdGA0LXQvdC10YHRkdC9INC40Lcg0L/QtdGA0LLQvtC5INGB0YLRgNC+0LrQuCDQsiDQv9C10YDQstGL0LlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0YHRgtC+0LvQsdC40LpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtqXVtwQ29sW2ldXS5pc1Bvc2l0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYXRpbyA9IGRhdGFbal1bbiAtIDFdLmRpdihkYXRhW2pdW3BDb2xbaV1dKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhdGlvLmNvbXBhcmUobWluKSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwUm93W2ldLnB1c2goaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGRhdGFbcFJvd1tpXVtrXV1bcENvbFtpXV0gLSDQvtC/0L7RgNC90YvQtSDRjdC70LXQvNC10L3RgtGLLFxyXG4gICAgICAgIC8vINC10YHQu9C4ICFwUm93W2ldLmVtcHR5KCksXHJcbiAgICAgICAgLy8gaSA9ICgwLCBwQ29sLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY29kZSxcclxuICAgICAgICAgICAgcm93czogcFJvdyxcclxuICAgICAgICAgICAgY29sczogcENvbCxcclxuICAgICAgICAgICAgbGVuZ3RoOiBwUm93Lmxlbmd0aFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JTQtdC70LDQtdC8INGI0LDQsyDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8gdmlld1xyXG4gICAgLy8g0YEg0L7Qv9C+0YDQvdGL0Lwg0Y3Qu9C10LzQtdC90YLQvtC8IChyb3csIGNvbClcclxuICAgIHN0YXRpYyBzdGVwKHZpZXcsIHJvdywgY29sKSB7XHJcbiAgICAgICAgLy8g0KDQsNCx0L7RgtCw0LXQvCDRgSDQvdC+0LLQvtC5INC60L7QvdGE0LjQs9GD0YDQsNGG0LjQtdC5INC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNGPXHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXSxcclxuICAgICAgICAgICAgdG9wID0gQXJyYXkuZnJvbSh2aWV3LnRvcCksXHJcbiAgICAgICAgICAgIGxlZnQgPSBBcnJheS5mcm9tKHZpZXcubGVmdCk7XHJcblxyXG4gICAgICAgIC8vINCS0YvQv9C+0LvQvdGP0LXQvCDQs9C70YPQsdC+0LrQvtC1INC60L7Qv9C40YDQvtCy0LDQvdC40LUgZGF0YVxyXG4gICAgICAgIGZvciAobGV0IHJvdyBvZiB2aWV3LmRhdGEpIHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKEFycmF5LmZyb20ocm93KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQn9C10YDQtdGB0YfQuNGC0YvQstCw0LXQvCDRgdGC0YDQvtC60YMg0L7Qv9C+0YDQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwLCDQutGA0L7QvNC1INGB0LDQvNC+0LPQviDQvtC/0L7RgNC+0L3QvtCz0L5cclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8PSB0b3AubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgaWYgKGsgIT0gY29sKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW3Jvd11ba10gPSBkYXRhW3Jvd11ba10uZGl2KGRhdGFbcm93XVtjb2xdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbGVmdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSB0b3AubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChqID09IGNvbCB8fCBpID09IHJvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINCV0YHQu9C4INGN0LvQtdC80LXQvdGCINCyINGC0L7QvCDQttC1INGB0YLQvtC70LHRhtC1INC40LvQuCDRgdGC0YDQvtC60LUsINGH0YLQviDQuCDQvtC/0L7RgNC90YvQuSxcclxuICAgICAgICAgICAgICAgICAgICAvLyDRgtC+INC/0L7QutCwINC90LUg0LXQs9C+INC/0LXRgNC10YHRh9C40YLRi9Cy0LDQtdC8XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbaV1bal0gPSBkYXRhW2ldW2pdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldW2NvbF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubXVsKGRhdGFbcm93XVtqXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0JzQtdC90Y/QtdC8INC80LXRgdGC0LDQvNC4INC40L3QtNC10LrRgdGLINC40LrRgdC+0LIg0YHQstC10YDRhdGDINC4INGB0LvQtdCy0LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+XHJcbiAgICAgICAgLy8g0L7Qv9C+0YDQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwXHJcbiAgICAgICAgW3RvcFtjb2xdLCBsZWZ0W3Jvd11dID0gW2xlZnRbcm93XSwgdG9wW2NvbF1dO1xyXG5cclxuICAgICAgICBpZiAodmlldy5sb29rQmFzaXMpIHtcclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LzQtdGC0L7QtCDQuNGB0LrRg9GB0YHRgtCy0LXQvdC90L7Qs9C+INCx0LDQt9C40YHQsCwg0YLQviDRg9C00LDQu9GP0LXQvCDRgdGC0L7Qu9Cx0LXRhiBjb2xcclxuICAgICAgICAgICAgdG9wLnNwbGljZShjb2wsIDEpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcm93LnNwbGljZShjb2wsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8g0J/QtdGA0LXRgdGH0LjRgtGL0LLQsNC8INGB0YLQvtC70LHQtdGGIGNvbFxyXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8PSBsZWZ0Lmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoayA9PSByb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDQn9C+0LrQsCDQvdC1INGC0YDQvtCz0LDQtdC8INC+0L/QvtGA0L3Ri9C5INGN0LvQtdC80LXQvdGCXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFba11bY29sXSA9IGRhdGFba11bY29sXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZGl2KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtyb3ddW2NvbF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubXVsKEZyYWN0aW9uLm1pbnVzT25lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDQn9C10YDQtdGB0YfQuNGC0YvQstCw0LXQvCDQvtC/0L7RgNC90YvRhSDRjdC70LXQvNC10L3RglxyXG4gICAgICAgICAgICBkYXRhW3Jvd11bY29sXSA9IEZyYWN0aW9uLm9uZS5kaXYoZGF0YVtyb3ddW2NvbF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtkYXRhLCB0b3AsIGxlZnR9O1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvU2ltcGxleFRhYmxlL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvU2ltcGxleFRhYmxlL1NpbXBsZXhUYWJsZS5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzNTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGRhdGEsIGxlZnQsIG1lc3NhZ2UsIHJlZmVyZW5jZUVsZW1lbnRzLCBzdGVwLCB0b3AsIHVuZGVmaW5JZWQpIHtsZXQgdG9wTGVuID0gdG9wLmxlbmd0aCxcbiAgICBsZWZ0TGVuID0gbGVmdC5sZW5ndGg7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZmllbGRzZXQgY2xhc3M9XFxcIlNpbXBsZXhUYWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFeFxcdTAwM0NzdXBcXHUwMDNFKFwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHN0ZXApID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiKVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXCI7XG5mb3IgKGxldCBqID0gMDsgaiA8IHRvcExlbjsgaisrKVxue1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RkXFx1MDAzRXhcXHUwMDNDc3ViXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRvcFtqXSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnN1YlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVwiO1xufVxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjtcbmZvciAobGV0IGkgPSAwOyBpIDwgbGVmdExlbjsgaSsrKVxue1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0V4XFx1MDAzQ3N1YlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBsZWZ0W2ldKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3ViXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXCI7XG5mb3IgKGxldCBqID0gMDsgaiA8PSB0b3BMZW47IGorKylcbntcbmxldCBpbnB1dENsYXNzTmFtZSA9IHVuZGVmaW5JZWQsXG4gICAgaW5kZXhlcyA9IHVuZGVmaW5lZDtcbmlmIChyZWZlcmVuY2VFbGVtZW50cyAhPSBudWxsKVxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcmVmZXJlbmNlRWxlbWVudHMubGVuZ3RoOyBrKyspXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJlZmVyZW5jZUVsZW1lbnRzLnJvd3Nba10ubGVuZ3RoOyByb3crKylcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VFbGVtZW50cy5yb3dzW2tdW3Jvd10gPT0gaSAmJlxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZUVsZW1lbnRzLmNvbHNba10gPT0galxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRDbGFzc05hbWUgPSAncmVmZXJlbmNlLWVsZW1lbnQnO1xuICAgICAgICAgICAgICAgIGluZGV4ZXMgPSByZWZlcmVuY2VFbGVtZW50cy5yb3dzW2tdW3Jvd10gKyAnLCcgKyByZWZlcmVuY2VFbGVtZW50cy5jb2xzW2tdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RkXCIgKyAocHVnLmF0dHIoXCJjbGFzc1wiLCBwdWcuY2xhc3NlcyhbaW5wdXRDbGFzc05hbWVdLCBbdHJ1ZV0pLCBmYWxzZSwgdHJ1ZSkrcHVnLmF0dHIoXCJkYXRhLWluZGV4ZXNcIiwgaW5kZXhlcywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gZGF0YVtpXVtqXSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVwiO1xufVxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjtcbn1cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcIjtcbmZvciAobGV0IGogPSAwOyBqIDw9IHRvcExlbjsgaisrKVxue1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGRhdGFbbGVmdExlbl1bal0pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcIjtcbn1cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcIjtcbmlmIChtZXNzYWdlKSB7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiO1xufVxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZmaWVsZHNldFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcImRhdGFcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmRhdGE6dHlwZW9mIGRhdGEhPT1cInVuZGVmaW5lZFwiP2RhdGE6dW5kZWZpbmVkLFwibGVmdFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubGVmdDp0eXBlb2YgbGVmdCE9PVwidW5kZWZpbmVkXCI/bGVmdDp1bmRlZmluZWQsXCJtZXNzYWdlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tZXNzYWdlOnR5cGVvZiBtZXNzYWdlIT09XCJ1bmRlZmluZWRcIj9tZXNzYWdlOnVuZGVmaW5lZCxcInJlZmVyZW5jZUVsZW1lbnRzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5yZWZlcmVuY2VFbGVtZW50czp0eXBlb2YgcmVmZXJlbmNlRWxlbWVudHMhPT1cInVuZGVmaW5lZFwiP3JlZmVyZW5jZUVsZW1lbnRzOnVuZGVmaW5lZCxcInN0ZXBcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnN0ZXA6dHlwZW9mIHN0ZXAhPT1cInVuZGVmaW5lZFwiP3N0ZXA6dW5kZWZpbmVkLFwidG9wXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50b3A6dHlwZW9mIHRvcCE9PVwidW5kZWZpbmVkXCI/dG9wOnVuZGVmaW5lZCxcInVuZGVmaW5JZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5JZWQ6dHlwZW9mIHVuZGVmaW5JZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5JZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvU2ltcGxleFRhYmxlL1NpbXBsZXhUYWJsZS5wdWdcbi8vIG1vZHVsZSBpZCA9IDM1M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvLyDQktC90YPRgtGA0LXQvdC90LjQtSDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4XHJcbmltcG9ydCB2aWV3IGZyb20gJy4vVHJhbnNpdGlvblZpZXcucHVnJztcclxuaW1wb3J0ICcuL1RyYW5zaXRpb25WaWV3LnNjc3MnO1xyXG5cclxuLy8g0JLQvdC10YjQvdC40LUg0LfQsNCy0LjRgdC40LzQvtGB0YLQuFxyXG5pbXBvcnQgRnJhY3Rpb24gZnJvbSAnLi4vLi4vbG9naWMvZnJhY3Rpb24uanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNpdGlvblZpZXcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGEsIHRvcCwgbGVmdCwgbGluZWFyRm9ybSkge1xyXG5cclxuICAgICAgICAvLyDQodC+0YXRgNCw0L3Rj9C10Lwg0LTQsNC90L3Ri9C1XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLnRvcCA9IHRvcDtcclxuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xyXG5cclxuICAgICAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC90LjQttC90Y7RjiDRgdGC0YDQvtC60YMg0YHQuNC80L/Qu9C10LrRgSDRgtCw0LHQu9C40YbRiyDQvdGD0LvRj9C80LhcclxuICAgICAgICBsZXQgYm90dG9tUm93ID0gW107XHJcbiAgICAgICAgbGV0IHRvcExlbiA9IHRvcC5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3BMZW47IGkrKykge1xyXG4gICAgICAgICAgICBib3R0b21Sb3cucHVzaChsaW5lYXJGb3JtW3RvcFtpXSAtIDFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYm90dG9tUm93LnB1c2gobmV3IEZyYWN0aW9uKDAsIDEpKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbGVmdC5sZW5ndGg7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9wTGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGJvdHRvbVJvd1tpXSA9IGJvdHRvbVJvd1tpXVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVhckZvcm1bbGVmdFtyb3ddIC0gMV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tdWwoZGF0YVtyb3ddW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJvdHRvbVJvd1t0b3BMZW5dID0gYm90dG9tUm93W3RvcExlbl1cclxuICAgICAgICAgICAgICAgIC5hZGQoXHJcbiAgICAgICAgICAgICAgICAgICAgbGluZWFyRm9ybVtsZWZ0W3Jvd10gLSAxXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubXVsKGRhdGFbcm93XVt0b3BMZW5dKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYm90dG9tUm93ID0gYm90dG9tUm93O1xyXG5cclxuICAgICAgICBsZXQgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHdyYXAuaW5uZXJIVE1MID0gdmlldyh7XHJcbiAgICAgICAgICAgIGRhdGEsIHRvcCwgbGVmdCwgbGluZWFyRm9ybSwgYm90dG9tUm93XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdyYXAuY2xhc3NOYW1lID0gJ1RyYW5zaXRpb25WaWV3JztcclxuICAgICAgICB0aGlzLnZpZXcgPSB3cmFwO1xyXG5cclxuICAgICAgICB0aGlzLmJvdHRvbVJvd1t0b3BMZW5dID0gdGhpcy5ib3R0b21Sb3dbdG9wTGVuXS5tdWwoRnJhY3Rpb24ubWludXNPbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGludG8oZGVzdGlvbmF0aW9uKSB7XHJcbiAgICAgICAgZGVzdGlvbmF0aW9uLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKCkgeyByZXR1cm47IH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL1RyYW5zaXRpb25WaWV3L2luZGV4LmpzIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJvdHRvbVJvdywgZGF0YSwgbGVmdCwgbGluZWFyRm9ybSwgdG9wKSB7bGV0IGlzRmlyc3Q7XG5wdWdfbWl4aW5zW1wiZm9ybWF0XCJdID0gcHVnX2ludGVycCA9IGZ1bmN0aW9uKGRhdGEsIGluZGV4LCBmaXJzdCl7XG52YXIgYmxvY2sgPSAodGhpcyAmJiB0aGlzLmJsb2NrKSwgYXR0cmlidXRlcyA9ICh0aGlzICYmIHRoaXMuYXR0cmlidXRlcykgfHwge307XG5pZiAoKGRhdGEuaXNaZXJvKSkge1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3JldHVyblxcdTAwM0VcXHUwMDNDXFx1MDAyRnJldHVyblxcdTAwM0VcIjtcbn1cbmVsc2Uge1xuaWYgKChpbmRleCAhPSBudWxsIHx8IGluZGV4ID09IG51bGwgJiYgIWRhdGEuaXNaZXJvKSkge1xuaWYgKChkYXRhLmlzUG9zaXRpdmUpKSB7XG5pZiAoKCFmaXJzdCkpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIiZuYnNwOytcIjtcbn1cbn1cbmVsc2Uge1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiJm5ic3A7LVwiO1xufVxuaWYgKCghZmlyc3QpKSB7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCImbmJzcDtcIjtcbn1cbmlmICgoaW5kZXggPT0gbnVsbCkpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gZGF0YS5hYnMpID8gXCJcIiA6IHB1Z19pbnRlcnApKTtcbn1cbmVsc2Uge1xuaWYgKCghZGF0YS5pc09uZSkpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gZGF0YS5hYnMpID8gXCJcIiA6IHB1Z19pbnRlcnApKTtcbn1cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcInhcXHUwMDNDc3ViXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGluZGV4KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3ViXFx1MDAzRVwiO1xufVxuaWYgKChmaXJzdCkpIHtcbmlzRmlyc3QgPSBmYWxzZTtcbn1cbn1cbn1cbn07XG5mb3IgKGxldCBpID0gMDsgaSA8IGxlZnQubGVuZ3RoOyBpKyspXG57XG5pc0ZpcnN0ID0gdHJ1ZTtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NwXFx1MDAzRXhcXHUwMDNDc3ViXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGxlZnRbaV0pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzdWJcXHUwMDNFID0gXCI7XG5wdWdfbWl4aW5zW1wiZm9ybWF0XCJdKGRhdGFbaV1bMF0ucmVmbGVjdCwgdG9wWzBdLCBpc0ZpcnN0KTtcbmZvciAobGV0IGogPSAxOyBqIDw9IHRvcC5sZW5ndGg7IGorKylcbntcbmlmICgoaiA9PSB0b3AubGVuZ3RoKSkge1xucHVnX21peGluc1tcImZvcm1hdFwiXShkYXRhW2ldW2pdLCB0b3Bbal0sIGlzRmlyc3QpO1xufVxuZWxzZSB7XG5wdWdfbWl4aW5zW1wiZm9ybWF0XCJdKGRhdGFbaV1bal0ucmVmbGVjdCwgdG9wW2pdLCBpc0ZpcnN0KTtcbn1cbn1cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcIjtcbn1cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NoclxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJsaW5lYXItZm9ybVxcXCJcXHUwMDNFXCI7XG5pc0ZpcnN0ID0gdHJ1ZTtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NwXFx1MDAzRUwoeCkgPSBcIjtcbnB1Z19taXhpbnNbXCJmb3JtYXRcIl0obGluZWFyRm9ybVswXSwgMSwgaXNGaXJzdCk7XG5mb3IgKGxldCBpID0gMTsgaSA8IGxpbmVhckZvcm0ubGVuZ3RoIC0gMTsgaSsrKVxue1xucHVnX21peGluc1tcImZvcm1hdFwiXShsaW5lYXJGb3JtW2ldLCBpICsgMSwgaXNGaXJzdCk7XG59XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCImbmJzcDs9XFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVwiO1xuaXNGaXJzdCA9IHRydWU7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDcFxcdTAwM0UmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDs9IFwiO1xucHVnX21peGluc1tcImZvcm1hdFwiXShib3R0b21Sb3dbMF0sIHRvcFswXSwgaXNGaXJzdCk7XG5mb3IgKGxldCBpID0gMTsgaSA8IGJvdHRvbVJvdy5sZW5ndGg7IGkrKylcbntcbnB1Z19taXhpbnNbXCJmb3JtYXRcIl0oYm90dG9tUm93W2ldLCB0b3BbaV0sIGlzRmlyc3QpO1xufVxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiO30uY2FsbCh0aGlzLFwiYm90dG9tUm93XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5ib3R0b21Sb3c6dHlwZW9mIGJvdHRvbVJvdyE9PVwidW5kZWZpbmVkXCI/Ym90dG9tUm93OnVuZGVmaW5lZCxcImRhdGFcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmRhdGE6dHlwZW9mIGRhdGEhPT1cInVuZGVmaW5lZFwiP2RhdGE6dW5kZWZpbmVkLFwibGVmdFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubGVmdDp0eXBlb2YgbGVmdCE9PVwidW5kZWZpbmVkXCI/bGVmdDp1bmRlZmluZWQsXCJsaW5lYXJGb3JtXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5saW5lYXJGb3JtOnR5cGVvZiBsaW5lYXJGb3JtIT09XCJ1bmRlZmluZWRcIj9saW5lYXJGb3JtOnVuZGVmaW5lZCxcInRvcFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudG9wOnR5cGVvZiB0b3AhPT1cInVuZGVmaW5lZFwiP3RvcDp1bmRlZmluZWQpKTs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9UcmFuc2l0aW9uVmlldy9UcmFuc2l0aW9uVmlldy5wdWdcbi8vIG1vZHVsZSBpZCA9IDM1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9UcmFuc2l0aW9uVmlldy9UcmFuc2l0aW9uVmlldy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzNTZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiaW1wb3J0IHZpZXcgZnJvbSAnLi9NYXRyaXhWaWV3LnB1Zyc7XHJcbmltcG9ydCAnLi9NYXRyaXhWaWV3LnNjc3MnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0cml4VmlldyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWF0cml4LCBpc0ZpcnN0ID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHdyYXAuaW5uZXJIVE1MID0gdmlldyh7XHJcbiAgICAgICAgICAgIG1hdHJpeCwgaXNGaXJzdFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmlldyA9IHdyYXAuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKCkgeyByZXR1cm47IH1cclxuXHJcbiAgICBpbnRvKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgZGVzdGluYXRpb24uYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL01hdHJpeFZpZXcvaW5kZXguanMiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAobWF0cml4KSB7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWF0cml4LXZpZXdcXFwiXFx1MDAzRVxcdTAwM0NmaWVsZHNldCBkaXNhYmxlZFxcdTAwM0VcXHUwMDNDdGFibGVcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVwiO1xuZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbWF0cml4Lmxlbmd0aDsgcm93KyspXG57XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXCI7XG5mb3IgKGxldCBkYXRhID0gMDsgZGF0YSA8IG1hdHJpeFtyb3ddLmxlbmd0aDsgZGF0YSsrKVxue1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1hdHJpeFtyb3ddW2RhdGFdKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXCI7XG59XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiO1xufVxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZmllbGRzZXRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJtYXRyaXhcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm1hdHJpeDp0eXBlb2YgbWF0cml4IT09XCJ1bmRlZmluZWRcIj9tYXRyaXg6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvTWF0cml4Vmlldy9NYXRyaXhWaWV3LnB1Z1xuLy8gbW9kdWxlIGlkID0gMzU4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL01hdHJpeFZpZXcvTWF0cml4Vmlldy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAzNTlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiaW1wb3J0IG1hcmt1cCBmcm9tICcuL21hcmt1cC5wdWcnO1xyXG5pbXBvcnQgZnVuY0hUTUwgZnJvbSAnLi9mdW5jLnB1Zyc7XHJcbmltcG9ydCAnLi9zdHlsZS5zY3NzJztcclxuXHJcbmNvbnN0IFNDQUxFID0gNTA7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGdW5jdGlvbkdyYXBoIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbiwgeCA9IDAsIHkgPSAwLCBuYW1lWCA9ICd4JywgbmFtZVkgPSAneScpIHtcclxuICAgICAgICAvLyDQodC+0YXRgNCw0L3Rj9C10Lwg0LjQvNC10L3QsCDQvtGB0LXQuVxyXG4gICAgICAgIHRoaXMubmFtZVggPSBuYW1lWDtcclxuICAgICAgICB0aGlzLm5hbWVZID0gbmFtZVk7XHJcblxyXG4gICAgICAgIC8vINCS0YHRgtCw0LLQu9GP0LXQvCDQs9GA0LDRhCDQsiDRgNCw0LfQvNC10YLQutGDXHJcbiAgICAgICAgZGVzdGluYXRpb24uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBtYXJrdXAoKSk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gZGVzdGluYXRpb24ubGFzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZFxyXG4gICAgICAgICAgICAuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCfQndC1INGD0LTQsNC70L7RgdGMINC/0L7Qu9GD0YfQuNGC0Ywg0LrQvtC90YLQtdC60YHRgiDQs9GA0LDRhNC40LrQsCDRhNGD0L3QutGG0LjQuSEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qINCc0L7QtNC10YDQvdC40LfQuNGA0YPQtdC8INGB0YLQsNC90LTQsNGA0L3Ri9C1INC80LXRgtC+0LTRiyDRgNC40YHQvtCy0LDQvdC40Y8g0LTQu9GPINC+0YLQvtCx0YDQsNC20LXQvdC40Y8g0LPRgNCw0YTQuNC60L7QsiAqL1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8gPSBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19wcm90b19fLm1vdmVUby5jYWxsKHRoaXMsIHksIHgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8gPSBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19wcm90b19fLmxpbmVUby5jYWxsKHRoaXMsIHksIHgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC90LDRh9Cw0LvRjNC90YPRjiDQv9C+0LfQuNGG0LjRjlxyXG4gICAgICAgIHRoaXMuY29udGV4dC5jYW52YXMucGFyZW50Tm9kZS5zdHlsZS50b3AgPSBgJHt5fXB4YDtcclxuICAgICAgICB0aGlzLmNvbnRleHQuY2FudmFzLnBhcmVudE5vZGUuc3R5bGUubGVmdCA9IGAke3h9cHhgO1xyXG5cclxuICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0LLQvtC30LzQvtC20L3QvtGB0YLRjCDQuNC30LzQtdC90LXQvdC40Y8g0L7QsdC70LDRgdGC0Lgg0LLQuNC00LjQvNC+0YHRgtC4INCyINCz0YDQsNGE0LjQutC1XHJcbiAgICAgICAgbGV0IGRyYWcgPSBmYWxzZSxcclxuICAgICAgICAgICAgZHJhZ1N0YXJ0WCwgZHJhZ1N0YXJ0WTtcclxuXHJcbiAgICAgICAgdGhpcy5vZmZzZXRYID0gMDtcclxuICAgICAgICB0aGlzLm9mZnNldFkgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRleHQuY2FudmFzLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGRyYWdTdGFydFggPSBlLm9mZnNldFggLSB0aGlzLm9mZnNldFg7XHJcbiAgICAgICAgICAgIGRyYWdTdGFydFkgPSBlLm9mZnNldFkgLSB0aGlzLm9mZnNldFk7XHJcbiAgICAgICAgICAgIGRyYWcgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY29udGV4dC5jYW52YXMub25tb3VzZXVwID0gZSA9PiBkcmFnID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBsYXN0V2lkdGggPSAwO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5jYW52YXMub25tb3VzZW1vdmUgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGRyYWcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0WCA9IGUub2Zmc2V0WCAtIGRyYWdTdGFydFg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9mZnNldFkgPSBlLm9mZnNldFkgLSBkcmFnU3RhcnRZO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGMgPSB0aGlzLmNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICB3ID0gdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgICAgIGggPSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIC8qINCS0YvQstC+0LQg0LrQvtC+0YDQtNC40L3QsNGCINC80YvRiNC4ICovXHJcbiAgICAgICAgICAgIGxldCBzID0gYCR7KFxyXG4gICAgICAgICAgICAgICAgKGUub2Zmc2V0WCAtIHRoaXMub2Zmc2V0WCAtIHcgLyAyKSAvIHRoaXMuc2NhbGUgLyBTQ0FMRVxyXG4gICAgICAgICAgICApLnRvRml4ZWQoMyl9OyAkeyhcclxuICAgICAgICAgICAgICAgIC0oZS5vZmZzZXRZIC0gdGhpcy5vZmZzZXRZICAtIGggLyAyKSAvIHRoaXMuc2NhbGUgLyBTQ0FMRVxyXG4gICAgICAgICAgICApLnRvRml4ZWQoMyl9YDtcclxuXHJcbiAgICAgICAgICAgIC8vINCe0YfQuNGJ0LDQtdC8INC+0LHQu9Cw0YHRgtGMINC00LvRjyDQstGL0LLQvtC00LAg0L3QvtCy0YvRhSDQutC+0L7RgNC00LjQvdCw0YIg0LzRi9GI0LhcclxuICAgICAgICAgICAgYy5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjLmZpbGxSZWN0KHcsIGgsIC1sYXN0V2lkdGgsIC0xMik7XHJcbiAgICAgICAgICAgIGxhc3RXaWR0aCA9IGMubWVhc3VyZVRleHQocykud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAvLyDQktGL0LLQvtC00LjQvCDQutC+0L7RgNC00LjQvdCw0YLRiyDQvNGL0YjQuCDQvdCwINGF0L7Qu9GB0YLQtVxyXG4gICAgICAgICAgICBjLmZpbGxTdHlsZSA9ICdibGFjayc7XHJcbiAgICAgICAgICAgIGMudGV4dEFsaWduID0gJ3JpZ2h0JztcclxuICAgICAgICAgICAgYy50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcclxuICAgICAgICAgICAgYy5maWxsVGV4dChzLCB3LCBoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0LLQvtC30LzQvtC20L3QvtGB0YLRjCDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40Y8g0LPRgNCw0YTQuNC60LBcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgICAgICB0aGlzLmNvbnRleHQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLmRlbHRhWSA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjYWxlID4gMC4yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSAvPSAxLjI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zY2FsZSA8IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlICo9IDEuMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmNhbnZhcy5vbm1vdXNlbW92ZShlKTtcclxuICAgICAgICB9LCB0cnVlKTtcclxuXHJcbiAgICAgICAgLyog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0L/QsNGA0LDQvNC10YLRgNGLINGI0YDQuNGE0YLQsCAqL1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gJzEwcHQgU2Vnb2UgVUknO1xyXG5cclxuICAgICAgICAvKiDQpdGA0LDQvdC40LvQuNGJ0LUg0L7RgtGA0LjRgdC+0LLRi9Cy0LDQtdC80YvRhSDQu9C40L3QuNC5ICovXHJcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YTRg9C90LrRhtC40Lgg0LIg0LPQsNGA0YTQuNC6XHJcbiAgICBhZGQoZnVuYykge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZS5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIGlmIChmdW5jLnkgPT0gMCAmJiBmdW5jLmsgPT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRleHQuY2FudmFzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bmN0aW9ucycpXHJcbiAgICAgICAgICAgIC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGZ1bmNIVE1MKHtcclxuICAgICAgICAgICAgICAgIHk6IGZ1bmMueSxcclxuICAgICAgICAgICAgICAgIGs6IGZ1bmMuayxcclxuICAgICAgICAgICAgICAgIGI6IGZ1bmMuYixcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBmdW5jLmNvbG9yLFxyXG4gICAgICAgICAgICAgICAgbmFtZVg6IHRoaXMubmFtZVgsXHJcbiAgICAgICAgICAgICAgICBuYW1lWTogdGhpcy5uYW1lWVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KHQsdGA0L7RgSDQvdCw0YHRgtGA0L7QtdC60YIg0LPRgNCw0YTQsFxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gW107XHJcbiAgICAgICAgdGhpcy5vZmZzZXRYID0gdGhpcy5vZmZzZXRZID0gMDtcclxuICAgICAgICB0aGlzLnNjYWxlWCA9IHRoaXMuc2NhbGVZID0gMTtcclxuICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5jYW52YXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZnVuY3Rpb25zJykuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J/QvtC60LDQt9Cw0YLRjCDQs9GA0LDRhNC40LpcclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmNhbnZhcy5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCh0LrRgNGL0YLRjCDQs9GA0LDRhNC40LpcclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmNhbnZhcy5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCf0LXRgNC10YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LBcclxuICAgIHJlZHJhdygpIHtcclxuICAgICAgICBsZXQgYyA9IHRoaXMuY29udGV4dCxcclxuICAgICAgICAgICAgdyA9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGggPSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgb2Zmc2V0WCA9IHRoaXMub2Zmc2V0WCxcclxuICAgICAgICAgICAgb2Zmc2V0WSA9IHRoaXMub2Zmc2V0WSxcclxuICAgICAgICAgICAgc2NhbGUgPSB0aGlzLnNjYWxlLFxyXG4gICAgICAgICAgICBuYW1lWSA9IHRoaXMubmFtZVksXHJcbiAgICAgICAgICAgIG5hbWVYID0gdGhpcy5uYW1lWCxcclxuICAgICAgICAgICAgbWF4ID0gKE1hdGgubWF4KE1hdGguYWJzKHRoaXMub2Zmc2V0WCksIE1hdGguYWJzKHRoaXMub2Zmc2V0WSkpICtcclxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHcsIGgpKSAvIHNjYWxlO1xyXG5cclxuICAgICAgICAvKiDQpNGD0L3QutGG0LjRjyDQvtGH0LjRidCw0Y7RidCw0Y8g0LPRgNCw0YTQuNC6ICovXHJcbiAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGMuZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgYy5maWxsUmVjdCgtbWF4LCAtbWF4LCAyICogbWF4LCAyICogbWF4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qINCk0YPQvdC60YbQuNGPINGA0LjRgdGD0Y7RidCw0Y8g0L7RgdC4INC60L7QvtGA0LTQuNC90LDRgiAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdBeGVzKCkge1xyXG4gICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICAgICAgYy5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG5cclxuICAgICAgICAgICAgLy8g0KDQuNGB0YPQtdC8INCy0LXRgNGC0LjQutCw0LvRjNC90YPRjiDQvtGB0YxcclxuICAgICAgICAgICAgYy5tb3ZlVG8oMCwgLWggLyAyIC0gbWF4KTtcclxuICAgICAgICAgICAgYy5saW5lVG8oMCwgaCAvIDIgKyBtYXgpO1xyXG5cclxuICAgICAgICAgICAgLy8g0KDQuNGB0YPQtdC8INCz0L7RgNC40LfQvtC90YLQsNC70YzQvdGD0Y4g0L7RgdGMXHJcbiAgICAgICAgICAgIGMubW92ZVRvKC13IC8gMiAtIG1heCwgMCk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHcgLyAyICsgbWF4LCAwKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCe0YLRgNC40YHQvtCy0YvQstCw0LXQvFxyXG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiDQpNGD0L3QutGG0LjRjyDRgNC40YHRg9GO0YnQsNGPINC/0L7QvNC10YLQutC4INC90LAg0L7RgdGP0YUg0LrQvtC+0YDQtNC40L3QsNGCICovXHJcbiAgICAgICAgZnVuY3Rpb24gZHJhd1NjYWxlTGFiZWxzKCkge1xyXG4gICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICAgICAgYy5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgICAgICAvKiDQn9C+0LTRgdGH0LjRgtGL0LLQsNC10Lwg0LrQvtC70LjRh9C10YHRgtCy0L4g0L/QvtC80LXRgtC+0LosINC60L7RgtC+0YDQvtC1INC90LXQvtCx0YXQvtC00LjQvNC+INC+0YLRgNC40YHQvtCy0LDRgtGMXHJcbiAgICAgICAgICAgICAgINCyINC60LDQttC00YPRjiDRgdGC0L7RgNC+0L3RgyDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0L3QsNGH0LDQu9CwINC60L7QvtGA0LTQuNC90LDRgiAqL1xyXG4gICAgICAgICAgICBsZXQgbiA9IE1hdGguZmxvb3IobWF4IC8gU0NBTEUpO1xyXG5cclxuICAgICAgICAgICAgLy8g0KDQuNGB0YPQtdC8INC/0L7QvNC10YLQutC4XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAtbjsgaSA8PSBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQvdCwINCy0LXRgNGC0LjQutCw0LvRjNC90L7QuSDQvtGB0LhcclxuICAgICAgICAgICAgICAgIGMubW92ZVRvKC00LCBpICogU0NBTEUpO1xyXG4gICAgICAgICAgICAgICAgYy5saW5lVG8oNCwgaSAqIFNDQUxFKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQvdCwINCz0L7RgNC40LfQvtC90YLQsNC70YzQvdC+0Lkg0L7RgdC4XHJcbiAgICAgICAgICAgICAgICBjLm1vdmVUbyhpICogU0NBTEUsIC00KTtcclxuICAgICAgICAgICAgICAgIGMubGluZVRvKGkgKiBTQ0FMRSwgNCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGMucm90YXRlKE1hdGguUEkgLyAyKTtcclxuICAgICAgICAgICAgLy8g0J/QvtC00L/QuNGB0YvQstCw0LXQvCDQv9C+0LzQtdGC0LrQuCDQvdCwINCy0LXRgNGC0LjQutCw0LvRjNC90L7QuSDQvtGB0LhcclxuICAgICAgICAgICAgYy50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcbiAgICAgICAgICAgIGMudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAtbjsgaSA8PSBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjLmZpbGxUZXh0KC1pLCAxMCwgaSAqIFNDQUxFLCA0MCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vINCf0L7QtNC/0LjRgdGL0LLQsNC10Lwg0L/QvtC80LXRgtC60Lgg0L3QsCDQs9C+0YDQuNC30L7QvdGC0LDQu9GM0L3QvtC5INC+0YHQuFxyXG4gICAgICAgICAgICBjLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICBjLnRleHRCYXNlbGluZSA9ICd0b3AnO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gLW47IGkgPD0gbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgYy5maWxsVGV4dChpLCBpICogU0NBTEUsIDEyLCA0MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g0KDQuNGB0YPQtdC8INC90L7Qu9GMINCyINC90LDRh9Cw0LvQtSDQutC+0L7RgNC00LjQvdCw0YJcclxuICAgICAgICAgICAgYy5maWxsVGV4dCgnMCcsIDEyLCA1KTtcclxuXHJcbiAgICAgICAgICAgIGMucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcblxyXG4gICAgICAgICAgICAvLyDQntGC0YDQuNGB0L7QstGL0LLQsNC10LxcclxuICAgICAgICAgICAgYy5zdHJva2UoKTtcclxuICAgICAgICAgICAgYy5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyog0KTRg9C90LrRhtC40Y8g0YDQuNGB0YPRjtGJ0LDRjyDRgdC10YLQutGDICovXHJcbiAgICAgICAgZnVuY3Rpb24gZHJhd0dyaWQoKSB7XHJcbiAgICAgICAgICAgIGMuc3Ryb2tlU3R5bGUgPSAncmdiKDIxMCwgMjEwLCAyMTApJztcclxuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgIC8qINCf0L7QtNGB0YfQuNGC0YvQstCw0LXQvCDQutC+0LvQuNGH0LXRgdGC0LLQviDQu9C40L3QuNC5LCDQutC+0YLQvtGA0YvQtSDQvdC10L7QsdGF0L7QtNC40LzQviDQvtGC0YDQuNGB0L7QstCw0YLRjFxyXG4gICAgICAgICAgICAgICDQsiDQutCw0LbQtNGD0Y4g0YHRgtC+0YDQvtC90YMg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC90LDRh9Cw0LvQsCDQutC+0L7RgNC00LjQvdCw0YIgKi9cclxuICAgICAgICAgICAgbGV0IG4gPSBNYXRoLmZsb29yKG1heCAvIFNDQUxFKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCg0LjRgdGD0LXQvCDQv9C+0LzQtdGC0LrQuFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gLW47IGkgPD0gbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0L3QsCDQstC10YDRgtC40LrQsNC70YzQvdC+0Lkg0L7RgdC4XHJcbiAgICAgICAgICAgICAgICBjLm1vdmVUbygtbWF4LCBpICogU0NBTEUpO1xyXG4gICAgICAgICAgICAgICAgYy5saW5lVG8obWF4LCBpICogU0NBTEUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vINC90LAg0LPQvtGA0LjQt9C+0L3RgtCw0LvRjNC90L7QuSDQvtGB0LhcclxuICAgICAgICAgICAgICAgIGMubW92ZVRvKGkgKiBTQ0FMRSwgLW1heCk7XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbyhpICogU0NBTEUsIG1heCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiDQpNGD0L3QutGG0LjRjyDQv9GA0Y/QvNC+0LkgeSA9IGt4K2IgKi9cclxuICAgICAgICBmdW5jdGlvbiBsaW5lRnVuY3Rpb24obGluZSwgeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKChsaW5lLmsgLyBsaW5lLnkpICogeCArIGxpbmUuYiAvIGxpbmUueSkgKiBTQ0FMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qINCh0L7RhdGA0LDQvdGP0LXQvCDRgtC10LrRg9GJ0LXQtSDRgdC+0YHRgtC+0Y/QvdC40LUg0YHQuNGB0YLQtdC80Ysg0LrQvtC+0YDQtNC40L3QsNGCICovXHJcbiAgICAgICAgYy5zYXZlKCk7XHJcblxyXG4gICAgICAgIC8qINCf0LXRgNC10L3QvtGB0LjQvCDQvdCw0YfQsNC70L4g0LrQvtC+0YDQtNC40L3QsNGCINGF0L7Qu9GB0YLQsCDQsiDQvdCw0YfQsNC70L4g0LLQuNGA0YLRg9Cw0LvRjNC90YvRhSDQutC+0L7RgNC00LjQvdCw0YIgKi9cclxuICAgICAgICBjLnRyYW5zbGF0ZSh0aGlzLm9mZnNldFggKyB3IC8gMiwgdGhpcy5vZmZzZXRZICsgaCAvIDIpO1xyXG5cclxuICAgICAgICAvKiDQn9C+0LLQvtGA0LDRh9C40LLQsNC10Lwg0YHQuNGB0YLQtdC80YMg0LrQvtC+0YDQtNC40L3QsNGCXHJcbiAgICAgICAgICAg0L3QsCA5MCDQs9GA0LDQtNGD0YHQvtCyINC/0YDQvtGC0LjQsiDRh9Cw0YHQvtCy0L7QuSDRgdGC0YDQtdC70LrQuCAqL1xyXG4gICAgICAgIGMucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcblxyXG4gICAgICAgIC8qINCc0LDRgdGI0YLQsNCx0LjRgNGD0LXQvCDRgdC40YHRgtC10LzRgyDQutC+0L7RgNC00LjQvdCw0YIgKi9cclxuICAgICAgICBjLnNjYWxlKHNjYWxlLCBzY2FsZSk7XHJcblxyXG4gICAgICAgIC8qINCe0YfQuNGJ0LDQtdC8INGE0L7QvSAqL1xyXG4gICAgICAgIGNsZWFyKCk7XHJcblxyXG4gICAgICAgIC8qINCg0LjRgdGD0LXQvCDRgdC10YLQutGDICovXHJcbiAgICAgICAgZHJhd0dyaWQoKTtcclxuXHJcbiAgICAgICAgLyog0KDQuNGB0YPQtdC8INC+0YHQuCDQutC+0L7RgNC00LjQvdCw0YIgKi9cclxuICAgICAgICBkcmF3QXhlcygpO1xyXG5cclxuICAgICAgICAvKiDQlNC10LvQsNC10Lwg0L/QvtC80LXRgtC60Lgg0LzQsNGB0YjRgtCw0LHQsCDQvdCwINC+0YHRj9GFINC60L7QvtGA0LTQuNC90LDRgiAqL1xyXG4gICAgICAgIGRyYXdTY2FsZUxhYmVscygpO1xyXG5cclxuICAgICAgICAvKiDQntGC0YDQuNGB0L7QstC60LAg0LvQuNC90LjQuSDQuCDQv9C+0LvRg9C/0LvQvtGB0LrQvtGB0YLQtdC5ICovXHJcbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiB0aGlzLnN0b3JhZ2UpIHtcclxuICAgICAgICAgICAgLyog0JfQsNC00LDRkdC8INGG0LLQtdGCINC70LjQvdC40Lgg0Lgg0L/QvtC70YPQv9C70L7RgdC60L7RgdGC0LggKi9cclxuICAgICAgICAgICAgYy5zdHJva2VTdHlsZSA9IGByZ2JhKCR7bGluZS5jb2xvcn0sIDEpYDtcclxuICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBgcmdiYSgke2xpbmUuY29sb3J9LCAwLjEpYDtcclxuXHJcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGluZS50eXBlID09ICdsaW5lJykge1xyXG4gICAgICAgICAgICAgICAgYy5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgYy5tb3ZlVG8obGluZS5rICogU0NBTEUsIC1saW5lLnkgKiBTQ0FMRSk7XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbygwLCAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGMubGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxpbmUueSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLyog0KDQuNGB0YPQtdC8INC/0YDRj9C80YPRjiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IEZtaW4gPSBsaW5lRnVuY3Rpb24obGluZSwgLW1heCksXHJcbiAgICAgICAgICAgICAgICAgICAgRm1heCA9IGxpbmVGdW5jdGlvbihsaW5lLCBtYXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGMubW92ZVRvKC1tYXggKiBTQ0FMRSwgRm1pbik7XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbyhtYXggKiBTQ0FMRSwgRm1heCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUudHlwZSA9PT0gJ2hhbGYtcGxhbmUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyog0KDQuNGB0YPQtdC8INC/0L7Qu9GD0L/Qu9C+0YHQutC+0YHRgtGMICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUueSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUuayA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubGluZVRvKC1tYXgsIG1heCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGluZS5rID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmxpbmVUbyhtYXgsIG1heCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8oLW1heCwgbWF4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8obWF4LCBtYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUuayA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubGluZVRvKC1tYXgsIC1tYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUuayA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8obWF4LCAtbWF4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmxpbmVUbygtbWF4LCAtbWF4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8obWF4LCAtbWF4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8qINCg0LjRgdGD0LXQvCB4ID0gY29uc3QgKi9cclxuICAgICAgICAgICAgICAgIGMubW92ZVRvKCgtbGluZS5iIC8gbGluZS5rKSAqIFNDQUxFLCBtYXgpO1xyXG4gICAgICAgICAgICAgICAgYy5saW5lVG8oKC1saW5lLmIgLyBsaW5lLmspICogU0NBTEUsIC1tYXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsaW5lLnR5cGUgPT09ICdoYWxmLXBsYW5lJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qINCg0LjRgdGD0LXQvCDQv9C+0LvRg9C/0LvQvtGB0LrQvtGB0YLRjCAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lLmsgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMubGluZVRvKC1tYXgsIC1tYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLmxpbmVUbygtbWF4LCBtYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5lLmsgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8obWF4LCAtbWF4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8obWF4LCBtYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYy5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgYy5maWxsKCk7IC8qINCX0LDQu9C40LLQsNC10Lwg0L/QvtC70YPQv9C70L7RgdC60L7RgdGC0YwgKi9cclxuICAgICAgICAgICAgYy5zdHJva2UoKTsgLyog0J7RgtGA0LjRgdC+0LLRi9Cy0LDQtdC8INC70LjQvdC40Y4gKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qINCS0L7RgdGB0YLQsNC90LDQstC70LjQstCw0LXQvCDQuNC30L3QsNGH0LDQu9GM0L3QvtC1INGB0L7RgdGC0L7Rj9C90LjQtSDRgdC40YHRgtC10LzRiyDQutC+0L7RgNC00LjQvdCw0YIgKi9cclxuICAgICAgICBjLnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgLyog0J/QvtC00L/QuNGB0YvQstCw0LXQvCDQvtGB0LggKi9cclxuICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGMuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgIGMuX19wcm90b19fLm1vdmVUby5jYWxsKGMsIDYwLCBoIC0gMTApO1xyXG4gICAgICAgIGMuX19wcm90b19fLmxpbmVUby5jYWxsKGMsIDEwLCBoIC0gMTApO1xyXG4gICAgICAgIGMuX19wcm90b19fLmxpbmVUby5jYWxsKGMsIDEwLCBoIC0gNjApO1xyXG4gICAgICAgIGMudGV4dEFsaWduID0gJ3JpZ2h0JztcclxuICAgICAgICBjLnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xyXG4gICAgICAgIGMuZmlsbFRleHQobmFtZVgsIDYwLCBoIC0gMTApOyAvLyDQk9C+0YDQuNC30L7QvdGC0LDQu9GM0L3QsNGPXHJcbiAgICAgICAgYy50ZXh0QWxpZ24gPSAnbGVmdCc7XHJcbiAgICAgICAgYy5maWxsVGV4dChuYW1lWSwgMTUsIGggLSA1MCk7IC8vINCS0LXRgNGC0LjQutCw0LvRjNC90LDRj1xyXG4gICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qINCU0L7QsdCw0LLQu9GP0LXQvCDQvtCx0YDQsNCx0L7RgtC60YMg0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjRjyDQs9GA0LDRhNC40LrQvtCyINGE0YPQvdC60YbQuNC5ICovXHJcbmxldCBkcmFnZ2FibGUgPSBudWxsLFxyXG4gICAgb2Zmc2V0WCwgb2Zmc2V0WTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCA9PT0gZmFsc2UpIHJldHVybjtcclxuICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZnVuY3Rpb24tZ3JhcGgtd3JhcCcpKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHBvc2l0aW9uID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgb2Zmc2V0WCA9IGUucGFnZVggLSBwb3NpdGlvbi5sZWZ0O1xyXG4gICAgb2Zmc2V0WSA9IGUucGFnZVkgLSBwb3NpdGlvbi50b3A7XHJcbiAgICBkcmFnZ2FibGUgPSB0YXJnZXQ7XHJcbiAgICBkcmFnZ2FibGUuY2xhc3NMaXN0LmFkZCgnZ3JhYmJpbmcnKTtcclxufSwgZmFsc2UpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKGRyYWdnYWJsZSkge1xyXG4gICAgICAgIGRyYWdnYWJsZS5zdHlsZS5sZWZ0ID0gYCR7ZS5wYWdlWCAtIG9mZnNldFh9cHhgO1xyXG4gICAgICAgIGRyYWdnYWJsZS5zdHlsZS50b3AgPSBgJHtlLnBhZ2VZIC0gb2Zmc2V0WX1weGA7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGUgPT4ge1xyXG4gICAgaWYgKGRyYWdnYWJsZSkge1xyXG4gICAgICAgIGRyYWdnYWJsZS5jbGFzc0xpc3QucmVtb3ZlKCdncmFiYmluZycpO1xyXG4gICAgICAgIGRyYWdnYWJsZSA9IG51bGw7XHJcbiAgICB9XHJcbn0sIGZhbHNlKTtcclxuXHJcbi8qINCa0L3QvtC/0LrQsCDQt9Cw0LrRgNGL0YLQuNGPINCz0YDQsNGE0LAgKi9cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgIGlmIChlLnRhcmdldC5pZCA9PT0gJ2NhbmNlbC1ncmFwaCcpIHtcclxuICAgICAgICBlLnRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgfVxyXG59LCBmYWxzZSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvRnVuY3Rpb25HcmFwaC9pbmRleC5qcyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImZ1bmN0aW9uLWdyYXBoLXdyYXAgaGlkZGVuXFxcIlxcdTAwM0VcXHUwMDNDY2FudmFzIGNsYXNzPVxcXCJmdW5jdGlvbi1ncmFwaFxcXCIgd2lkdGg9XFxcIjUwMFxcXCIgaGVpZ2h0PVxcXCI1MDBcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGY2FudmFzXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImZ1bmN0aW9uc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBpZD1cXFwiY2FuY2VsLWdyYXBoXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRXhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9GdW5jdGlvbkdyYXBoL21hcmt1cC5wdWdcbi8vIG1vZHVsZSBpZCA9IDM2MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYiwgY29sb3IsIGssIG5hbWVYLCBuYW1lWSwgeSkge3B1Z19taXhpbnNbXCJmb3JtYXRcIl0gPSBwdWdfaW50ZXJwID0gZnVuY3Rpb24oYSwgeCl7XG52YXIgYmxvY2sgPSAodGhpcyAmJiB0aGlzLmJsb2NrKSwgYXR0cmlidXRlcyA9ICh0aGlzICYmIHRoaXMuYXR0cmlidXRlcykgfHwge307XG5pZiAoeCA9PSBudWxsKSB7XG5pZiAoYSA9PSAwKSB7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDcmV0dXJuXFx1MDAzRVxcdTAwM0NcXHUwMDJGcmV0dXJuXFx1MDAzRVwiO1xufVxuZWxzZSB7XG5pZiAoYSA+IDApIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzcGFuXFx1MDAzRSZuYnNwKyZuYnNwXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gYSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXCI7XG59XG5lbHNlIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzcGFuXFx1MDAzRSZuYnNwOy0mbmJzcFwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGEgKiAtMSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXCI7XG59XG59XG59XG5lbHNlIHtcbmlmIChhID09IDApIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzcGFuXFx1MDAzRTBcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXCI7XG59XG5lbHNlIHtcbmlmIChhID09IDEpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzcGFuXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHgpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVwiO1xufVxuZWxzZSB7XG5pZiAoYSA9PSAtMSkge1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NwYW5cXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gJy0nICsgeCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXCI7XG59XG5lbHNlIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzcGFuXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGEgKyB4KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcIjtcbn1cbn1cbn1cbn1cbn07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJmdW5jXFxcIlxcdTAwM0VcIjtcbmlmIChjb2xvciA9PSAnMCwgMCwgMjU1Jykge1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NwYW5cIiArIChcIiBjbGFzcz1cXFwiY29sb3JcXFwiXCIrcHVnLmF0dHIoXCJzdHlsZVwiLCBwdWcuc3R5bGUoe1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoJyArIGNvbG9yICsgJywgMSknXG4gICAgICAgIH0pLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gJ24gKCcgKyBrICsgJzsgJyArIC15ICsgJyknKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcIjtcbn1cbmVsc2Uge1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NwYW5cIiArIChcIiBjbGFzcz1cXFwiY29sb3JcXFwiXCIrcHVnLmF0dHIoXCJzdHlsZVwiLCBwdWcuc3R5bGUoe1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoJyArIGNvbG9yICsgJywgMC4xKSdcbiAgICAgICAgfSksIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcIjtcbnB1Z19taXhpbnNbXCJmb3JtYXRcIl0oeSwgbmFtZVkpO1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NwYW5cXHUwMDNFJm5ic3Diqb4mbmJzcFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcIjtcbnB1Z19taXhpbnNbXCJmb3JtYXRcIl0oaywgbmFtZVgpO1xucHVnX21peGluc1tcImZvcm1hdFwiXShiLCBudWxsKTtcbn1cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiO30uY2FsbCh0aGlzLFwiYlwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYjp0eXBlb2YgYiE9PVwidW5kZWZpbmVkXCI/Yjp1bmRlZmluZWQsXCJjb2xvclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguY29sb3I6dHlwZW9mIGNvbG9yIT09XCJ1bmRlZmluZWRcIj9jb2xvcjp1bmRlZmluZWQsXCJrXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5rOnR5cGVvZiBrIT09XCJ1bmRlZmluZWRcIj9rOnVuZGVmaW5lZCxcIm5hbWVYXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5uYW1lWDp0eXBlb2YgbmFtZVghPT1cInVuZGVmaW5lZFwiP25hbWVYOnVuZGVmaW5lZCxcIm5hbWVZXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5uYW1lWTp0eXBlb2YgbmFtZVkhPT1cInVuZGVmaW5lZFwiP25hbWVZOnVuZGVmaW5lZCxcInlcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnk6dHlwZW9mIHkhPT1cInVuZGVmaW5lZFwiP3k6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvRnVuY3Rpb25HcmFwaC9mdW5jLnB1Z1xuLy8gbW9kdWxlIGlkID0gMzYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL0Z1bmN0aW9uR3JhcGgvc3R5bGUuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMzYzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8vINCS0L3Rg9GC0YDQtdC90L3QuNC1INC30LDQstC40YHQuNC80L7RgdGC0LhcclxuaW1wb3J0ICcuL0lucHV0Vmlldy5zY3NzJztcclxuaW1wb3J0IHZpZXcgZnJvbSAnLi9JbnB1dFZpZXcucHVnJztcclxuaW1wb3J0IGFkZCBmcm9tICcuL2FkZC5wdWcnO1xyXG5pbXBvcnQgbGFzdENvbmRpdGlvbiBmcm9tICcuL2xhc3RDb25kaXRpb24ucHVnJztcclxuXHJcbi8vINCS0L3QtdGI0L3QuNC1INC30LDQstC40YHQuNC80L7RgdGC0LhcclxuaW1wb3J0IHtJbnB1dFZpZXcgYXMgRE9NRm9yfSBmcm9tICcuLi8uLi9sb2dpYy9ET01Gb3IuanMnO1xyXG5pbXBvcnQge2FkZEFycm93LCByZW1vdmVBcnJvd30gZnJvbSAnLi4vLi4vbG9naWMvYXJyb3cuanMnO1xyXG5pbXBvcnQgc29sdmUgZnJvbSAnLi4vLi4vbG9naWMvc29sdmVyLmpzJztcclxuaW1wb3J0IEZyYWN0aW9uIGZyb20gJy4uLy4uL2xvZ2ljL2ZyYWN0aW9uLmpzJztcclxuaW1wb3J0IEJhc2lzVmlldyBmcm9tICcuLi9CYXNpc1ZpZXcnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXRWaWV3IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZ3VyYWJsZSwgbSwgbiwgc2l6ZSwgZGF0YSA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZ3VyYWJsZSBpbnN0YW5jZW9mIElucHV0Vmlldykge1xyXG4gICAgICAgICAgICBtID0gY29uZmlndXJhYmxlLm07XHJcbiAgICAgICAgICAgIG4gPSBjb25maWd1cmFibGUubjtcclxuICAgICAgICAgICAgc2l6ZSA9IGNvbmZpZ3VyYWJsZS5zaXplLFxyXG4gICAgICAgICAgICBkYXRhID0gY29uZmlndXJhYmxlLmdldERhdGEoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGVtcC5pbm5lckhUTUwgPSB2aWV3KHtcclxuICAgICAgICAgICAgb2JqZWN0OiAndGFibGUnLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGUsXHJcbiAgICAgICAgICAgIG0sXHJcbiAgICAgICAgICAgIG4sXHJcbiAgICAgICAgICAgIGRhdGEsXHJcbiAgICAgICAgICAgIHNpemVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maWd1cmFibGUgPSBjb25maWd1cmFibGU7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLm0gPSBtO1xyXG4gICAgICAgIHRoaXMubiA9IG47XHJcbiAgICAgICAgdGhpcy52aWV3ID0gdGVtcC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZ3VyYWJsZSkge1xyXG4gICAgICAgICAgICAvLyDQodGC0YDQtdC70LrQuFxyXG4gICAgICAgICAgICBsZXQgYXJyb3dzQmxvY2sgPSB0aGlzLnZpZXcubGFzdEVsZW1lbnRDaGlsZC5wcmV2aW91c1NpYmxpbmc7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhbnZhcyBvZiBhcnJvd3NCbG9jay5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgYWRkQXJyb3coY2FudmFzKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2FudmFzLmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm4gPiAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDb2woKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQmFzaXNWaWV3KHRoaXMubiAtIDEsIHRoaXMubSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNhbnZhcy5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0Jyk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubiA8IDE3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDb2woKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQmFzaXNWaWV3KHRoaXMubiAtIDEsIHRoaXMubSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNhbnZhcy5jbGFzc0xpc3QuY29udGFpbnMoJ3VwJyk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubSA+IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVJvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBCYXNpc1ZpZXcodGhpcy5uIC0gMSwgdGhpcy5tIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2FudmFzLmNsYXNzTGlzdC5jb250YWlucygnZG93bicpOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm0gPCAxNykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUm93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEJhc2lzVmlldyh0aGlzLm4gLSAxLCB0aGlzLm0gLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vINCh0L3Rj9GC0LjQtSDRhNC70LDQs9CwINC/0LvQvtGF0L7Qs9C+INCy0LLQvtC00LAg0YEg0L/QvtC70Y8g0L/RgNC4INC/0L7Qv9GL0YLQutC1INGH0YLQvi3RgtC+INGC0YPQtNCwINCy0LLQtdGB0YLQuFxyXG4gICAgICAgICAgICB0aGlzLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PlxyXG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2JhZC1pbnB1dCcpLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAvLyDQkdC70L7QutC40YDQvtCy0LrQsCDQstCy0L7QtNCwINC/0YDQvtCx0LXQu9C+0LJcclxuICAgICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PlxyXG4gICAgICAgICAgICAgICAgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJyA/IGV2ZW50LnByZXZlbnREZWZhdWx0KCkgOiB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8g0JHQu9C+0LrQuNGA0L7QstC60LAg0LLRgdGC0LDQstC60Lgg0L/RgNC+0LHQtdC70L7QsiDQuNC3INCx0YPRhNC10YDQsCDQvtCx0LzQtdC90LBcclxuICAgICAgICAgICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IGV2ZW50LmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dCcpLnJlcGxhY2UoLyAvZywgJycpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnZhbHVlID0gdGFyZ2V0LnZhbHVlLnNsaWNlKDAsIHRhcmdldC5zZWxlY3Rpb25TdGFydCkgK1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgKyB0YXJnZXQudmFsdWUuc2xpY2UodGFyZ2V0LnNlbGVjdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQvdC+0L/QutC4INC/0L7RgdGH0LjRgtCw0YLRjFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY291bnQnKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmZvcm1zLnNldHRpbmdzLmJhc2lzLnZhbHVlID09ICfQodCR0J8nICYmICFCYXNpc1ZpZXcuaXNWYWxpZEZvcm0odGhpcy5tIC0gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJhZElucHV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBET01Gb3IodGhpcy52aWV3LmZpcnN0RWxlbWVudENoaWxkLCAoZWxlbSwgaSwgaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLnZhbHVlLmxlbmd0aCA9PT0gMCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPT09IHRoaXMubiAtIDFcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEvKF4oLSk/P1xcZCs/KFsuLF1cXGQrPyk/PyQpfCheKC0pPz9cXGQrP1xcL1xcZCs/JCkvLnRlc3QoZWxlbS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKCdiYWQtaW5wdXQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFkSW5wdXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghYmFkSW5wdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzb2x2ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60L3QvtC/0LrQuCDRgdCx0YDQvtGBXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldCcpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBET01Gb3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvbHV0aW9uLXdyYXAnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZCwgKGVsZW0sIGksIGopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAwICYmIGogPT0gdGhpcy5uIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtLnZhbHVlID0gJ21pbic7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2JhZC1pbnB1dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQn9C+0LzQtdGJ0LDQtdGCINC/0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1INCyINC60L7QvdC10YYgZGVzdGluYXRpb25cclxuICAgIGludG8oZGVzdGluYXRpb24pIHtcclxuICAgICAgICBkZXN0aW5hdGlvbi5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCY0LfQvNC10L3QuNGC0Ywg0YDQsNC30LzQtdGAINC/0L7Qu9C10Lkg0LLQstC+0LTQsCDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQvdCwIHNpemVcclxuICAgIHJlc2l6ZShzaXplKSB7XHJcbiAgICAgICAgRE9NRm9yKHRoaXMudmlldy5maXJzdEVsZW1lbnRDaGlsZCwgKGVsZW0sIGksIGopID0+IHtcclxuICAgICAgICAgICAgaWYgKGkgIT09IDAgfHwgaiAhPT0gdGhpcy5uIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbS5zaXplID0gc2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J/QvtC70YPRh9C40YLRjCDQtNCw0L3QvdGL0LUg0LjQtyDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90LjRjyDQsiDQstC40LTQtSDQvNCw0YHRgdC40LLQsFxyXG4gICAgLy8g0JXRgdC70LggZGF0YVRvTmV4dFN0ZXAgPSB0cnVlLCDRgtC+INGB0L7Qt9C00LDRkdGCINC00YDQvtCx0LggKEZyYWN0aW9uKSxcclxuICAgIC8vINC40L3QsNGH0LUg0LLQvtC30LLRgNCw0YnQsNC10YIg0YHRgtGA0L7QutC+0LLRi9C1INC30L3QsNGH0LXQvdC40Y9cclxuICAgIGdldERhdGEoZGF0YVRvTmV4dFN0ZXAgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBkYXRhID0gW107XHJcbiAgICAgICAgbGV0IGxhc3RJID0gLTE7XHJcbiAgICAgICAgRE9NRm9yKHRoaXMudmlldy5maXJzdEVsZW1lbnRDaGlsZCwgKGVsZW0sIGksIGopID0+IHtcclxuICAgICAgICAgICAgaWYgKGxhc3RJIDwgaSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgIGxhc3RJID0gaTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkYXRhVG9OZXh0U3RlcCB8fCBpID09PSAwICYmIGogPT09IHRoaXMubiAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW2ldLnB1c2goZWxlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gZWxlbS52YWx1ZSxcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5wdXRWYWx1ZS5pbmRleE9mKCcvJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0J7QsdGL0YfQvdCw0Y8g0LTRgNC+0LHRjFxyXG4gICAgICAgICAgICAgICAgZGF0YVtpXS5wdXNoKG5ldyBGcmFjdGlvbigraW5wdXRWYWx1ZS5zbGljZSgwLCBpbmRleCksXHJcbiAgICAgICAgICAgICAgICAgICAgK2lucHV0VmFsdWUuc2xpY2UoaW5kZXggKyAxKSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbnB1dFZhbHVlLmluZGV4T2YoJy4nKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaW5wdXRWYWx1ZS5pbmRleE9mKCcsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDQlNC10YHRj9GC0LjRh9C90LDRjyDQtNGA0L7QsdGMXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJlZm9yZSA9ICtpbnB1dFZhbHVlLnNsaWNlKDAsIGluZGV4KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgPSAraW5wdXRWYWx1ZS5zbGljZShpbmRleCArIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGVub21pbmF0b3IgPSBNYXRoLnBvdygxMCwgYWZ0ZXIudG9TdHJpbmcoKS5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmVmb3JlWzBdID09PSAnLScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5wdXNoKG5ldyBGcmFjdGlvbigtKC1iZWZvcmUgKiBkZW5vbWluYXRvciArIGFmdGVyKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5wdXNoKG5ldyBGcmFjdGlvbihiZWZvcmUgKiBkZW5vbWluYXRvciArIGFmdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVub21pbmF0b3IpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINCm0LXQu9C+0LUg0YfQuNGB0LvQvlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbaV0ucHVzaChuZXcgRnJhY3Rpb24oK2lucHV0VmFsdWUsIDEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRSb3coKSB7XHJcbiAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvdy5pbm5lckhUTUwgPSBhZGQoe1xyXG4gICAgICAgICAgICBvYmplY3Q6ICdyb3cnLFxyXG4gICAgICAgICAgICBuOiB0aGlzLm4sXHJcbiAgICAgICAgICAgIHNpemU6IHRoaXMuc2l6ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubSsrO1xyXG4gICAgICAgIHRoaXMudmlldy5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVJvdygpIHtcclxuICAgICAgICB0aGlzLnZpZXcuZmlyc3RFbGVtZW50Q2hpbGQucmVtb3ZlQ2hpbGQoXHJcbiAgICAgICAgICAgIHRoaXMudmlldy5maXJzdEVsZW1lbnRDaGlsZC5sYXN0RWxlbWVudENoaWxkXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLm0tLTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb2woKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldERhdGEoKTtcclxuICAgICAgICBkYXRhLmZvckVhY2goYXJyYXkgPT4gYXJyYXkuc3BsaWNlKHRoaXMubiAtIDEsIDAsICcnKSk7XHJcblxyXG4gICAgICAgIHRoaXMudmlldy5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSBhZGQoe1xyXG4gICAgICAgICAgICBvYmplY3Q6ICd0YWJsZScsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdGhpcy5jb25maWd1cmFibGUsXHJcbiAgICAgICAgICAgIG46ICsrdGhpcy5uLFxyXG4gICAgICAgICAgICBtOiB0aGlzLm0sXHJcbiAgICAgICAgICAgIHNpemU6IHRoaXMuc2l6ZSxcclxuICAgICAgICAgICAgZGF0YVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZXcubGFzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSBsYXN0Q29uZGl0aW9uKHtcclxuICAgICAgICAgICAgbjogdGhpcy5uXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ29sKCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXREYXRhKCk7XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKGFycmF5ID0+IGFycmF5LnNwbGljZSh0aGlzLm4gLSAyLCAxKSk7XHJcblxyXG4gICAgICAgIHRoaXMudmlldy5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSBhZGQoe1xyXG4gICAgICAgICAgICBvYmplY3Q6ICd0YWJsZScsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdGhpcy5jb25maWd1cmFibGUsXHJcbiAgICAgICAgICAgIG46IC0tdGhpcy5uLFxyXG4gICAgICAgICAgICBtOiB0aGlzLm0sXHJcbiAgICAgICAgICAgIHNpemU6IHRoaXMuc2l6ZSxcclxuICAgICAgICAgICAgZGF0YVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZpZXcubGFzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSBsYXN0Q29uZGl0aW9uKHtcclxuICAgICAgICAgICAgbjogdGhpcy5uXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQXJyb3dzSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgYXJyb3cgb2YgQXJyYXkuZnJvbShcclxuICAgICAgICAgICAgdGhpcy52aWV3Lmxhc3RFbGVtZW50Q2hpbGQucHJldmlvdXNTaWJsaW5nLmNoaWxkcmVuXHJcbiAgICAgICAgKSkge1xyXG4gICAgICAgICAgICByZW1vdmVBcnJvdyhhcnJvdyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvSW5wdXRWaWV3L2luZGV4LmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gTm90ZTog0J7Qv9GD0YnQtdC90Ysg0L/RgNC+0LLQtdGA0LrQuCDQvdCw0LvQuNGH0LjRjyDQsNGA0LPRg9C80LXQvdGC0L7QsiDQuCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Y8g0LjRhSDRgtC40L/QvtCyXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyYWN0aW9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihudW1lcmF0b3IsIGRlbm9taW5hdG9yKSB7XHJcbiAgICAgICAgaWYgKGRlbm9taW5hdG9yID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcign0JfQvdCw0LzQtdC90LDRgtC10LvRjCDQtNGA0L7QsdC4INC90LUg0LzQvtC20LXRgiDQsdGL0YLRjCDRgNCw0LLQtdC9INC90YPQu9GOIScpO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWxlcnQoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRlbm9taW5hdG9yIDwgMCkge1xyXG4gICAgICAgICAgICBkZW5vbWluYXRvciAqPSAtMTtcclxuICAgICAgICAgICAgbnVtZXJhdG9yICo9IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5udW1lcmF0b3IgPSBudW1lcmF0b3I7XHJcbiAgICAgICAgdGhpcy5kZW5vbWluYXRvciA9IGRlbm9taW5hdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCj0L/RgNC+0YHRgtC40YLRjCDQtNGA0L7QsdGMXHJcbiAgICBzaW1wbGlmeSgpIHtcclxuICAgICAgICBsZXQgYSA9IE1hdGguYWJzKHRoaXMubnVtZXJhdG9yKSxcclxuICAgICAgICAgICAgYiA9IHRoaXMuZGVub21pbmF0b3I7XHJcblxyXG4gICAgICAgIGlmIChhID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2hpbGUgKGIgIT09IDApIHtcclxuICAgICAgICAgICAgW2EsIGJdID0gW2IsIGEgJSBiXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubnVtZXJhdG9yIC89IGE7XHJcbiAgICAgICAgdGhpcy5kZW5vbWluYXRvciAvPSBhO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCh0LvQvtC20LXQvdC40LUg0LTRgNC+0LHQtdC5XHJcbiAgICBhZGQodGVybSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24odGhpcy5udW1lcmF0b3IgKiB0ZXJtLmRlbm9taW5hdG9yICsgdGhpcy5kZW5vbWluYXRvclxyXG4gICAgICAgICAgICAqIHRlcm0ubnVtZXJhdG9yLCB0aGlzLmRlbm9taW5hdG9yICogdGVybS5kZW5vbWluYXRvcikuc2ltcGxpZnkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktGL0YfQuNGC0LDQvdC40LUg0LTRgNC+0LHQtdC5XHJcbiAgICBzdWIodGVybSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24odGhpcy5udW1lcmF0b3IgKiB0ZXJtLmRlbm9taW5hdG9yIC0gdGhpcy5kZW5vbWluYXRvclxyXG4gICAgICAgICAgICAqIHRlcm0ubnVtZXJhdG9yLCB0aGlzLmRlbm9taW5hdG9yICogdGVybS5kZW5vbWluYXRvcikuc2ltcGxpZnkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQn9C10YDQtdC80L3QvtC20LXQvdC40LUg0LTRgNC+0LHQtdC5XHJcbiAgICBtdWwodGVybSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24odGhpcy5udW1lcmF0b3IgKiB0ZXJtLm51bWVyYXRvcixcclxuICAgICAgICAgICAgdGhpcy5kZW5vbWluYXRvciAqIHRlcm0uZGVub21pbmF0b3IpLnNpbXBsaWZ5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JTQtdC70LXQvdC40LUg0LTRgNC+0LHQtdC5XHJcbiAgICBkaXYodGVybSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24odGhpcy5udW1lcmF0b3IgKiB0ZXJtLmRlbm9taW5hdG9yLFxyXG4gICAgICAgICAgICB0aGlzLmRlbm9taW5hdG9yICogdGVybS5udW1lcmF0b3IpLnNpbXBsaWZ5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyog0KHRgNCw0LLQvdC10L3QuNC1INC00YDQvtCx0LXQuVxyXG4gICAgKiAgIHRoaXMgPiB0ZXJtLCByZXQgPiAwXHJcbiAgICAqICAgdGhpcyA9IHRlcm0sIHJldCA9IDBcclxuICAgICogICB0aGlzIDwgdGVybSwgcmV0IDwgMFxyXG4gICAgKi9cclxuICAgIGNvbXBhcmUodGVybSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih0ZXJtKS5udW1lcmF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J/QvtC70YPRh9C10L3QuNC1INC+0YLQstC10YLQsCDQsiDQstC40LTQtSDRgdGC0YDQvtC60LhcclxuICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHRoaXMuc2ltcGxpZnkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZW5vbWluYXRvciA9PT0gMSB8fFxyXG4gICAgICAgICAgICB0aGlzLm51bWVyYXRvciA9PT0gMCA/XHJcbiAgICAgICAgICAgIHRoaXMubnVtZXJhdG9yIDpcclxuICAgICAgICAgICAgdGhpcy5udW1lcmF0b3IgKyAnLycgKyB0aGlzLmRlbm9taW5hdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCf0L7Qu9GD0YfQtdC90LjQtSDQvtCx0YvRh9C90L7Qs9C+INGH0LjRgdC70LBcclxuICAgIHRvSW50KCkge1xyXG4gICAgICAgIHJldHVybiArdGhpcy5udW1lcmF0b3IgLyArdGhpcy5kZW5vbWluYXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQn9GA0L7QstC10YDQutCwINGA0LDQstC10L3RgdGC0LLQsCDQtNGA0L7QsdC4INC90YPQu9GOXHJcbiAgICBnZXQgaXNaZXJvKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm51bWVyYXRvciA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQn9C+0LvQvtC20LjRgtC10LvRjNC90LAg0LvQuCDQtNGA0L7QsdGMP1xyXG4gICAgZ2V0IGlzUG9zaXRpdmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtZXJhdG9yID4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQntGC0YDQuNGG0LDRgtC10LvRjNC90LDRjyDQtNGA0L7QsdGMP1xyXG4gICAgZ2V0IGlzTmVnYXRpdmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtZXJhdG9yIDwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQvNC+0LTRg9C70Ywg0LTRgNC+0LHQuFxyXG4gICAgZ2V0IGFicygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc05lZ2F0aXZlID8gdGhpcy5tdWwoRnJhY3Rpb24ubWludXNPbmUpIDogdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvLyDQoNCw0LLQvdCwINC70Lgg0LTRgNC+0LHRjCDQtdC00LjQvdC40YbQtT9cclxuICAgIGdldCBpc09uZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hYnMuY29tcGFyZShGcmFjdGlvbi5vbmUpID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC00YDQvtCx0Ywg0YPQvNC90L7QttC10L3QvdGD0Y4g0L3QsCDQvNC40L3Rg9GBINC10LTQuNC90LjRhtGDXHJcbiAgICBnZXQgcmVmbGVjdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWwobWludXNPbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC90L7Qu9GMICjQtNGA0L7QsdGM0Y4pXHJcbiAgICBzdGF0aWMgZ2V0IHplcm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIHplcm87XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LXQtNC40L3QuNGG0YMgKNC00YDQvtCx0YzRjilcclxuICAgIHN0YXRpYyBnZXQgb25lKCkge1xyXG4gICAgICAgIHJldHVybiBvbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LzQuNC90YPRgSDQtdC00LjQvdC40YbRgyAo0LTRgNC+0LHRjNGOKVxyXG4gICAgc3RhdGljIGdldCBtaW51c09uZSgpIHtcclxuICAgICAgICByZXR1cm4gbWludXNPbmU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCB6ZXJvID0gbmV3IEZyYWN0aW9uKDAsIDEpLFxyXG4gICAgb25lID0gbmV3IEZyYWN0aW9uKDEsIDEpLFxyXG4gICAgbWludXNPbmUgPSBuZXcgRnJhY3Rpb24oLTEsIDEpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2dpYy9mcmFjdGlvbi5qcyIsImltcG9ydCBmaWxlc0xpc3QgZnJvbSAnLi9maWxlcy1saXN0LnB1Zyc7XHJcbmltcG9ydCBCYXNpc1ZpZXcgZnJvbSAnLi4vQmFzaXNWaWV3JztcclxuaW1wb3J0IFN0YWNrIGZyb20gJy4uLy4uL2xvZ2ljL1N0YWNrLmpzJztcclxuaW1wb3J0IElucHV0VmlldyBmcm9tICcuLi9JbnB1dFZpZXcnO1xyXG5cclxubGV0IGZpbGVzUG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZXMtcG9wdXAnKSxcclxuICAgIGZpbGVzUG9wdXBXcmFwID0gZmlsZXNQb3B1cC5xdWVyeVNlbGVjdG9yKCcubGlzdCcpLFxyXG4gICAgcG9wdXBXcmFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLXdyYXAnKSxcclxuICAgIHdhaXRpbmdQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3YWl0aW5nLXBvcHVwJyksXHJcbiAgICB3YWl0aW5nUG9wdXBNZXNzYWdlID0gd2FpdGluZ1BvcHVwLnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlJyksXHJcbiAgICB3YWl0aW5nUG9wdXBDYW5jZWwgPSB3YWl0aW5nUG9wdXAucXVlcnlTZWxlY3RvcignLmNhbmNlbCcpLFxyXG4gICAgZmlsZVNhdmVQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlLXNhdmUnKSxcclxuICAgIGZpbGVTYXZlUG9wdXBTZW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQnKSxcclxuICAgIGZpbGVTYXZlTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLW5hbWUnKSxcclxuICAgIGJnQmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2dyb3VuZC1ibG9jaycpLFxyXG4gICAgc29sdXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29sdXRpb24td3JhcCcpO1xyXG5cclxuLy8g0KPRgdGC0LDQvdC+0LLQutCwINC+0LHRgNCw0LHQvtGC0YfQuNC60L7QsiDQt9Cw0LrRgNGL0YLQuNGPIHBvcHVwJ9C+0LJcclxucG9wdXBXcmFwLm9uY2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgaWYgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYW5jZWwnKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBiZ0Jsb2NrLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgZmlsZXNQb3B1cC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgIHdhaXRpbmdQb3B1cC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgIHdhaXRpbmdQb3B1cENhbmNlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgIGZpbGVTYXZlUG9wdXAuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbn07XHJcblxyXG4vKiDQl9Cw0LPRgNGD0LfQutCwINGE0LDQudC70LAg0LjQtyDRgdC/0LjRgdC60LAgKi9cclxuZmlsZXNQb3B1cFdyYXAub25jbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlJykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZmlsZXNQb3B1cC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTsgLy8g0KHQutGA0YvQstCw0LXQvCDRgdC/0LjRgdC+0Log0YTQsNC50LvQvtCyXHJcbiAgICBQb3B1cHMud2FpdGluZygpOyAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQvtC60L3QviDQvtC20LjQtNCw0L3QuNGPXHJcblxyXG4gICAgZmV0Y2goYC9maWxlcy8ke3RhcmdldC50ZXh0Q29udGVudH1gKVxyXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICE9IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgcmVzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGpzb24gPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IG0gPSBqc29uLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIG4gPSBqc29uWzBdLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmIChuIDwgMyB8fCBuID4gMTcgfHwgbSA8IDMgfHwgbSA+IDE3KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc29sdXRpb24uaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIHdpbmRvdy52aWV3cyA9IG5ldyBTdGFjayhcclxuICAgICAgICAgICAgICAgIG5ldyBJbnB1dFZpZXcodHJ1ZSwgbSwgbiwgMiwganNvbikuaW50byhzb2x1dGlvbilcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgbmV3IEJhc2lzVmlldyhuIC0gMSk7XHJcblxyXG4gICAgICAgICAgICBQb3B1cHMuc2hvd01lc3NhZ2UoJ9CU0LDQvdC90YvQtSDRg9GB0L/QtdGI0L3QviDQt9Cw0LPRgNGD0LbQtdC90YshJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5kaXIoZXJyKTsgLy8g0J/QvtC00YDQvtCx0L3QvtC1INC+0L/QuNGB0LDQvdC40LUg0L7RiNC40LHQutC4XHJcbiAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICBQb3B1cHMuc2hvd01lc3NhZ2UoYCR7ZXJyLnN0YXR1c306ICR7ZXJyLnN0YXR1c1RleHR9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBQb3B1cHMuc2hvd01lc3NhZ2UoJ9CX0LDQs9GA0YPQttCw0LXQvNGL0Lkg0YTQsNC50Lsg0LjQvNC10LXRgiDQvdC10L/RgNCw0LLQuNC70YzQvdGL0Lkg0YTQvtGA0LzQsNGCIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG4vKiDQmtC90L7Qv9C60LAgXCLQodC+0YXRgNCw0L3QuNGC0YxcIiAqL1xyXG5maWxlU2F2ZVBvcHVwU2VuZC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgbmFtZSA9IGZpbGVTYXZlTmFtZS52YWx1ZS50cmltKCk7XHJcblxyXG4gICAgLy8g0KHQutGA0YvQstCw0LXQvCDQvtC60L3QviDRgdC+0YXRgNCw0L3QtdC90LjRj1xyXG4gICAgZmlsZVNhdmVQb3B1cC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INC+0LrQvdC+INC+0LbQuNC00LDQvdC40Y9cclxuICAgIFBvcHVwcy53YWl0aW5nKCk7XHJcblxyXG4gICAgaWYgKG5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgUG9wdXBzLnNob3dNZXNzYWdlKCfQktCy0LXQtNC10L3QviDQv9GD0YHRgtC+0LUg0LjQvNGPINGE0LDQudC70LAhJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoKCcvc2F2ZScsIHtcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgZmlsZTogd2luZG93LnZpZXdzWzBdLmdldERhdGEoKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgUG9wdXBzLnNob3dNZXNzYWdlKCfQpNCw0LnQuyDRg9GB0L/QtdGI0L3QviDRgdC+0YXRgNCw0L3RkdC9IScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgUG9wdXBzLnNob3dNZXNzYWdlKCfQndC1INGD0LTQsNC70L7RgdGMINGB0L7RhdGA0LDQvdC40YLRjCDRhNCw0LnQuyEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIFBvcHVwcy5zaG93TWVzc2FnZShlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3B1cHMge1xyXG5cclxuICAgIHN0YXRpYyB3YWl0aW5nKCkge1xyXG4gICAgICAgIC8vINCe0YLQvtCx0YDQsNC20LXQvdC40LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0L7QttC40LTQsNC90LjRjyDQt9Cw0LPRgNGD0LfQutC4XHJcbiAgICAgICAgYmdCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICAgICAgICB3YWl0aW5nUG9wdXBNZXNzYWdlLnRleHRDb250ZW50ID0gJ9Ce0LbQuNC00LDQvdC40LUg0L7RgtCy0LXRgtCwINC+0YIg0YHQtdGA0LLQtdGA0LAuLi4nO1xyXG4gICAgICAgIHdhaXRpbmdQb3B1cENhbmNlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgICB3YWl0aW5nUG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLRi9Cy0LXRgdGC0Lgg0YHQvtC+0LHRidC10L3QuNC1INGBINCy0L7Qt9C80L7QttC90L7RgdGC0YzRjiDQt9Cw0LrRgNGL0YLQuNGPIHBvcHVwXHJcbiAgICBzdGF0aWMgc2hvd01lc3NhZ2UobXNnKSB7XHJcbiAgICAgICAgYmdCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICAgICAgICB3YWl0aW5nUG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHdhaXRpbmdQb3B1cE1lc3NhZ2UudGV4dENvbnRlbnQgPSBtc2c7XHJcbiAgICAgICAgd2FpdGluZ1BvcHVwQ2FuY2VsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvcGVuRmlsZUxvYWRWaWV3KGZpbGVzKSB7XHJcbiAgICAgICAgLy8g0KHQutGA0YvRgtC40LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0L7QttC40LTQsNC90LjRjyDQt9Cw0LPRgNGD0LfQutC4XHJcbiAgICAgICAgd2FpdGluZ1BvcHVwLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgICAgIC8vINC+0YLQvtCx0YDQsNC20LXQvdC40LUg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8g0LrQsNGC0LDQu9C+0LPQsFxyXG4gICAgICAgIGZpbGVzUG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLRjCDQutCw0YLQsNC70L7Qs1xyXG4gICAgICAgIGZpbGVzUG9wdXBXcmFwLmlubmVySFRNTCA9IGZpbGVzTGlzdCh7IGZpbGVzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvcGVuRmlsZVNhdmVWaWV3KCkge1xyXG4gICAgICAgIGJnQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgZmlsZVNhdmVQb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL1BvcHVwcy9pbmRleC5qcyIsIi8vINCS0L3Rg9GC0YDQtdC90L3QuNC1INC30LDQstC40YHQuNC80L7RgdGC0LhcclxuaW1wb3J0IHZpZXcgZnJvbSAnLi9CYXNpc1ZpZXcucHVnJztcclxuaW1wb3J0ICcuL0Jhc2lzVmlldy5zY3NzJztcclxuXHJcbi8vINCS0L3QtdGI0L3QuNC1INC30LDQstC40YHQuNC80L7RgdGC0LhcclxuaW1wb3J0IFBvcHVwcyBmcm9tICcuLi9Qb3B1cHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaXNWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuKSB7XHJcbiAgICAgICAgdGhpcy5uID0gbjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXktYmFzaXMnKS5pbm5lckhUTUwgPSB2aWV3KHsgbiB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNWYWxpZEZvcm0obSkge1xyXG4gICAgICAgIGxldCBjaGVja0JveGVzID0gZG9jdW1lbnQuZm9ybXMuc2V0dGluZ3MsXHJcbiAgICAgICAgICAgIGFtb3VudENoZWNrZWQgPSAwLFxyXG4gICAgICAgICAgICBuID0gd2luZG93LnZpZXdzWzBdLm4gLSAxO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY2hlY2tCb3hlc1tgYiR7aSArIDF9YF0uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgYW1vdW50Q2hlY2tlZCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYW1vdW50Q2hlY2tlZCAhPT0gbSkge1xyXG4gICAgICAgICAgICBQb3B1cHMuc2hvd01lc3NhZ2UoYNCR0LDQt9C40YEg0LTQvtC70LbQtdC9INGB0L7QtNC10YDQttCw0YLRjCDRgNC+0LLQvdC+ICR7bX0g0L/QtdGA0LXQvNC10L3QvdGLZSjRi9GFKSwg0LAg0LLRiyDQstGL0LHRgNCw0LvQuCAke2Ftb3VudENoZWNrZWR9IWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL0Jhc2lzVmlldy9pbmRleC5qcyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWNrIGV4dGVuZHMgQXJyYXkge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGxldCBhcnJheSA9IEFycmF5LmZyb20oYXJncyk7XHJcbiAgICAgICAgYXJyYXkuX19wcm90b19fID0gU3RhY2sucHJvdG90eXBlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQstC10YDRiNC40L3RgyDRgdGC0LXQutCwXHJcbiAgICBnZXQgdG9wKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J7Rh9C40YnQsNC10YIg0YHRgtC10LpcclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnBvcCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQntGH0LjRidCw0LXRgiDRgdGC0LXQuiDQuCDQt9Cw0LzQtdC90Y/QtdGCINC10LPQviDRgdC+0LTQtdC20LjQvNC+0LUg0L3QsCBhcmdzXHJcbiAgICByZXBsYWNlKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBhcmdzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xvZ2ljL1N0YWNrLmpzIiwiLy8g0J/RgNC+0YXQvtC0INC/0L4g0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y4gSW5wdXRWaWV3XHJcbmV4cG9ydCBmdW5jdGlvbiBJbnB1dFZpZXcocm9vdCwgY2FsbGJhY2spIHtcclxuICAgIGxldCByb3dzID0gcm9vdC5jaGlsZHJlbjtcclxuICAgIGZvciAoXHJcbiAgICAgICAgbGV0IHJvd0luZGV4ID0gMCwgcm93c0xlbiA9IHJvd3MubGVuZ3RoO1xyXG4gICAgICAgIHJvd0luZGV4IDwgcm93c0xlbjtcclxuICAgICAgICByb3dJbmRleCsrXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgY29scyA9IHJvd3Nbcm93SW5kZXhdLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAoXHJcbiAgICAgICAgICAgIGxldCBjb2xJbmRleCA9IDAsIGNvbHNMZW4gPSBjb2xzLmxlbmd0aCwgZWxlbUluZGV4ID0gMDtcclxuICAgICAgICAgICAgZWxlbUluZGV4IDwgY29sc0xlbjtcclxuICAgICAgICAgICAgZWxlbUluZGV4KytcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgbGV0IGVsZW0gPSBjb2xzW2VsZW1JbmRleF07XHJcbiAgICAgICAgICAgIGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTFNwYW5FbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjYWxsYmFjayhlbGVtLCByb3dJbmRleCwgY29sSW5kZXgpO1xyXG4gICAgICAgICAgICBjb2xJbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8g0J/RgNC+0YXQvtC0INC/0L4g0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y4gU2ltcGxleFRhYmxlXHJcbmV4cG9ydCBmdW5jdGlvbiBTaW1wbGV4VGFibGUocm9vdCwgY2FsbGJhY2spIHtcclxuICAgIGxldCByb3dzID0gcm9vdC5yb3dzO1xyXG4gICAgZm9yIChsZXQgaSA9IDEsIGlMZW4gPSByb3dzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xyXG4gICAgICAgIGxldCBjZWxscyA9IHJvd3NbaV0uY2VsbHM7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDEsIGpMZW4gPSBjZWxscy5sZW5ndGg7IGogPCBqTGVuOyBqKyspIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soY2VsbHNbal0sIGkgLSAxLCBqIC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xvZ2ljL0RPTUZvci5qcyJdLCJzb3VyY2VSb290IjoiIn0=