import {
	BeforeChatEvent,
	EntityHealthComponent,
	EntityBreathableComponent,
	Player,
	PlayerInventoryComponentContainer,
	world,
	EntityQueryOptions,
	EntityQueryScoreOptions,
	IEntityComponent,
	EntityRideableComponent,
	EntityStrengthComponent,
	Vector,
	Location,
	Dimension,
	MinecraftEffectTypes,EffectType,
} from "mojang-minecraft";

const World = world;

const config = {

  prefix: "!",
}


type CommandCheck = (instance:Object,options:Record<string,any>) => {boolean:boolean,error:string}

interface CommandType {
  name: string;
  description?: string;
  example?: string;
}


interface CommandArgument{
  type: CommandType;
  name: string,
  optional?: boolean,
  default?: any,
  description?: string,
  example?: string,
};


interface CommandOptions {
	aliases?: string[];
	description?: string;
	usage?: string;
	permission?: string;
	category?: string;
  tags?: string[];
  arguments: CommandArgument[];
}

//!help "Debug Bot" {"foo":"bar", "baz": {"foo": "bar", "baz": "qux"}} true false 1.0 -1 -1.0 22e222 1 thisIsAString @a @s @r @"GamerTag" @nameIWantToUse @e[ff]

//(?:(?<command>^[\S]+?)\s)|(?:(?<query>@(?:[resa]|here)\[[\S\s]*?\])\s)|(?:(?<json>\{[\S ]+?\})\s)|(?:(?<array>\[[\S\s]+?\])\s)|(?:(?<boolean>true|false)\s)|(?:(?<number>[-]*(?:(?:\d+?\.\d+?)|(?:\d+?)))\s)|(?:(?<selector>@(?:[resa]|here))\s)|(?:@(?<playerName>(?:[\S]+))\s)|(?:(?<string>"[\S )]+?"|[\S]+)\s)



const ChatBuilder = class {
	registeredCommands: Record<string, any> = {};
	registeredTriggers: Record<string, any> = {};
  types = {
    string: /"(?:[^"\\]|\\.)*"/,
    number: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
    "boolean": /true|false/,
    "undefined": /null|undefined/,
    "array": /\[(?:[^\[\]\r\n]|\r?\n)*\]/,
    "object": /\{(?:[^\{\}]|\r?\n)*\}/,

 // selector = @r or @s or @e or @p
    selector: /@(?:[^\[\]\r\n]|\r?\n)*/,
}
  buildTypes(types: RegExp[]) {
    let string = "";
    for (const type of types) {
      string += type.toString();
    }
    return string
  }



  constructor(options: { prefix: string, types: RegExp[] }) {

    const { prefix } = options;



		World.events.beforeChat.subscribe((data: BeforeChatEvent) => {
			// Array, boolean, ints, floats,  strings, json, players (with space), @ selector, custom args
			// ways player names can be written @GamerTag 	@"GamerTag" "GamerTag" @here @a @s @r  /
			// !help "Debug Bot" ["foo", "bar", "baz"] {"foo": "bar", "baz": "qux"} true false 1.0 1 thisIsAString @a @s @r @"GamerTag" @nameIWantToUse

      if (data.message.startsWith(config.prefix)) {
        data.message = data.message.substring(config.prefix.length);

        const match = data.message.match((this.regex));



      }

		});
	}
	registerCommand(
		name: string,
		options: CommandOptions,
		callback: (args: BeforeChatEvent) => any
  ) {




		this.registeredCommands[name] = {
			options: options,
      callback: callback,
      types: this.buildTypes(options.types),
		};
	}
	registerTrigger(
		triggerWord: string,
		callback: (args: BeforeChatEvent) => any
	) {
		this.registeredTriggers[triggerWord] = {
			callback: callback,
		};
	}
};

world.getPlayers();

const PlayerBuilder = class {
	player: Player;
	constructor(Player: Player) {


	}
	get components():IEntityComponent[]{

		return this.player.getComponents();
	}
	get inventory(): PlayerInventoryComponentContainer {
		// @ts-ignore
		return this.player.getComponent("minecraft:inventory");
	}

	get health(): EntityHealthComponent {
		// @ts-ignore
		return this.player.getComponent("minecraft:health");
	}

	get breathable(): EntityBreathableComponent {
		// @ts-ignore
		return this.player.getComponent("minecraft:breathable");
	}
	get rideable(): EntityRideableComponent {
		// @ts-ignore
		return this.player.getComponent("minecraft:rideable");
	}
	get strength(): EntityStrengthComponent {
		// @ts-ignore
		return this.player.getComponent("minecraft:strength");
	}

	get location(): Location {
		return this.player.location;
	}
 	get tags (){
		return this.player.getTags();
	}

	setLocation(location: {x:number,y:number,z:number},dimensionId:string|"overworld"|"the_end"|"nether", xRotation?:number, yRotation?:number) {
		this.player.teleport(new Location(location.x, location.y, location.z),world.getDimension(dimensionId),xRotation?? this.player.bodyRotation,yRotation?? 90);
	}

	get nameTag(): string {
		return this.player.nameTag;
	}
	set nameTag (name:string){
		this.player.nameTag = name;
	}
	get velocity(): Vector {
		return this.player.velocity;
	}





	kill() {
		this.player.kill();
	}
	getEffect(effectType: MinecraftEffectTypes|string): EffectType {
		// @ts-ignore
		return this.player.getEffect(effectType);
	}

	runCommand(command: string, ignoreError?:boolean) {
		if (ignoreError == true ){
		try {this.player.runCommand(command)} catch (e) {}
		} else (this.player.runCommand(command))
	}

};


