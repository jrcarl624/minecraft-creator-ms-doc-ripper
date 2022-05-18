import path from "path";
import fs from "fs";

fs.readFileSync(
	path.join(
		"C:/Users/miner/Documents/GitHub/minecraft-creator/creator/Reference/Content/EntityReference/Examples/EntityComponents/minecraftComponent_angry.md",
		"./../../../../../Source/VanillaBehaviorPack/entities/spider.json"
	),
	"utf8"
)
	.split("\n")
	.slice(120 - 1, 127 - 1)
	.join("\n");

