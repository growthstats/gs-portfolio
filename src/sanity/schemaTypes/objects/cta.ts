import { defineField, defineType } from "sanity"

const ICON_OPTIONS = [
	{ title: "Arrow Right", value: "arrowRight" },
	{ title: "External Link", value: "externalLink" },
	{ title: "Mail", value: "mail" },
	{ title: "Phone", value: "phone" },
	{ title: "Download", value: "download" },
	{ title: "Calendar", value: "calendar" },
]

export default defineType({
	name: "cta",
	title: "Call to Action",
	type: "object",
	groups: [
		{ name: "content", title: "Content", default: true },
		{ name: "options", title: "Options" },
	],
	fields: [
		defineField({
			name: "label",
			type: "string",
			group: "content",
			validation: (Rule) => Rule.required().min(2),
		}),
		defineField({
			name: "href",
			type: "string",
			group: "content",
			validation: (Rule) =>
				Rule.required().uri({
					allowRelative: true,
					scheme: ["http", "https", "mailto", "tel"],
				}),
		}),
		defineField({
			name: "isExternal",
			type: "boolean",
			group: "content",
			description: "Open link in a new tab",
		}),
		defineField({
			name: "icon",
			type: "string",
			group: "content",
			options: {
				list: ICON_OPTIONS,
				layout: "radio",
			},
		}),
		defineField({
			name: "style",
			type: "string",
			group: "options",
			initialValue: "primary",
			options: {
				list: [
					{ title: "Primary", value: "primary" },
					{ title: "Secondary", value: "secondary" },
					{ title: "Tertiary", value: "tertiary" },
					{ title: "Ghost", value: "ghost" },
				],
				layout: "radio",
			},
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: "label",
			href: "href",
			isExternal: "isExternal",
		},
		prepare({ title, href, isExternal }) {
			return {
				title,
				subtitle: [href, isExternal ? "External" : "Internal"]
					.filter(Boolean)
					.join(" · "),
			}
		},
	},
})
