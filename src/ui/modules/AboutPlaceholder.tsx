import React from 'react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'

const AboutPlaceholder = () => {
  return (
    <div className="w-full py-4">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="relative rounded-3xl p-2 shadow-(--shadow-badge)">
          <div className="relative h-[450px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/about-gs-png.png"
              alt="About GrowthStats"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-1">
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
            {/* Badge */}
            <Badge
              variant="outline"
              className="mb-4 gap-2 rounded-full px-4 py-2 shadow-(--shadow-badge)"
            >
              <span className="h-3 w-3 rounded-full bg-black"></span>
              <Text as="span" variant="body" className="text-ink">
                About GrowthStats
              </Text>
            </Badge>

            {/* Heading + Divider wrapper */}
            <div className="relative inline-block">
              <Heading
                as="h2"
                variant="h2"
                className="text-3xl leading-tight font-semibold text-gray-900 sm:text-4xl lg:text-5xl"
              >
                An Agency With Classic <br />
                Revolutionary Skills
              </Heading>

              {/* Divider inside the same relative container */}
              <span
                aria-hidden="true"
                className="absolute top-full left-1/2 mt-3 block h-[2px] w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-400 to-transparent md:left-0 md:translate-x-0"
              />
            </div>
          </div>

          {/* Subheading */}
          <Heading as="h3" variant="h3" className="mt-6 text-xl font-semibold text-gray-800">
            Your Success, Our Priority
          </Heading>

          {/* Description */}
          <Text as="p" variant="body" className="leading-relaxed text-[#848484]">
            At Growthstats, we believe in empowering our clients to achieve their goals. Our team
            works closely with you.
          </Text>

          {/* Second Title */}
          <Heading as="h3" variant="h3" className="mt-4 text-xl font-semibold text-gray-800">
            Partners You Can Rely On
          </Heading>

          <Text as="p" variant="body" className="leading-relaxed text-[#848484]">
            Landin is here to ensure your success with expert guidance and collaborative teamwork.
          </Text>

          {/* Stars + Rating */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex text-xl text-black">★ ★ ★ ★ ★</div>
          </div>
          <div className="text-sm font-semibold text-[#848484]">200+ Clients Rated</div>
        </div>
      </div>
    </div>
  )
}

export default AboutPlaceholder
