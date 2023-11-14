import {describe, it, jest} from "@jest/globals";
import * as os from "node:os"
import * as path from "node:path"
import * as fs from "node:fs"
import {Direction, NoSuchFileError, OutOfBoundError, Report, RobotInterface} from "../../types";
import {Terminal} from "../../delivery/terminal";

class RobotMock implements RobotInterface {
    private readonly commands : string[];
    index : number = -1;
    called = jest.fn();
    nextError = new Error('no error');
    isNextError = false;
    dummyReport : boolean = false;

    constructor(...command : string[]) {
        this.commands = command;
    }

    SetNextError(err : Error) {
        this.nextError = err;
        this.isNextError = true;
    }

    Left(): void {
        this.called();
        this.index++;
        if (this.commands[this.index] != 'LEFT') {
            throw new Error('mismatch command');
        }

        // console.log('left called');
    }

    Move(): void {
        this.called();
        this.index++;
        if (this.commands[this.index] != 'MOVE') {
            throw new Error('mismatch command');
        }

        if (this.isNextError) {
            this.isNextError = false;
            throw this.nextError;
        }

        // console.log('move called');
    }

    Place(x: number, y: number, f: Direction): void {
        this.called({
            x: x,
            y: y,
            f: f
        });
        this.index++;
        if (!this.commands[this.index].startsWith('PLACE')) {
            throw new Error('mismatch command');
        }

        if (this.isNextError) {
            this.isNextError = false;
            throw this.nextError;
        }

        // console.log('place called');
    }

    Report(): Report | false {
        this.called();
        this.index++;
        if (this.commands[this.index] != 'REPORT') {
            throw new Error('mismatch command');
        }

        // console.log('report called');
        if (this.dummyReport) {
            return {
                x: 1,
                y: 1,
                f: Direction.SOUTH
            }
        }

        return false;
    }

    Right(): void {
        this.called();
        this.index++;
        if (this.commands[this.index] != 'RIGHT') {
            throw new Error('mismatch command');
        }

        // console.log('right called');
    }

    isOnTheTable(): boolean {
        return false;
    }
}

function writeCommands(fd: number, ...command :string[]) {
    command.forEach((cmd) => {
        fs.writeSync(fd, `${cmd}\n`);
    })
    fs.closeSync(fd);
}

describe('loads commands from file or stdin', () => {
    let tmpdir :string;
    let cmdFile :string;
    let cmdFd :number;
    beforeEach(() => {
        tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'robotdemo-'))
        cmdFile = path.join(tmpdir, 'commands.txt');
        cmdFd = fs.openSync(cmdFile, 'w');
    })

    afterEach(() => {
        fs.rmSync(tmpdir, { force: true, recursive: true})
    })

    it('reads commands line by line',  (done) => {
        let commands = [
            'PLACE 0,0,NORTH',
            'RIGHT',
            'MOVE',
            'LEFT',
            'MOVE',
            'REPORT',
            'PLACE 0,0,WEST',
            'PLACE 0,0,SOUTH',
            'PLACE 0,0,EAST',
            'REPORT',
        ]

        writeCommands(cmdFd, ...commands);

        let mock = new RobotMock(...commands);
        mock.dummyReport = true;
        let t = new Terminal(mock, cmdFile);
        let p = new Promise<any>((resolve, reject) => {
            t.Run({
                resolve: resolve,
                reject: reject
            })
        })

        p.catch((err) => {
            throw err;
        })
        p.then(() => {
            expect(mock.called).toHaveBeenCalledTimes(commands.length);
            done();
        });
    })

    it('reports when the input file is not found', (done) => {
        writeCommands(cmdFd);
        fs.rmSync(cmdFile, {force: true});

        let mock = new RobotMock();
        let t = new Terminal(mock, cmdFile);
        let p = new Promise<any>((resolve, reject) => {
            t.Run({
                resolve: resolve,
                reject: reject
            })
        })

        p.catch((err) => {
            expect(err).toEqual(new NoSuchFileError(`file not found: ${cmdFile}`))
            done();
        })
    })

    it('catches exception thrown by move command report error', (done) => {
        writeCommands(cmdFd, 'MOVE');

        let mock = new RobotMock('MOVE');
        mock.SetNextError(new OutOfBoundError(`location 6, -1 is out of bound`))
        let t = new Terminal(mock, cmdFile);
        let p = new Promise<any>((resolve, reject) => {
            t.Run({
                resolve: resolve,
                reject: reject
            })
        })

        p.catch((err) => {
            expect(err).toEqual(new OutOfBoundError(`location 6, -1 is out of bound`))
            done();
        })
    })

    it('catches exception thrown by place command report error', (done) => {
        writeCommands(cmdFd, 'PLACE 1,1,WEST');

        let mock = new RobotMock('PLACE 1,1,WEST');
        mock.SetNextError(new OutOfBoundError(`location 8, 3 is out of bound`))
        let t = new Terminal(mock, cmdFile);
        let p = new Promise<any>((resolve, reject) => {
            t.Run({
                resolve: resolve,
                reject: reject
            })
        })

        p.catch((err) => {
            expect(err).toEqual(new OutOfBoundError(`location 8, 3 is out of bound`))
            done();
        })
    })

    it('catches invalid place command parameter and report error', (done) => {
        writeCommands(cmdFd, 'PLACE 1,1');

        let mock = new RobotMock('PLACE 1,1');
        mock.SetNextError(new Error('invalid place command parameter: PLACE 1,1'))
        let t = new Terminal(mock, cmdFile);
        let p = new Promise<any>((resolve, reject) => {
            t.Run({
                resolve: resolve,
                reject: reject
            })
        })

        p.catch((err) => {
            expect(err).toEqual(new Error('invalid place command parameter: PLACE 1,1'))
            done();
        })
    })

    it('catches invalid command and report error', (done) => {
        writeCommands(cmdFd, 'INVALID');

        let mock = new RobotMock('INVALID');
        mock.SetNextError(new Error('received unexpected command: INVALID'))
        let t = new Terminal(mock, cmdFile);
        let p = new Promise<any>((resolve, reject) => {
            t.Run({
                resolve: resolve,
                reject: reject
            })
        })

        p.catch((err) => {
            expect(err).toEqual(new Error('received unexpected command: INVALID'))
            done();
        })
    })
})
