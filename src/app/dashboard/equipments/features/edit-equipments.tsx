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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAlert } from '@/context/AlertContext'
import { handleErrorApi } from '@/lib/utils'
import { useGetEquipmentById, useUpdateEquipmentMutation } from '@/queries/useEquipment'
import { UpdateEquipmentSchema, UpdateEquipmentType } from '@/schema/equipment.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function EditEquipment({
  equipmentId,
  setId,
  onSubmitSuccess
}: {
  equipmentId?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const { showAlert } = useAlert()
  const { data } = useGetEquipmentById({ equipmentId: equipmentId as number, enabled: Boolean(equipmentId) })
  const updateEquipment = useUpdateEquipmentMutation()

  const form = useForm<UpdateEquipmentType>({
    resolver: zodResolver(UpdateEquipmentSchema),
    defaultValues: {
      equipment_name: '',
      description: '',
      location: '',
      status: 'ACTIVE'
    }
  })

  const reset = () => {
    setId(undefined)
  }

  useEffect(() => {
    if (data) {
      const { equipment_name, description, location, status } = data?.payload.data
      form.reset({
        equipment_name,
        description,
        location,
        status
      })
    }
  }, [form, data])

  const onSubmit = async (values: UpdateEquipmentType) => {
    if (updateEquipment.isPending) return
    try {
      let body: UpdateEquipmentType & { equipmentId: number } = { equipmentId: equipmentId as number, ...values }
      const result = await updateEquipment.mutateAsync(body)
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
      open={Boolean(equipmentId)}
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
            id='edit-equipment-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Equipment Name  */}
            <FormField
              control={form.control}
              name='equipment_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Please enter equipment name' {...field} className='input' />
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

            {/* Location */}
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder='Please enter location' {...field} className='input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select euipment status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ACTIVE'>ACTIVE</SelectItem>
                        <SelectItem value='MAINTENANCE'>MAINTENANCE</SelectItem>
                        <SelectItem value='BROKEN'>BROKEN</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-equipment-form' className='hover:cursor-pointer'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
