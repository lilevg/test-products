import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: '1', description: 'unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ApiProperty({ example: 'Name', description: 'User`s name' })
  @Column({ length: 100 })
  public name: string;

  @ApiProperty({ example: 'P@ssword', description: 'User`s password' })
  @Column()
  public password: string;
}
