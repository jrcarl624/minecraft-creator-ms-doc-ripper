//this whole file is meant for compiling regexp to one regexp
interface RegExpCompilerOptions {
	flags?: string;
	lazy?;
	quantifier?: "any" | "optional" | "some";
}

const compileRegex = (
	regExp: (RegExp | string)[] | string | RegExp,
	options: RegExpCompilerOptions = {
		flags: "",
		lazy: false,
	}
) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}
	let suffix = "";
	let source;
	switch (options.quantifier) {
		case "any":
			suffix = "*";
		case "some":
			suffix = "+";
		case "optional":
			suffix = "?";
		default:
			if (options.lazy) {
				suffix += "?";
			}
	} //TODO: flag types
	//@ts-ignore
	for (let j of regExp) {
		try {
			switch (typeof j) {
				case "string":
					j = new RegExp(j);

				default:
					source += j.source;
			}
		} catch (error) {
			throw new Error( // @ts-ignore
				`${error.message} at the index of ${regExp.indexOf(j)}`
			);
		}
	}

	return new RegExp(`(?:${source})`);
};

const charClass = (string: string, exclude: boolean) => {
	if (exclude) return new RegExp(`[^${literalEscape(string).source}]`);
	return new RegExp(`[${literalEscape(string).source}]`);
};

const literalEscape = (str: string) => {
	let out = "";
	for (let i of str) {
		switch (i) {
			case "\\":
				out += "\\\\";
				break;
			case "^":
				out += "\\^";
				break;
			case "$":
				out += "\\$";
				break;
			case ".":
				out += "\\.";
				break;
			case "|":
				out += "\\|";
				break;
			case "?":
				out += "\\?";
				break;
			case "*":
				out += "\\*";
				break;
			case "+":
				out += "\\+";
				break;
			case "(":
				out += "\\(";
				break;
			case ")":
				out += "\\)";
				break;
			case "[":
				out += "\\[";
				break;
			case "]":
				out += "\\]";
				break;
			case "{":
				out += "\\{";
				break;
			case "}":
				out += "\\}";
				break;
			default:
				out += i;
		}
	}
	return new RegExp(`(?${out})`);
};

const match = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}
	return new RegExp(`(?:${compileRegex(regExp).source})`);
};

//TODO letter ranges and unicode ranges

const range = (
	regExp: (string | RegExp)[] | string | RegExp,
	start: number,
	end?: number
) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}
	switch (end) {
		case Infinity:
			return new RegExp(`(?:${compileRegex(regExp).source}){${start},}`);
		case undefined:
			return new RegExp(`(?:${compileRegex(regExp).source}){${start}}`);
		default:
			return new RegExp(
				`(?:${compileRegex(regExp).source}){${start},${end}}`
			);
	}
};

const capture = (
	regExp: (string | RegExp)[] | string | RegExp,
	name: string
) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}
	if (name) return new RegExp(`(?<${name}>${compileRegex(regExp).source})`);
	return new RegExp(`(${compileRegex(regExp).source})`);
};

const optional = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?:${compileRegex(regExp).source})?`);
};

const any = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?:${compileRegex(regExp).source})*`);
};
const some = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?:${compileRegex(regExp).source})+`);
};
const optionalLazy = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?:${compileRegex(regExp).source})??`);
};

const anyLazy = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?:${compileRegex(regExp).source})*?`);
};
const someLazy = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?:${compileRegex(regExp).source})+?`);
};

const lookAhead = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?=${compileRegex(regExp).source})`);
};

const negativeLookAhead = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?!${compileRegex(regExp).source})`);
};

