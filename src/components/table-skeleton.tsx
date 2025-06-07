import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function TableSkeleton() {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 8 }).map((_, idx) => (
              <TableHead key={idx}>
                <Skeleton className='h-4 w-24' />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: 8 }).map((__, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton className='h-4 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
