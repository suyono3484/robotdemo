import {Direction, NoSuchFileError, RobotInterface} from "../types";
import * as readline from "node:readline";
import * as fs from "node:fs";
import * as process from "node:process";


enum Command {
    PLACE = "PLACE",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    MOVE = "MOVE",
    REPORT = "REPORT"
}

export type runCallback = {
    resolve: (data? : any) => void,
    reject: (reason? : any) => void
}

export class Terminal {
    private readonly robot: RobotInterface;
    private readonly filename? : string;

    constructor(robot :RobotInterface, filename? :string) {
        this.robot = robot;
        this.filename = filename;
    }

    Run(callback? : runCallback) {
        let rl : readline.Interface;
        if (typeof this.filename === 'string') {
            console.log(`input from file: ${this.filename}`)
            if (!fs.existsSync(this.filename)) {
                console.log(`file not found: ${this.filename}`)
                if (typeof callback !== 'undefined') {
                    callback.reject(new NoSuchFileError(`file not found: ${this.filename}`));
                }
                return;
            }

            rl = readline.createInterface({
                input: fs.createReadStream(this.filename),
                crlfDelay: Infinity,
                // terminal: false,
                // output: process.stdout
            })

        } else {
            rl = readline.createInterface({
                input: process.stdin,
                // output: process.stdout
            })
        }

        rl.on('line', (command) => {
            let upCmd = command.toUpperCase();
            switch (upCmd) {
                case Command.MOVE:
                    try {
                        this.robot.Move();
                    } catch (e) {
                        if (typeof callback !== 'undefined') {
                            callback.reject(e);
                        }
                        console.log(`${Command.MOVE} error ${e}`);
                    }
                    break;
                case Command.LEFT:
                    this.robot.Left();
                    break;
                case Command.RIGHT:
                    this.robot.Right();
                    break;
                case Command.REPORT:
                    let report = this.robot.Report();
                    if (report !== false) {
                        console.log(`Output: ${report.x},${report.y},${report.f}`)
                    }
                    break;
                default:
                    if (upCmd.startsWith(Command.PLACE)) {
                        let re = upCmd.match(/PLACE\s(\d+),(\d+),(NORTH|EAST|SOUTH|WEST)/)

                        if (re) {
                            // console.log(`x: ${re[1]}`);
                            // console.log(`y: ${re[2]}`);
                            // console.log(`direction: ${re[3]}`);

                            let x = parseInt(re[1]);
                            let y = parseInt(re[2]);
                            try {
                                switch (re[3]) {
                                    case Direction.EAST:
                                        this.robot.Place(x, y, Direction.EAST);
                                        break;
                                    case Direction.SOUTH:
                                        this.robot.Place(x, y, Direction.SOUTH);
                                        break;
                                    case Direction.NORTH:
                                        this.robot.Place(x, y, Direction.NORTH);
                                        break;
                                    case Direction.WEST:
                                        this.robot.Place(x, y, Direction.WEST);
                                        break;
                                }
                            } catch (e) {
                                console.log(`${Command.PLACE} error: ${e}`);
                                if (typeof callback !== 'undefined') {
                                    callback.reject(e);
                                }
                            }
                        } else {
                            console.log(`invalid place command parameter: ${command}`)
                            if (typeof callback !== 'undefined') {
                                callback.reject(new Error(`invalid place command parameter: ${command}`));
                            }
                        }
                    } else {
                        console.log(`received unexpected command: ${command}`);
                        if (typeof callback !== 'undefined') {
                            callback.reject(new Error(`received unexpected command: ${command}`));
                        }
                    }
            }
        })

        if (typeof callback !== 'undefined') {
            rl.on('close', () => {
                callback.resolve();
            })
        }
    }
}