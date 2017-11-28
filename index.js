module.exports = function(options = {}) {
    const dict = options.language || {};
    const re = /__\(\s*['"`](.+)['"`]\s*\)/g;
    const isObject = function(value) {
      return Object.prototype.toString.call(value) === '[object Object]';
    }

    function replacer(match, p1) {
        let val;

        function scan(obj) {
          let k;

          if (obj.hasOwnProperty(p1)) {
            val = obj[p1];
          } else if (isObject(obj) && !obj.hasOwnProperty(p1)) {
            for (k in obj) {
              if (obj.hasOwnProperty(k) && isObject(obj[k])) {
                scan(obj[k]);
              }
            }
          } else {
            val = p1;
            console.log('Missing translation for:', p1)
          }

          return '"' + val + '"';
        }

        return scan(dict);
    }

    return {
        name: 'i18n',
        transform: function (source, id) {
          return source.replace(re, replacer.bind(this));
        },
    };
}
