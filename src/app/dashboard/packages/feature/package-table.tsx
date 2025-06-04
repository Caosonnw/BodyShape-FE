'use client'

import { ROUTES } from '@/common/path'
import AutoPagination from '@/components/auto-pagination'
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
import { useGetAllPackages } from '@/queries/usePackage'
import { useGetAllUsers } from '@/queries/useUser'
import { PackageListResType, PackageType } from '@/schema/package.schema'
import { AccountListResType, AccountType } from '@/schema/user.schema'
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
import { PlusIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type PackageItem = PackageListResType['data'][0]

const PackageTableContext = createContext<{
  setPackageIdEdit: (value: number) => void
  packageIdEdit: number | undefined
  packageDelete: PackageItem | null
  setPackageDelete: (value: PackageItem | null) => void
}>({
  setPackageIdEdit: (value: number | undefined) => {},
  packageIdEdit: undefined,
  packageDelete: null,
  setPackageDelete: (value: PackageItem | null) => {}
})

export const columns: ColumnDef<PackageType>[] = [
  {
    id: 'stt',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        STT
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
    accessorKey: 'package_name',
    header: 'Name',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('package_name')}</div>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('description')}</div>
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => <div>{row.getValue('price')}</div>
  },
  {
    accessorKey: 'duration_days',
    header: 'Duration Days',
    cell: ({ row }) => <div>{row.getValue('duration_days')}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setPackageIdEdit, setPackageDelete } = useContext(PackageTableContext)
      const openEditUser = () => {
        setPackageIdEdit(row.original.package_id)
      }

      const openDeleteUser = () => {
        setPackageDelete(row.original)
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

function AlertDialogDeleteAccount({
  userDelete,
  setUserDelete
}: {
  userDelete: PackageItem | null
  setUserDelete: (value: PackageItem | null) => void
}) {
  const { showAlert } = useAlert()

  // const { mutateAsync } = useDeleteAccountMutation()
  const deleteAccount = async () => {
    if (userDelete) {
      try {
        // const result = await mutateAsync(userDelete.id)
        setUserDelete(null)
        // showAlert(result.payload.message, 'success')
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
      open={Boolean(userDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setUserDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Package?</AlertDialogTitle>
          <AlertDialogDescription>
            Package{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>{userDelete?.package_name}</span> will
            be erased permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAccount}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function PackageTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [packageIdEdit, setPackageIdEdit] = useState<number | undefined>()
  const [packageDelete, setPackageDelete] = useState<PackageItem | null>(null)
  const packageListQuery = useGetAllPackages()
  const data: any[] = packageListQuery.data?.payload.data ?? []
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
    <PackageTableContext.Provider value={{ packageIdEdit, setPackageIdEdit, packageDelete, setPackageDelete }}>
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Packages list</h1>
        <div className='flex items-center space-x-3'>
          <Button variant={'default'} className='px-4 py-2 hover:cursor-pointer'>
            Add Package
            <PlusIcon />
          </Button>
        </div>
      </div>
      <div className='w-full px-6'>
        {/* <EditUser id={packageIdEdit} setId={setPackageIdEdit} onSubmitSuccess={() => {}} /> */}
        <AlertDialogDeleteAccount userDelete={packageDelete} setUserDelete={setPackageDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter Package Name...'
            value={(table.getColumn('package_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('package_name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>{/* <AddPackage /> */}</div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Showing <strong>{table.getPaginationRowModel().rows.length}</strong> of <strong>{data.length}</strong>{' '}
            results
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname={ROUTES.dashboardRoutes.packages}
            />
          </div>
        </div>
      </div>
    </PackageTableContext.Provider>
  )
}
