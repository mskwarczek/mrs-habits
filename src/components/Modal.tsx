import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Portal, Button } from './index';

const StyledModalBackdrop = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.bg.secondary};
`;

const StyledModal = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background-color: ${({ theme }) => theme.color.bg.primary};
  border-radius: ${({ theme }) => theme.borderRad.xl};
`;

const StyledModalTop = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
`;

const StyledModalBody = styled.div`
  padding: ${({ theme }) => theme.space.m};
`;

interface IModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  portalId?: string;
  closeModal: (...args: any[]) => void;
}

const Modal = ({ children, isOpen, portalId, closeModal }: IModalProps) => {
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' ? closeModal() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <Portal wrapperId={portalId || 'modal-portal-wrapper'}>
      <StyledModalBackdrop onClick={() => closeModal()}>
        <StyledModal onClick={(e) => e.stopPropagation()}>
          <StyledModalTop>
            <Button
              text={'X'}
              action={closeModal}
            />
          </StyledModalTop>
          <StyledModalBody>{children}</StyledModalBody>
        </StyledModal>
      </StyledModalBackdrop>
    </Portal>
  );
};

export default Modal;
