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
import { useDeleteEquipmentMutation } from '@/queries/useEquipment'
import { useGetAllPlanExercises } from '@/queries/usePlanExercise'
import { PlanExerciseListResType, PlanExerciseType } from '@/schema/planExercise.schema'
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
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type PlanExerciseItem = PlanExerciseListResType['data'][0]

const PlanExerciseTableContext = createContext<{
  setPlanExerciseIdEdit: (value: number) => void
  planExerciseIdEdit: number | undefined
  planExerciseDelete: PlanExerciseItem | null
  setPlanExerciseDelete: (value: PlanExerciseItem | null) => void
}>({
  setPlanExerciseIdEdit: (value: number | undefined) => {},
  planExerciseIdEdit: undefined,
  planExerciseDelete: null,
  setPlanExerciseDelete: (value: PlanExerciseItem | null) => {}
})

export const columns: ColumnDef<PlanExerciseType>[] = [
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
    id: 'coaches.user_id',
    header: 'Coach ID',
    accessorKey: 'coaches.user_id',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
      const coach = row.original.coaches
      return (
        <>
          <span className='text-sm'>{row.getValue('coaches.user_id')}</span>
          <Button size='sm' className='ml-2' onClick={() => setOpen(true)}>
            More
          </Button>
          {open && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Coach Details</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div>
                      <div>
                        <strong>ID:</strong> {coach?.user_id}
                      </div>
                      <div>
                        <strong>Name:</strong> {coach?.users.full_name || 'N/A'}
                      </div>
                      <div>
                        <strong>Email:</strong> {coach?.users.email || 'N/A'}
                      </div>
                      {/* Add more fields as needed */}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </>
      )
    }
  },
  {
    id: 'customers.user_id',
    header: 'Customer ID',
    accessorKey: 'customers.user_id',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
      const customer = row.original.customers
      return (
        <>
          <span className='text-sm'>{row.getValue('customers.user_id')}</span>
          <Button size='sm' className='ml-2' onClick={() => setOpen(true)}>
            More
          </Button>
          {open && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Customer Details</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div>
                      <div>
                        <strong>ID:</strong> {customer?.user_id}
                      </div>
                      <div>
                        <strong>Name:</strong> {customer?.users.full_name || 'N/A'}
                      </div>
                      <div>
                        <strong>Email:</strong> {customer?.users.email || 'N/A'}
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </>
      )
    }
  },
  {
    id: 'day_number',
    header: 'Day Number',
    accessorKey: 'day_number',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('day_number')}</span>
  },
  {
    id: 'sets',
    header: 'Sets',
    accessorKey: 'sets',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('sets')}</span>
  },
  {
    id: 'reps',
    header: 'Reps',
    accessorKey: 'reps',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('reps')}</span>
  },
  {
    id: 'weight',
    header: 'Weight (kg)',
    accessorKey: 'weight',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('weight')}</span>
  },
  {
    id: 'rest_time',
    header: 'Rest Time (s)',
    accessorKey: 'rest_time',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('rest_time')}</span>
  },
  {
    id: 'exercises.name',
    header: 'Exercise Name',
    accessorKey: 'exercise.name',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('exercises.name')}</span>
  },
  {
    id: 'exercises.muscleGroup',
    header: 'Muscle Group',
    accessorKey: 'exercise.muscleGroup',
    cell: ({ row }) => <span>{row.getValue('exercises.muscleGroup') || 'N/A'}</span>
  },
  {
    id: 'exercises.equipment',
    header: 'Equipment',
    accessorKey: 'exercise.equipment',
    cell: ({ row }) => <span>{row.getValue('exercises.equipment') || 'N/A'}</span>
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setPlanExerciseIdEdit, setPlanExerciseDelete } = useContext(PlanExerciseTableContext)
      const openEditUser = () => {
        setPlanExerciseIdEdit(row.original.plan_exercise_id)
      }

      const openDeleteUser = () => {
        setPlanExerciseDelete(row.original)
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
  equipmentDelete: PlanExerciseItem | null
  setEquipmentDelete: (value: PlanExerciseItem | null) => void
}) {
  const { showAlert } = useAlert()

  const { mutateAsync } = useDeleteEquipmentMutation()
  const deleteEquipment = async () => {
    if (equipmentDelete) {
      try {
        const result = await mutateAsync(equipmentDelete.plan_exercise_id)
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
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {equipmentDelete?.plan_exercise_id}
            </span>{' '}
            will be erased permanently.
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
export default function PlanExerciseTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [planExerciseIdEdit, setPlanExerciseIdEdit] = useState<number | undefined>()
  const [planExerciseDelete, setPlanExerciseDelete] = useState<PlanExerciseItem | null>(null)
  const planEquipmentListQuery = useGetAllPlanExercises()
  const isLoading = planEquipmentListQuery.isLoading
  const data: any[] = planEquipmentListQuery.data?.payload.data ?? []
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
    <PlanExerciseTableContext.Provider
      value={{ planExerciseIdEdit, setPlanExerciseIdEdit, planExerciseDelete, setPlanExerciseDelete }}
    >
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Plan Exercise list</h1>
      </div>
      <div className='w-full px-6'>
        <EditExercise exerciseId={planExerciseIdEdit} setId={setPlanExerciseIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteExercise equipmentDelete={planExerciseDelete} setEquipmentDelete={setPlanExerciseDelete} />
        <div className='flex items-center py-4'>
          {/* <Input
            placeholder='Filter Plan Exercise Name...'
            value={(table.getColumn('equipment_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('equipment_name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          /> */}
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
    </PlanExerciseTableContext.Provider>
  )
}
