for (const templateType of ["preact_full", "preact_light", "react_full", "react_light"]) {
	let file = await Bun.file(`../docs/${templateType}/index.html`).text();
	file = file.replace(
		`<meta name="viewport" content="width=device-width, initial-scale=1" />`,
		`<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script type="importmap">
			{
				"imports": {
					"../tr/": "./tr/"
				}
			}
		</script>`
	);
	file = file.replace(
		`<div id="root"></div>`,
		`<div id="root"></div>
		<script>
			if (!window.location.href.endsWith("/")) window.location.href = window.location.href + "/";
		</script>`
	);
	await Bun.write(`../docs/${templateType}/index.html`, file);
}
