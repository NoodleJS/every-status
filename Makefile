TESTS = $(shell ls -S `find test examples/helloworld/test -type f -name "*.test.js" -print`)
version = `cat package.json | grep version | awk -F'"' '{print $$4}'`
TIMEOUT = 10000
MOCHA_OPTS =
REPORTER = spec

install:
	@npm install

test:
	@./node_modules/.bin/mocha test/test.js

test-cov coverage cov: install jshint
	@NODE_ENV=test node --harmony \
		node_modules/.bin/istanbul cover -x 'examples/**' ./node_modules/.bin/_mocha \
		-- -u exports \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require co-mocha \
		--require should-http \
		$(MOCHA_OPTS) \
		$(TESTS)
	@-./node_modules/.bin/alicov coverage

.PHONY: test

run:
	@nohup mongod >mongo.log & 
	@hotnode bin/www