const lookBehind = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?<=${compileRegex(regExp).source})`);
};

const negativeLookBehind = (regExp: (string | RegExp)[] | string | RegExp) => {
	if (regExp instanceof (RegExp || String)) {
		regExp = [regExp];
	}

	return new RegExp(`(?<!${compileRegex(regExp).source})`);
};

const matchEither = (regExp: (string | RegExp)[]) => {
	let out = "";

	for (let i of regExp) {
		try {
			switch (typeof i) {
				case "string":
					i = new RegExp(i);
				default:
					if (regExp.lastIndexOf(i) == regExp.length) {
						out += `(?:${i.source})`;
					} else {
						out += `(?:${i.source})|`;
					}
			}
		} catch (error) {
			throw new Error(
				`${error.message} at the index of ${regExp.indexOf(i)}`
			);
		}
	}
	return new RegExp(`(?:${out})`);
};

let preInteger = /(?:-?\s*?\d)/;

let preDecimal = /(?:-?\s*?\d(\.\d*?)(?:\^))/;

let preScientific = /(?:-?\s*?\d(\.\d*?)(?:e\d+))/;

let preNumber = matchEither([preInteger, preDecimal, preScientific]);

const unicodeRange = (start: string, end: string) => {
	let startUnicode = parseInt(start, 16);
};

const alphaNumeric: true | RegExp = /[^a-zA-Z0-9]/ || /[a-zA-Z0-9]/;
const alpha: true | RegExp = /[^a-zA-Z]/ || /[a-zA-Z]/;
const numeric: true | RegExp = /[^0-9]/ || /[0-9]/;
const alphaLower: true | RegExp = /[^a-z]/ || /[a-z]/;
const alphaUpper: true | RegExp = /[^A-Z]/ || /[A-Z]/;
const whiteSpace: true | RegExp = /\s/ || /\S/;
const word: true | RegExp = /\w/ || /\W/;
const digit: true | RegExp = /\d/ || /\D/;
const wordBoundary: true | RegExp = /\b/ || /\B/;
const acknowledge: true | RegExp = /\cF/ || /\cU/;

const tab: RegExp = /\t/;
const newline: RegExp = /\n/;
const carriageReturn: RegExp = /\r/;
const formFeed: RegExp = /\f/;
const verticalTab: RegExp = /\v/;
const backSpace: RegExp = /[\b]/;
const NULL = /\0/;
const escape = /[\e]/;
const lineBreak: RegExp = /(?:\r\n|\r|\n)/;

const headingStart: RegExp = /\cA/;
const textStart: RegExp = /\cB/;
const textEnd: RegExp = /\cC/;
const transmissionEnd: RegExp = /\cD/;
const enquiry: RegExp = /\cE/;
const bell: RegExp = /\cG/;
const shiftOut: RegExp = /\cN/;

const shiftIn: RegExp = /\cO/;
const dataLinkEsc: RegExp = /\cP/;
const deviceCtrl1: RegExp = /\cQ/;
const deviceCtrl2: RegExp = /\cR/;
const deviceCtrl3: RegExp = /\cS/;
const deviceCtrl4: RegExp = /\cT/;

const syncIdle: RegExp = /\cZ/;

const char = /./;
const transmissionBlkEnd: RegExp = /\c_/;

const cancel: RegExp = /\cX/;

const mediumEnd: RegExp = /\cY/;

const substitute: RegExp = /\cZ/;
const fileSeparator: RegExp = /\c\\/;
const groupSeparator: RegExp = /\c\]/;
const recordSeparator: RegExp = /\c\^/;
const unitSeparator: RegExp = /\c_/;
const DELETE: RegExp = /\c\?/;

//TODO: expressions in fractions
//TODO: expressions in exponents
//TODO: expressions in roots

let preVariable = /(?:\-?\s*?\w)/;

//TODO: find better way to do this
let bracket =
	/\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*(?:(\([^\(\)]*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\))+?[^\(\)]*)*?\)/;

//let fraction = compileRegex([integer, "\\", integer]);

let exponentVariable = compileRegex([
	preVariable,
	/(?:\^|√)/,
	matchEither([preVariable, preNumber, bracket]),
]);

let exponentNumber = compileRegex([
	matchEither([preNumber, bracket]),
	/(?:\^|√)/,
	matchEither([preNumber, bracket]),
]);
const start = /^/;
const end = /$/;
console.log(exponentNumber);

let fraction = match([exponentNumber, /\//, exponentNumber]);

let exponentFraction = compileRegex([exponentVariable, /(?:\^|√)/, fraction]);

let exponentFraction2 = compileRegex([exponentNumber, /(?:\^|√)/, fraction]);

let preNumber2 = matchEither([exponentNumber, fraction]);

// /|(?<image>(^:::image(?:[\s\S]*?)image-end:::$)|(^:::image.*?:::$))|(?:^[\s]*?> -   (?<checklist>.*))|(?:^[\s]*?> -   (?<selector>\[.*?)$)|(?<table>^[\s]*[^!"#$%&'()*+,\-./:;<=?@[\]^_`{}~](?:(?:\r?\n){2}|^[^!"#$%&'()*+,\-./:;<=?@[\]^_`{}~]{4})(?:[^\r\n]*\|[^\r\n]*(?:\r?\n)?)+(?:(?:\r?\n){2}|$))|(?:^[ ]*?^>\s+\[!(?<alert>NOTE|TIP|IMPORTANT|CAUTION|WARNING)\].*?)|(?:^[ ]*?(?:(?:\d+?\. )|(?:[-*] ))(?<list>.*?)$)|(?<link>^\[.+?\]\(?:.+?\)\n$)|(?<row>^:::row(?:[\s\S]*?)row-end:::$)|(?<column>^:::column(?:[\S\s]*?)column-end:::$)|(?<extension>^[ ]?[\[!.*?]$)|(?:^[ ]*> (?<quote>.*?)$)|(?<other>^.*?$)/gm;
//(?<code>)
matchEither([
	compileRegex([/^<!--/, capture(/[\s\S]*/, "comment"), /-->$/]),
	capture(/^#{1,6}\s) (?:.*?)\s$/, "heading"),
	capture(
		[
			matchEither([
				compileRegex([
					start,
					match([
						/[\s]*?[^!"#$%&'()*+,\-./:;<=>?@[\]^_{}~]:::code)[\s\S]*:::/,
					]),
					end,
				]),
				/(?:^(?:[\s]*?[^!"#$%&'()*+,\-.>/:;<=?@[\]^_{}~]```)(?:[\S\s]*?)([^>]```)$)/,
				/(?:^(?:[\s]*?[^!"#$%&'()*+,\-./:;<=?@[\]^_{}~]> ```)(?:[\S\s]*?)(?:> ```)$)/,
			]),
		],
		"code"
	),
]);
