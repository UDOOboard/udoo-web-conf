all:
	npm install
	chmod -R 755 bin/
	chmod -R 755 shscripts/

install:
	mkdir -p $(DESTDIR)/opt/udoo-web-conf
	mkdir -p $(DESTDIR)/etc/init/
	mkdir -p $(DESTDIR)/boot
	
	cp -r arduino_examples bin public routes shscripts views node_modules app.js karma.conf.js package.json $(DESTDIR)/opt/udoo-web-conf/
	install -m 744 udoo-docs.conf $(DESTDIR)/etc/init/udoo-docs.conf
	install -m 744 quickstart.html $(DESTDIR)/boot/quickstart.html
