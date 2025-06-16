import { useSelector, useDispatch } from 'react-redux';
import * as css from './DiaryProductListItem.styled';
import { deleteProduct } from '../../redux/day/day-operations';

function DiaryProductListItem({ valueDate }) {
  const eatenProducts = useSelector(state => state.day.eatenProducts);
  const dispatch = useDispatch();

  const handleDeleteFood = (consumedProductId) => {
    dispatch(deleteProduct({
      productId: consumedProductId,
      date: valueDate,
    }));
  };

  if (!eatenProducts || eatenProducts.length === 0) {
    return null;
  }

  return (
    <>
      {eatenProducts.map((eaten) => (
        <css.ListItem key={eaten._id || eaten.id}>
          <css.PName>{eaten.product?.title || '-'}</css.PName>
          <css.PGrame>
            {eaten.weight} <css.Kcal>grams</css.Kcal>
          </css.PGrame>
          <css.PKcal>
            {eaten.product && typeof eaten.product.calories === 'number'
              ? ((eaten.weight / 100) * eaten.product.calories).toFixed(0)
              : '-'} <css.Kcal>kcal</css.Kcal>
          </css.PKcal>
          <css.Button
            onClick={() => handleDeleteFood(eaten._id || eaten.id)}
            type="button"
          >
            <css.Close />
          </css.Button>
        </css.ListItem>
      ))}
    </>
  );
}

export default DiaryProductListItem;
