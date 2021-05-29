import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation";
import { Validation } from "../../presentation/helper/validators/validation";
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite";
import { makeSignUpValidation } from "./signup-validation";

jest.mock('../../presentation/helper/validators/validation-composite')

describe('SignUpValidator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toBeCalledWith(validations)
  });
});