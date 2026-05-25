I was implementing `context/implementation/01System Setup-and-Installation.md` file then this error happens : ## Error Type
Build Error

## Error Message
Error evaluating Node.js code

## Build Output
./src/app/globals.css
Error evaluating Node.js code
CssSyntaxError: tailwindcss: /Users/arialbaack/Desktop/application/Novacity/src/app/globals.css:1:1: Can't resolve 'shadcn/tailwind.css' in '/Users/arialbaack/Desktop/application/Novacity/src/app'
    [at Input.error (turbopack:///[project]/node_modules/postcss/lib/input.js:135:16)]
    [at Root.error (turbopack:///[project]/node_modules/postcss/lib/node.js:146:32)]
    [at Object.Once (/Users/arialbaack/Desktop/application/Novacity/node_modules/@tailwindcss/postcss/dist/index.js:10:6913)]
    [at process.processTicksAndRejections (node:internal/process/task_queues:105:5)]
    [at async LazyResult.runAsync (turbopack:///[project]/node_modules/postcss/lib/lazy-result.js:293:11)]
    [at async transform (turbopack:///[turbopack-node]/transforms/postcss.ts:70:34)]
    [at async run (turbopack:///[turbopack-node]/child_process/evaluate.ts:89:23)]

Import trace:
  Client Component Browser:
    ./src/app/globals.css [Client Component Browser]
    ./src/app/layout.tsx [Server Component]

Next.js version: 16.2.4 (Turbopack)

---

## Resolution (applied)

Tailwind’s PostCSS step could not resolve the `shadcn` package export for `tailwind.css` (`"style"` condition). The preset was copied into [`src/styles/shadcn.css`](../src/styles/shadcn.css) and referenced from [`src/app/globals.css`](../src/app/globals.css) as `@import "../styles/shadcn.css";`. The standalone `shadcn` CLI package was removed from `devDependencies`; add components with `npx shadcn@latest add …`.



Cause
globals.css used @import "shadcn/tailwind.css". That path depends on the shadcn package exports field ("style": "./dist/tailwind.css"). Tailwind’s PostCSS resolver does not resolve that export the same way the app bundler might, so Turbopack failed with Can't resolve 'shadcn/tailwind.css' (often after a clean install or any environment where resolution differs).

Fix (implemented)
src/styles/shadcn.css — Vendored the same content as shadcn@4 dist/tailwind.css (accordion keyframes + data variants + no-scrollbar utility), with a short sync note at the top.
src/app/globals.css — Replaced
@import "shadcn/tailwind.css"; → @import "../styles/shadcn.css";
package.json — Removed the shadcn devDependency so installs no longer rely on that package for CSS at build time. You can still use npx shadcn@latest add … for components.
Tracker & docs
context/Project-Process-Tracker.md — While working, this was flagged in progress for that issue; once fixed, it’s recorded under Recently completed with what changed (no dangling “in progress” block anymore).
context/Errors-issues.md — Appended Resolution (applied) so the incident file matches reality.
Verified: npm install, npm run build, and npm run lint all succeed.

If shadcn’s preset CSS changes in a future major CLI release, refresh src/styles/shadcn.css from their dist/tailwind.css for that version.


# Error (dashboard listings — delete dialog)

Was: after creating listings and using the dashboard listings table, the browser reported the following:
## Error Type
Console Error

## Error Message
In HTML, <button> cannot be a descendant of <button>.
This will cause a hydration error.

  ...
    <table data-slot="table" className="w-full cap...">
      <TableHeader>
      <TableBody>
        <tbody data-slot="table-body" className={"[&_tr:la..."}>
          <TableRow>
            <tr data-slot="table-row" className="border-b t...">
              <TableCell>
              <TableCell>
              <TableCell>
              <TableCell>
              <TableCell>
              <TableCell>
              <TableCell className="text-right">
                <td data-slot="table-cell" className={"p-2 alig..."}>
                  <ListingActions listingId="6a02923a3c...">
                    <div className="flex flex-...">
                      <LinkComponent>
                      <Dialog open={false} onOpenChange={function bound dispatchSetState}>
                        <DialogRoot data-slot="dialog" open={false} onOpenChange={function bound dispatchSetState}>
                          <DialogTrigger>
                            <DialogTrigger data-slot="dialog-tri...">
>                             <button
>                               type="button"
>                               onClick={function}
>                               onMouseDown={function}
>                               onKeyDown={function}
>                               onKeyUp={function}
>                               onPointerDown={function}
>                               tabIndex={0}
>                               disabled={false}
>                               data-base-ui-click-trigger=""
>                               id="base-ui-_r_2b_"
>                               data-slot="dialog-trigger"
>                               ref={function}
>                             >
                                <Button variant="destructive" size="sm" type="button">
                                  <Button data-slot="button" className={"group/bu..."} type="button">
>                                   <button
>                                     type="button"
>                                     onClick={function}
>                                     onMouseDown={function}
>                                     onKeyDown={function}
>                                     onKeyUp={function}
>                                     onPointerDown={function}
>                                     tabIndex={0}
>                                     disabled={false}
>                                     data-slot="button"
>                                     ref={function}
>                                     className={"group/button inline-flex shrink-0 items-center justify-center borde..."}
>                                   >
                          ...



    at button (<anonymous>:null:null)
    at Button (src/components/ui/button.tsx:50:5)
    at ListingActions (src/features/listings/components/ListingActions.tsx:54:11)
    at <anonymous> (src/features/listings/components/ListingTable.tsx:99:17)
    at Array.map (<anonymous>:1:18)
    at ListingTable (src/features/listings/components/ListingTable.tsx:65:17)
    at DashboardListingsPage (src/app/(dashboard)/dashboard/listings/page.tsx:49:9)

## Code Frame
  48 | }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  49 |   return (
> 50 |     <ButtonPrimitive
     |     ^
  51 |       data-slot="button"
  52 |       className={cn(buttonVariants({ variant, size, className }))}
  53 |       {...props}

Next.js version: 16.2.4 (Turbopack)

## Resolution (applied)

**Cause:** Base UI’s `DialogTrigger` renders a native `<button>`. [`ListingActions`](../src/features/listings/components/ListingActions.tsx) wrapped our shadcn-style `Button` (also a `<button>`) inside that trigger, producing invalid HTML (`<button><button>…</button></button>`) and a React hydration warning.

**Fix:** Use a single button for both roles — apply [`buttonVariants`](../src/components/ui/button.tsx) to `DialogTrigger` via `className` and put the label (“Delete”) as direct children of `DialogTrigger`, instead of nesting `<Button>` inside it.

Verified: `npm run lint` and `npm run build` succeed.


I was in admin account page listing property then when press create listing button. error happen: something went wrong while saving your listing.

ValidationError: Property validation failed: listingType: Path `listingType` is required.
    at model.validate (/Users/arialbaack/Desktop/application/Novacity/node_modules/mongoose/lib/document.js:2864:36)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async model.$__save (/Users/arialbaack/Desktop/application/Novacity/node_modules/mongoose/lib/model.js:393:7)
    at async model.save (/Users/arialbaack/Desktop/application/Novacity/node_modules/mongoose/lib/model.js:667:5)
    at async Function.create (/Users/arialbaack/Desktop/application/Novacity/node_modules/mongoose/lib/model.js:2747:5)
    at async createListingAction (/Users/arialbaack/Desktop/application/Novacity/.next/dev/server/chunks/ssr/[root-of-the-server]__07d1prt._.js:787:9)
    at async executeActionAndPrepareForRender (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:64:5248)
    at async /Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:64:1986
    at async handleAction (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:62:25378)
    at async renderToHTMLOrFlightImpl (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:69:55630)
    at async doRender (/Users/arialbaack/Desktop/application/Novacity/.next/dev/server/chunks/ssr/node_modules_next_dist_esm_0byjljh._.js:801:28)
    at async AppPageRouteModule.handleResponse (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:71:63567)
    at async handleResponse (/Users/arialbaack/Desktop/application/Novacity/.next/dev/server/chunks/ssr/node_modules_next_dist_esm_0byjljh._.js:1094:32)
    at async Module.handler (/Users/arialbaack/Desktop/application/Novacity/.next/dev/server/chunks/ssr/node_modules_next_dist_esm_0byjljh._.js:1497:20)
    at async DevServer.renderToResponseWithComponentsImpl (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/base-server.js:1454:9)
    at async DevServer.renderPageComponent (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/base-server.js:1506:24)
    at async DevServer.renderToResponseImpl (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/base-server.js:1556:32)
    at async DevServer.pipeImpl (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/base-server.js:1043:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/next-server.js:338:17)
    at async DevServer.handleRequestImpl (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/base-server.js:934:17)
    at async /Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/dev/next-dev-server.js:394:20
    at async Span.traceAsyncFn (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/trace/trace.js:164:20)
    at async DevServer.handleRequest (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/dev/next-dev-server.js:390:24)
    at async invokeRender (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/lib/router-server.js:266:21)
    at async handleRequest (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/lib/router-server.js:465:24)
    at async requestHandlerImpl (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/lib/router-server.js:514:13)
    at async Server.requestListener (/Users/arialbaack/Desktop/application/Novacity/node_modules/next/dist/server/lib/start-server.js:225:13) {
  errors: {
    listingType: ValidatorError: Path `listingType` is required.
        at async createListingAction (src/features/listings/actions/listingActions.ts:122:5)
      120 |
      121 |   try {
    > 122 |     await createProperty({
          |     ^
      123 |       title: parsed.data.title,
      124 |       slug,
      125 |       description: parsed.data.description, {
      properties: [Object],
      kind: 'required',
      path: 'listingType',
      value: undefined,
      reason: undefined,
      formatMessage: [Function: formatMessage]
    }
  },
  _message: 'Property validation failed',
  digest: '2706838569'
}
 POST /dashboard/listings/create 500 in 884ms (next.js: 11ms, proxy.ts: 22ms, application-code: 851ms)
  └─ ƒ createListingAction({"address":"880 Victoria Tower","bathrooms":2,"bedrooms":3,"...":"11 items not stringified"}) in 63ms src/features/listings/actions/listingActions.ts

---

## Resolution (applied) — `listingType` required after schema change

**Cause:** The app replaced `listingType` with `listingSource` / `currency` on the Property schema and in [`createListingAction`](../src/features/listings/actions/listingActions.ts), but **Next.js dev (HMR)** can keep a **cached** `mongoose.models.Property` compiled from the **previous** schema. That stale model still required `listingType`, while the action only sent `listingSource` → Mongoose `ValidationError: Path listingType is required`.

**Fix:**

1. [`Property.ts`](../src/server/models/Property.ts) — Before `mongoose.model(...)`, **`delete mongoose.models.Property`** when present so the current `propertySchema` is always registered (standard Mongoose + Next.js pattern after schema changes).
2. [`listingActions.ts`](../src/features/listings/actions/listingActions.ts) — In `createListingAction`, catch **`mongoose.Error.ValidationError`** and return a safe `{ ok: false, message }` instead of a 500 when validation still fails.

**Also ensure:** DB documents were migrated (`listingSource` / `currency`); idempotent migration runs on connect via [`propertyMigrations.ts`](../src/server/db/propertyMigrations.ts).

Verified: `npm run build` and `npm run lint` succeed.

---

## Error (home — `FeaturedPropertiesSection` module not found)

**Symptom:**

```txt
Module not found: Can't resolve './FeaturedPropertiesSection'
./src/features/home/components/HomePageView.tsx
import { FeaturedPropertiesSection } from "./FeaturedPropertiesSection";
```

**Cause:** The homepage refactor removed [`FeaturedPropertiesSection.tsx`](../src/features/home/components/FeaturedPropertiesSection.tsx) in favor of [`OwnershipHomeSection.tsx`](../src/features/home/components/OwnershipHomeSection.tsx) (wireframe **band 2 — Ownership**). A stale `HomePageView` still imports the deleted file.

**Fix (applied in repo):**

1. In [`HomePageView.tsx`](../src/features/home/components/HomePageView.tsx), **remove** `import { FeaturedPropertiesSection } from "./FeaturedPropertiesSection";`.
2. **Add** `import { OwnershipHomeSection } from "./OwnershipHomeSection";`.
3. In the JSX, replace `<FeaturedPropertiesSection />` with `<OwnershipHomeSection />` (order: `HeroSection` → `OwnershipHomeSection` → `Suspense` + `HomeForSaleListings` → other rails).

If the error persists after editing, restart `next dev` (Turbopack can cache a bad graph briefly).

Verified: `npm run build` / `npm run lint` succeed with the ownership band wired as above.