/*
 * {
  "format_version": "1.18.10",
  "minecraft:entity": {
    "description": {
      "identifier": "minecraft:player",
      "is_spawnable": false,
      "is_summonable": false,
      "is_experimental": false
    },

    "components": {
      "minecraft:experience_reward": {
        "on_death": "Math.Min(query.player_level * 7, 100)"
      },
      "minecraft:type_family": {
        "family": [ "player" ]
      },
      "minecraft:is_hidden_when_invisible": {
      },
      "minecraft:loot": {
        "table": "loot_tables/empty.json"
      },
      "minecraft:collision_box": {
        "width": 0.6,
        "height": 1.8
      },
      "minecraft:can_climb": {
      },
      "minecraft:movement": {
        "value": 0.1
      },
      "minecraft:hurt_on_condition": {
        "damage_conditions": [
          {
            "filters": { "test": "in_lava", "subject": "self", "operator": "==", "value": true },
            "cause": "lava",
            "damage_per_tick": 4
          }
        ]
      },
      "minecraft:attack": {
        "damage": 1
      },
      "minecraft:player.saturation": {
        "value": 20
      },
      "minecraft:player.exhaustion": {
        "value": 0,
        "max": 4
      },
      "minecraft:player.level": {
        "value": 0,
        "max": 24791
      },
      "minecraft:player.experience": {
        "value": 0,
        "max": 1
      },
      "minecraft:breathable": {
        "total_supply": 15,
        "suffocate_time": -1,
        "inhale_time": 3.75,
        "generates_bubbles": false
      },
      "minecraft:nameable": {
        "always_show": true,
        "allow_name_tag_renaming": false
      },
      "minecraft:physics": {
      },
      "minecraft:pushable": {
        "is_pushable": false,
        "is_pushable_by_piston": true
      },
      "minecraft:insomnia": {
        "days_until_insomnia": 3
      },
      "minecraft:rideable": {
        "seat_count": 2,
        "family_types": [
          "parrot_tame"
        ],
        "pull_in_entities": true,
        "seats": [
          {
            "position": [ 0.4, -0.2, -0.1 ],
            "min_rider_count": 0,
            "max_rider_count": 0,
            "lock_rider_rotation": 0
          },
          {
            "position": [ -0.4, -0.2, -0.1 ],
            "min_rider_count": 1,
            "max_rider_count": 2,
            "lock_rider_rotation": 0
          }
        ]
      },
      "minecraft:conditional_bandwidth_optimization": {
      },
      "minecraft:block_climber": {},
      "minecraft:environment_sensor": {
        "triggers": {
          "filters": {
            "all_of": [
              {
                "test": "has_mob_effect",
                "subject": "self",
                "value": "bad_omen"
              },
              {
                "test": "is_in_village",
                "subject": "self",
                "value": true
              }
            ]
          },
          "event": "minecraft:trigger_raid"
        }
      }
    },





 *
 */

// !help "Debug Bot" ["foo", "bar", "baz"] {"foo": "bar", "baz": "qux"} true false 1.0 1 thisIsAString @a @s @r @"GamerTag" @nameIWantToUse




interface PlayerQueryOptions extends EntityQueryOptions {type:"minecraft:player";}

const newEntityQuery = (entityQueryOptions:EntityQueryOptions) => {
	let newQuery = new EntityQueryOptions();
		for (let i in entityQueryOptions) newQuery[i] = entityQueryOptions[i];
	return newQuery;
}

const newScoreQuery = (entityQueryOptions:EntityQueryScoreOptions ) => {
	let newQuery = new EntityQueryScoreOptions();
		for (let i in entityQueryOptions) newQuery[i] = entityQueryOptions[i];
	return newQuery;
}

const newPlayerQuery = (entityQueryOptions:PlayerQueryOptions) => {
	let newQuery = new EntityQueryOptions()
		for (let i in entityQueryOptions) newQuery[i] = entityQueryOptions[i];
	return newQuery.type = "minecraft:player";
}
