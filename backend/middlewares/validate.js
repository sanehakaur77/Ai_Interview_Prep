const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.reduce((acc, err) => {
        const field = err.path[0];
        acc[field] = err.message;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.body = result.data;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during validation",
      error: err.message,
    });
  }
};

module.exports = validate;
