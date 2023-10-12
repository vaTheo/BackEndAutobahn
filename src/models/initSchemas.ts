//Try di do these to import the/userpoint before user and game and ensure an mongoose error, and then call in the app.ts import 'this file', but it does not work :
// throw new TypeError(`Invalid schema configuration: \`${name}\` is not ` +
//       ^
// TypeError: Invalid schema configuration: `Model` is not a valid type at path `userPoints`. See https://bit.ly/mongoose-schematypes for a list of valid schema types.
import './userPoints';
import './user';
import './game';
