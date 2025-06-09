import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as css from './DiaryProductListItem.styled';
import { deleteProduct } from '../../redux/day/day-operations';

function DiaryProductListItem({ valueDate }) {
  const eatenProducts = useSelector(state => state.day.eatenProducts);
  const dayId = useSelector(state => state.day.id);
  const dispatch = useDispatch();
  const [deletedObjects, setDeletedObjects] = useState([]);

  const handleDeleteFood = (consumedProductId) => {
    dispatch(deleteProduct({
      productId: consumedProductId,
      date: valueDate,
    })).then(() => {
      // You can log the new value directly from the state
      setTimeout(() => {
        // useSelector doesn't update instantly after dispatch, so use a small timeout
        console.log("New eatenProducts after delete:", 
          JSON.parse(JSON.stringify(eatenProducts))
        );
      }, 300); // Give Redux a moment to update state
    });
  };
  

 
  

  if (!eatenProducts || eatenProducts.length === 0) {
    return null;
  }

  return (
    <>
      {eatenProducts.map((eaten, index) => (
        <css.ListItem key={eaten._id || eaten.id}>
          <css.PName>{eaten.product?.title || '-'}</css.PName>
          <css.PGrame>
            {eaten.weight} <css.Kcal>grams</css.Kcal>
          </css.PGrame>
          <css.PKcal>
            {/* Calculate kcal for given weight and add null checks */}
            {eaten.product && typeof eaten.product.kcal === 'number'
              ? ((eaten.weight / 100) * eaten.product.kcal).toFixed(0)
              : '-'} <css.Kcal>kcal</css.Kcal>
          </css.PKcal>
          <css.Button
            onClick={() => handleDeleteFood(eaten._id || eaten.id, index)}
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
