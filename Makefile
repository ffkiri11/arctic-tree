TSC := node_modules/.bin/tsc 
TSCFLAGS := --moduleResolution nodenext --target es6 --module es6 \
        --jsx react --esModuleInterop --lib "es2015,dom" --noEmitOnError \
	--declaration 

lib/index.js : index.tsx 
	$(TSC) $(TSCFLAGS) --outDir lib/ index.tsx

clean : 
	rm -rf lib/ 

