
ifneq ($(CI), true)
LOCAL_ARG = --local --verbose --diagnostics
endif
export PATH := flatc2:$(PATH)

PROTOBUF_VERSION = 3.20.1
ifeq ($(UNAME),Darwin)
PROTOBUF_ZIP = protoc-$(PROTOBUF_VERSION)-osx-x86_64.zip
else
PROTOBUF_ZIP = protoc-$(PROTOBUF_VERSION)-linux-x86_64.zip
endif

install: 
	npm install
	make install_protobuffer_compiler

test:
	node_modules/.bin/jest --detectOpenHandles --silent=false --verbose --colors --runInBand --testPathIgnorePatterns test/performance.spec.ts $(TESTARGS)

benchmark:
	node_modules/.bin/jest --detectOpenHandles --silent=false --verbose --colors --runInBand test/performance.spec.ts

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

build-components:
	./tools/dist/protocol-buffer-generation/index.js --component-path ${PWD}/src/components

test-components:
	./tools/dist/protocol-buffer-generation/index.js test --component-path ${PWD}/src/components

watch:
	./node_modules/.bin/tsc -p tsconfig.json -w

lint:
	./node_modules/.bin/eslint . --ext .ts

lint-fix:
	./node_modules/.bin/eslint . --ext .ts --fix

install_protobuffer_compiler:
	curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v$(PROTOBUF_VERSION)/$(PROTOBUF_ZIP)
	unzip -o $(PROTOBUF_ZIP) -d node_modules/.bin/protobuf
	rm $(PROTOBUF_ZIP)
	chmod +x ./node_modules/.bin/protobuf/bin/protoc

build_protobuffer:
	./node_modules/.bin/protobuf/bin/protoc \
		--plugin=./node_modules/.bin/protoc-gen-ts_proto \
		--proto_path=src/components \
		--ts_proto_opt=esModuleInterop=true  \
		--ts_proto_out=src/components \
		src/components/legacy/BoxShape/BoxShape.proto


.PHONY: build test
