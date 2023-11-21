const mysql = require("mysql2");

// Set up MySQL connection
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 4040,
  user: "root",
  password: "1234",
  database: "cakaatalk",
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    process.exit(1); // Exit if there is a connection error
  }

  console.log("Connected to MySQL");

  // Replace "YOUR_QUERY_HERE" with your actual query
  connection.query(
    `CREATE TABLE AUTH (
    auth_id INT PRIMARY KEY AUTO_INCREMENT,
    refresh_token TEXT,
    email VARCHAR(255)
);`,
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("Error executing query:", queryErr.stack);
        connection.end(); // Close the connection after the query
        process.exit(1); // Exit if there is a query error
      }

      // Output the query results and fields if needed
      console.log("Query Results:", results);
      // console.log("Fields:", fields);

      connection.end(); // Close the connection after the query
      process.exit(0); // Exit the process after the query execution
    }
  );
});
