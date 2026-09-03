import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'btn3d bg-[#d4d0c8] text-black hover:bg-[#e8e4dc]',
        destructive:
          'btn3d bg-[#d4d0c8] text-red-700 hover:bg-[#e8e4dc] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'bevel-in bg-white text-black hover:bg-[#f5f5f0] dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'btn3d bg-[#e8e8d8] text-black hover:bg-[#f0f0e0]',
        ghost:
          'hover:bg-[#e8e4dc] hover:text-black dark:hover:bg-accent/50 border-none',
        link: 'text-link underline-offset-4 hover:underline hover:text-red-700',
        retro: 'bevel-out bg-[#d4d0c8] text-black hover:bg-[#e8e4dc]',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5 text-xs',
        lg: 'h-10 px-6 has-[>svg]:px-4 text-base',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
