export enum Direction {
    NORTH = "NORTH",
    EAST = "EAST",
    SOUTH = "SOUTH",
    WEST = "WEST"
}

export interface Report {
    x: number
    y: number
    f: Direction
}

export interface RobotInterface {
    Place(x: number, y: number, f: Direction): void
    Move(): void
    Left(): void
    Right(): void
    Report(): Report | false
    isOnTheTable(): boolean
}

export class OutOfBoundError extends Error {
    constructor(message: string) {
        super(message);

        // we are extending a built-in class
        Object.setPrototypeOf(this, OutOfBoundError.prototype);
    }
}

export class InvalidBoardSizeError extends Error {
    constructor(message: string) {
        super(message);

        // we are extending a built-in class
        Object.setPrototypeOf(this, InvalidBoardSizeError.prototype);
    }
}

export class NoSuchFileError extends Error {
    constructor(message: string) {
        super(message);

        // we are extending a built-in class
        Object.setPrototypeOf(this, NoSuchFileError.prototype);
    }

}