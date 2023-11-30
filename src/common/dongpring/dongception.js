class ErrorResponse {
  constructor(status, message) {
    this.status = status;
    this.body = { error: message };
  }

  send(res) {
    res.status(this.status).json(this.body);
  }
}
const dongception = (error, req, res, next) => {
  if (error instanceof ErrorResponse) {
    error.send(res);
  } else {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { ErrorResponse, dongception };
