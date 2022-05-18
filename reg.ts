import fs from "fs";
import RE2 from "re2";
import matter from "gray-matter";
import path from "path";
import * as docs from "./markdownlint-custom-rules/common.js";
import * as json from "jsonc-parser";
import forEachPropertyDeep from "for-each-property";
import * as browserify from "browserify";
import prettier from "prettier";
var errors = [];
import { match, capture, matchEither, compileRegex } from "./regex";

//IDEA: so if a quote block is there ie starts with > it gets added to a array until there is a new line and then it gets added to the string then parsed recursively

console.log();

const listFiles = (
	dir: fs.PathLike,
	files?: path.ParsedPath[] | undefined
): path.ParsedPath[] => {
	files = files || [];
	var funcList = fs.readdirSync(dir);
	for (var i in funcList) {
		var name = dir + "/" + funcList[i];
		if (fs.statSync(name).isDirectory()) {
			listFiles(name, files);
		} else {
			files.push(path.parse(name));
		}
	}
	return files;
};
/**
 * Returns the contents of the file between the two lines specified.
 */
const stringBetweenLines = (
	file: fs.PathLike,
	start: number,
	end: number
): string => {
	return fs
		.readFileSync(file, "utf8")
		.split("\n")
		.slice(start - 1, end - 1)
		.join("\n");
};

const stringToCamelCase = (string) => {
	return string.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
		if (+match === 0) return "";
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
};

