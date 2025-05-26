// 'use client'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from '@/components/ui/dialog'
// import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch'
// import { useAlert } from '@/context/AlertContext'
// import { handleErrorApi } from '@/lib/utils'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Upload } from 'lucide-react'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { useForm } from 'react-hook-form'

// export default function EditUser({
//   id,
//   setId,
//   onSubmitSuccess
// }: {
//   id?: number | undefined
//   setId: (value: number | undefined) => void
//   onSubmitSuccess?: () => void
// }) {
//   const [fileImage, setFileImage] = useState<File | null>(null)
//   // const updateEmployeeMutation = useUpdateAccountMutation()
//   // const upLoadMediaMutation = useUploadMediaMutation()
//   const { showAlert } = useAlert()

//   const avatarInputRef = useRef<HTMLInputElement | null>(null)
//   // const form = useForm({
//   //   resolver:
//   // })

//   useEffect(() => {}, [])

//   const onSubmit = async () => {}

//   const reset = () => {
//     setId(undefined)
//     setFileImage(null)
//   }
//   return (
//     <Dialog
//       open={Boolean(id)}
//       onOpenChange={(value) => {
//         if (!value) {
//           reset()
//         }
//       }}
//     >
//       <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
//         <DialogHeader>
//           <DialogTitle>Cập nhật tài khoản</DialogTitle>
//           <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             noValidate
//             className='grid auto-rows-max items-start gap-4 md:gap-8'
//             id='edit-employee-form'
//             onSubmit={form.handleSubmit(onSubmit)}
//           >
//             <div className='grid gap-4 py-4'>hêllo</div>
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button type='submit' form='edit-employee-form'>
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
