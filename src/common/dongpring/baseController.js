class BaseController {
  constructor() {
    this.applyAsyncWrapper();
  }

  applyAsyncWrapper() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter(
        (prop) => typeof this[prop] === "function" && prop !== "constructor"
      )
      .forEach((method) => {
        this[method] = asyncWrapper(this[method].bind(this));
      });
  }
}

const asyncWrapper = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);
    if (result !== undefined) {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = BaseController;
