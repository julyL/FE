var Url = function(url) {
  if (!(this instanceof Url)) {
    return new Url(url);
  }
  this.url = url || window.location.href;
};
Url.prototype = {
  parse() {
    var parser = document.createElement("a");
    // http://example.com:3000/pathname/?search=test#hash
    parser.href = this.url;
    return {
      protocol: parser.protocol, // => "http:"
      hostname: parser.hostname, // => "example.com"
      port: parser.port, // => "3000"
      pathname: parser.pathname, // => "/pathname/"
      search: parser.search, // => "?search=test"
      hash: parser.hash, // => "#hash"
      host: parser.host, // => "example.com:3000"
      href: parser.href, // => "example.com:3000"
      origin: parser.origin // => "example.com:3000"
    };
  },
  get(key) {
    var params = this.parse()
        .search.slice(1)
        .split("&"),
      temp;
    for (var i = 0, len = params.length; i < len; i++) {
      temp = params[i].split("=");
      if (temp[0] == key) {
        return decodeURIComponent(temp[1] || "");
      }
    }
  },
  set(key, val) {
    var url = this.parse(),
      params = url.search.slice(1).split("&"),
      temp,
      index;
    for (var i = 0, len = params.length; i < len; i++) {
      temp = params[i].split("=");
      if (temp[0] == key) {
        index = i;
        break;
      }
    }
    if (index) {
      params[index] = key + "=" + decodeURIComponent(val);
      this.url = url.origin + url.pathname + "?" + params.join("&");
    }
    return this.url;
  }
};
export default Url;
