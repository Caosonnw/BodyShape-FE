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
import { useGetAllTrainingPlans } from '@/queries/useTrainingPlan'
import { EquipmentType } from '@/schema/equipment.schema'
import { TrainingPlanListResType, TrainingPlanType } from '@/schema/trainingPlan.schema'
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

type TrainingPlanItem = TrainingPlanListResType['data'][0]

const TrainingPlanTableContext = createContext<{
  setTrainingPlanIdEdit: (value: number) => void
  trainingPlanIdEdit: number | undefined
  trainingPlanDelete: TrainingPlanItem | null
  setTrainingPlanDelete: (value: TrainingPlanItem | null) => void
}>({
  setTrainingPlanIdEdit: (value: number | undefined) => {},
  trainingPlanIdEdit: undefined,
  trainingPlanDelete: null,
  setTrainingPlanDelete: (value: TrainingPlanItem | null) => {}
})

export const columns: ColumnDef<TrainingPlanType>[] = [
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
                        <strong>Name:</strong>
                        {customer?.users.full_name || 'N/A'}
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
    id: 'description',
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('description')}</span>
  },
  {
    id: 'diet_plan',
    header: 'Diet Plan',
    accessorKey: 'diet_plan',
    cell: ({ row }) => <span className='text-sm'>{row.getValue('diet_plan')}</span>
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setTrainingPlanIdEdit, setTrainingPlanDelete } = useContext(TrainingPlanTableContext)
      const openEditTrainingPlan = () => {
        setTrainingPlanIdEdit(row.original.plan_id)
      }

      const openDeleteTrainingPlan = () => {
        setTrainingPlanDelete(row.original)
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
            <DropdownMenuItem onClick={openEditTrainingPlan}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTrainingPlan}>Delete</DropdownMenuItem>
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
  equipmentDelete: TrainingPlanItem | null
  setEquipmentDelete: (value: TrainingPlanItem | null) => void
}) {
  const { showAlert } = useAlert()

  const { mutateAsync } = useDeleteEquipmentMutation()
  const deleteEquipment = async () => {
    if (equipmentDelete) {
      try {
        const result = await mutateAsync(equipmentDelete.plan_id)
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
            <span className='bg-foreground text-primary-foreground rounded px-1'>{equipmentDelete?.plan_id}</span> will
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
export default function TrainingPlanTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [trainingPlanIdEdit, setTrainingPlanIdEdit] = useState<number | undefined>()
  const [trainingPlanDelete, setTrainingPlanDelete] = useState<TrainingPlanItem | null>(null)
  const trainingPlanListQuery = useGetAllTrainingPlans()
  const isLoading = trainingPlanListQuery.isLoading
  const data: any[] = trainingPlanListQuery.data?.payload.data ?? []
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
    <TrainingPlanTableContext.Provider
      value={{ trainingPlanIdEdit, setTrainingPlanIdEdit, trainingPlanDelete, setTrainingPlanDelete }}
    >
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Training Plan list</h1>
      </div>
      <div className='w-full px-6'>
        <EditExercise exerciseId={trainingPlanIdEdit} setId={setTrainingPlanIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteExercise equipmentDelete={trainingPlanDelete} setEquipmentDelete={setTrainingPlanDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter Exercises Name...'
            value={(table.getColumn('equipment_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('equipment_name')?.setFilterValue(event.target.value)}
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
              pathname={ROUTES.dashboardRoutes.trainingPlans}
            />
          </div>
        </div>
      </div>
    </TrainingPlanTableContext.Provider>
  )
}
