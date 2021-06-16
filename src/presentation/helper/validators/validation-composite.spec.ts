import { MissingParamError } from "../../errors";
import { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    class ValidationSub implements Validation {
      validate (inpute: any): Error {
        return new MissingParamError('field')
      }
    }
    const validationStub = new ValidationSub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  });
});