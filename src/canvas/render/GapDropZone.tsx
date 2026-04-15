import { useDndContext, useDroppable } from '@dnd-kit/core'
import { dropTargetId } from '../dnd/dropTarget'

interface GapDropZoneProps {
  /** Parent node id, or null for root-level gaps. */
  parentId: string | null
  /** Index where an incoming drop should be inserted. */
  index: number
  /** Orientation of the sibling flow; 'column' → horizontal bar, 'row' → vertical bar. */
  flow: 'row' | 'column'
}

/**
 * Sits between sibling RenderNodes. Always occupies the same amount of
 * layout space (natural sibling spacing) so nothing shifts when a drag
 * starts — that way a test or user can target a gap by its at-rest
 * position. Visible affordance only appears when the pointer is over it
 * during a drag (the classic Figma/Subframe blue insertion bar).
 */
export function GapDropZone({ parentId, index, flow }: GapDropZoneProps) {
  const { active } = useDndContext()
  const dragging = active !== null

  const { setNodeRef, isOver } = useDroppable({
    id: dropTargetId({ kind: 'gap', parentId, index }),
    disabled: !dragging,
  })

  const isRow = flow === 'row'

  // Constant layout size → no drag-start shift. 12px is a natural gutter
  // between flex siblings and a comfortable drop target.
  const hitArea = isRow ? 'w-3 self-stretch' : 'h-3 w-full'
  const alignment = 'flex items-center justify-center'

  const bar = isOver
    ? isRow
      ? 'w-[3px] h-[80%] rounded-full bg-blue-500'
      : 'h-[3px] w-[85%] rounded-full bg-blue-500'
    : ''

  return (
    <div
      ref={setNodeRef}
      data-testid={`gap-${parentId ?? 'root'}-${index}`}
      data-gap-index={index}
      data-dragging={dragging ? 'true' : 'false'}
      className={`shrink-0 ${hitArea} ${alignment}`}
    >
      <div className={bar} />
    </div>
  )
}
