const re = /__\(\s*(\\?)(['"`])(.+?)\\?\2\s*\)/g;

const isObject = function(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
const isEscaped = x => x === '\\'

const wrapEscape = x => `\\'${x}\\'`

const escape = x => x
  .replace(/'/g, '\u2019')
  .replace(/"/g,  '\u201D')

module.exports = function(options = {}) {
    const dict = options.language || {};
    const shouldEscape = Boolean(options.escape)

    function replacer(match, p0, p00, p1) {
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

          if (typeof val === 'function') {
            return val + '';
          }

          if (shouldEscape && isEscaped(p0)) {
            return typeof val === 'undefined'
              ? wrapEscape(escape(''))
              : wrapEscape(escape(val))
          }

          return JSON.stringify(val);
        }

        return scan(dict);
    }

    return {
        name: 'i18n',
        renderChunk: function(code) {
          return code.replace(re, replacer.bind(this))
        }
    };
}
