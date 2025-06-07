'use client'

import AddMembership from '@/app/dashboard/memberships/features/add-membership'
import EditMembership from '@/app/dashboard/memberships/features/edit-membership'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusMemberships } from '@/constants/type'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useDeleteMembershipMutation, useGetAllMemberships } from '@/queries/useMembership'
import { useDeletePackageMutation } from '@/queries/usePackage'
import { MembershipListResType, MembershipType } from '@/schema/membership.schema'
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
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const membershipsStatusColors: Record<string, string> = {
  [StatusMemberships.ACTIVE]: 'bg-green-500 text-white',
  [StatusMemberships.INACTIVE]: 'bg-yellow-500 text-white',
  [StatusMemberships.EXPIRED]: 'bg-red-500 text-white'
}

type MembershipsItem = MembershipListResType['data'][0]

const MembershipTableContext = createContext<{
  setMembershipIdEdit: (value: number) => void
  membershipIdEdit: number | undefined
  membershipDelete: MembershipsItem | null
  setMembershipDelete: (value: MembershipsItem | null) => void
}>({
  setMembershipIdEdit: (value: number | undefined) => {},
  membershipIdEdit: undefined,
  membershipDelete: null,
  setMembershipDelete: (value: MembershipsItem | null) => {}
})

export const columns: ColumnDef<MembershipType>[] = [
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
    accessorKey: 'customer_id',
    header: 'Customer',
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const userDetails = row.original.customers?.users

      const handleShowUserDetails = () => setIsDialogOpen(true)
      const handleCloseDialog = () => setIsDialogOpen(false)

      return (
        <>
          <div className='flex items-center space-x-2'>
            <Button onClick={handleShowUserDetails}>Show Details</Button>
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <div>
                  <p>Name: {userDetails.full_name}</p>
                  <p>Email: {userDetails.email}</p>
                  <p>Phone: {userDetails.phone_number}</p>
                  <p>
                    Birthday:{' '}
                    {userDetails.date_of_birth ? new Date(userDetails.date_of_birth).toLocaleDateString() : ''}
                  </p>
                </div>
                <DialogFooter>
                  <Button onClick={handleCloseDialog}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )
    }
  },
  {
    accessorKey: 'package_id',
    header: 'Package',
    cell: ({ row }) => {
      const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false)
      const packageDetails = row.original.packages

      const handleShowPackageDetails = () => setIsPackageDialogOpen(true)
      const handleClosePackageDialog = () => setIsPackageDialogOpen(false)

      const startDate = new Date(row.getValue('start_date'))
      const endDate = new Date(row.getValue('end_date'))

      return (
        <>
          <div className='flex items-center space-x-2'>
            <Button onClick={handleShowPackageDetails}>Show Details</Button>
            <Dialog open={isPackageDialogOpen} onOpenChange={handleClosePackageDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Package Details</DialogTitle>
                </DialogHeader>
                <div>
                  <p>Name: {packageDetails.package_name}</p>
                  <p>Description: {packageDetails.description}</p>
                  <p>Price: {packageDetails.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  <p>Duration: {packageDetails.duration_days} days </p>
                  <span>
                    ({startDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} -{' '}
                    {endDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })})
                  </span>
                  {/* More package details can be displayed here */}
                </div>
                <DialogFooter>
                  <Button onClick={handleClosePackageDialog}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )
    }
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => {
      const startDate = parseISO(row.getValue('start_date'))
      const formattedStartDate = format(startDate, 'dd/MM/yyyy HH:mm:ss')
      return <div>{formattedStartDate}</div>
    }
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => {
      const endDate = parseISO(row.getValue('end_date'))
      const formattedEndDate = format(endDate, 'dd/MM/yyyy HH:mm:ss')
      return <div>{formattedEndDate}</div>
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge className={`px-2 py-1 rounded-md ${membershipsStatusColors[status] || 'bg-gray-300'}`}>{status}</Badge>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setMembershipIdEdit, setMembershipDelete } = useContext(MembershipTableContext)
      const openEditMembership = () => {
        setMembershipIdEdit(row.original.card_id)
      }

      const openDeleteMembership = () => {
        setMembershipDelete(row.original)
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
            <DropdownMenuItem onClick={openEditMembership}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteMembership}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteMembership({
  membershipDelete,
  setMembershipDelete
}: {
  membershipDelete: MembershipsItem | null
  setMembershipDelete: (value: MembershipsItem | null) => void
}) {
  const { showAlert } = useAlert()
  const { mutateAsync } = useDeleteMembershipMutation()
  const deletePackage = async () => {
    if (membershipDelete) {
      try {
        const result = await mutateAsync(membershipDelete.card_id)
        setMembershipDelete(null)
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
      open={Boolean(membershipDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setMembershipDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Membership Card?</AlertDialogTitle>
          <AlertDialogDescription>
            Membership Card{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>{membershipDelete?.card_id}</span> will
            be erased permanently.
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
export default function MembershipTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [membershipIdEdit, setMembershipIdEdit] = useState<number | undefined>()
  const [membershipDelete, setMembershipDelete] = useState<MembershipsItem | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const membershipsListQuery = useGetAllMemberships()
  const isLoading = membershipsListQuery.isLoading
  const data: any[] = membershipsListQuery.data?.payload.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  // Filter data based on the search query (customer name)
  const filteredData = useMemo(() => {
    let result = data

    // Filter by customer name
    if (searchQuery) {
      result = result.filter((row) => {
        const customer = row.customers?.users
        return customer?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }
    // Filter by membership status
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((row) => row.status === statusFilter)
    }

    return result
  }, [data, searchQuery, statusFilter])

  const table = useReactTable({
    data: filteredData,
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
    <MembershipTableContext.Provider
      value={{ setMembershipIdEdit, membershipIdEdit, membershipDelete, setMembershipDelete }}
    >
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold'>Membership list</h1>
      </div>
      <div className='w-full px-6'>
        <EditMembership membershipId={membershipIdEdit} setId={setMembershipIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteMembership membershipDelete={membershipDelete} setMembershipDelete={setMembershipDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Search by customer name...'
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className='max-w-sm'
          />
          <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className='p-2 border rounded-md ml-2'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'all'}>All Status</SelectItem>
              <SelectItem className='bg-green-500 text-white mt-1' value={StatusMemberships.ACTIVE}>
                Active
              </SelectItem>
              <SelectItem className='bg-yellow-500 text-white mt-1' value={StatusMemberships.INACTIVE}>
                Inactive
              </SelectItem>
              <SelectItem className='bg-red-500 text-white !mt-1' value={StatusMemberships.EXPIRED}>
                Expired
              </SelectItem>
            </SelectContent>
          </Select>

          <div className='ml-auto flex items-center gap-2'>
            <AddMembership />
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
              pathname={ROUTES.dashboardRoutes.memberships}
            />
          </div>
        </div>
      </div>
    </MembershipTableContext.Provider>
  )
}
