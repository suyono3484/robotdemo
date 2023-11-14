import {Direction, InvalidBoardSizeError, OutOfBoundError, Report, RobotInterface} from "../types";

export class Robot implements RobotInterface{
    private readonly spaceX: number;
    private readonly spaceY: number;
    private x: number = -1;
    private y: number = -1;
    private f: Direction = Direction.NORTH;

    constructor(spaceX: number, spaceY: number) {
        if (spaceX <= 0 || spaceY <= 0) {
            throw new InvalidBoardSizeError('minimum board size is 1 x 1')
        }

        this.spaceX = spaceX;
        this.spaceY = spaceY;
    }

    Left(): void {
        if (!this.isOnTheTable()) {
            return;
        }

        switch (this.f) {
            case Direction.NORTH:
                this.f = Direction.WEST;
                break;
            case Direction.EAST:
                this.f = Direction.NORTH;
                break;
            case Direction.SOUTH:
                this.f = Direction.EAST;
                break;
            case Direction.WEST:
                this.f = Direction.SOUTH;
                break;
        }
    }

    isOnTheTable(): boolean {
        return this.x >= 0 && this.y >= 0;
    }

    private setLocation(x: number, y: number): void {
        if (x < 0 || x > this.spaceX - 1 ||
            y < 0 || y > this.spaceY - 1) {
            throw new OutOfBoundError(`location ${x}, ${y} is out of bound`);
        }

        this.x = x;
        this.y = y;
    }

    Move(): void {
        if (!this.isOnTheTable()) {
            return;
        }

        switch (this.f) {
            case Direction.NORTH:
                this.setLocation(this.x, this.y + 1);
                break;
            case Direction.EAST:
                this.setLocation(this.x + 1, this.y);
                break;
            case Direction.SOUTH:
                this.setLocation(this.x, this.y - 1);
                break;
            case Direction.WEST:
                this.setLocation(this.x - 1, this.y);
                break;
        }
    }

    Place(x: number, y: number, f: Direction): void {
        this.setLocation(x, y);
        this.f = f;
    }

    Report(): Report | false {
        if (!this.isOnTheTable()) {
            return false
        }

        return {
            x: this.x,
            y: this.y,
            f: this.f
        };
    }

    Right(): void {
        if (!this.isOnTheTable()) {
            return;
        }

        switch (this.f) {
            case Direction.NORTH:
                this.f = Direction.EAST;
                break;
            case Direction.EAST:
                this.f = Direction.SOUTH;
                break;
            case Direction.SOUTH:
                this.f = Direction.WEST;
                break;
            case Direction.WEST:
                this.f = Direction.NORTH;
                break;
        }
    }

}