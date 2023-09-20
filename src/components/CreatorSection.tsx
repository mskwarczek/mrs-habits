import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Modal, Button } from './index';
import HabitCreator from '../creators/HabitCreator/HabitCreator';
import { TRootState, openCreatorModal, closeCreatorModal } from '../store';

interface ICreatorSection {
  type: 'HABIT';
}

const CreatorSection = ({ type }: ICreatorSection) => {
  const isModalOpen = useSelector(
    (state: TRootState) => state.modals.creatorModal.isOpen,
  );
  const dispatch = useDispatch();

  switch (type) {
    case 'HABIT':
      return (
        <div>
          <Button
            text={'Create a new habit'}
            action={() => dispatch(openCreatorModal())}
          />
          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              title={'New habit creator'}
              portalId={'creator-modal-portal-wrapper'}
              closeModal={() => dispatch(closeCreatorModal())}
            >
              <HabitCreator />
            </Modal>
          )}
        </div>
      );
    default:
      return null;
  }
};

export default CreatorSection;
