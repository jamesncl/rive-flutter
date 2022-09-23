RenderFont["onRuntimeInitialized"] = function () {
  var HEAPU8 = RenderFont["HEAPU8"];
  var HEAPU32 = RenderFont["HEAPU32"];
  var HEAPF32 = RenderFont["HEAPF32"];
  var nativeMakeGlyphPath = RenderFont["makeGlyphPath"];
  var move = 0;
  var line = 1;
  var quad = 2;
  var cubic = 4;
  var close = 5;
  RenderFont["makeGlyphPath"] = function (font, glyphId) {
    var glyph = nativeMakeGlyphPath(font, glyphId);
    var verbCount = glyph[3];
    var ptsPtr = glyph[1];
    var verbPtr = glyph[2];
    var verbs = HEAPU8["subarray"](verbPtr, verbPtr + verbCount);

    let pointCount = 0;
    for (var verb of verbs) {
      switch (verb) {
        case move:
        case line:
          pointCount++;
          break;
        case quad:
          pointCount += 2;
          break;
        case cubic:
          pointCount += 3;
          break;
        default:
          break;
      }
    }

    const ptsStart = ptsPtr / 4;
    return {
      "rawPath": glyph[0],
      "verbs": verbs,
      "points": HEAPF32["subarray"](ptsStart, ptsStart + pointCount * 2),
    };
  };

  var nativeShapeText = RenderFont["shapeText"];
  RenderFont["shapeText"] = function (codeUnits, runsList) {
    var shapeResult = nativeShapeText(codeUnits, runsList);
    return {
      "rawResult": shapeResult,
      "results": HEAPU8["subarray"](shapeResult),
    };
  };

  var nativeBreakLines = RenderFont["breakLines"];
  RenderFont["breakLines"] = function (runs, width, align) {
    var breakResult = nativeBreakLines(runs, width, align);
    return {
      "rawResult": breakResult[0],
      "lines": HEAPU8["subarray"](breakResult[1]),
      "lineCount": breakResult[2],
    };
  };
};
