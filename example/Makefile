TSC := ../node_modules/.bin/tsc 
TSCFLAGS := --moduleResolution nodenext --target es6 --module es6 \
	--jsx react --esModuleInterop --lib "es2015,dom" --noEmitOnError

dist : index.js index.html
	mkdir -p dist
	cp index.html index.js -t dist/

index.js : index.tsx
	$(TSC) $(TSCFLAGS) index.tsx

clean : 
	rm *.js

clean_dist : 
	rm -rf dist/

clean_modules : 
	rm -rf node_modules

