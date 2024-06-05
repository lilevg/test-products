import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Name', description: 'User`s name' })
  public readonly name: string;

  @ApiProperty({ example: 'P@ssword', description: 'User`s password' })
  public readonly password: string;
}
