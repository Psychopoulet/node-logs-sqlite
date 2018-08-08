# node-logs-sqlite
A class to manage logs

[![Build Status](https://api.travis-ci.org/Psychopoulet/node-logs-sqlite.svg?branch=master)](https://travis-ci.org/Psychopoulet/node-logs-sqlite)
[![Coverage Status](https://coveralls.io/repos/github/Psychopoulet/node-logs-sqlite/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/node-logs-sqlite)
[![Dependency Status](https://david-dm.org/Psychopoulet/node-logs-sqlite/status.svg)](https://david-dm.org/Psychopoulet/node-logs-sqlite)
[![Dev dependency Status](https://david-dm.org/Psychopoulet/node-logs-sqlite/dev-status.svg)](https://david-dm.org/Psychopoulet/node-logs-sqlite?type=dev)

## Installation

```bash
$ npm install node-logs-sqlite
```

## Features

  * all the [node-logs](https://www.npmjs.com/package/node-logs) features
  * Save logs in sqlite formate, order by date (different files) & time
  * Delete old x days local logs automaticly
  * Read local logs

## Doc

[node-logs](https://www.npmjs.com/package/node-logs) inheritage

-- Interfaces --

```typescript
type iOption = "background" | "bold" | "italic" | "strikethrough" | "underline";

interface iLogDate {
  year: string,
  month: string,
  day: string
}

interface iLog {
  date: string,
  time: string,
  type: string,
  message: string
}
```

-- Constructor --

* ``` constructor () ```

-- Methods --

* -- Accessors --
* ``` deleteLogsAfterXDays (deleteLogsAfterXDays: number): this ```
* ``` localStorageDatabase (localStorageDatabase: string): this ```

* -- Init / Release --
* ``` init(): Promise< resolve<void> | reject<Error> > ``` create local storage if not exists and delete old logs
* ``` release(): Promise< resolve<void> | reject<Error> > ```

* -- Read logs --
* ``` getLogs(): Promise< resolve< Array<iLogDate> > | reject<Error> > ```
* ``` readLog(year: string|number, month: string|number, day: string|number): Promise< resolve< Array<iLog> > | reject< ReferenceError|TypeError|Error > > ```

## Examples

### Native

```javascript
const Logs = require("node-logs-sqlite");
const logs = new Logs();
```

```javascript
// optionnal : configure the logger
logs
  .deleteLogsAfterXDays(2)
  .localStorageDatabase(require("path").join(__dirname, "logs.db"))
  .showInConsole(true);
```

```javascript
return logs.init().then(() => {

  return logs.log("this is a message", [ "background" ]);

}).then(() => {

  return logs.getLogs().then((logs) => {
     return logs.readLog(year, month, day);
  }).then((logs) => {
     console.log(logs); return Promise.resolve();
  });

}).then(() => {

  return logs.release();

}).catch((err) => {
   console.log(err);
});
```

### Typescript

```typescript
import Logs = require("node-logs-sqlite");
const logs = new Logs();

logs.init().then(() => {
   return logs.log("log");
});
```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
