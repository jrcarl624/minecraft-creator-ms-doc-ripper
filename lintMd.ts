import markdownlint from "markdownlint";
import fs from "fs";

import * as rules from "./markdownlint-custom-rules/rules.js";

markdownlint(
	{

		files: "./md/test.regexp",
		config: {
			default: true,
			MD003: { style: "atx_closed" },
            MD007: { indent: 4 },
            MD028: false,
			"no-hard-tabs": true,
			whitespace: false,
		},

		customRules: [...rules],
		/**
		 * True to ignore HTML directives.
		 */
		noInlineConfig: true,
		/**
		 * Results object version.
		 */
		resultVersion: 1,
		/**
		 * Additional plugins.
		 */
		markdownItPlugins: [],
	},
	(err, result) => {
		if (err) {
			console.error(err);
		}
		fs.writeFileSync("./md/test.json", JSON.stringify(result));
	}
);
