import { IEvent } from '@/components/calendar/interfaces'
import { useAlert } from '@/context/AlertContext'
import { useUpdateScheduleMutation } from '@/queries/useSchedule'

export function useUpdateEvent() {
  const { showAlert } = useAlert()
  const updateSchedules = useUpdateScheduleMutation()

  const updateEvent = (event: IEvent) => {
    const newEvent: IEvent = event

    newEvent.start_date = new Date(event.start_date).toISOString()
    newEvent.end_date = new Date(event.end_date).toISOString()

    try {
      updateSchedules.mutate({
        schedule_id: event.schedule_id,
        body: {
          ...newEvent,
          start_date: newEvent.start_date,
          end_date: newEvent.end_date
        }
      })

      showAlert('Event updated successfully', 'success')
    } catch (error) {
      showAlert('Error updating event', 'error')
    }
  }

  return { updateEvent }
}
