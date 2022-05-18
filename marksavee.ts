import * as fs from "fs";
import * as json from "jsonc-parser";

fs.mkdirSync(`./dist/`, { recursive: true });

let output = {};

const listFiles = (
	dir: fs.PathLike,
	files_?: String[] | undefined
): String[] => {
	files_ = files_ || [];
	var funcList = fs.readdirSync(dir);
	for (var i in funcList) {
		var name = dir + "/" + funcList[i];
		if (fs.statSync(name).isDirectory()) {
			listFiles(name, files_);
		} else {
			files_.push(name);
		}
	}
	return files_;
};

var animationControllers = {},
	animations = {},
	attachables = {},
	cameras = {},
	entity = {},
	fogs = {},
	itemsResources = {},
	materials = {},
	models = {},
	particles = {},
	renderControllers = {},
	sounds = {},
	textureSets = {},
	textures = {},
	ui = {},
	behaviorTree = {},
	biomes = {},
	entities = {
		filters: {},
		components: {},
	},
	featuresRules = {},
	features = {},
	itemBehaviors = {},
	lootTables = {},
	recipes = {},
	spawnGroups = {},
	spawnRules = {},
	trading = {};

const recurseOverObject = (obj: Record<string, any>) => {
	for (let i in obj) {
		if (typeof obj[i] === "object") {
			switch (i) {
				case "components":
					//console.log(i);
					for (let j in obj[i]) {
						if (!entities.components[j])
							entities.components[j] = [];
						entities.components[j].push(obj.components[j]);
					}
					break;
				case "filters":
					for (let j in obj[i]) {
						if (!entities.filters[j["test"]])
							entities.filters[j] = [];
						entities.filters[j["test"]].push(obj[i][j]);
					}
					break;
				case "component_groups":
					for (let j in obj[i]) {
						for (let k in obj[i][j]) {
							if (!entities.components[k])
								entities.components[k] = [];
							entities.components[k].push(
								obj.component_groups[j][k]
							);
						}
					}
					break;
			}
			recurseOverObject(obj[i]);
		} else {
			//console.log(i);
		}
	}
};
var inBackTicks = false;
for (let filePath of listFiles(
	"C:/Users/miner/Documents/GitHub/minecraft-creator/creator/Reference/Content"
)) {
	//@ts-ignore
	let fileName: string = filePath.split("/").pop().split(".")[0];
	let fileExt = filePath.split(".").pop();
	//console.log(fileExt);
	let pathSplit = filePath.split("/");

	switch (fileExt) {
		case "md":
			let markdown = fs
				//@ts-ignore
				.readFileSync(filePath, "utf8")
				.replace(/\r/g, "");
			let titleName, currentHeader, namespace, type;

			if (!pathSplit[11]) continue;

			if (pathSplit[11].includes("Events")) {
				type = "events";
				namespace = pathSplit[11].replace(/Events/g, "").toLowerCase();
				//console.log(namespace, type, fileName);
			}
			if (pathSplit[11].includes("Triggers")) {
				type = "events";
				namespace = pathSplit[11]
					.replace(/Triggers/g, "")
					.toLowerCase();
			}
			if (
				pathSplit[11].includes("Components") ||
				pathSplit[11].includes("Attributes") ||
				pathSplit[11].includes("Properties") ||
				pathSplit[11].includes("Goals")
			) {
				type = "components";
				namespace = pathSplit[11]
					.replace(/Components/g, "")
					.replace(/Attributes/g, "")
					.replace(/Properties/g, "")
					.replace(/Goals/g, "")
					.toLowerCase();
			}
			if (pathSplit[11].includes("Filters")) {
				type = "filters";
				namespace = "entity";
			}

			if (!type) continue;
			if (!namespace) continue;

			if (!output[namespace]) output[namespace] = {};
			if (!output[namespace][type]) output[namespace][type] = {};

			var oldHeader;
			var codeBlockIndex = 0;
			for (let i of markdown.split("\n")) {
				if (i.startsWith("|---") || i.startsWith("|:--")) continue; else
				if (!output[namespace][type][titleName])
					output[namespace][type][titleName] = {};
				if (i.startsWith("title:"))
					titleName = i.replace(/ /g, "").split(" - ")[1];else

				if (i.startsWith("#")) {
					let e = i.split(" ");
					e.shift();
					//console.log(e);
					currentHeader = e.join(" ");
				}else
				if (i.startsWith("|")) {
					//filter out "" from the split
					let e = i
						.replace(/\| /g, "|")
						.replace(/ \|/g, "|")
						.replace(/   /g, " ")
						.replace(/  /, "")
						.replace(/\| /g, "|")
						.replace(/ \|/g, "|")
						.split("|");
					if (e[0] === "") e.shift();
					if (e[e.length - 1] === "") e.pop();
					if (!output[namespace][type][titleName].tables)
						output[namespace][type][titleName].tables = {};
					if (
						!output[namespace][type][titleName].tables[
							currentHeader
						]
					)
						output[namespace][type][titleName].tables[
							currentHeader
						] = [];
					//console.log(namespace,type,headingName,);
					if (!currentHeader) continue;
					output[namespace][type][titleName].tables[
						currentHeader
					].push(e);
				} else


				if (i.startsWith(">")) {
					if (!output[namespace][type][titleName].quotes)
						output[namespace][type][titleName].quotes = [];

					if (
						!output[namespace][type][titleName].quotes[
							currentHeader
						]
					)output[namespace][type][titleName].quotes[currentHeader] =
						[];
						output[namespace][type][titleName].quotes[
							currentHeader
					].push(i.replace(/^> /, ""));
				}else

				if (
					i.startsWith("- ") ||
					i.startsWith("* ") ||
					i.match(/^[0-9]./)
				) {
					if (!output[namespace][type][titleName].lists)
						output[namespace][type][titleName].lists = [];
					if (
						!output[namespace][type][titleName].lists[
							currentHeader
						]
					)
						output[namespace][type][titleName].lists[
							currentHeader
						] = [];
					output[namespace][type][titleName].lists[
						currentHeader
					].push(
						i
							.replace(/^- /, "")
							.replace(/^\* /, "")
							.replace(/^[0-9]./, "")
					);




				}else
				if (i.startsWith("```"))
					if (inBackTicks) {
						inBackTicks = false;
						codeBlockIndex++;
					} else {
						if (oldHeader !== currentHeader) codeBlockIndex = 0;
						if (!output[namespace][type][titleName].codeBlocks)
							output[namespace][type][titleName].codeBlocks = {};
						if (
							!output[namespace][type][titleName].codeBlocks[
								currentHeader
							]
						)
							output[namespace][type][titleName].codeBlocks[
								currentHeader
							] = [];
						if (!output[namespace][type][titleName].codeBlocks)
							output[namespace][type][titleName].codeBlocks = {};
						if (
							!output[namespace][type][titleName].codeBlocks[
								currentHeader
							][codeBlockIndex]
						)
							output[namespace][type][titleName].codeBlocks[
								currentHeader
							][codeBlockIndex] = {};
						//console.log(output[namespace][type][titleName]);
						if (
							!output[namespace][type][titleName].codeBlocks[
								currentHeader
							][codeBlockIndex].data
						)
							output[namespace][type][titleName].codeBlocks[
								currentHeader
							][codeBlockIndex].data = "";
						output[namespace][type][titleName].codeBlocks[
							currentHeader
						][codeBlockIndex].type = i.replace(/```/, "");

						inBackTicks = true;
					}else
				if (!i.startsWith("```") && inBackTicks) {
					output[namespace][type][titleName].codeBlocks[
						currentHeader
					][codeBlockIndex].data += i;
				} else {
					if (!output[namespace][type][titleName].text)
						output[namespace][type][titleName].text = "";
					output[namespace][type][titleName].text += i;
				}
			}
			oldHeader = currentHeader;
			break;
	}
}

const example = {
	tables: {
		"Default Parameter": [
			["Default Value", "Type"],
			["true", "Boolean"],
		],
		"Extra Parameters": [
			["Name", "Default Value", "Type", "Description"],
			[
				"origin",
				"[-8.0, 0.0, -8.0]",
				"Vector [a, b, c]",
				"Minimal position Bounds of the collision box. Origin can't be smaller than (-8, 0, -8) and can't be more than (8, 16, 8).",
			],
			[
				"size",
				"[16.0, 16.0, 16.0]",
				"Vector [a, b, c]",
				"Size of each side of the box of the component. When added to origin it can't make origin smaller than (-8, 0, -8) or more than (0, 16, 8).",
			],
		],
	},
};

const recObj = (obj) => {
	for (let f in obj)
		for (let g in obj[f])
			for (let h in obj[f][g])
				for (let i in obj[f][g][h]) {
					let object = obj[f][g][h];

					switch (i) {
						case "tables":
							//console.log(obj[f][g][h][i]);
							let tempObj: Record<string, any> = {};

							for (let j in object[i]) {
								let index = {};
								let tempArray = [];
								for (let k in object[i][j]) {
									let nest = object[i][j][k];
									//console.log(nest);
									if (k === "0") {
										for (let l in nest) {
											//console.log(l);
											index[l] = nest[l];
										}
									}
									if (k !== "0") {
										for (let l in nest) {
											//if (!tempObj) tempObj = {};
											//console.log(nest[l]);
											Object.assign(tempObj, {
												[index[l]]: nest[l],
											});
											//console.log(nest[l]);
										}
										//console.log(JSON.stringify(tempObj));
										tempArray.push(JSON.stringify(tempObj));
									}
								}
								let oo = [];
								for (let ee in tempArray) {
									oo.push(JSON.parse(tempArray[ee]));
								}
								object[i][j] = oo;

								//console.log(tempArray);
							}

							break;
						case "codeBlocks":
							for (let j in object[i])
								for (let k in object[i][j]) {
									switch (object[i][j][k].type) {
										case "json":
										case "JSON":
											//console.log(json.parse(object[i][j].data));
											if (
												object[i][j][k].data.startsWith(
													"{"
												)
											) {
												object[i][j][k].data =
													json.parse(
														object[i][j][k].data
													);
											} else {
												object[i][j][k].data =
													json.parse(
														`{${object[i][j][k].data}}`
													);
											}
											break;
									}
								}
					}
				}

	return obj;
};

fs.writeFileSync("dist/e.json", JSON.stringify(recObj(output)));
