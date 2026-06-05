"use client";

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'


interface DenaroImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string,
  fallBackWidth?:number;
  fallBackHeight?:number;
}

export function DenaroImage(props: DenaroImageProps ) {
  const [didError, setDidError] = useState(false)
  const {
    src,
    alt,
    style,
    className,
    fallbackSrc = '/error-image.png', // Default fallback image
    width = 40, // Default width
    height = 40, // Default height
    fallBackWidth = 88,
    fallBackHeight = 88,
    ...rest
  } = props

  const handleError = () => {
    setDidError(true)
  }

  if (didError) {
    return (
      <Image
        src={fallbackSrc}
        alt="Error loading image"
        width={fallBackWidth}
        height={fallBackHeight}
        className="object-contain"
        data-original-url={typeof src === 'string' ? src : ''}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt || ''}
      className={className}
      style={style}
      width={width}
      height={height}
      onError={handleError}
      {...rest}
    />
  )
}