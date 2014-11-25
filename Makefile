TESTS = $(shell ls -S `find test examples/helloworld/test -type f -name "*.test.js" -print`)
version = `cat package.json | grep version | awk -F'"' '{print $$4}'`
TIMEOUT = 10000
MOCHA_OPTS =
REPORTER = spec

install:
	@npm install

jshint: install
	@./node_modules/.bin/jshint ./lib

test: install jshint
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require co-mocha \
		--require should-http \
		$(MOCHA_OPTS) \
		$(TESTS)

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

totoro: install jshint
	@./node_modules/.bin/totoro --runner test/lib/util.test.js \
		--root ./ \
		-b 'linux/node/0.11,windows7/node/0.11,windowsXP/node/0.11'

autod: install
	@./node_modules/.bin/autod -w -e examples --prefix "~"
	@$(MAKE) install

contributors: install
	@./node_modules/.bin/ali-contributors

.PHONY: test

run:
	@nohup mongod >mongo.log & 
	@hotnode bin/www
