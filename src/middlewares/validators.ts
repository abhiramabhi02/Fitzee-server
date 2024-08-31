import { body } from "express-validator";

class Validators {
  static registration = [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Enter a password with atleast 6 characters"),
    body("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .trim()
      .escape(),
  ];
}

export default Validators
