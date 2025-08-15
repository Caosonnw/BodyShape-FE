'use client'

import AddExercise from '@/app/dashboard/exercises/fetures/add-exercises'
import EditExercise from '@/app/dashboard/exercises/fetures/edit-exercises'
import { ROUTES } from '@/common/path'
import AutoPagination from '@/components/auto-pagination'
import TableSkeleton from '@/components/table-skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useDeleteEquipmentMutation, useGetAllEquipments } from '@/queries/useEquipment'
import { useGetAllWorkoutLogs } from '@/queries/useWorkoutLog'
import { WorkoutLogListResType, WorkoutLogType } from '@/schema/workoutLog.schema'
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type WorkoutLogItem = WorkoutLogListResType['data'][0]

const WorkoutLogTableContext = createContext<{
  setWorkoutLogIdEdit: (value: number) => void
  workoutLogIdEdit: number | undefined
  workoutLogDelete: WorkoutLogItem | null
  setWorkoutLogDelete: (value: WorkoutLogItem | null) => void
}>({
  setWorkoutLogIdEdit: (value: number | undefined) => {},
  workoutLogIdEdit: undefined,
  workoutLogDelete: null,
  setWorkoutLogDelete: (value: WorkoutLogItem | null) => {}
})

export const columns: ColumnDef<WorkoutLogType>[] = [
  {
    id: 'stt',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        No.
        <CaretSortIcon className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row, table }) => {
      // Tính STT dựa trên trang hiện tại và index của row
      const pageIndex = table.getState().pagination.pageIndex || 0
      const pageSize = table.getState().pagination.pageSize || 10
      return <div>{pageIndex * pageSize + row.index + 1}</div>
    },
    enableSorting: true,
    accessorFn: (row, index) => index // Cho phép sắp xếp theo index
  },
  {
    id: 'actual_sets',
    header: 'Sets',
    accessorKey: 'actual_sets',
    cell: ({ row }) => <div>{row.getValue('actual_sets')}</div>
  },
  {
    id: 'actual_reps',
    header: 'Reps',
    accessorKey: 'actual_reps',
    cell: ({ row }) => <div>{row.getValue('actual_reps')}</div>
  },
  {
    id: 'actual_weight',
    header: 'Weight',
    accessorKey: 'actual_weight',
    cell: ({ row }) => <div>{row.getValue('actual_weight')}</div>
  },
  {
    id: 'workout_date',
    header: 'Workout Date',
    accessorKey: 'workout_date',
    cell: ({ row }) => {
      const value = row.getValue('workout_date')
      if (!value) return <div className='text-muted-foreground italic'>N/A</div>
      try {
        const workout_date = parseISO(value as string)
        const formatedWorkoutDate = format(workout_date, 'dd/MM/yyyy HH:mm:ss')
        return <div>{formatedWorkoutDate}</div>
      } catch {
        return <div className='text-muted-foreground italic'>Invalid date</div>
      }
    }
  },
  {
    id: 'notes',
    header: 'Notes',
    accessorKey: 'notes',
    cell: ({ row }) => <div>{row.getValue('notes')}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setWorkoutLogIdEdit, setWorkoutLogDelete } = useContext(WorkoutLogTableContext)
      const openEditUser = () => {
        setWorkoutLogIdEdit(row.original.log_id)
      }

      const openDeleteUser = () => {
        setWorkoutLogDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditUser}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteUser}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteExercise({
  equipmentDelete,
  setEquipmentDelete
}: {
  equipmentDelete: WorkoutLogItem | null
  setEquipmentDelete: (value: WorkoutLogItem | null) => void
}) {
  const { showAlert } = useAlert()

  const { mutateAsync } = useDeleteEquipmentMutation()
  const deleteEquipment = async () => {
    if (equipmentDelete) {
      try {
        const result = await mutateAsync(equipmentDelete.log_id)
        setEquipmentDelete(null)
        showAlert(result.payload.message, 'success')
      } catch (error) {
        handleErrorApi({
          error,
          setError: () => {}
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(equipmentDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEquipmentDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exercise?</AlertDialogTitle>
          <AlertDialogDescription>
            Exercise{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>{equipmentDelete?.log_id}</span> will
            be erased permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteEquipment}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function WorkoutLogTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [workoutLogIdEdit, setWorkoutLogIdEdit] = useState<number | undefined>()
  const [workoutLogDelete, setWorkoutLogDelete] = useState<WorkoutLogItem | null>(null)
  const workoutLogListQuery = useGetAllWorkoutLogs()
  const isLoading = workoutLogListQuery.isLoading
  const data: any[] = workoutLogListQuery.data?.payload.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

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
    <WorkoutLogTableContext.Provider
      value={{ workoutLogIdEdit, setWorkoutLogIdEdit, workoutLogDelete, setWorkoutLogDelete }}
    >
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Workout Log list</h1>
      </div>
      <div className='w-full px-6'>
        <EditExercise exerciseId={workoutLogIdEdit} setId={setWorkoutLogIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteExercise equipmentDelete={workoutLogDelete} setEquipmentDelete={setWorkoutLogDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter Workout Log ID...'
            value={(table.getColumn('log_id')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('log_id')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddExercise />
          </div>
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
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
              pathname={ROUTES.dashboardRoutes.exercises}
            />
          </div>
        </div>
      </div>
    </WorkoutLogTableContext.Provider>
  )
}
