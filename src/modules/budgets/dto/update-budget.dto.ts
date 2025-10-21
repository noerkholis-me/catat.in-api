import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateBudgetDto } from "./create-budget.dto";

export class UpdateBudgetDto extends PartialType(
  OmitType(CreateBudgetDto, ["month", "year" as const]),
) {}