const parseMd = (markdown: fs.PathLike) => {
	//@ts-ignore
	let filePath = path.parse(markdown);

	//TODO: support the rest of markdown syntax
	const regex =
		/(?:^<!--(?<comment>[\s\S]*?)-->$)|(?<heading>(?:^#{1,6}\s)(?:.*?)\s$)|(?<code>(^(?:[\s]*?[^!"#$%&'()*+,\-./:;<=>?@[\]^_{}~]:::code)[\s\S]*:::$)|(?:^(?:[\s]*?[^!"#$%&'()*+,\-.>/:;<=?@[\]^_{}~]```)(?:[\S\s]*?)([^>]```)$)|(?:^(?:[\s]*?[^!"#$%&'()*+,\-./:;<=?@[\]^_{}~]> ```)(?:[\S\s]*?)(?:> ```)$))|(?<image>(^:::image(?:[\s\S]*?)image-end:::$)|(^:::image.*?:::$))|(?:^[\s]*?> -   (?<checklist>.*))|(?:^[\s]*?> -   (?<selector>\[.*?)$)|(?<table>^[\s]*[^!"#$%&'()*+,\-./:;<=?@[\]^_`{}~](?:(?:\r?\n){2}|^[^!"#$%&'()*+,\-./:;<=?@[\]^_`{}~]{4})(?:[^\r\n]*\|[^\r\n]*(?:\r?\n)?)+(?:(?:\r?\n){2}|$))|(?:^[ ]*?^>\s+\[!(?<alert>NOTE|TIP|IMPORTANT|CAUTION|WARNING)\].*?)|(?:^[ ]*?(?:(?:\d+?\. )|(?:[-*] ))(?<list>.*?)$)|(?<link>^\[.+?\]\(?:.+?\)\n$)|(?<row>^:::row(?:[\s\S]*?)row-end:::$)|(?<column>^:::column(?:[\S\s]*?)column-end:::$)|(?<extension>^[ ]?[\[!.*?]$)|(?:^[ ]*> (?<quote>.*?)$)|(?<other>^.*?$)/gm;

	const file: string = prettier.format(
		fs.readFileSync(filePath.dir + "/" + filePath.base, "utf8"),
		{
			proseWrap: "preserve",
			parser: "markdown",
		}
	);
	if (filePath.base == "BehaviorPack.md") {
		fs.writeFileSync("./md/hmmTurtle.md", file);
	}

	var groupsArray = [];
	let yamlHeader = matter(file);
	groupsArray.push({ type: "yamlHeader", data: yamlHeader.data });

	for (let i of yamlHeader.content.matchAll(regex)) {
		if (i.groups.other) {
			let other = i.groups.other;
			if (other.trim() === "") {
				continue;
			}
		}

		if (i.groups.quote) {
			let quote = i.groups.quote.trim();
			groupsArray.push({
				type: "quote",
				data: quote,
			});
			console.log(quote);
			//console.log(i.groups);
			continue;
		}

		if (i.groups.heading) {
			let heading = i.groups.heading.trim();
			groupsArray.push({
				type: "heading",
				level: heading.match(/^#{1,6}/)[0].length,
				data: heading.replace(/^#{1,6}/, ""),
			});
			continue;
		}
		if (i.groups.extension) {
			let extension = i.groups.extension.trim();
			groupsArray.push({
				type: "extension",
				data: extension,
			});
			continue;
		}
		if (i.groups.other) {
			let other = i.groups.other.trim();
			groupsArray.push({
				type: "other",
				data: other,
			});
			continue;
		}

		if (i.groups.link) {
			//TODO: link text and link split
			let link = i.groups.link.trim();
			groupsArray.push({
				type: "link",
				data: link,
			});
			continue;
		}
		if (i.groups.row) {
			//TODO: get contents of row
			let row = i.groups.row.trim();
			groupsArray.push({
				type: "row",
				data: row,
			});
			continue;
		}
		if (i.groups.column) {
			//TODO: get contents of column
			let column = i.groups.column.trim();
			groupsArray.push({
				type: "column",
				data: column,
			});
			continue;
		}

		if (i.groups.comment) {
			let comment = i.groups.comment.trim();
			groupsArray.push({
				type: "comment",
				data: comment,
			});
			continue;
		}
		if (i.groups.image) {
			//TODO: reg markdown support for images
			let image = i.groups.image.trim();
			groupsArray.push({
				type: "image",
				data: image,
			});
			continue;
		}

		if (i.groups.list) {
			//console.log(i.groups.list);

			var list = i.groups.list.trim().replace(/^[ ]*?/, "");
			//console.log(i.groups);

			if (!groupsArray[0]) {
				groupsArray.push({ type: "list", data: [list] });
				continue;
			}

			if (groupsArray[groupsArray.length - 1].type === "list") {
				groupsArray[groupsArray.length - 1].data.push(list);
			} else {
				groupsArray.push({ type: "list", data: [list] });
			}
			continue;
		}

		if (i.groups.checklist) {
			var list = i.groups.checklist.trim().replace(/^[ ]?/g, "");
			//console.log(i.groups);

			if (!groupsArray[0]) {
				groupsArray.push({ type: "checklist", data: [list] });
				continue;
			}

			if (groupsArray[groupsArray.length - 1].type === "checklist") {
				groupsArray[groupsArray.length - 1].data.push(list);
			} else {
				groupsArray.push({ type: "checklist", data: [list] });
			}
			continue;
		}

		if (i.groups.alert) {
			var alert = i.groups.alert.trim();

			//console.log(i.groups);

			groupsArray.push({ type: "alert", tag: alert, data: "" });
			continue;
		}

		if (i.groups.selector) {
			let selector = i.groups.selector || i.groups.table;
			var list = selector.trim().replace(/^[ ]?/g, "");

			//console.log(i.groups);
			if (!groupsArray[0]) {
				groupsArray.push({ type: "selector", data: [list] });
				continue;
			}

			if (groupsArray[groupsArray.length - 1].type === "selector") {
				groupsArray[groupsArray.length - 1].data.push(list);
			} else {
				groupsArray.push({ type: "selector", data: [list] });
			}
			continue;
		}

		if (i.groups.code) {
			interface codeOut {
				type: "code";
				data: any;
				source?: string;
				language?: string;
				range?: [number, number];
				id?: string;
				highlight?: string;
				interactive?: string;
			}
			let out: codeOut = {
				type: "code",
				data: "",
			};

			let code = i.groups.code.trim();
			//	try {
			switch (code.substring(0, 3)) {
				case "```":
					out.language = code
						.trim()
						.split("\n")[0]
						.toString()
						.replace(/```[\s]*?/, "");

					out.data = code
						.trim()
						.replace(/^```.*\s*/, "")
						.replace(/\s*?```$/, "");

					break;

				case "> `":
					out.language = code
						.trim()
						.split("\n")[0]
						.replace(/> ```[\s]*?/, "");
					out.data = code
						.trim()
						.replace(/^> ```\s?/, "")
						.replace(/\s?> ```$/, "");
					break;
				case ":::":
					//TODO: fix maybe?
					//I could do this all much more effectively using just one match with multiple groups (may fix later). Well this works nicely but its 0.00000001 times slower *joke*, this just a scraper so its not that important

					if (i.groups.code.match(/language="(?<data>.*?)"/)) {
						out.language = i.groups.code.match(
							/language="(?<data>.*?)"/
						).groups.data;
					} else {
						out.language = filePath.ext;
					}
					out.source = i.groups.code.match(
						/source="(?<data>.*?)"/
					).groups.data;

					if (i.groups.code.match(/range="(?<data>.*?)"/)) {
						//@ts-ignore
						out.range = [];

						let range = i.groups.code
							.match(/range="(?<data>.*?)"/)
							.groups.data.split("-");

						for (let j in range) {
							out.range[j] = parseInt(range[j]);
						}
					}

					if (i.groups.code.match(/id="(?<data>.*?)"/)) {
						out.id =
							i.groups.code.match(
								/id="(?<data>.*?)"/
							).groups.data;
					}

					if (i.groups.code.match(/highlight="(?<data>.*?)"/)) {
						out.highlight = i.groups.code.match(
							/highlight="(?<data>.*?)"/
						).groups.data;
					}
					if (i.groups.code.match(/interactive="(?<data>.*?)"/)) {
						out.interactive = i.groups.code.match(
							/interactive="(?<data>.*?)"/
						).groups.data;
					}

					/*console.log(
						out.source,
						"\n",
						filePath.dir + "/" + filePath.base
					);*/

					if (out.range) {
						out.data = fs
							.readFileSync(
								path.join(
									filePath.dir + "/" + filePath.base,
									"./../" + out.source
								),
								"utf8"
							)
							.split("\n")
							.slice(out.range[0] - 1, out.range[1] - 1)
							.join("\n")
							.replace(/[,]$/m, "")
							.trim();
					} else
						out.data = fs.readFileSync(
							path.join(
								filePath.dir + "/" + filePath.base,
								"./../" + out.source
							),
							"utf8"
						);

				//console.log(out);
			}
			/*} catch (e) {
							//Find out why recipes are causing error
							errors.push({error:e,origin:filePath});
						}*/

			switch (out.language.toLowerCase().replace(/\s*?/g, "")) {
				//TODO: json schemas
				case "json":
					if (out.data.trim().startsWith('"')) {
						out.data = json.parse(`{\n${out.data}\n}`);
					} else {
						out.data = json.parse(out.data);
					}
					break;
			}
			groupsArray.push(out);
			continue;
		}
		//console.log(i.groups);
		if (i.groups.table) {
			if (!i.groups.table.trim().match(/^[>|][ ]*?[^\-\s\*]/)) {
				groupsArray.push({
					type: "other",
					data: i.groups.table,
				});
			} else {
				let table = i.groups.table;
				let tableArray = [];
				let tableSplit = table
					.replace(/^> \|/gm, "|")
					.replace(/\|[ ]*?/gm, "|")
					.replace(/[ ]*?\|/gm, "|")
					.replace(/\| /gm, "|")
					.replace(/ \|/gm, "|")
					.split("\n");

				for (let j of tableSplit) {
					if (j.trim() === "") continue;
					if (j.match(/^(\|[  ]*(:--|---))/g)) continue;
					//console.log(j);
					tableArray.push(j.trim());
				}

				let tableJson: Record<string, any> = {};

				let index = {};
				let tableJsonArray = [];
				for (let k in tableArray) {
					let nest = tableArray[k].split("|");
					//console.log(nest);

					if (k === "0") {
						for (let l in nest) {
							index[l] = nest[l];
							//console.log(tableArray);
						}
					} else if (k !== "0") {
						for (let l in nest) {
							//if (!tableJson) tableJson = {};

							if (
								JSON.stringify({
									[index[l]]: nest[l],
								}) === '{"":""}'
							)
								continue;

							//console.log(l,index, nest, index[l], nest[l]);
							//console.log({ [index[l]]: nest[l] },JSON.stringify({[index[l]]: nest[l],}));

							Object.assign(tableJson, {
								[index[l]]: nest[l].trim(),
							});
							//console.log(tableJson);
						}
						//console.log(JSON.stringify(tableJson));
						tableJsonArray.push(JSON.stringify(tableJson));
					}
					//console.log(k);
				}
				let oo = [];
				for (let ee in tableJsonArray) {
					oo.push(JSON.parse(tableJsonArray[ee]));
				}
				groupsArray.push({ type: "table", data: oo });
			}
		}
	}
	return groupsArray;
};

var types = {};

const getPropertyType = (type, description) => {
	//TODO: add support for more types
	if (!types[type]) {
		types[type] = [];
	}
	types[type].push(description);
	return type;
};

const rootDir = "C:\\Users\\miner\\Documents\\GitHub\\minecraft-creator";

var markdownJSON = {};

//@ts-ignore
var Entity: Entity = { components: {} };

for (let filePath of listFiles(rootDir)) {
	let currentNamespace = "";

	const filePathArray = (
		filePath.dir.replace(rootDir + "/", "") +
		"/" +
		filePath.base
	)
		.replace(/\\/g, "/")
		.split("/");
	//console.log(filePathArray);

	switch (filePathArray[0]) {
		case ".github":
		case ".git":
		case ".vscode":
		case "node_modules":
			continue;
	}

	switch (filePathArray[1]) {
		case "Templates":
			continue;
	}
	switch (filePathArray[2]) {
	}
	switch (filePathArray[3]) {
		case "VanillaBehaviorPack_Snippets":
			continue;
	}

	switch (filePath.ext) {
		case ".md":
			const md = parseMd(filePath.dir + "/" + filePath.base);
			let heading: string;
			let headingLevel: number;
			let headingLevels: Record<number, string> = {};

			for (let i in md) {
				switch (md[i].type) {
					case "heading":
						heading = md[i].data;
						headingLevel = md[i].level;
						headingLevels[headingLevel] = heading;

					case "yamlHeader":
					//currentNamespace = md[i].data.title.split(" - ")[1];
				}

				switch (filePathArray[3]) {
					case "AddonsReference":
						break;
					case "AnimationsReference":
						break;
					case "BiomeReference":
						break;
					case "BlockReference":
						break;
					case "EntityReference":
						let componentType;
						switch (filePathArray[5]) {
							case "EntityProperties":
								if (!componentType) componentType = "property";
							//break;
							case "EntityAttributes":
								if (!componentType) componentType = "attribute";
							//break
							case "EntityGoals":
								if (!componentType) componentType = "goal";
							//break

							case "EntityComponents":
								if (!componentType) componentType = "component";
								//markdownJSON[filePath.name] = md
								switch (md[i].type) {
									case "yamlHeader":
										currentNamespace =
											md[i].data.title.split(" - ")[1];
										break;
									case "other":
										if (!currentNamespace) {
											if (
												md[i].data.match(
													/`[:a-zA-z_]+?`/
												)
											) {
												currentNamespace = md[i].data
													.match(/`[:a-zA-z_]+?`/)[0]
													.replace(/`/g, "");
											}
										}
								}

								//console.log(heading);

								if (heading) {
									switch (heading.replace(/\s/g, "")) {
										case "Parameter":
										case "Parameters":
											switch (md[i].type) {
												case "table":
													for (let j in md[i].data) {
														if (
															!Entity.components[
																currentNamespace
															]
														) {
															Entity.components[
																currentNamespace
															] = {
																properties: {
																	[md[i].data[
																		j
																	].Name]: {
																		type: getPropertyType(
																			md[
																				i
																			]
																				.data[
																				j
																			]
																				.Type,
																			md[
																				i
																			]
																				.data[
																				j
																			]
																				.Description
																		),
																		description:
																			md[
																				i
																			]
																				.data[
																				j
																			]
																				.Description,
																		default:
																			md[
																				i
																			]
																				.data[
																				j
																			][
																				"Default Value"
																			],
																	},
																},
																numericId: null,
																examples: [],
																type: componentType,
															};
														} else {
															Entity.components[
																currentNamespace
															].properties[
																md[i].data[
																	j
																].Name
															] = {
																type: getPropertyType(
																	md[i].data[
																		j
																	].Type,
																	md[i].data[
																		j
																	]
																		.Description
																),
																description:
																	md[i].data[
																		j
																	]
																		.Description,
																default:
																	md[i].data[
																		j
																	][
																		"Default Value"
																	],
															};
														}
													}
													if (
														!Entity.components[
															currentNamespace
														]
													) {
														console.log(
															currentNamespace
														);
													}
											}
											break;
										case "Example":
											if (
												!Entity.components[
													currentNamespace
												]
											)
												Entity.components[
													currentNamespace
												] = {};

											if (
												!Entity.components[
													currentNamespace
												].examples
											)
												Entity.components[
													currentNamespace
												].examples = [];

											if (md[i].type == "code") {
												Entity.components[
													currentNamespace
												].examples.push(md[i].data);
											}
										default:
											if (headingLevels[2])
												if (
													headingLevels[2].includes(
														"Vanilla entities using "
													)
												)
													if (md[i].type == "list") {
														if (
															!Entity.components[
																currentNamespace
															].usedIn
														)
															Entity.components[
																currentNamespace
															].usedIn = [];

														for (let j in md[i]
															.data) {
															//console.log(md[i].data,currentNamespace);
															Entity.components[
																currentNamespace
															].usedIn.push(
																md[i].data[
																	j
																].match(
																	/\[(.*?)\]/
																)[1]
															);
														}
														break;
													}

											let nest = {};
											switch (md[i].type) {
												case "table":
													for (let j in md[i].data) {
														if (
															!nest[
																headingLevel - 3
															]
														) {
															nest[
																headingLevel - 3
															] = {};
														}
														if (
															nest[
																headingLevel - 3
															][
																md[i].data[j]
																	.Name
															]
														) {
														}
														if (!nest) {
															nest[
																headingLevel - 3
															] = {
																[md[i].data[j]
																	.Name]: {
																	type: getPropertyType(
																		md[i]
																			.data[
																			j
																		].Type,
																		md[i]
																			.data[
																			j
																		]
																			.Description
																	),
																	description:
																		md[i]
																			.data[
																			j
																		]
																			.Description,
																	default:
																		md[i]
																			.data[
																			j
																		][
																			"Default Value"
																		],
																},
															};
														} else {
															nest[
																headingLevel - 3
															][
																md[i].data[
																	j
																].Name
															] = {
																type: getPropertyType(
																	md[i].data[
																		j
																	].Type,
																	md[i].data[
																		j
																	]
																		.Description
																),
																description:
																	md[i].data[
																		j
																	]
																		.Description,
																default:
																	md[i].data[
																		j
																	][
																		"Default Value"
																	],
															};
														}
														//console.log(Entity.components[currentNamespace],currentNamespace);

														//console.log(Entity.components[currentNamespace]);
														if (
															Entity.components[
																currentNamespace
															]
														) {
															for (let k in Entity
																.components[
																currentNamespace
															].properties) {
																//console.log(Entity.components[j])
																if (
																	Entity
																		.components[
																		currentNamespace
																	]
																		.properties[
																		k
																	].type ===
																		"List" ||
																	Entity
																		.components[
																		currentNamespace
																	]
																		.properties[
																		k
																	].type ===
																		"JSON Object"
																) {
																	//console.log(k,Entity.components[currentNamespace].properties[k],nest)
																	//Entity.components[currentNamespace].properties[k].properties = nest
																}
															}
															Entity.components[
																currentNamespace
															].nested = nest;

															//console.log(Entity.components[currentNamespace].properties)
														}
													}

												case "code":
													if (headingLevels[2])
														if (
															headingLevels[2].includes(
																"Vanilla entities examples"
															)
														) {
															//console.log(currentNamespace)

															if (
																!Entity
																	.components[
																	currentNamespace
																]
															)
																Entity.components[
																	currentNamespace
																] = {};

															if (
																!Entity
																	.components[
																	currentNamespace
																].examples
															)
																Entity.components[
																	currentNamespace
																].examples = [];

															Entity.components[
																currentNamespace
															].examples.push(
																md[i].data
															);
														}
													break;
											}
										/*
											if (heading.trim()==`Entity Documentation - ${currentNamespace}`) {
												//TODO fix alert content in the parser and add it here
												//console.log(currentNamespace);
												if (!Entity[currentNamespace]) Entity[currentNamespace] = {};
												if (!Entity[currentNamespace].description) Entity[currentNamespace].description = "";
												if (md[i].type = "other"){Entity[currentNamespace].description += "\n"+md[i].data;}
											}*/
									}
								}
								break;

							case "EntityEvents":
								break;
							case "EntityTriggers":
								break;

							case "Filters":
								switch (heading) {
									case "Example":
										break;
									case "other":
								}
								break;
						}
				}
			}
			break;
		case "FeaturesReference":
			break;
		case "FogsReference":
			break;
		case "ItemsReference":
			break;
		case "MaterialsReference":
			break;
		case "MolangReference":
			break;
		case "ParticlesReference":
			break;
		case "RecipeReference":
			break;
		case "SchemasReference":
			break;
		case "TextureSetsReference":
			break;
		case "VolumeReference":
			break;
	}
}
fs.writeFileSync("./dist/entityData.json", JSON.stringify(Entity));
fs.writeFileSync("./dist/behaviorTypes.json", JSON.stringify(types));

//fs.writeFileSync('./dist/entityDataMD.json', JSON.stringify(markdownJSON));

interface EntityComponent {
	id?: number;
	type?: string;
	description?: string;
	defaultValue?: string;
	properties?: Record<string, any>;
	usedIn: string[];
	examples: Record<string, any>[];
}

interface EntityIdentifier {
	formatVersion: Record<string, any>;
	fullId?: number;
	shortId?: number;
	description?: string;
	data?: Record<string, any>;
}

type Definition = {};

interface Entity {
	identifiers: EntityIdentifier[];
	components: EntityComponent;
	events: Record<string, any>;
	damageSources: Record<string, any>;
	filters: Record<string, any>;
}

interface ItemIdentifier {}
interface ItemComponent {}
interface Item {
	identifiers: Record<string, ItemIdentifier>;
	components: ItemComponent;
}
