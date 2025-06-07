import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as css from './DiaryProductListItem.styled';
import { dayInfo, deleteProduct } from '../../redux/day/day-operations';

function DiaryProductListItem({ valueDate }) {
  const eatenProducts = useSelector(state => state.day.eatenProducts);
  const dayId = useSelector(state => state.day.id);
  const dispatch = useDispatch();
  let selectedDate = useMemo(() => ({ date: valueDate }), [valueDate]);
  const [deletedObjects, setDeletedObjects] = useState([]);

  const handleDeleteFood = (eatenProductId, index) => {
    if (deletedObjects.includes(index)) {
      return;
    }

    const body = {
      dayId,
      productId: eatenProductId, // use productId, not eatenProductId (see thunk)
      date: valueDate,
    };

    setDeletedObjects([...deletedObjects, index]);

    dispatch(deleteProduct(body))
      .then(() => {
        dispatch(dayInfo(selectedDate));
      })
      .catch(error => {
        console.log(error);
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
