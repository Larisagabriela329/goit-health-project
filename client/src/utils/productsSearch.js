import { instance } from '../config';

export default async function productSearch(query) {
  try {
    const { data } = await instance.get(`/api/products?search=${query}`);
    return data; 
  } catch (error) {
    console.error('🔴 productSearch error:', error);
    return [];
  }
}