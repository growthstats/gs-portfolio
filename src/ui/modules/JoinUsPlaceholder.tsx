import React from 'react'
import { Badge } from '@/components/ui/badge'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'

const JoinUsPlaceholder = () => {
  return (
    <div className="flex w-full justify-center py-2">
      <div className="flex w-full flex-col items-center rounded-3xl bg-[#F0F0F0] px-4 py-8 text-center shadow-(--shadow-badge)">
        <Badge
          variant="outline"
          className="mb-4 gap-2 rounded-full px-4 py-1.5 shadow-(--shadow-badge)"
        >
          <span className="h-3 w-3 rounded-full bg-black"></span>
          <Text as="span" variant="eyebrow" className="text-ink">
            Join Us Now
          </Text>
        </Badge>

        {/* Main Heading */}
        <Heading
          as="h2"
          variant="h2"
          className="max-w-3xl text-3xl leading-snug font-semibold sm:text-4xl lg:text-5xl"
        >
          <span className="bg-gradient-to-b from-[#8A8A8A] via-[#8A8A8A] to-black bg-clip-text text-transparent">
            Each Project we Undertake
          </span>
          <br />

          <span className="text-black">is a Unique Opportunity.</span>
        </Heading>

        {/* Description */}
        <Text as="p" variant="body" className="mt-4 max-w-xl text-[#616060]">
          Ready to take the next step? Join us now and start transforming your vision into reality
          with expert support.
        </Text>

        {/* Bottom Button */}
        <button className="mt-8 rounded-full px-8 py-3 font-medium shadow-(--shadow-badge)">
          Book an Appointment
        </button>
      </div>
    </div>
  )
}

export default JoinUsPlaceholder
