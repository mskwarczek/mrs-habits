import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Portal, Button } from './index';
import { hextToRgbaString } from '../utils/colors';
import { flexWrappers } from '../styles/mixins';

const StyledModalBackdrop = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${flexWrappers.cCenter};
  background-color: ${({ theme }) =>
    hextToRgbaString(theme.color.bg.secondary, 0.8)};
`;

const StyledModal = styled.div`
  background-color: ${({ theme }) => theme.color.bg.primary};
  border-radius: ${({ theme }) => theme.borderRad.xl};
`;

const StyledModalTop = styled.div`
  ${flexWrappers.rLine};
  padding: ${({ theme }) => theme.space.m};
`;

const StyledModalBody = styled.div`
  padding: ${({ theme }) => theme.space.m};
`;

interface IModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  title?: string;
  portalId?: string;
  closeModal: (...args: any[]) => void;
}

const Modal = ({
  children,
  isOpen,
  title,
  portalId,
  closeModal,
}: IModalProps) => {
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
            <h2>{title}</h2>
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
