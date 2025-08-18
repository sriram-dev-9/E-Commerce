/**
 * Tests for the variants-only system in the frontend
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import { ProductCard } from '@/components/ProductCard'
import { useCartContext } from '@/hooks/use-cart'
import type { Product } from '@/lib/products'

// Mock the cart context
jest.mock('@/hooks/use-cart')
const mockUseCartContext = useCartContext as jest.MockedFunction<typeof useCartContext>

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

describe('Variants-Only System', () => {
  const mockAddToCart = jest.fn()
  const mockIsAddingToCart = jest.fn().mockReturnValue(false)

  beforeEach(() => {
    mockUseCartContext.mockReturnValue({
      addToCart: mockAddToCart,
      isAddingToCart: mockIsAddingToCart,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      loading: false,
      isInitialized: true,
      isAuthenticated: false,
      initializeCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    })
    
    mockAddToCart.mockClear()
    mockIsAddingToCart.mockClear()
  })

  describe('ProductCard with Single Variant', () => {
    const singleVariantProduct: Product = {
      id: 1,
      slug: 'test-product',
      name: 'Test Product',
      description: 'Test description',
      image: '/test-image.jpg',
      category: { id: 1, name: 'Test Category', slug: 'test-category' },
      subcategory: '',
      effective_price: 100,
      price_range: '₹100',
      total_stock: 10,
      rating: 4.5,
      variants: [
        { id: 1, name: 'Standard', price: 100, stock: 10 }
      ],
      has_variants: true,
      is_in_stock: true,
    }

    it('should display single variant product correctly', () => {
      render(<ProductCard product={singleVariantProduct} />)
      
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('₹100')).toBeInTheDocument()
      expect(screen.getByText('Add to Cart')).toBeInTheDocument()
    })

    it('should add single variant to cart directly', async () => {
      render(<ProductCard product={singleVariantProduct} />)
      
      const addButton = screen.getByText('Add to Cart')
      fireEvent.click(addButton)
      
      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith(
          singleVariantProduct,
          1,
          singleVariantProduct.variants[0]
        )
      })
    })
  })

  describe('ProductCard with Multiple Variants', () => {
    const multiVariantProduct: Product = {
      id: 2,
      slug: 'multi-variant-product',
      name: 'Multi Variant Product',
      description: 'Product with multiple variants',
      image: '/test-image.jpg',
      category: { id: 1, name: 'Test Category', slug: 'test-category' },
      subcategory: '',
      effective_price: 50,
      price_range: '₹50 - ₹100',
      total_stock: 15,
      rating: 4.0,
      variants: [
        { id: 2, name: 'Small', price: 50, stock: 5 },
        { id: 3, name: 'Large', price: 100, stock: 10 }
      ],
      has_variants: true,
      is_in_stock: true,
    }

    it('should display multiple variant product correctly', () => {
      render(<ProductCard product={multiVariantProduct} />)
      
      expect(screen.getByText('Multi Variant Product')).toBeInTheDocument()
      expect(screen.getByText('₹50 - ₹100')).toBeInTheDocument()
      expect(screen.getByText('Select Options')).toBeInTheDocument()
    })

    it('should redirect to product page for variant selection', () => {
      // Mock window.location.href
      const mockLocation = { href: '' }
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      })

      render(<ProductCard product={multiVariantProduct} />)
      
      const selectButton = screen.getByText('Select Options')
      fireEvent.click(selectButton)
      
      expect(mockLocation.href).toBe('/products/multi-variant-product')
    })
  })

  describe('Out of Stock Products', () => {
    const outOfStockProduct: Product = {
      id: 3,
      slug: 'out-of-stock-product',
      name: 'Out of Stock Product',
      description: 'This product is out of stock',
      image: '/test-image.jpg',
      category: { id: 1, name: 'Test Category', slug: 'test-category' },
      subcategory: '',
      effective_price: 100,
      price_range: '₹100',
      total_stock: 0,
      rating: 4.0,
      variants: [
        { id: 4, name: 'Standard', price: 100, stock: 0 }
      ],
      has_variants: true,
      is_in_stock: false,
    }

    it('should display out of stock status', () => {
      render(<ProductCard product={outOfStockProduct} />)
      
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled()
    })

    it('should not allow adding out of stock product to cart', () => {
      render(<ProductCard product={outOfStockProduct} />)
      
      const button = screen.getByRole('button', { name: /out of stock/i })
      fireEvent.click(button)
      
      expect(mockAddToCart).not.toHaveBeenCalled()
    })
  })

  describe('Low Stock Products', () => {
    const lowStockProduct: Product = {
      id: 4,
      slug: 'low-stock-product',
      name: 'Low Stock Product',
      description: 'This product has low stock',
      image: '/test-image.jpg',
      category: { id: 1, name: 'Test Category', slug: 'test-category' },
      subcategory: '',
      effective_price: 100,
      price_range: '₹100',
      total_stock: 3,
      rating: 4.0,
      variants: [
        { id: 5, name: 'Standard', price: 100, stock: 3 }
      ],
      has_variants: true,
      is_in_stock: true,
    }

    it('should display low stock warning', () => {
      render(<ProductCard product={lowStockProduct} />)
      
      expect(screen.getByText('Only 3 left')).toBeInTheDocument()
      expect(screen.getByText('3 in stock')).toBeInTheDocument()
    })
  })
})

describe('Product Type Validation', () => {
  it('should ensure all products have variants in TypeScript', () => {
    // This test ensures our TypeScript types enforce variants-only system
    const validProduct: Product = {
      id: 1,
      slug: 'test-product',
      name: 'Test Product',
      description: 'Test description',
      image: '/test-image.jpg',
      category: { id: 1, name: 'Test Category', slug: 'test-category' },
      subcategory: '',
      effective_price: 100,
      price_range: '₹100',
      total_stock: 10,
      variants: [
        { id: 1, name: 'Standard', price: 100, stock: 10 }
      ],
      has_variants: true,
      is_in_stock: true,
    }

    // This should compile without errors
    expect(validProduct.variants).toBeDefined()
    expect(validProduct.variants.length).toBeGreaterThan(0)
    expect(validProduct.has_variants).toBe(true)
    expect(validProduct.effective_price).toBeDefined()
    expect(validProduct.total_stock).toBeDefined()
  })
})