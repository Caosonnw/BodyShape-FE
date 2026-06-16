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
import { useDeleteExerciseMutation, useGetAllExercises } from '@/queries/useExercise'
import { ExerciseListResType } from '@/schema/exercise.schema'
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

type ExerciseItem = ExerciseListResType['data'][0]

const ExerciseTableContext = createContext<{
  setExerciseIdEdit: (value: number) => void
  exerciseIdEdit: number | undefined
  exerciseDelete: ExerciseItem | null
  setExerciseDelete: (value: ExerciseItem | null) => void
}>({
  setExerciseIdEdit: (value: number | undefined) => {},
  exerciseIdEdit: undefined,
  exerciseDelete: null,
  setExerciseDelete: (value: ExerciseItem | null) => {}
})

export const columns: ColumnDef<ExerciseItem>[] = [
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
    accessorKey: 'exercise_name',
    header: 'Name',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('exercise_name')}</div>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('description')}</div>
  },
  {
    accessorKey: 'muscle_group',
    header: 'Muscle Group',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('muscle_group')}</div>
  },
  {
    accessorKey: 'equipment_needed',
    header: 'Equipment Needed',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('equipment_needed')}</div>
  },
  {
    accessorKey: 'video_url',
    header: 'Video URL',
    cell: ({ row }) => {
      const videoUrl = row.getValue('video_url') as string
      return videoUrl ? (
        <a
          href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/videos/${videoUrl}`}
          target='_blank'
          title={videoUrl}
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline truncate max-w-[200px] block'
        >
          {videoUrl}
        </a>
      ) : (
        <div className='text-muted-foreground italic'>N/A</div>
      )
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
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      const value = row.getValue('updated_at')
      if (!value) return <div className='text-muted-foreground italic'>N/A</div>
      try {
        const updated_at = parseISO(value as string)
        const formattedUpdatedDate = format(updated_at, 'dd/MM/yyyy HH:mm:ss')
        return <div>{formattedUpdatedDate}</div>
      } catch {
        return <div className='text-muted-foreground italic'>Invalid date</div>
      }
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setExerciseIdEdit, setExerciseDelete } = useContext(ExerciseTableContext)
      const openEditExercise = () => {
        setExerciseIdEdit(row.original.exercise_id)
      }

      const openDeleteExercise = () => {
        setExerciseDelete(row.original)
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
            <DropdownMenuItem onClick={openEditExercise}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteExercise}>Delete</DropdownMenuItem>
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
  equipmentDelete: ExerciseItem | null
  setEquipmentDelete: (value: ExerciseItem | null) => void
}) {
  const { showAlert } = useAlert()

  const { mutateAsync } = useDeleteExerciseMutation()
  const deleteEquipment = async () => {
    if (equipmentDelete) {
      try {
        const result = await mutateAsync(equipmentDelete.exercise_id)
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
            <span className='bg-foreground text-primary-foreground rounded px-1'>{equipmentDelete?.exercise_name}</span>{' '}
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
export default function ExercisesTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [exerciseIdEdit, setExerciseIdEdit] = useState<number | undefined>()
  const [exerciseDelete, setExerciseDelete] = useState<ExerciseItem | null>(null)
  const exerciseListQuery = useGetAllExercises()
  const isLoading = exerciseListQuery.isLoading
  const data: any[] = exerciseListQuery.data?.payload.data ?? []
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
    <ExerciseTableContext.Provider value={{ exerciseIdEdit, setExerciseIdEdit, exerciseDelete, setExerciseDelete }}>
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Exercise list</h1>
      </div>
      <div className='w-full px-6'>
        <EditExercise exerciseId={exerciseIdEdit} setId={setExerciseIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteExercise equipmentDelete={exerciseDelete} setEquipmentDelete={setExerciseDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter Exercises Name...'
            value={(table.getColumn('exercise_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('exercise_name')?.setFilterValue(event.target.value)}
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
    </ExerciseTableContext.Provider>
  )
}
