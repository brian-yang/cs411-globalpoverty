# cs411-globalpoverty

## Install
1. Install npm and Node.js.
2. Run `npm install` in the root directory.
3. Install MySQL and import the .sql dump file into MySQL.
4. Rename `.secrets.js` into `secrets.js`.
5. Put your MySQL credentials into `secrets.js`. You need to have a password for your user.
6. See `Other things` below if you're having trouble with setting up MySQL.

## Run
1. Run `npm run dev`.
2. Go to `localhost:3000` or `127.0.0.1:3000` to view the site.

## Importing and Exporting MySQL
### Export the database to a .sql file
Run `mysqldump -u <user> -p <database_name> > global_poverty.sql`. `<user>` should be whatever user you use to get into the mysql terminal, which could be `root` or another user. `<database_name>` is the name of the database you want to export.

### Import the database into MySQL from a .sql file
Run `mysqldump -u <user> -p <database_name> < global_poverty.sql`. Notice the arrow is reversed.

## Other things
1. You might see a weird error that says `Client does not support authentication protocol requested by server`. This might be because you are running MySQL 8.0. Do `ALTER USER '<username>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>'`, replacing `<username>` and `<password>` with your username and password for MySQL.