TSC := ../node_modules/.bin/tsc 
TSCFLAGS := --moduleResolution nodenext --target es6 --module es6 \
	--jsx react --esModuleInterop --lib "es2015,dom" --noEmitOnError \
	--outDir dist/

dist : dist/index.js dist/arctic-tree.js index.html
	# Index
	cp index.html -t dist/
	# AutoSizer.js, List.js
	cd ../react-virtualized-custom; npm install
	cp ../react-virtualized-custom/dist/AutoSizer.js \
	../react-virtualized-custom/dist/List.js -t dist/

dist/arctic-tree.js : ../lib/index.js
	cp ../lib/index.js dist/arctic-tree.js

dist/index.js : index.tsx
	$(TSC) $(TSCFLAGS) index.tsx

clean_dist : 
	rm -rf dist/

clean_modules : 
	rm -rf node_modules

