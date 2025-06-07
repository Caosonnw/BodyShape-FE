'use client'

import AddEquipment from '@/app/dashboard/equipments/features/add-equipments'
import EditEquipment from '@/app/dashboard/equipments/features/edit-equipments'
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
import { StatusEquipments } from '@/constants/type'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useDeleteEquipmentMutation, useGetAllEquipments } from '@/queries/useEquipment'
import { useDeletePackageMutation } from '@/queries/usePackage'
import { EquipmentListResType, EquipmentType } from '@/schema/equipment.schema'
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

type EquipmentItem = EquipmentListResType['data'][0]

const statusEquipmentolors: Record<string, string> = {
  [StatusEquipments.ACTIVE]: 'bg-green-500 text-white',
  [StatusEquipments.MAINTENANCE]: 'bg-yellow-500 text-white',
  [StatusEquipments.BROKEN]: 'bg-red-500 text-white'
}

const EquipmentTableContext = createContext<{
  setEquipmentIdEdit: (value: number) => void
  equipmentIdEdit: number | undefined
  equipmentDelete: EquipmentItem | null
  setEquipmentDelete: (value: EquipmentItem | null) => void
}>({
  setEquipmentIdEdit: (value: number | undefined) => {},
  equipmentIdEdit: undefined,
  equipmentDelete: null,
  setEquipmentDelete: (value: EquipmentItem | null) => {}
})

export const columns: ColumnDef<EquipmentType>[] = [
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
    accessorKey: 'equipment_name',
    header: 'Name',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('equipment_name')}</div>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('description')}</div>
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('location')}</div>
  },
  {
    accessorKey: 'last_maintenance_date',
    header: 'Last Maintenance Date',
    cell: ({ row }) => {
      const value = row.getValue('last_maintenance_date')
      if (!value) return <div className='text-muted-foreground italic'>N/A</div>
      try {
        const last_maintenance_date = parseISO(value as string)
        const formattedLastMaintenanceDate = format(last_maintenance_date, 'dd/MM/yyyy HH:mm:ss')
        return <div>{formattedLastMaintenanceDate}</div>
      } catch {
        return <div className='text-muted-foreground italic'>Invalid date</div>
      }
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const value = row.getValue('created_at')
      if (!value) return <div className='text-muted-foreground italic'>N/A</div>
      try {
        const created_at = parseISO(value as string)
        const formattedCreatedDate = format(created_at, 'dd/MM/yyyy HH:mm:ss')
        return <div>{formattedCreatedDate}</div>
      } catch {
        return <div className='text-muted-foreground italic'>Invalid date</div>
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return <Badge className={`px-2 py-1 rounded-md ${statusEquipmentolors[status] || 'bg-gray-300'}`}>{status}</Badge>
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setEquipmentIdEdit, setEquipmentDelete } = useContext(EquipmentTableContext)
      const openEditUser = () => {
        setEquipmentIdEdit(row.original.equipment_id)
      }

      const openDeleteUser = () => {
        setEquipmentDelete(row.original)
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

function AlertDialogDeleteEquipment({
  equipmentDelete,
  setEquipmentDelete
}: {
  equipmentDelete: EquipmentItem | null
  setEquipmentDelete: (value: EquipmentItem | null) => void
}) {
  const { showAlert } = useAlert()

  const { mutateAsync } = useDeleteEquipmentMutation()
  const deleteEquipment = async () => {
    if (equipmentDelete) {
      try {
        const result = await mutateAsync(equipmentDelete.equipment_id)
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
          <AlertDialogTitle>Delete Equipment?</AlertDialogTitle>
          <AlertDialogDescription>
            Equipment{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {equipmentDelete?.equipment_name}
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
export default function EquipmentTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [equipmentIdEdit, setEquipmentIdEdit] = useState<number | undefined>()
  const [equipmentDelete, setEquipmentDelete] = useState<EquipmentItem | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const equipmentListQuery = useGetAllEquipments()
  const isLoading = equipmentListQuery.isLoading
  const data: any[] = equipmentListQuery.data?.payload.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const filteredData = useMemo(() => {
    let result = data

    // Filter by equipments status
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((row) => row.status === statusFilter)
    }

    return result
  }, [data, statusFilter])

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
    <EquipmentTableContext.Provider
      value={{ equipmentIdEdit, setEquipmentIdEdit, equipmentDelete, setEquipmentDelete }}
    >
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Equipment list</h1>
      </div>
      <div className='w-full px-6'>
        <EditEquipment equipmentId={equipmentIdEdit} setId={setEquipmentIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteEquipment equipmentDelete={equipmentDelete} setEquipmentDelete={setEquipmentDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter Equipments Name...'
            value={(table.getColumn('equipment_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('equipment_name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className='p-2 border rounded-md ml-2'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'all'}>All Status</SelectItem>
              <SelectItem className='bg-green-500 text-white mt-1' value={StatusEquipments.ACTIVE}>
                Active
              </SelectItem>
              <SelectItem className='bg-yellow-500 text-white mt-1' value={StatusEquipments.MAINTENANCE}>
                Maintenace
              </SelectItem>
              <SelectItem className='bg-red-500 text-white !mt-1' value={StatusEquipments.BROKEN}>
                Broken
              </SelectItem>
            </SelectContent>
          </Select>
          <div className='ml-auto flex items-center gap-2'>
            <AddEquipment />
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
              pathname={ROUTES.dashboardRoutes.equipments}
            />
          </div>
        </div>
      </div>
    </EquipmentTableContext.Provider>
  )
}
