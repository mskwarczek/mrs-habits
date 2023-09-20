import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const createPortalWrapper = (wrapperId: string) => {
  const portalWrapper = document.createElement('div');
  portalWrapper.setAttribute('id', wrapperId);
  document.body.appendChild(portalWrapper);
  return portalWrapper;
};

interface IPortalProps {
  wrapperId: string;
  children: React.ReactNode;
}

const Portal = ({
  wrapperId = 'default-portal-wrapper',
  children,
}: IPortalProps) => {
  const [portalWrapper, setPortalWrapper] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let wrapperElement = document.getElementById(wrapperId);
    let isWrapperCreatedByFunc = false;

    if (!wrapperElement) {
      wrapperElement = createPortalWrapper(wrapperId);
      isWrapperCreatedByFunc = true;
    }
    setPortalWrapper(wrapperElement);

    return () => {
      if (isWrapperCreatedByFunc && wrapperElement?.parentNode) {
        wrapperElement.parentNode.removeChild(wrapperElement);
      }
    };
  }, [wrapperId]);

  if (portalWrapper === null) return null;

  return createPortal(children, portalWrapper);
};

export default Portal;
