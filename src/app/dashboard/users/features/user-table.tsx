'use client'

import AddUser from '@/app/dashboard/users/features/add-user'
import EditUser from '@/app/dashboard/users/features/edit-user'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Role } from '@/constants/type'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useDeleteUserMutation, useGetAllUsers } from '@/queries/useUser'
import { AccountType } from '@/schema/user.schema'
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
import { format } from 'date-fns'
import { Calendar1, CircleCheckBig, Contact, Heart, Mail, Phone, Star, VenusAndMars } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface ExtendedAccountItem extends AccountType {
  // Coach specific fields
  specialization?: string | null
  bio?: string | null
  rating_avg?: number | null

  // Customer specific fields
  health_info?: string | null
  goals?: string | null

  // Relationships
  coach_customers?: Array<{
    // For coaches - customer info
    customer_id?: number
    customer_full_name?: string
    customer_email?: string
    customer_phone_number?: string
    customer_gender?: boolean
    customer_date_of_birth?: string
    customer_avatar?: string | null

    // For customers - coach info
    coach_id?: number
    coach_full_name?: string
    coach_email?: string
    coach_phone_number?: string
    coach_gender?: boolean
    coach_date_of_birth?: string
    coach_avatar?: string | null
  }>
}

// Cập nhật type AccountItem
type AccountItem = ExtendedAccountItem

const roleColors: Record<string, string> = {
  [Role.OWNER]: 'bg-red-500 text-white',
  [Role.ADMIN]: 'bg-blue-500 text-white',
  [Role.COACH]: 'bg-yellow-500 text-white',
  [Role.CUSTOMER]: 'bg-green-500 text-white'
}

const AccountTableContext = createContext<{
  setUserIdEdit: (value: number) => void
  userIdEdit: number | undefined
  userDelete: AccountItem | null
  setUserDelete: (value: AccountItem | null) => void
  setUserDetails: (value: AccountItem | null) => void
}>({
  setUserIdEdit: (value: number | undefined) => {},
  userIdEdit: undefined,
  userDelete: null,
  setUserDelete: (value: AccountItem | null) => {},
  setUserDetails: (value: AccountItem | null) => {}
})

