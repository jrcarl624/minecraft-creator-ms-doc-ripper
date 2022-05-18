import { callbackify } from "util";

const List = class {
	constructor() {
		return Object.setPrototypeOf([], null);
	}
};
import fs from "fs";
import { Entity } from "mojang-minecraft";
let list = new List()[0];

//use ts dom

interface List {}
//The list of (?<list>[\S ]+?) (of|for|this|of|that|to)
//regex
const filter = "The list of conditions";
const trigger = "The list of trigger" || "The list of other triggers";
const items = "The list of items";
const damageSource = "The list of Entity Damage Sources";
const entityDefinition = "The list of entity definitions";
const nearbyBlockRequirements = "The list of nearby block requirements";

interface lootTable {
	table: fs.PathLike;
}
type Identifier = `${Lowercase<string>}:${Lowercase<string>}`;
type MinecraftIdentifier = `minecraft:${Lowercase<string>}`;

type langCode = `${Lowercase<string>}.${Lowercase<string>}`;

//To look for event type
//Desc : Event to run
//Name : event

// with this make sure the type is a json object
// regex :"[ ]*?Event

interface Filters {
	allOf?: MinecraftFilter[];
	anyOf?: MinecraftFilter[];
	noneOf: MinecraftFilter[];
}
//https://docs.microsoft.com/en-us/minecraft/creator/documents/entitybehaviorintroduction

declare namespace Molang {
	interface types {
		boolean: 0.0 | 1.0;
		//TODO on compile switch all numbers to floats {number}.0
		number: number;

		array: Array<number>;
		//TODO convert "  and ` to ' on compile
		string: string;

		undefined: 0.0;
	}
	type animation = `animation.${string}`;
	type expression = string;
	// TODO: make this better, make nested
	type variable = `${"v" | "variable"}.${string}`;

	//type struct = "maybe use this"

	interface query {}
}
// https://docs.microsoft.com/en-us/minecraft/creator/documents/entitybehaviorintroduction
//TODO: test an entity with no components and just an identifier
interface EntityBehavior {
	description: {
		/**
		 *Identifier of the entity. If this is a custom entity in an add-on, you should use a custom unique namespace as seen in the example.
		 */
		identifier: Identifier;
		/**
		 * Identifier that's used internally by the game. This can be used to inherit custom mechanics from vanilla entities that are not yet available as a component. Only one runtime identifier may be specified per entity Only use this if it is really necessary. If a vanilla entity's mechanics are turned into components, you may lose functionality if you are relying on those mechanics through a runtime identifier.
		 */
		runtimeIdentifier?: MinecraftIdentifier;
		/**
		 * If true, a spawn egg for the entity is added to the creative inventory.
		 */
		isSpawnable: boolean;
		/**
		 * If true, the entity can be summoned using the /summon command.
		 */
		isSummonable: boolean;
		/**
		 * If true, the entity can use experimental features. The entity will only work in experimental worlds. Marketplace content can not be submitted with this option enabled.
		 */
		isExperimental: boolean;
		//TODO make this more specific
		/**
		 * A list of behavior animations or animation controllers. These can be used to run commands or events on the entity.
		 */
		animations?: Record<string, Molang.animation>;
		/**
		 * Scripts work similarly to how they work in client entity files, and they can be used to play behavior animations.
		 */
		scripts?: {
			animate?: (
				| keyof EntityBehavior["description"]["animations"]
				| Record<
						keyof EntityBehavior["description"]["animations"],
						Molang.expression
				  >
			)[];
			variables?: {
				[key: Molang.variable]: "public";
			};
			initialize: `${Molang.variable}=${
				| Molang.types["string"]
				| Molang.types["boolean"]
				| Molang.types["number"]};`[];
		};
	};

	/**
	 * Components are properties or mechanics that you can add to your entity.  Components added to the base component tag are always active unless removed through a component group in an event.
	 */
	components?: EntityComponents;
	/**
	 * Component groups are sets of one or more components each that aren't active by default but can be enabled or disabled through events.
	 */
	componentGroups?: Array<Record<Identifier, EntityComponents[]>>;

	//TODO add events
	/**
	 * Events are used to add and remove component groups from the entity
	 */
	events?: Record<Identifier, EntityEvent>;
}

type EntityComponents = Record<string, any>;

interface EntityEvent {
	sequence?: EntityEvent[];

	randomize?: EntityEventRandomize[];
	filters?: MinecraftFilter;
	add?: {
		component_groups: string[];
	};
	remove?: {
		component_groups: string[];
	};
}

interface EntityEventRandomize extends EntityEvent {
	weight: number;
}

//TODO make better @prop test operator
type MinecraftFilter = {
	domain?;
	subject?;
	value: string | boolean | number;
	test: string;
	operator?: string;
};

type Vector = [number, number, number];
