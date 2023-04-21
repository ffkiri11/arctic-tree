dist/index.js : index.js dist/List.js dist/AutoSizer.js
	cp index.js dist/

src/List/List.js src/AutoSizer/AutoSizer.js : 
	node_modules/.bin/flow-remove-types react-virtualized/source --out-dir src/

dist/List.js : src/List/List.js
	node_modules/.bin/esbuild --packages=external --platform=browser --loader:.js=jsx --format=esm --bundle src/List/List.js --outfile=dist/List.js

dist/AutoSizer.js : src/AutoSizer/AutoSizer.js
	node_modules/.bin/esbuild --packages=external --platform=browser --loader:.js=jsx --format=esm --bundle src/AutoSizer/AutoSizer.js --outfile=dist/AutoSizer.js

