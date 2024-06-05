import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '../enums/product-category.emun';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Product {
  @ApiProperty({ example: '1', description: 'unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ApiProperty({ example: 'Chips', description: 'Product`s name' })
  @Column({ unique: true })
  public readonly name: string;

  @ApiProperty({
    example:
      'This is a snack food in the form of a crisp, flat or slightly bowl shaped, bite-sized unit',
    description: 'Description of product',
  })
  @Column({ length: 100 })
  public readonly description: string;

  @ApiProperty({ example: '$5.80', description: 'Product`s price' })
  @Column({ type: 'float' })
  public readonly price: number;

  @ApiProperty({
    example: 'Dairy',
    description:
      'Product`s categories (Fruit & vegetables, Carbohydrates, Proteins, Dairy, Fats & oils)',
    enum: Categories,
  })
  @Column({ enum: Categories })
  public readonly category: Categories;
}
