import { CreateBudgetDto } from "@/modules/budgets/dto";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "percentageSum", async: false })
export class PercentageSumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
    const object = args.object as CreateBudgetDto;
    const needs = object.needsPercentage ?? 50;
    const wants = object.wantsPercentage ?? 30;
    const savings = object.savingsPercentage ?? 20;

    return needs + wants + savings === 100;
  }

  defaultMessage(args?: ValidationArguments): string {
    const object = args.object as CreateBudgetDto;
    const total =
      (object.needsPercentage ?? 50) +
      (object.wantsPercentage ?? 30) +
      (object.savingsPercentage ?? 20);

    return `Total percentage harus 100%, sekarang ${total}%`;
  }
}
