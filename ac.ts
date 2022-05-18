import {
	Vector,
	Block,
	BlockPermutation,
	Location,
	BlockLocation,
	world as World,
	MinecraftDimensionTypes,
} from "mojang-minecraft";


import * as config from "./config.js"



interface ModuleEnableOptions {
    event: string;
    callback: (...args: any[]) => void;
}





const ItemBlacklistModule = () => {




}













for (let i of enabled) {
    World.events[i.event].subscribe(i.callback);
}
