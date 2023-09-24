import React from 'react';
import styled from 'styled-components';

import { flexWrappers } from '../styles/mixins';

const StyledImage404 = styled.div<{ $width: string; $height: string }>`
  ${flexWrappers.rCenter};
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.color.bg.secondary};
  border-radius: ${({ theme }) => theme.borderRad.s};
`;

interface IImageProps {
  path: string;
  width: string;
  height: string;
  alt: string;
  title?: string;
  lazyLoading?: boolean;
}

const Image = ({
  path,
  width,
  height,
  alt,
  title,
  lazyLoading,
}: IImageProps) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const image = require(`../assets/images/${path}`);
    if (!image)
      throw new Error(`Image path assets/images/${path} does not exist`);
    return (
      <img
        src={image}
        width={width}
        height={height}
        alt={alt}
        title={title}
        loading={lazyLoading ? 'lazy' : 'eager'}
      />
    );
  } catch (error) {
    console.error(error);
    return (
      <StyledImage404
        $width={width}
        $height={height}
      >
        <p>{alt}</p>
      </StyledImage404>
    );
  }
};

export default Image;
