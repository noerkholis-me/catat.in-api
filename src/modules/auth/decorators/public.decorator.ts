import { SetMetadata } from "@nestjs/common";

export const IS_PUBliC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBliC_KEY, true);
