build:
	npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css
	rm ./src/*.gz ./src/*.br
	gzip -9 -f -k ./src/index.html
	gzip -9 -f -k ./src/favicon.ico
	gzip -9 -f -k ./src/output.css
	gzip -9 -f -k ./src/images/utm-builder-og.png
	brotli -9 -f -k ./src/index.html
	brotli -9 -f -k ./src/favicon.ico
	brotli -9 -f -k ./src/output.css
	brotli -9 -f -k ./src/images/utm-builder-og.png
	cd src && zip -jvr ../upload.zip * -x "*.DS_Store"
