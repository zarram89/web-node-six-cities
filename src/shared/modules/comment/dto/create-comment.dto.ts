import { IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @MinLength(5, { message: 'Min length is 5' })
  @MaxLength(1024, { message: 'Max length is 1024' })
  public text!: string;

  @IsInt({ message: 'rating must be an integer' })
  @Min(1, { message: 'Min rating is 1' })
  @Max(5, { message: 'Max rating is 5' })
  public rating!: number;

  @IsMongoId({ message: 'userId must be valid MongoDB ID' })
  public userId!: string;

  public offerId!: string; // Will be populated from route params
}
