import * as ts from "typescript";

function compile(fileNames: string[], options: ts.CompilerOptions): void {
	let program = ts.createProgram(fileNames, options);
	let emitResult = program.emit();

	let allDiagnostics = ts
		.getPreEmitDiagnostics(program)
		.concat(emitResult.diagnostics);

	allDiagnostics.forEach((diagnostic) => {
		if (diagnostic.file) {
			let { line, character } = ts.getLineAndCharacterOfPosition(
				diagnostic.file,
				diagnostic.start!
			);
			let message = ts.flattenDiagnosticMessageText(
				diagnostic.messageText,
				"\n"
			);
			console.log(
				`${diagnostic.file.fileName} (${line + 1},${
					character + 1
				}): ${message}`
			);
		} else {
			console.log(
				ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
			);
		}
	});

	let exitCode = emitResult.emitSkipped ? 1 : 0;
	console.log(`Process exiting with code '${exitCode}'.`);
	process.exit(exitCode);
}

compile(process.argv.slice(2), {
	target: ts.ScriptTarget.ES2016,
	module: ts.ModuleKind.CommonJS,
	allowJs: true,
	outDir: "./dist/",
	removeComments: true,
	allowSyntheticDefaultImports: true,
	esModuleInterop: true,
	preserveSymlinks: true,
	forceConsistentCasingInFileNames: true,
	strict: false,
	allowUnusedLabels: true,
	allowUnreachableCode: true,
	skipDefaultLibCheck: true,
	skipLibCheck: true,
});

import * as browserify from "browserify";
import tsify from "tsify";

browserify()
	.add("main.ts")
	.plugin(tsify, {
		target: ts.ScriptTarget.ES2016,
		module: ts.ModuleKind.CommonJS,
		allowJs: true,
		removeComments: true,
		allowSyntheticDefaultImports: true,
		esModuleInterop: true,
		preserveSymlinks: true,
		forceConsistentCasingInFileNames: true,
		strict: false,
		allowUnusedLabels: true,
		allowUnreachableCode: true,
		skipDefaultLibCheck: true,
		skipLibCheck: true,
 	})
	.bundle()
	.on("error", function (error) {
		console.error(error.toString());
	})
	.pipe(process.stdout);
