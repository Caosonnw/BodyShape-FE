import { cn } from '@/lib/utils'
import type { CSSProperties, ElementRef, HTMLAttributes, ReactElement } from 'react'
import { Children, cloneElement, forwardRef, isValidElement, useMemo } from 'react'

type TAvatarGroupRef = ElementRef<'div'>
type TAvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  max?: number
  spacing?: number
}

type AvatarChildProps = {
  className?: string
  style?: CSSProperties
  [key: string]: any
}

const AvatarGroup = forwardRef<TAvatarGroupRef, TAvatarGroupProps>(
  ({ className, children, max = 1, spacing = 10, ...props }, ref) => {
    const avatarItems = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarChildProps>[]

    const renderContent = useMemo(() => {
      return (
        <>
          {avatarItems.slice(0, max).map((child, index) =>
            cloneElement(child, {
              key: child.key ?? index,
              className: cn(child.props.className, 'border-2 border-background'),
              style: {
                marginLeft: index === 0 ? 0 : -spacing,
                ...child.props.style
              }
            })
          )}

          {avatarItems.length > max && (
            <div
              key='more'
              className={cn(
                'relative flex items-center justify-center rounded-full border-2 border-background bg-muted',
                avatarItems[0]?.props.className
              )}
              style={{ marginLeft: -spacing }}
            >
              <p>+{avatarItems.length - max}</p>
            </div>
          )}
        </>
      )
    }, [avatarItems, max, spacing])

    return (
      <div ref={ref} className={cn('relative flex', className)} {...props}>
        {renderContent}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

export { AvatarGroup }
