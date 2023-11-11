import {Direction, OutOfBoundError, Report, RobotInterface} from "../types";

export class Robot implements RobotInterface{
    private readonly spaceX: number = 0;
    private readonly spaceY: number = 0;
    private x: number = -1;
    private y: number = -1;
    private f: Direction = Direction.NORTH;

    constructor(spaceX: number, spaceY: number) {
        this.spaceX = spaceX;
        this.spaceY = spaceY;
    }

    Left(): void {
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

    private setLocation(x: number, y: number): void {
        if (x < 0 || x > this.spaceX - 1 ||
            y < 0 || y > this.spaceY - 1) {
            throw new OutOfBoundError("location " + x + ", " + y + " is out of bound");
        }

        this.x = x;
        this.y = y;
    }

    Move(): void {
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

    Report(): Report {
        return {
            x: this.x,
            y: this.y,
            f: this.f
        };
    }

    Right(): void {
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