import React from 'react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'

const AboutPlaceholder = () => {
  return (
    <div className="w-full py-4 md:m-2">
      {/* Outer grid: on lg it's two columns, on mobile it stacks */}
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
        {/* ---------- DESKTOP IMAGE (left column only) ---------- */}
        {/* This image is hidden on mobile and visible on lg+ so desktop layout remains unchanged */}
        <div className="relative hidden rounded-3xl p-2 shadow-(--shadow-badge) lg:block">
          <div className="relative h-[450px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/about-gs-png.png"
              alt="About GrowthStats"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* ---------- CONTENT COLUMN ---------- */}
        {/* This column contains the Badge, Heading, a mobile-only image, content, stars, and mobile divider. */}
        <div className="space-y-1">
          {/* Badge (mobile: appears first inside this column) */}
          <div className="flex justify-center md:justify-start">
            <Badge
              variant="outline"
              className="mb-4 gap-2 rounded-full px-4 py-2 shadow-(--shadow-badge)"
            >
              <span className="h-3 w-3 rounded-full bg-black" />
              <Text as="span" variant="body" className="text-ink">
                About GrowthStats
              </Text>
            </Badge>
          </div>

          {/* Heading + (DESKTOP divider kept exactly as before) */}
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="relative inline-block">
              <Heading
                as="h2"
                variant="h2"
                className="text-3xl leading-tight font-semibold text-gray-900 sm:text-4xl lg:text-5xl"
              >
                An Agency With Classic <br />
                Revolutionary Skills
              </Heading>

              {/* ----- DESKTOP ONLY divider: keep as-is but hide on mobile ----- */}
              <span
                aria-hidden="true"
                className="absolute top-full left-1/2 mt-3 hidden h-[2px] w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-400 to-transparent md:left-0 md:translate-x-0 lg:block"
              />
            </div>
          </div>

          {/* ---------- MOBILE IMAGE (placed after heading on mobile) ---------- */}
          {/* visible on mobile, hidden on lg to avoid duplicate image on desktop */}
          <div className="block lg:hidden">
            <div className="relative mt-4 rounded-3xl p-2 shadow-(--shadow-badge)">
              <div className="relative h-[350px] w-full overflow-hidden rounded-2xl sm:h-[450px]">
                <Image
                  src="/images/about/about-gs-png.png"
                  alt="About GrowthStats"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* ---------- Rest of the content (appears after the image on mobile) ---------- */}
          <Heading as="h3" variant="h3" className="mt-6 text-xl font-semibold text-gray-800">
            Your Success, Our Priority
          </Heading>

          <Text as="p" variant="body" className="leading-relaxed text-[#848484]">
            At Growthstats, we believe in empowering our clients to achieve their goals. Our team
            works closely with you.
          </Text>

          <Heading as="h3" variant="h3" className="mt-4 text-xl font-semibold text-gray-800">
            Partners You Can Rely On
          </Heading>

          <Text as="p" variant="body" className="leading-relaxed text-[#848484]">
            Landin is here to ensure your success with expert guidance and collaborative teamwork.
          </Text>

          {/* ---------- Stars + Rating (should appear before the mobile divider) ---------- */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex text-xl text-black">★ ★ ★ ★ ★</div>
          </div>
          <div className="text-sm font-semibold text-[#848484]">200+ Clients Rated</div>

          {/* ---------- MOBILE DIVIDER (6th place) ---------- */}
          {/* visible only on mobile; hidden on lg so desktop divider remains unchanged */}
          <span
            aria-hidden="true"
            className="mt-6 block h-[2px] w-full max-w-xl rounded-sm bg-gradient-to-r from-transparent via-gray-400 to-transparent lg:hidden"
          />
        </div>
      </div>
    </div>
  )
}

export default AboutPlaceholder
