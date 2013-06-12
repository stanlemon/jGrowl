(function() {
  var SourceMap, eqJson, vlqEncodedValues;

  if (global.testingBrowser) {
    return;
  }

  SourceMap = require('../src/sourcemap');

  vlqEncodedValues = [[1, "C"], [-1, "D"], [2, "E"], [-2, "F"], [0, "A"], [16, "gB"], [948, "o7B"]];

  test("encodeVlq tests", function() {
    var pair, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = vlqEncodedValues.length; _i < _len; _i++) {
      pair = vlqEncodedValues[_i];
      _results.push(eq((new SourceMap).encodeVlq(pair[0]), pair[1]));
    }
    return _results;
  });

  eqJson = function(a, b) {
    return eq(JSON.stringify(JSON.parse(a)), JSON.stringify(JSON.parse(b)));
  };

  test("SourceMap tests", function() {
    var map, testWithFilenames;
    map = new SourceMap;
    map.add([0, 0], [0, 0]);
    map.add([1, 5], [2, 4]);
    map.add([1, 6], [2, 7]);
    map.add([1, 9], [2, 8]);
    map.add([3, 0], [3, 4]);
    testWithFilenames = map.generate({
      sourceRoot: "",
      sourceFiles: ["source.coffee"],
      generatedFile: "source.js"
    });
    eqJson(testWithFilenames, '{"version":3,"file":"source.js","sourceRoot":"","sources":["source.coffee"],"names":[],"mappings":"AAAA;;IACK,GAAC,CAAG;IAET"}');
    eqJson(map.generate(), '{"version":3,"file":"","sourceRoot":"","sources":[""],"names":[],"mappings":"AAAA;;IACK,GAAC,CAAG;IAET"}');
    arrayEq(map.sourceLocation([2, 8]), [1, 9]);
    return arrayEq(map.sourceLocation([2, 10]), [1, 9]);
  });

}).call(this);
