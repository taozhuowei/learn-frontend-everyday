/**
 * Component: ResizableWorkspace
 * Purpose: 三栏可拖拽宽度的工作区布局容器。
 * 左右两列宽度由 useState 管理（不持久化），中间列自动占满剩余空间。
 */

import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_COL_WIDTH = 240
const DEFAULT_LEFT = 340
const DEFAULT_RIGHT = 360

export function ResizableWorkspace({
  left,
  center,
  right,
  defaultLeftWidth = DEFAULT_LEFT,
  defaultRightWidth = DEFAULT_RIGHT,
}: {
  left: ReactNode
  center: ReactNode
  right: ReactNode
  defaultLeftWidth?: number
  defaultRightWidth?: number
}) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [rightWidth, setRightWidth] = useState(defaultRightWidth)

  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'left' | 'right' | null>(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const leftHandleRef = useRef<HTMLDivElement>(null)
  const rightHandleRef = useRef<HTMLDivElement>(null)

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth ?? window.innerWidth
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const side = draggingRef.current
      if (!side) return

      const delta = e.clientX - startXRef.current
      const containerWidth = getContainerWidth()
      // 左右两个 handle 宽度 (5px × 2) + 间距 (10px × 2) 占用的空间
      const usedSpace = 10 + 10 + 5 + 5
      const maxWidth = containerWidth - usedSpace - MIN_COL_WIDTH * 2

      if (side === 'left') {
        const next = Math.max(
          MIN_COL_WIDTH,
          Math.min(maxWidth - rightWidth, startWidthRef.current + delta),
        )
        setLeftWidth(next)
      } else {
        const next = Math.max(
          MIN_COL_WIDTH,
          Math.min(maxWidth - leftWidth, startWidthRef.current - delta),
        )
        setRightWidth(next)
      }
    },
    [getContainerWidth, leftWidth, rightWidth],
  )

  const onMouseUp = useCallback(() => {
    draggingRef.current = null
    leftHandleRef.current?.classList.remove('dragging')
    rightHandleRef.current?.classList.remove('dragging')
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  function startDrag(side: 'left' | 'right', e: React.MouseEvent) {
    e.preventDefault()
    draggingRef.current = side
    startXRef.current = e.clientX
    startWidthRef.current = side === 'left' ? leftWidth : rightWidth
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    if (side === 'left') {
      leftHandleRef.current?.classList.add('dragging')
    } else {
      rightHandleRef.current?.classList.add('dragging')
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        height: '100%',
        padding: '10px',
      }}
    >
      {/* Left column */}
      <div style={{ width: leftWidth, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {left}
      </div>

      {/* Left drag handle */}
      <div
        ref={leftHandleRef}
        className="cf-drag-handle"
        onMouseDown={(e) => startDrag('left', e)}
        style={{ margin: '0 5px' }}
        title="拖拽调整宽度"
      />

      {/* Center column */}
      <div style={{ flex: 1, minWidth: MIN_COL_WIDTH, display: 'flex', flexDirection: 'column' }}>
        {center}
      </div>

      {/* Right drag handle */}
      <div
        ref={rightHandleRef}
        className="cf-drag-handle"
        onMouseDown={(e) => startDrag('right', e)}
        style={{ margin: '0 5px' }}
        title="拖拽调整宽度"
      />

      {/* Right column */}
      <div style={{ width: rightWidth, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {right}
      </div>
    </div>
  )
}
