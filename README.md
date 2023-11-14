# Robot Demo

It is a simulation application for a toy robot movement on a square tabletop.

## Building Docker image

Clone this repository, enter the root directory of the project, and run this command
```shell
docker build -t robotdemo .
```

## Running

This application can be run interractively, accepts input commands through piped/stdin redirection, and specifying input file as command line parameter.

#### Interactively

```shell
docker run -it --rm robotdemo
```
Type the command and end it with newline / Enter key. To quit press `Ctrl + C` or `Ctrl + D`.

#### Piped / STDIN redirection

```shell
cat input.txt | docker run -i --rm robotdemo
```
or 
```shell
docker run -i --rm robotdemo < input.txt
```

#### Command line parameter

```shell
docker run --rm -v /path/to/input/file:/container/path robotdemo node dist/index.js /container/path
```
Note: This docker image is a rootless image, make sure the in-container input file can be read by a regular user with uid 1000 and gid 1000.

#### Running without Docker

It is possible to run this application without Docker. After you clone this repository, run `npm install` in the project root directory, then run `npm run build`. You can run the application by using command `node dist/index.js`. Similarly, you can run interractively, piped/STDIN redirection, and using input file parameter.

## Testing

To run the test
```shell
docker run --rm robotdemo jest
```

To run with coverage
```shell
docker run --rm robotdemo jest --coverage
```