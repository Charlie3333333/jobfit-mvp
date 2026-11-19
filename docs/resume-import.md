# Resume import

Experience Bank has a browser-only resume reader for text PDFs, DOCX and UTF-8
TXT files. PDF.js and Mammoth extract text locally; no resume bytes or text are
sent to an API. The PDF worker is served from the same origin and prepared by
the dev/build scripts. File size is limited to 5 MB, PDFs to 30 pages, extracted
text to 200,000 characters. The bank has no application-imposed experience count
limit; browser storage capacity still applies. Generated resumes use only the
three or four highest-ranked experiences (or all entries when fewer exist).

The parser uses section headings and date ranges, not a language model. Fields
are best-effort and every detected entry is editable before import. Users can
inspect the original text, deselect entries, remove entries or add a missing
experience manually. Unrecognized/undated layouts retain their extracted text
for review. Multi-column layouts may need corrections. Image-only PDFs need
OCR and are explicitly rejected rather than silently creating fake entries.

Confirmed entries append to the existing browser-local experience bank. Exact
normalized duplicates (all six fields) are skipped, including duplicates within
one upload. The import event persists the bank without regenerating the saved
resume. If storage fails, newly added cards are rolled back and the preview
stays open. No profile fields are overwritten, and no original file is stored.

Run `pnpm test` for parser tests. `tests/create-resume-fixtures.py` optionally
creates synthetic PDF/DOCX/TXT fixtures in `/private/tmp/bestfit-import-tests`
using ReportLab and python-docx for manual browser checks.

Verified locally: PDF and DOCX field extraction, TXT mobile preview, append,
refresh persistence, duplicate skipping, cancel and 390 px responsive layout.
This feature has not yet been deployed to the public website.
