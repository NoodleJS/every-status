APPNAME = $(shell cat package.json | grep name | awk -F'"' '{print $$4}')

name:
	@echo $(APPNAME)

run: 
	@nohup mongod > ./logs/mongod.log & node app

