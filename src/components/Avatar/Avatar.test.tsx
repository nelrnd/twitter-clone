import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import Avatar from './Avatar'

describe('Avatar', () => {
  it('should render an img with correct src attribute', () => {
    const src = 'https://example.com/myImage.jpg'
    render(<Avatar src={src} />)
    const img: HTMLImageElement = screen.getByAltText('avatar')
    expect(img).toBeInTheDocument()
    expect(img.tagName).toBe('IMG')
    expect(img.src).toBe(src)
  })
})
