import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { IoMdAlert } from 'react-icons/io';
import { Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { getUserData } from '../../redux/auth/auth-selectors';
import {
  dailyRate,
  getUser,
} from '../../redux/auth/auth-operations';
import { calcData } from '../../redux/calculator/calculator-reducer';
import { getCalcData } from '../../redux/calculator/calculator-selectors';
import { toggleModal } from '../../redux/modal/modal-reducer.js';
import { getIsModalOpen } from '../../redux/modal/modal-selectors';
import Modal from 'components/Modal/Modal';
import {
  StyledWrapCaloriesCalc,
  StyledHeaderCaloriesCalc,
  StyledFormCaloriesCalc,
  StyledLabelCaloriesCalc,
  StyledWrapInputCaloriesCalc,
  StyledInputCaloriesCalc,
  StyledErrorCaloriesCalc,
  BtnWrapCaloriesCalc,
  StyledBtnCaloriesCalc,
  StyledLabelBTCaloriesCalc,
  StyledRadioBtnsBTCaloriesCalc,
  StyledRadioBtnBTCaloriesCalc,
  StyledRadioLabelBTCaloriesCalc,
  StyledRadioBtnSpanCaloriesCalc,
} from './CalculatorCalorieForm.styled.jsx';

let schema = yup.object({
  weight: yup.number().min(20).max(500),
  height: yup.number().min(100).max(250),
  age: yup.number().min(18).max(100),
  desiredWeight: yup.number().min(20).max(500),
  bloodType: yup.number(),
});

function CalculatorCalorieForm() {
  const userData = useSelector(getUserData);
  const userCalcData = useSelector(getCalcData);
  const dispatch = useDispatch();
  const isModalOpen = useSelector(getIsModalOpen);

  const startValue = {
    weight: userData.weight || userCalcData.weight,
    height: userData.height || userCalcData.height,
    age: userData.age || userCalcData.age,
    desiredWeight: userData.desiredWeight || userCalcData.desiredWeight,
    bloodType: userData.bloodType || userCalcData.bloodType,
  };

  const handleSubmit = (values, { resetForm }) => {
    const body = {
      currentWeight: values.weight,
      height: values.height,
      age: values.age,
      desiredWeight: values.desiredWeight,
      bloodType: Number(values.bloodType),
    };

    dispatch(dailyRate(body))
      .unwrap()
      .then((res) => {
        if (userData) {
          dispatch(getUser());
        }

        dispatch(calcData({
          ...body,
          dailyCalories: res.dailyCalories,
          notAllowedProducts: res.notAllowedProducts,
        }));

        setTimeout(() => {
          dispatch(toggleModal(true));
        }, 100);
      })
      .catch((error) => {
        console.error('❌ Error in handleSubmit:', error);
      });
  }; 

  return (
    <StyledWrapCaloriesCalc>
      <StyledHeaderCaloriesCalc>Start losing weight</StyledHeaderCaloriesCalc>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={schema}
        initialValues={startValue}
      >
        {({ values }) => (
          <StyledFormCaloriesCalc>
            {/* Height */}
            <StyledWrapInputCaloriesCalc>
              <StyledInputCaloriesCalc type="number" name="height" placeholder=" " />
              <StyledLabelCaloriesCalc>Height *</StyledLabelCaloriesCalc>
              <ErrorMessage name="height">
                {(m) => <StyledErrorCaloriesCalc><IoMdAlert />{m}</StyledErrorCaloriesCalc>}
              </ErrorMessage>
            </StyledWrapInputCaloriesCalc>

            {/* Age */}
            <StyledWrapInputCaloriesCalc>
              <StyledInputCaloriesCalc type="number" name="age" placeholder=" " />
              <StyledLabelCaloriesCalc>Age *</StyledLabelCaloriesCalc>
              <ErrorMessage name="age">
                {(m) => <StyledErrorCaloriesCalc><IoMdAlert />{m}</StyledErrorCaloriesCalc>}
              </ErrorMessage>
            </StyledWrapInputCaloriesCalc>

            {/* Weight */}
            <StyledWrapInputCaloriesCalc>
              <StyledInputCaloriesCalc type="number" name="weight" placeholder=" " />
              <StyledLabelCaloriesCalc>Current weight *</StyledLabelCaloriesCalc>
              <ErrorMessage name="weight">
                {(m) => <StyledErrorCaloriesCalc><IoMdAlert />{m}</StyledErrorCaloriesCalc>}
              </ErrorMessage>
            </StyledWrapInputCaloriesCalc>

            {/* Desired Weight */}
            <StyledWrapInputCaloriesCalc>
              <StyledInputCaloriesCalc type="number" name="desiredWeight" placeholder=" " />
              <StyledLabelCaloriesCalc>Desired weight *</StyledLabelCaloriesCalc>
              <ErrorMessage name="desiredWeight">
                {(m) => <StyledErrorCaloriesCalc><IoMdAlert />{m}</StyledErrorCaloriesCalc>}
              </ErrorMessage>
            </StyledWrapInputCaloriesCalc>

            {/* Blood Type */}
            <div>
              <StyledLabelBTCaloriesCalc>Blood type *</StyledLabelBTCaloriesCalc>
              <StyledRadioBtnsBTCaloriesCalc component="div" name="bloodType">
                {[1, 2, 3, 4].map((type) => (
                  <StyledRadioLabelBTCaloriesCalc key={type} htmlFor={`bloodType${type}`}>
                    <StyledRadioBtnSpanCaloriesCalc idx={values.bloodType}>{type}</StyledRadioBtnSpanCaloriesCalc>
                    <StyledRadioBtnBTCaloriesCalc
                      type="radio"
                      id={`bloodType${type}`}
                      defaultChecked={values.bloodType === type}
                      name="bloodType"
                      value={type}
                    />
                  </StyledRadioLabelBTCaloriesCalc>
                ))}
              </StyledRadioBtnsBTCaloriesCalc>
            </div>

            {/* Submit Button */}
            <BtnWrapCaloriesCalc>
              <StyledBtnCaloriesCalc type="submit">Start losing weight</StyledBtnCaloriesCalc>
            </BtnWrapCaloriesCalc>
          </StyledFormCaloriesCalc>
        )}
      </Formik>
      {isModalOpen && createPortal(<Modal />, document.body)}
    </StyledWrapCaloriesCalc>
  );
}

export default CalculatorCalorieForm;
