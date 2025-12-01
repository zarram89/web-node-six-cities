import { IsEmail, IsEnum, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { UserType } from '../../types/user.type.js';

export class CreateUserDto {
  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsOptional()
  @IsString({ message: 'avatarUrl must be string' })
  public avatarUrl?: string;

  @IsString({ message: 'name is required' })
  @MinLength(1, { message: 'Min length for name is 1' })
  @MaxLength(15, { message: 'Max length for name is 15' })
  public name!: string;

  @IsString({ message: 'password is required' })
  @MinLength(6, { message: 'Min length for password is 6' })
  @MaxLength(12, { message: 'Max length for password is 12' })
  public password!: string;

  @IsEnum(UserType, { message: 'type must be one of: standard, pro' })
  public type!: UserType;
}
