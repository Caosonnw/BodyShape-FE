'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useGetPackageById, useUpdatePackageMutation } from '@/queries/usePackage'
import { UpdatePackageSchema, UpdatePackageType } from '@/schema/package.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function EditPackage({
  packageId,
  setId,
  onSubmitSuccess
}: {
  packageId?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const { showAlert } = useAlert()
  const { data } = useGetPackageById({ packageId: packageId as number, enabled: Boolean(packageId) })
  const updatePackage = useUpdatePackageMutation()

  const form = useForm<UpdatePackageType>({
    resolver: zodResolver(UpdatePackageSchema),
    defaultValues: {
      package_name: '',
      description: '',
      price: 0,
      duration_days: 0
    }
  })

  const reset = () => {
    setId(undefined)
  }

  useEffect(() => {
    if (data) {
      const { package_name, description, price, duration_days } = data?.payload.data
      form.reset({
        package_name,
        description,
        price,
        duration_days
      })
    }
  }, [form, data])

  const onSubmit = async (values: UpdatePackageType) => {
    if (updatePackage.isPending) return
    try {
      let body: UpdatePackageType & { packageId: number } = { packageId: packageId as number, ...values }
      const result = await updatePackage.mutateAsync(body)
      showAlert(result.payload.message, 'success')
      reset()
      onSubmitSuccess?.()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={Boolean(packageId)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>Fields name, email, password are compulsory</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-package-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Package Name  */}
            <FormField
              control={form.control}
              name='package_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Please enter package name' {...field} className='input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Please enter package description' {...field} className='input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className='peer pe-12'
                        placeholder='0.00'
                        type='number'
                      />

                      <span className='pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
                        /VND
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration Days */}
            <FormField
              control={form.control}
              name='duration_days'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration Days</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className='peer pe-12'
                        placeholder='0'
                        type='number'
                      />

                      <span className='pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
                        /Day
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-package-form' className='hover:cursor-pointer'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
