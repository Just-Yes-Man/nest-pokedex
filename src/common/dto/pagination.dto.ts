import { IsNumber, IsOptional, IsPositive, Min, MinLength } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Min(0)
    offset?: number;
}