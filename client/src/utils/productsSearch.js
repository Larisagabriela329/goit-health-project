import { instance } from 'config';

async function productSearch(query) {
  try {
    const products = await instance.get(`/products?search=${query}`);
    return products.data;
  } catch (error) {
    console.error(error.message);
  }
}

export default productSearch;
