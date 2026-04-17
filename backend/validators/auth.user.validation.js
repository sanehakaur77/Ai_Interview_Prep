const { z } = require("zod");

// my Signup Validation
const signupValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),

  email: z.string().email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long"),
});

//myLogin Validation --
const loginValidation = z.object({
  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = {
  signupValidation,
  loginValidation,
};
