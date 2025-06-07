'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useCreatePackageMutation } from '@/queries/usePackage'
import { CreatePackageSchema, CreatePackageType } from '@/schema/package.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddPackage() {
  const [open, setOpen] = useState(false)
  const addPackageMutation = useCreatePackageMutation()
  const { showAlert } = useAlert()
  const form = useForm<CreatePackageType>({
    resolver: zodResolver(CreatePackageSchema),
    defaultValues: {
      package_name: '',
      description: '',
      price: 0,
      duration_days: 0
    }
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreatePackageType) => {
    if (addPackageMutation.isPending) return
    try {
      const body = {
        package_name: values.package_name,
        description: values.description,
        price: Number(values.price),
        duration_days: Number(values.duration_days)
      }
      const result = await addPackageMutation.mutateAsync(body)
      showAlert(result.payload.message, 'success')
      reset()
      setOpen(false)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-10 gap-1 text-[13px] hover:cursor-pointer'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Package</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto' onEscapeKeyDown={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Create Package</DialogTitle>
          <DialogDescription>Fields package name, description, price and duration day are compulsory</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-package-form'
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
          <Button type='submit' form='add-package-form' className='hover:cursor-pointer'>
            Add Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
