build:
	npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --minify
	rm ./src/*.gz ./src/*.br || true
	gzip -9 -f -k ./src/index.html
	gzip -9 -f -k ./src/main.js
	gzip -9 -f -k ./src/favicon.ico
	gzip -9 -f -k ./src/output.css
	gzip -9 -f -k ./src/images/utm-builder-og.png
	brotli -9 -f -k ./src/index.html
	brotli -9 -f -k ./src/main.js
	brotli -9 -f -k ./src/favicon.ico
	brotli -9 -f -k ./src/output.css
	brotli -9 -f -k ./src/images/utm-builder-og.png
	cd src && zip -vr ../upload.zip * -x "*.DS_Store"

chrome:
	npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --minify
	rm ./src/*.gz ./src/*.br || true
	cd src && zip -vr ../chrome-extension.zip * -x "*.DS_Store"
