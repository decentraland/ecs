
ifneq ($(CI), true)
LOCAL_ARG = --local --verbose --diagnostics
endif

test:
	node_modules/.bin/jest --detectOpenHandles --silent=false --verbose --colors --runInBand --coverage $(TESTARGS)

test-watch:
	node_modules/.bin/jest --detectOpenHandles --colors --runInBand --watch $(TESTARGS)

build:
	rm -rf dist/
	./node_modules/.bin/tsc -p tsconfig.json
	rm -rf node_modules/@microsoft/api-extractor/node_modules/typescript || true
	./node_modules/.bin/api-extractor run $(LOCAL_ARG) --typescript-compiler-folder ./node_modules/typescript

build-tools:
	rm -rf tools/dist/
	./node_modules/.bin/tsc -p tools/tsconfig.json
	chmod +x tools/dist/flatbuffer-generation/index.js

lint:
	./node_modules/.bin/eslint . --ext .ts

lint-fix:
	./node_modules/.bin/eslint . --ext .ts --fix

build-flatbuffers:
	echo "Building tools"
	make build-tools
	
	./tools/dist/flatbuffer-generation/index.js --component-path ${PWD}/src/components/legacy/flatbuffer

	echo "Running eslint"
	./node_modules/.bin/eslint ./src/components/legacy/flatbuffer/ --ext .ts --fix

.PHONY: build test
