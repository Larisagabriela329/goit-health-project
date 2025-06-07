import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import {
  EnterButton,
  Wrapper,
  Title,
  ProductsList,
  Calories,
  Caption,
  Kkal,
  ProductItem,
  Product,
  CaloriesWrapper,
  Recommend,
} from './recommendations.styled';
import { getIsLoggedIn } from '../../../redux/auth/auth-selectors';
import { toggleModal } from '../../../redux/modal/modal-reducer';
import { getIsModalOpen } from '../../../redux/modal/modal-selectors';
import { getCalcData } from '../../../redux/calculator/calculator-selectors';

function Recommendations() {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const isModalOpen = useSelector(getIsModalOpen);
  const products = useSelector(getCalcData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStartLoseWeight = () => {
    dispatch(toggleModal(!isModalOpen));
    return isLoggedIn ? navigate('/diary') : navigate('/registration');
  };

  return (
    <Wrapper>
      <Title>
        Your recommended daily <br />
        calorie intake is
      </Title>

      <CaloriesWrapper>
        <Calories>
          {products?.dailyCalories ? Math.trunc(products.dailyCalories) : 0}
          <Kkal>kcal</Kkal>
        </Calories>
      </CaloriesWrapper>

      <Recommend>
        <Caption>Foods you should not eat</Caption>
        <ProductsList>
          {products?.notAllowedProducts?.length ? (
            products.notAllowedProducts.map((product, idx) => (
              <ProductItem key={nanoid()}>
                <Product>
                  {idx + 1}. {product.title}
                </Product>
              </ProductItem>
            ))
          ) : (
            <ProductItem>
              <Product>No restricted products found</Product>
            </ProductItem>
          )}
        </ProductsList>
      </Recommend>

      <EnterButton type="button" onClick={handleStartLoseWeight}>
        Start losing weight
      </EnterButton>
    </Wrapper>
  );
}

export default Recommendations;
