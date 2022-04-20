
ifneq ($(CI), true)
LOCAL_ARG = --local --verbose --diagnostics
endif

export PATH := flatc2:$(PATH)

ifeq ($(UNAME),Darwin)
FLATC_ZIP = Mac.flatc.binary.zip
else
FLATC_ZIP = Linux.flatc.binary.clang++-9.zip
endif

test:
	node_modules/.bin/jest --detectOpenHandles --silent=false --verbose --colors --runInBand --coverage $(TESTARGS)
	
test-watch:
	node_modules/.bin/jest --detectOpenHandles --colors --runInBand --watch $(TESTARGS)

install:
	npm install
	make install_flatbuffer_compiler

build:
	rm -rf dist/
	./node_modules/.bin/tsc -p tsconfig.json
	rm -rf node_modules/@microsoft/api-extractor/node_modules/typescript || true
	./node_modules/.bin/api-extractor run $(LOCAL_ARG) --typescript-compiler-folder ./node_modules/typescript

	@# Build tools
	rm -rf tools/dist/
	./node_modules/.bin/tsc -p tools/tsconfig.json
	chmod +x tools/dist/flatbuffer-generation/index.js

lint:
	./node_modules/.bin/eslint . --ext .ts

lint-fix:
	./node_modules/.bin/eslint . --ext .ts --fix

install_flatbuffer_compiler:
	curl -OL https://github.com/google/flatbuffers/releases/download/v2.0.0/$(FLATC_ZIP)
	unzip -o $(FLATC_ZIP) -d node_modules/.bin
	rm $(FLATC_ZIP)
	chmod +x node_modules/.bin/flatc

build-flatbuffers:
	./tools/dist/flatbuffer-generation/index.js --component-path ${PWD}/src/components/legacy/flatbuffer
	./node_modules/.bin/eslint ./src/components/legacy/flatbuffer --ext .ts --fix

test-build-flatbuffers:
	./tools/dist/flatbuffer-generation/index.js test --component-path ${PWD}/src/components/legacy/flatbuffer

.PHONY: build test
