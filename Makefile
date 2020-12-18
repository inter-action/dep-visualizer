PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash



MOCHA ?= ./node_modules/.bin/mocha
TSC ?= ./node_modules/.bin/tsc


.PHONY: test clean docs reset 


test:
	$(MOCHA)

build:
	$(TSC)