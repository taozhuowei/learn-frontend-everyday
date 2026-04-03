/**
 * Component: SplitPane
 * Purpose: Provide a reusable draggable split layout for both horizontal and vertical workspaces.
 * Data flow: Parents pass two panes plus sizing constraints; the component owns only the local pane size state.
 */

import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const HANDLE_SIZE = 4

export function SplitPane({
  direction,
  first,
  second,
  fixedPane = 'first',
  defaultSize,
  defaultSizeRatio,
  minFirstSize = 240,
  minSecondSize = 240,
  className = '',
  firstClassName = '',
  secondClassName = '',
}: {
  direction: 'horizontal' | 'vertical'
  first: ReactNode
  second: ReactNode
  fixedPane?: 'first' | 'second'
  defaultSize?: number
  defaultSizeRatio?: number
  minFirstSize?: number
  minSecondSize?: number
  className?: string
  firstClassName?: string
  secondClassName?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fixedSize, setFixedSize] = useState<number | null>(defaultSize ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStateRef = useRef<{ startPosition: number; startSize: number } | null>(null)

  const isHorizontal = direction === 'horizontal'
  const layoutClassName = isHorizontal ? 'flex-row' : 'flex-col'
  const handleClassName = isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'
  const paneMinStyle = useMemo(
    () =>
      isHorizontal
        ? {
            first: { minWidth: minFirstSize },
            second: { minWidth: minSecondSize },
          }
        : {
            first: { minHeight: minFirstSize },
            second: { minHeight: minSecondSize },
          },
    [isHorizontal, minFirstSize, minSecondSize],
  )

  const getContainerSize = useCallback(() => {
    if (!containerRef.current) return 0
    return isHorizontal ? containerRef.current.clientWidth : containerRef.current.clientHeight
  }, [isHorizontal])

  useEffect(() => {
    if (fixedSize !== null || !containerRef.current) return

    const totalSize = getContainerSize()
    if (totalSize <= 0) return

    const minSize = fixedPane === 'first' ? minFirstSize : minSecondSize
    const nextSize = Math.max(minSize, Math.floor(totalSize * (defaultSizeRatio ?? 0.5)))
    setFixedSize(nextSize)
  }, [defaultSizeRatio, fixedPane, fixedSize, getContainerSize, minFirstSize, minSecondSize])

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragStateRef.current) return

      const totalSize = getContainerSize()
      const minFixedSize = fixedPane === 'first' ? minFirstSize : minSecondSize
      const minFlexibleSize = fixedPane === 'first' ? minSecondSize : minFirstSize
      const maxFixedSize = Math.max(minFixedSize, totalSize - HANDLE_SIZE - minFlexibleSize)
      const currentPosition = isHorizontal ? event.clientX : event.clientY
      const delta = currentPosition - dragStateRef.current.startPosition
      const nextSize =
        fixedPane === 'first'
          ? dragStateRef.current.startSize + delta
          : dragStateRef.current.startSize - delta

      setFixedSize(Math.max(minFixedSize, Math.min(maxFixedSize, nextSize)))
    },
    [fixedPane, getContainerSize, isHorizontal, minFirstSize, minSecondSize],
  )

  const stopDragging = useCallback(() => {
    if (!dragStateRef.current) return

    dragStateRef.current = null
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', stopDragging)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', stopDragging)
    }
  }, [onMouseMove, stopDragging])

  function startDragging(event: React.MouseEvent) {
    const currentSize = fixedSize ?? Math.floor(getContainerSize() * (defaultSizeRatio ?? 0.5))

    dragStateRef.current = {
      startPosition: isHorizontal ? event.clientX : event.clientY,
      startSize: currentSize,
    }
    setIsDragging(true)
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
  }

  const firstStyle =
    fixedPane === 'first'
      ? {
          ...paneMinStyle.first,
          ...(isHorizontal
            ? { width: fixedSize ?? undefined }
            : { height: fixedSize ?? undefined }),
        }
      : paneMinStyle.first
  const secondStyle =
    fixedPane === 'second'
      ? {
          ...paneMinStyle.second,
          ...(isHorizontal
            ? { width: fixedSize ?? undefined }
            : { height: fixedSize ?? undefined }),
        }
      : paneMinStyle.second

  return (
    <div ref={containerRef} className={`flex min-h-0 min-w-0 ${layoutClassName} ${className}`}>
      <div
        className={`min-h-0 min-w-0 shrink-0 ${fixedPane === 'first' ? '' : 'flex-1'} ${firstClassName}`}
        style={firstStyle}
      >
        {first}
      </div>
      <div
        className={`shrink-0 rounded-sm bg-[var(--color-border)] transition-colors hover:bg-[var(--color-primary)] ${handleClassName} ${isDragging ? 'bg-[var(--color-primary)]' : ''}`}
        onMouseDown={startDragging}
        role="separator"
      />
      <div
        className={`min-h-0 min-w-0 ${fixedPane === 'second' ? '' : 'flex-1'} ${secondClassName}`}
        style={secondStyle}
      >
        {second}
      </div>
    </div>
  )
}
