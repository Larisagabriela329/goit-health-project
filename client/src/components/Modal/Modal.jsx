import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Overlay, ModalContainer, CloseModal, CloseIcon } from './modal.styled';
import Recommendations from './Recommendations/Recommendations';
import { toggleModal } from '../../redux/modal/modal-reducer';


const modalDiv = document.querySelector('#modal');
function Modal() {
  const dispatch = useDispatch();
  

  const handleOnBackdropClick = e => {
    if (e.target === e.currentTarget) {
      dispatch(toggleModal());
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        dispatch(toggleModal());
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

 
  return ReactDOM.createPortal(
    <Overlay onClick={handleOnBackdropClick}>
      <ModalContainer>
        <CloseModal
          onClick={() => dispatch(toggleModal())}
          type="button"
        >
          <CloseIcon />
        </CloseModal>
        <Recommendations />
      </ModalContainer>
    </Overlay>,
    modalDiv
  );
}

export default Modal;
