import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  message!: string;
}
