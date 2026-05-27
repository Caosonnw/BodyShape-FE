'use client'

import StarRatingBasic from '@/components/commerce-ui/star-rating-basic'
import { useState } from 'react'

export default function StarRating_Basic() {
  const [rating, setRating] = useState(0)
  return (
    <div className='flex flex-row items-center gap-4'>
      <StarRatingBasic value={rating} onChange={setRating} maxStars={5} />
      <p>({rating})</p>
    </div>
  )
}
