import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '../enums/product-category.emun';

export class CreateProductDto {
  @ApiProperty({ example: 'Chips', description: 'Product`s name' })
  public readonly name: string;

  @ApiProperty({
    example:
      'This is a snack food in the form of a crisp, flat or slightly bowl shaped, bite-sized unit',
    description: 'Description of product',
  })
  public readonly description: string;

  @ApiProperty({ example: '5.80', description: 'Product`s price' })
  public readonly price: number;

  @ApiProperty({
    example: 'Dairy',
    description:
      'Product`s categories (Fruit & vegetables, Carbohydrates, Proteins, Dairy, Fats & oils)',
    enum: Categories,
  })
  public readonly category: Categories;
}
