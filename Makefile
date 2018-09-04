TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =

jshint:
	@./node_modules/.bin/jshint .

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-all: jshint test

autod:
	@./node_modules/.bin/autod -w
	@$(MAKE) install

contributors:
	@./node_modules/.bin/contributors -f plain -o AUTHORS

.PHONY: test
