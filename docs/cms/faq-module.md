# FAQ Module (Sanity Studio)

## Where to use it

- Add a **Section** module to any page (title now optional if you only need spacing) and choose **FAQ** as the nested module.
- Each FAQ section displays a two-column layout: supporting copy on the left and an accordion on the right. Accordions are single-open by default for accessibility.

## Configuration steps

1. Insert the module, then open the **Content** group.
2. Fill the headline stack:
   - **Pretitle** (optional) appears as a badge above the heading.
   - **Title** (required in the FAQ module) becomes the main heading.
   - **Description** supports rich Portable Text (links, emphasis, inline code, etc.).
3. Add FAQ entries inside **FAQ items**:
   - **Question** (required) is the accordion trigger label.
   - **Answer** supports Portable Text plus optional code blocks.
   - **Initially open** keeps a specific item expanded on load when checked.
4. Use the **Options** group:
   - **Module options** control padding/background just like any other module.
   - **Accessible accordion** should remain on unless design specifies otherwise; it keeps ARIA attributes and focus behavior intact.
   - **Generate schema.org FAQPage markup** outputs JSON-LD so search engines can detect rich FAQ results. Disable only if the same questions already exist elsewhere on the page.

## Authoring tips

- Keep questions conversational and scoped to a single topic; long multi-part questions reduce scanability.
- Answers should start with the takeaway sentence, then provide supporting detail or links.
- Use inline links sparingly and prefer internal links when content already exists on the site.
- Code blocks are ideal for snippets such as API responses—set meaningful filenames when possible.
- If you need a spacer-only block, add a Section without FAQ content and adjust padding in **Module options**.

## Quality checklist

- [ ] Preview the page to confirm accordion order and open states.
- [ ] Run the “Generate preview URL” action (if enabled) to check JSON-LD using browser devtools.
- [ ] Confirm there are no duplicate questions across sections—search engines may drop schema if duplicates exist.
