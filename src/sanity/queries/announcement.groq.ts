import { defineQuery } from 'next-sanity'
import { LINK_QUERY } from '@/sanity/lib/queries'

/** The announcements listed in site settings, in their set order, with each one's schedule and CTA. */
export const ANNOUNCEMENTS_QUERY = defineQuery(`
	*[_type == 'site'][0].announcements[]->{
		_id,
		content,
		start,
		end,
		cta{ ${LINK_QUERY} }
	}
`)
