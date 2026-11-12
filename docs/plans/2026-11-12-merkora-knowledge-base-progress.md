# Execution progress — MerKora knowledge base

Plan: `docs/plans/2026-11-12-merkora-knowledge-base.md`

Branch: `feature/merkora-rebuild-foundation`

## Task 1: Inventorier et classer les ressources historiques

**Status: in progress — verification blocked**

- [x] Inventory of the 265 Library items completed (20 documents, 240 images, 5 videos).
- [x] Initial manifest added with 19 knowledge-resource records.
- [x] Inventory report added, including project-specific sources, duplicate candidates, media collection and exclusions.
- [x] Source-preservation and knowledge-governance rules documented.
- [x] Vitest contract test added.
- [x] Remote structural checks completed: valid JSON, required metadata, multi-sector resource, missing 500-sector source, separate duplicate candidates and project-specific tags.
- [ ] Focused Vitest command not run: the connected GitHub tools provide repository read/write but no shell runner. The existing GitHub quality workflow runs on pull requests or pushes to `main`; opening a draft pull request would trigger CI and may also trigger a Vercel Preview. No PR or deployment was created without explicit confirmation.
- [ ] Typecheck and baseline test suite not run for the same reason.

**Important findings**
- The historical guide provided on 2026-11-12 is referenced in prior conversation context (universal questionnaire, 20 sectors, architectures, reusable prompts, SQL, super-app patterns, OpenAI/Gemini variables), but its complete source content was not recovered as a Library file.
- The announced 500-sector source remains missing. No entries have been invented.
- No Supabase schema or data was changed. No AI provider was called. No deployment or merge occurred.

**Next action**
- Obtain an approved CI execution path (for example, a draft PR to trigger the existing quality workflow) before marking Task 1 complete.
