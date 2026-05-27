'use client'

import { ROUTES } from '@/common/path'
import AutoPagination from '@/components/auto-pagination'
import TableSkeleton from '@/components/table-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetAllWorkoutLogs } from '@/queries/useWorkoutLog'
import { WorkoutLogListResType, WorkoutLogType } from '@/schema/workoutLog.schema'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import { Eye } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type WorkoutLogItem = WorkoutLogListResType['data'][0]

const PAGE_SIZE = 10

export default function WorkoutLogTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const workoutLogListQuery = useGetAllWorkoutLogs()
  const isLoading = workoutLogListQuery.isLoading
  const data: WorkoutLogType[] = workoutLogListQuery.data?.payload.data ?? []
  const [selectedWorkoutLog, setSelectedWorkoutLog] = useState<WorkoutLogType | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  const columns = useMemo<ColumnDef<WorkoutLogType>[]>(
    () => [
      {
        id: 'stt',
        header: ({ column }) => (
          <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            No.
            <CaretSortIcon className='ml-2 h-4 w-4' />
          </Button>
        ),
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex || 0

          const pageSize = table.getState().pagination.pageSize || 10

          return <div>{pageIndex * pageSize + row.index + 1}</div>
        },
        enableSorting: true,
        accessorFn: (_, index) => index
      },

      {
        id: 'log_id',
        header: 'Log ID',
        accessorFn: (row) => row.log_id?.toString(),
        cell: ({ row }) => <div>{row.original.log_id}</div>
      },

      {
        id: 'exercise_name',
        header: 'Exercise',
        accessorFn: (row) => row.exercise?.name,
        cell: ({ row }) => <div className='font-medium'>{row.original.exercise?.name}</div>
      },

      {
        id: 'customer_name',
        header: 'Customer',
        accessorFn: (row) => row.customer?.full_name,
        cell: ({ row }) => <div>{row.original.customer?.full_name}</div>
      },

      {
        id: 'coach_name',
        header: 'Coach',
        accessorFn: (row) => row.coaches?.full_name,
        cell: ({ row }) => <div>{row.original.coaches?.full_name}</div>
      },

      {
        id: 'actual_sets',
        header: 'Sets',
        accessorKey: 'actual_sets'
      },

      {
        id: 'actual_reps',
        header: 'Reps',
        accessorKey: 'actual_reps'
      },

      {
        id: 'actual_weight',
        header: 'Weight',
        accessorKey: 'actual_weight'
      },

      {
        id: 'workout_date',
        header: 'Workout Date',
        accessorKey: 'workout_date',
        cell: ({ row }) => {
          const value = row.getValue('workout_date')

          if (!value) {
            return <div className='italic text-muted-foreground'>N/A</div>
          }

          try {
            const workoutDate = parseISO(value as string)

            return <div>{format(workoutDate, 'dd/MM/yyyy HH:mm:ss')}</div>
          } catch {
            return <div className='italic text-muted-foreground'>Invalid date</div>
          }
        }
      },

      {
        id: 'actions',
        enableHiding: false,
        header: 'Actions',
        cell: ({ row }) => {
          const workoutLog = row.original

          return (
            <Button
              size='sm'
              className='gap-2 hover:cursor-pointer bg-primary'
              onClick={() => setSelectedWorkoutLog(workoutLog)}
            >
              <Eye className='h-4 w-4' />
              View
            </Button>
          )
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <>
      <div className='flex items-center justify-between px-6 pt-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Workout Log List</h1>
      </div>

      <div className='w-full px-6'>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter Workout Log ID...'
            value={(table.getColumn('log_id')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('log_id')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Showing <strong>{table.getPaginationRowModel().rows.length}</strong> of <strong>{data.length}</strong>{' '}
            results
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname={ROUTES.dashboardRoutes.users}
            />
          </div>
        </div>
      </div>

      <Dialog open={!!selectedWorkoutLog} onOpenChange={() => setSelectedWorkoutLog(null)}>
        <DialogContent className='max-h-screen overflow-auto sm:max-w-[700px]'>
          <DialogHeader>
            <DialogTitle>Workout Log Details</DialogTitle>
          </DialogHeader>

          {selectedWorkoutLog && (
            <div className='space-y-6'>
              {/* Customer */}
              <div className='rounded-xl border p-4'>
                <h3 className='mb-4 text-lg font-semibold'>Customer</h3>

                <div className='flex items-center gap-4'>
                  <Avatar className='aspect-square h-16 w-16 rounded-xl object-cover'>
                    <AvatarImage
                      src={
                        selectedWorkoutLog.customer?.avatar
                          ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${selectedWorkoutLog.customer.avatar}`
                          : undefined
                      }
                    />

                    <AvatarFallback className='rounded-xl text-sm font-semibold'>
                      {selectedWorkoutLog.customer?.full_name
                        ?.split(' ')
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='font-medium'>{selectedWorkoutLog.customer?.full_name}</p>

                    <p className='text-sm text-muted-foreground'>{selectedWorkoutLog.customer?.email}</p>

                    <p className='text-sm text-muted-foreground'>{selectedWorkoutLog.customer?.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* Coach */}
              <div className='rounded-xl border p-4'>
                <h3 className='mb-4 text-lg font-semibold'>Coach</h3>

                <div className='flex items-center gap-4'>
                  <Avatar className='aspect-square h-16 w-16 rounded-xl object-cover'>
                    <AvatarImage
                      src={
                        selectedWorkoutLog.coaches?.avatar
                          ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${selectedWorkoutLog.coaches.avatar}`
                          : undefined
                      }
                    />

                    <AvatarFallback className='rounded-xl text-sm font-semibold'>
                      {selectedWorkoutLog.coaches?.full_name
                        ?.split(' ')
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='font-medium'>{selectedWorkoutLog.coaches?.full_name}</p>

                    <p className='text-sm text-muted-foreground'>{selectedWorkoutLog.coaches?.email}</p>
                  </div>
                </div>
              </div>

              {/* Exercise */}
              <div className='rounded-xl border p-4'>
                <h3 className='mb-4 text-lg font-semibold'>Exercise</h3>

                <div className='space-y-2'>
                  <p>
                    <strong>Name:</strong> {selectedWorkoutLog.exercise?.name}
                  </p>

                  <p>
                    <strong>Muscle Group:</strong> {selectedWorkoutLog.exercise?.muscleGroup}
                  </p>

                  <p>
                    <strong>Equipment:</strong> {selectedWorkoutLog.exercise?.equipment}
                  </p>

                  <p>
                    <strong>Description:</strong> {selectedWorkoutLog.exercise?.description}
                  </p>
                </div>
              </div>

              {/* Workout Info */}
              <div className='rounded-xl border p-4'>
                <h3 className='mb-4 text-lg font-semibold'>Workout Information</h3>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Sets</p>

                    <p className='font-semibold'>{selectedWorkoutLog.actual_sets}</p>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>Reps</p>

                    <p className='font-semibold'>{selectedWorkoutLog.actual_reps}</p>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>Weight</p>

                    <p className='font-semibold'>{selectedWorkoutLog.actual_weight} kg</p>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>Workout Date</p>

                    <p className='font-semibold'>
                      {format(parseISO(selectedWorkoutLog.workout_date), 'dd/MM/yyyy HH:mm:ss')}
                    </p>
                  </div>
                </div>

                <div className='mt-4'>
                  <p className='text-sm text-muted-foreground'>Notes</p>

                  <p className='mt-1'>{selectedWorkoutLog.notes}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
