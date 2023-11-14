import {Terminal} from "./delivery/terminal";
import {Robot} from "./usecase/robot";
import * as process from "node:process";


let t :Terminal
if (process.argv.length >= 3) {
    t = new Terminal(new Robot(5, 5), process.argv[2]);
} else {
    t = new Terminal(new Robot(5, 5));
}
t.Run()