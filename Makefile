
ifneq ($(CI), true)
LOCAL_ARG = --local --verbose --diagnostics
endif

test:
	node_modules/.bin/jest --detectOpenHandles --silent=false --verbose --colors --runInBand $(TESTARGS)

test-watch:
	node_modules/.bin/jest --detectOpenHandles --colors --runInBand --watch $(TESTARGS)

build:
	rm -rf dist/
	./node_modules/.bin/tsc -p tsconfig.json
	rm -rf node_modules/@microsoft/api-extractor/node_modules/typescript || true
	./node_modules/.bin/api-extractor run $(LOCAL_ARG) --typescript-compiler-folder ./node_modules/typescript

watch:
	./node_modules/.bin/tsc -p tsconfig.json -w

lint:
	./node_modules/.bin/eslint . --ext .ts

lint-fix:
	./node_modules/.bin/eslint . --ext .ts --fix

build-flatbuffers:
	find ./ -type f -name "*.fbs" -exec flatc --ts --csharp --gen-mutable "{}" \;

.PHONY: build test
