'use client'

import AddCoachCustomer from '@/app/dashboard/coach-customer/features/add-coach-customer'
import EditCoachCustomer from '@/app/dashboard/coach-customer/features/edit-coach-customer'
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
import { useDeleteCoachCustomerMutation, useGetAllCoachCustomers } from '@/queries/useCoachCustomer'
import { CoachCustomerResType } from '@/schema/coachCustomer.schema'
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

type CoachCustomerItem = CoachCustomerResType['data'][0]

const CoachCustomerTableContext = createContext<{
  setCoachCustomerIdEdit: (value: { oldCoachId: number; oldCustomerId: number } | undefined) => void
  coachCustomerIdEdit: { oldCoachId: number; oldCustomerId: number } | undefined
  coachCustomerDelete: CoachCustomerItem | null
  setCoachCustomerDelete: (value: CoachCustomerItem | null) => void
}>({
  setCoachCustomerIdEdit: () => {},
  coachCustomerIdEdit: undefined,
  coachCustomerDelete: null,
  setCoachCustomerDelete: () => {}
})

export const columns: ColumnDef<CoachCustomerItem>[] = [
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
    header: 'Coach Name',
    accessorFn: (row) => row.coach.full_name,
    cell: ({ row }) => <span>{row.original.coach.full_name}</span>
  },
  {
    header: 'Coach Email',
    accessorFn: (row) => row.coach.email,
    cell: ({ row }) => <span>{row.original.coach.email}</span>
  },
  {
    header: 'Coach Phone',
    accessorFn: (row) => row.coach.phone_number,
    cell: ({ row }) => <span>{row.original.coach.phone_number}</span>
  },
  {
    header: 'Gender of Coach',
    cell: ({ row }) => <span>{row.original.coach.gender ? 'Male' : 'Female'}</span>
  },
  {
    header: 'DOB of Coach',
    cell: ({ row }) => <span>{new Date(row.original.coach.date_of_birth).toLocaleDateString('en-GB')}</span>
  },
  {
    header: 'Customer Name',
    accessorFn: (row) => row.customer.full_name,
    cell: ({ row }) => <span>{row.original.customer.full_name}</span>
  },
  {
    header: 'Customer Email',
    accessorFn: (row) => row.customer.email,
    cell: ({ row }) => <span>{row.original.customer.email}</span>
  },
  {
    header: 'Customer Phone',
    accessorFn: (row) => row.customer.phone_number,
    cell: ({ row }) => <span>{row.original.customer.phone_number}</span>
  },
  {
    header: 'Gender of Customer',
    cell: ({ row }) => <span>{row.original.customer.gender ? 'Male' : 'Female'}</span>
  },
  {
    header: 'DOB of Customer',
    cell: ({ row }) => <span>{new Date(row.original.customer.date_of_birth).toLocaleDateString('en-GB')}</span>
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setCoachCustomerIdEdit, setCoachCustomerDelete } = useContext(CoachCustomerTableContext)
      const openEditUser = () => {
        setCoachCustomerIdEdit({
          oldCoachId: row.original.coach_id,
          oldCustomerId: row.original.customer_id
        })
      }

      const openDeleteUser = () => {
        setCoachCustomerDelete(row.original)
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

function AlertDialogDeleteCoachCustomer({
  coachCustomerDelete,
  setCoachCustomerDelete
}: {
  coachCustomerDelete: CoachCustomerItem | null
  setCoachCustomerDelete: (value: CoachCustomerItem | null) => void
}) {
  const { showAlert } = useAlert()

  const { mutateAsync } = useDeleteCoachCustomerMutation()
  const deletePackage = async () => {
    if (coachCustomerDelete) {
      try {
        const coachID = coachCustomerDelete.coach_id
        const customerID = coachCustomerDelete.customer_id
        const result = await mutateAsync({ coach_id: coachID, customer_id: customerID })

        setCoachCustomerDelete(null)
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
      open={Boolean(coachCustomerDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setCoachCustomerDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Coach Customer?</AlertDialogTitle>
          <AlertDialogDescription>
            Relation Coach & Customer{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {coachCustomerDelete?.coach.full_name} - {coachCustomerDelete?.customer.full_name}
            </span>{' '}
            will be erased permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePackage}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function CoachCustomerTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [coachCustomerIdEdit, setCoachCustomerIdEdit] = useState<
    | {
        oldCoachId: number
        oldCustomerId: number
      }
    | undefined
  >()
  const [coachCustomerDelete, setCoachCustomerDelete] = useState<CoachCustomerItem | null>(null)
  const coachCustomerListQuery = useGetAllCoachCustomers()
  const isLoading = coachCustomerListQuery.isLoading
  const data: any[] = coachCustomerListQuery.data?.payload?.data ?? []
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
    <CoachCustomerTableContext.Provider
      value={{ coachCustomerIdEdit, setCoachCustomerIdEdit, coachCustomerDelete, setCoachCustomerDelete }}
    >
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Coach Customer list</h1>
      </div>
      <div className='w-full px-6'>
        <EditCoachCustomer
          coachCustomerId={coachCustomerIdEdit}
          setId={setCoachCustomerIdEdit}
          onSubmitSuccess={() => {}}
        />
        <AlertDialogDeleteCoachCustomer
          coachCustomerDelete={coachCustomerDelete}
          setCoachCustomerDelete={setCoachCustomerDelete}
        />
        <div className='flex items-center py-4 gap-2'>
          <Input
            placeholder='Filter Coach Name...'
            value={(table.getColumn('Coach Name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('Coach Name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <Input
            placeholder='Filter Customer Name...'
            value={(table.getColumn('Customer Name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('Customer Name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddCoachCustomer />
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
              pathname={ROUTES.dashboardRoutes.coachCustomer}
            />
          </div>
        </div>
      </div>
    </CoachCustomerTableContext.Provider>
  )
}