export const columns: ColumnDef<AccountType>[] = [
  {
    id: 'stt',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='w-[70px]'>
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
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatar') as string
      const user = row.original as AccountItem
      return (
        <Avatar className='aspect-square w-[40px] h-[40px] rounded-md object-cover'>
          <AvatarImage
            src={avatarUrl ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${avatarUrl}` : undefined}
          />
          <AvatarFallback className='rounded-none'>
            {user?.full_name
              ?.split(' ')
              .map((word: any) => word[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )
    }
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('full_name')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }) => {
      const dateOfBirth = row.getValue('date_of_birth') as string
      return <div>{dateOfBirth ? format(new Date(dateOfBirth), 'dd/MM/yyyy') : ''}</div>
    }
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
    cell: ({ row }) => <div>{row.getValue('phone_number')}</div>
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as keyof typeof Role

      return <Badge className={`px-2 py-1 rounded-md ${roleColors[role] || 'bg-gray-300'}`}>{role}</Badge>
    }
  },
  {
    id: 'details',
    header: 'Details',
    cell: ({ row }) => {
      const user = row.original as AccountItem
      const { setUserDetails } = useContext(AccountTableContext)
      return (
        <Button size={'sm'} className='hover:cursor-pointer' onClick={() => setUserDetails(user)}>
          More
        </Button>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Actions({ row }) {
      const { setUserIdEdit, setUserDelete } = useContext(AccountTableContext)
      const user = row.original as AccountItem
      const isOwner = user.role === Role.OWNER

      const openEditUser = () => {
        if (!isOwner) {
          setUserIdEdit(row.original.user_id)
        }
      }

      const openDeleteUser = () => {
        if (!isOwner) {
          setUserDelete(row.original)
        }
      }

      // Nếu là Owner thì không hiển thị dropdown
      if (isOwner) {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <DotsHorizontalIcon className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel className='!text-red-500'>Protected</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openEditUser} disabled>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openDeleteUser} disabled>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
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

function AlertDialogDeleteUser({
  userDelete,
  setUserDelete
}: {
  userDelete: AccountItem | null
  setUserDelete: (value: AccountItem | null) => void
}) {
  const { showAlert } = useAlert()

  const { mutateAsync } = useDeleteUserMutation()
  const deleteUser = async () => {
    if (userDelete) {
      try {
        const result = await mutateAsync(userDelete.user_id)
        setUserDelete(null)
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
      open={Boolean(userDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setUserDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User?</AlertDialogTitle>
          <AlertDialogDescription>
            Account <span className='bg-foreground text-primary-foreground rounded px-1'>{userDelete?.full_name}</span>{' '}
            will be erased permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteUser}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function UserDetailDialog({
  userDetails,
  setUserDetails
}: {
  userDetails: AccountItem | null
  setUserDetails: (value: AccountItem | null) => void
}) {
  if (!userDetails) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided'
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const isCoach = userDetails.role === 'COACH'
  const isCustomer = userDetails.role === 'CUSTOMER'

  return (
    <AlertDialog
      open={Boolean(userDetails)}
      onOpenChange={(value) => {
        if (!value) {
          setUserDetails(null)
        }
      }}
    >
      <AlertDialogContent className='max-w-7xl max-h-[85vh] overflow-y-auto'>
        <AlertDialogHeader className='text-center pb-2'>
          <div className='flex flex-col items-center space-y-4'>
            <Avatar className='w-20 h-20'>
              <AvatarImage
                src={
                  userDetails.avatar
                    ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${userDetails.avatar}`
                    : ''
                }
                alt={userDetails.full_name}
              />
              <AvatarFallback className='text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white'>
                {getInitials(userDetails.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex justify-center items-center flex-col'>
              <AlertDialogTitle className='text-xl font-bold text-gray-900 '>{userDetails.full_name}</AlertDialogTitle>
              <Badge className={`mt-2 ${roleColors[userDetails.role as keyof typeof roleColors] || 'bg-gray-300'}`}>
                {userDetails.role}
              </Badge>
            </div>
          </div>
        </AlertDialogHeader>

        <div className='border-t border-gray-200 my-4'></div>

        {/* Two-column layout for better space utilization */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column - Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold !text-gray-900  mb-3'>Basic Information</h3>

            <div className='flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
              <Mail size={20} className='text-gray-500' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900'>Email</p>
                <p className='text-sm text-gray-600 truncate'>{userDetails.email}</p>
              </div>
            </div>

            <div className='flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
              <Phone size={20} className='text-gray-500' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900'>Phone Number</p>
                <p className='text-sm text-gray-600'>{userDetails.phone_number || 'Not provided'}</p>
              </div>
            </div>

            <div className='flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
              <Calendar1 size={20} className='text-gray-500' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900'>Date of Birth</p>
                <p className='text-sm text-gray-600'>{formatDate(userDetails.date_of_birth)}</p>
              </div>
            </div>

            <div className='flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
              <VenusAndMars size={20} className='text-gray-500' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900'>Gender</p>
                <p className='text-sm text-gray-600'>{userDetails.gender ? 'Male' : 'Female'}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Role-specific Information */}
          {(isCoach || isCustomer) && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3 '>
                {isCoach ? 'Coach Information' : 'Customer Information'}
              </h3>

              {isCoach && (
                <>
                  <div className='flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors'>
                    <div className='flex-shrink-0'>
                      <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                        />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>Specialization</p>
                      <p className='text-sm text-gray-600'>{userDetails.specialization || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors'>
                    <Contact size={20} className='text-blue-500 mt-2.5' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>Bio</p>
                      <p className='text-sm text-gray-600'>{userDetails.bio || 'No bio available'}</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors'>
                    <Star size={20} className='text-blue-500 mt-0.5' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>Average Rating</p>
                      <p className='text-sm text-gray-600'>
                        {userDetails.rating_avg ? `${userDetails.rating_avg}/5.0` : 'No ratings yet'}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {isCustomer && (
                <>
                  <div className='flex items-start space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors'>
                    <Heart size={20} className='text-green-500 mt-5' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>Health Information</p>
                      <p className='text-sm text-gray-600'>
                        {userDetails.health_info || 'No health information provided'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors'>
                    <CircleCheckBig size={20} className='text-green-500 mt-1.5' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>Goals</p>
                      <p className='text-sm text-gray-600'>{userDetails.goals || 'No goals set'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Relationships */}
        {(isCoach || isCustomer) && userDetails.coach_customers && userDetails.coach_customers.length > 0 && (
          <>
            <div className='border-t border-gray-200 my-4'></div>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3 '>
                {isCoach
                  ? `Customers (${userDetails.coach_customers.length})`
                  : `Coaches (${userDetails.coach_customers.length})`}
              </h3>

              <div className='space-y-3 max-h-60 overflow-y-auto'>
                {userDetails.coach_customers.map((relation: any, index: number) => {
                  const person = isCoach
                    ? {
                        id: relation.customer_id,
                        name: relation.customer_full_name,
                        email: relation.customer_email,
                        phone: relation.customer_phone_number,
                        avatar: relation.customer_avatar,
                        gender: relation.customer_gender,
                        dateOfBirth: relation.customer_date_of_birth
                      }
                    : {
                        id: relation.coach_id,
                        name: relation.coach_full_name,
                        email: relation.coach_email,
                        phone: relation.coach_phone_number,
                        avatar: relation.coach_avatar,
                        gender: relation.coach_gender,
                        dateOfBirth: relation.coach_date_of_birth
                      }

                  return (
                    <div
                      key={person.id}
                      className='flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
                    >
                      <Avatar className='w-10 h-10'>
                        <AvatarImage
                          src={
                            person.avatar
                              ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/images/${person.avatar}`
                              : ''
                          }
                          alt={person.name}
                        />
                        <AvatarFallback className='text-sm bg-gradient-to-br from-purple-500 to-pink-600 text-white'>
                          {getInitials(person.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>{person.name}</p>
                        <p className='text-xs text-gray-500 truncate'>{person.email}</p>
                        <p className='text-xs text-gray-500'>{person.phone}</p>
                      </div>
                      <div className='text-xs text-gray-400'>{person.gender ? 'Male' : 'Female'}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        <AlertDialogFooter className='pt-4'>
          <AlertDialogCancel onClick={() => setUserDetails(null)} className='w-full hover:cursor-pointer'>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function UserTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const params = Object.fromEntries(searchParam.entries())
  const [userIdEdit, setUserIdEdit] = useState<number | undefined>()
  const [userDelete, setUserDelete] = useState<AccountItem | null>(null)
  const [userDetails, setUserDetails] = useState<AccountItem | null>(null)
  const accountListQuery = useGetAllUsers()
  const data: any[] = accountListQuery.data?.payload.data ?? []
  const isLoading = accountListQuery.isLoading
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
    <AccountTableContext.Provider value={{ userIdEdit, setUserIdEdit, userDelete, setUserDelete, setUserDetails }}>
      <div className='flex items-center justify-between pt-6 px-6'>
        <h1 className='text-3xl font-bold'>Users list</h1>
      </div>
      <div className='w-full px-6'>
        <EditUser id={userIdEdit} setId={setUserIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteUser userDelete={userDelete} setUserDelete={setUserDelete} />
        <UserDetailDialog userDetails={userDetails} setUserDetails={setUserDetails} />
        <div className='flex items-center py-4 space-x-3'>
          <Input
            placeholder='Filter emails...'
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />

          <Select
            value={(table.getColumn('role')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                table.getColumn('role')?.setFilterValue('')
              } else {
                table.getColumn('role')?.setFilterValue(value)
              }
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              <SelectItem value={Role.OWNER}>Owner</SelectItem>
              <SelectItem value={Role.ADMIN}>Admin</SelectItem>
              <SelectItem value={Role.COACH}>Coach</SelectItem>
              <SelectItem value={Role.CUSTOMER}>Customer</SelectItem>
            </SelectContent>
          </Select>

          <div className='ml-auto flex items-center gap-2'>
            <AddUser />
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
              pathname={ROUTES.dashboardRoutes.users}
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
