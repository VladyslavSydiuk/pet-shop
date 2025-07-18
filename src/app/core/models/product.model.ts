import {Category} from './category.model';


export interface Product {

  id: number;
  productName: string;
  price: number;
  productDescription: string;
  category: Category;
  avatarUrl: string;
}
