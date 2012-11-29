var fs = require('fs');
var uglifyjs = require('uglify-js');
desc('Combine and compress Road Inventory source files');
task('build', function(){
	concat(["array-polyfill.js", "esri2geo.js", "leaflet-hash.js", "leaflet.ajax.js", "script.js","click.js"],"script-src.js")
	});
task('click', ["build"], function(){
	concat(["script-src.js","click.js"],"click.min.js")
	});
task('min', ["build"], function() {
  return fs.readFile('./script-src.js', 'utf8', function(e, j) {
    var ast;
    if (!e) {
      ast = uglifyjs.parse(j);
      ast.figure_out_scope();
      ast.compute_char_frequency();
      ast.mangle_names();
      fs.writeFile('./script.min.js', ast.print_to_string());
      return console.log("minified");
    }
  });
});
task('default', ['build']);

function concat(files,outName) {
	var out = files.map(function(v){return fs.readFileSync("./"+v,"utf8");});
	fs.writeFile("./"+outName,out.join(""));
}