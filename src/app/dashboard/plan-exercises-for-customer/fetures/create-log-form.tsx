'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateLogForm({
  defaults,
  onCancel,
  onSave,
  isSaving
}: {
  defaults: { sets: number; reps: number; weight: number }
  onCancel: () => void
  onSave: (p: {
    actual_sets: number
    actual_reps: number
    actual_weight: number
    notes: string
    workout_date: string
  }) => void
  isSaving: boolean
}) {
  const [form, setForm] = useState({
    actual_sets: defaults.sets || 0,
    actual_reps: defaults.reps || 0,
    actual_weight: Math.max(0, defaults.weight || 0),
    notes: '',
    workout_date: new Date().toISOString().slice(0, 10)
  })

  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-3 gap-3'>
        <div>
          <Label htmlFor='actual_sets'>Sets</Label>
          <Input
            id='actual_sets'
            type='number'
            min={0}
            value={form.actual_sets}
            onChange={(e) => setForm((f) => ({ ...f, actual_sets: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor='actual_reps'>Reps</Label>
          <Input
            id='actual_reps'
            type='number'
            min={0}
            value={form.actual_reps}
            onChange={(e) => setForm((f) => ({ ...f, actual_reps: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor='actual_weight'>Weight (kg)</Label>
          <Input
            id='actual_weight'
            type='number'
            min={0}
            value={form.actual_weight}
            onChange={(e) => setForm((f) => ({ ...f, actual_weight: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor='workout_date'>Date</Label>
        <Input
          id='workout_date'
          type='date'
          value={form.workout_date}
          onChange={(e) => setForm((f) => ({ ...f, workout_date: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor='notes'>Notes</Label>
        <Textarea
          id='notes'
          rows={3}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder='How did it feel today?'
        />
      </div>

      <div className='flex justify-end gap-2 pt-2'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(form)} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Log'}
        </Button>
      </div>
    </div>
  )
}
