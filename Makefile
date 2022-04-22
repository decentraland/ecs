
ifneq ($(CI), true)
LOCAL_ARG = --local --verbose --diagnostics
endif

export PATH := flatc2:$(PATH)

  
PROTOBUF_VERSION = 3.19.1
ifeq ($(UNAME),Darwin)
FLATC_ZIP = Mac.flatc.binary.zip
PROTOBUF_ZIP = protoc-$(PROTOBUF_VERSION)-osx-x86_64.zip
else
FLATC_ZIP = Linux.flatc.binary.clang++-9.zip
PROTOBUF_ZIP = protoc-$(PROTOBUF_VERSION)-linux-x86_64.zip
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

build-tools:
	rm -rf tools/dist/
	./node_modules/.bin/tsc -p tools/tsconfig.json
	chmod +x tools/dist/flatbuffer-generation/index.js

watch:
	./node_modules/.bin/tsc -p tsconfig.json -w

lint:
	./node_modules/.bin/eslint . --ext .ts

lint-fix:
	./node_modules/.bin/eslint . --ext .ts --fix

install_flatbuffer_compiler:
	curl -OL https://github.com/google/flatbuffers/releases/download/v2.0.0/$(FLATC_ZIP)
	unzip -o $(FLATC_ZIP) -d node_modules/.bin
	rm $(FLATC_ZIP)
	chmod +x node_modules/.bin/flatc

install_protobuffer_compiler:
	curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v$(PROTOBUF_VERSION)/$(PROTOBUF_ZIP)
	unzip -o $(PROTOBUF_ZIP) -d node_modules/.bin
	rm $(PROTOBUF_ZIP)
	chmod +x node_modules/.bin/protoc

build-flatbuffers:
	./tools/dist/flatbuffer-generation/index.js --component-path ${PWD}/src/components/legacy/flatbuffer

test-build-flatbuffers:
	./tools/dist/flatbuffer-generation/index.js test --component-path ${PWD}/src/components/legacy/flatbuffer

.PHONY: build test
