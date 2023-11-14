import {Robot} from "../../usecase/robot";
import {describe, it} from "@jest/globals";
import {Direction, InvalidBoardSizeError, OutOfBoundError, Report } from "../../types";

describe('testing Robot use-cases', () => {
    describe('board size 5 x 5', () => {
        let rbt :Robot
        beforeEach(() => {
            rbt = new Robot(5, 5)
        })

        it('accepts Place command', () => {
            let x = 3;
            let y = 2;
            rbt.Place(x, y, Direction.EAST);
            expect(rbt.Report()).toEqual<Report>({
                x: x,
                y: y,
                f: Direction.EAST
            });
        })

        it('rejects Place command with invalid position', () => {
            let x = 6;
            let y = 2;
            expect(() => {
                rbt.Place(x, y, Direction.EAST);
            }).toThrow(new OutOfBoundError(`location ${x}, ${y} is out of bound`))
        })

        it('can handle multiple Report commands', () => {
            rbt.Place(0, 0, Direction.NORTH);
            rbt.Move();
            rbt.Left();
            rbt.Left();
            rbt.Left();
            expect(rbt.Report()).toEqual<Report>({
                x: 0,
                y: 1,
                f: Direction.EAST
            });
            rbt.Move();
            rbt.Left();
            expect(rbt.Report()).toEqual<Report>({
                x: 1,
                y: 1,
                f: Direction.NORTH
            });
            rbt.Right();
            rbt.Right();
            rbt.Move();
            rbt.Right();
            rbt.Right();
            expect(rbt.Report()).toEqual<Report>({
                x: 1,
                y: 0,
                f: Direction.NORTH
            });
            rbt.Left();
            rbt.Move();
            rbt.Left();
            expect(rbt.Report()).toEqual<Report>({
                x: 0,
                y: 0,
                f: Direction.SOUTH
            });
        })

        it(`ignores Move, Left, Right and returns false on Report if the robot is not on the board`, () => {
            rbt.Left();
            rbt.Right();
            rbt.Move();
            expect(rbt.Report()).toBe(false);
        })
    })

    it('rejects invalid board initial size', () => {
        expect(() => {
            new Robot(-1, 0)
        }).toThrow(new InvalidBoardSizeError('minimum board size is 1 x 1'))
    })

    it('returns false when calling report with no prior place', () => {
        let rbt = new Robot(1, 1)
        expect(rbt.Report()).toEqual(false)
    })
})