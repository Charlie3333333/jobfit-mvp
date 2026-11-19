# One-page resume policy

The generated resume uses a US Letter page (816 x 1056 CSS pixels), not an
unbounded webpage. Experience Bank has no application-imposed entry count cap.
The initial ranking keeps four experiences; measured layout may reduce this to
three. Fewer than three available experiences are kept as-is, never fabricated.

Generation ranks existing evidence, bounds long fields, begins with two bullets
per experience and checks the full-size page. It can drop the fourth experience
if necessary and omit core courses. After fitting, it tries to restore further
source bullets in relevance order across the selected experiences, retaining
every addition that still fits. It does not fill short drafts with fabricated
content, stretch vertical whitespace or enlarge typography to simulate detail.
Typesetting uses Times New Roman, 1.16 line height, compact bullet spacing and
full-width section rules inspired by the user's traditional resume reference.
Body text stays between 10.5 and 11 pt. No overflow is hidden and no tiny-font
or arbitrary transform is used to squeeze the printed content onto the page.
The on-screen page is zoomed as a whole to fit its preview surface; measurement
always uses a separate full-size copy, independent of viewport or hidden tabs.

Manual edits and existing saved drafts are never silently trimmed. If the
full-size content exceeds the page, the preview warns and the application's
download/print commands are disabled until it is shortened. Editing still
autosaves. Printing uses a separate body-level copy so hidden application UI
does not create blank extra pages. HTML export includes the identical page CSS,
US Letter size, zero page margins and non-editable document content.

Local checks: 10 bank entries retained, a long target-role draft curated to
four entries with 16 source bullets at 11 pt in the denser template, a measured
content bottom at 1002 px within a 1014 px safe limit, HTML export, overflow detection and disabled export,
overflow draft persistence across reload, and regeneration back to a valid page.
The system print dialog was opened and dismissed; a saved PDF's page count was
not independently verified in this environment. User printer settings can
override the requested paper size. This change has not been published yet.
