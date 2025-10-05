# Devy Programming Language

Devy is an experimental programming language toolkit that currently focuses on token-level helpers and basic tokenization logic. The repository packages the primitives needed to build higher-level parsing, error handling, and editor tooling on top of `.devy` source files.

> **Preview notice:** Devy is currently in preview so that early adopters can exercise the language, share feedback, and help shape its evolution. Because the toolkit is open source, the community is encouraged to fork it, build fresh Devy flavors, and publish their own distributions that extend the core helpers described below.

## Repository layout

- `lang.js` exposes reusable helper predicates for common lexical categories (letters, whitespace, numbers, parentheses, quotes, and operators) and exports additional metadata used by other tools in the stack.【F:lang.js†L5-L31】【F:lang.js†L45-L51】
- `tokenize.js` defines a minimal tokenizer that walks over an input string, producing tokens for parentheses and a placeholder `CursorType`, and throws on unsupported characters.【F:tokenize.js†L3-L35】
- `fileext.js` registers the `.devy` file extension with a custom MIME type and demonstrates how language assets can be retrieved dynamically in browser-based tooling.【F:fileext.js†L1-L3】

## Lexical helpers

`lang.js` centralizes the regular expressions and derived helper functions that describe Devy's core character classes. These include checks for function markers (`/add/`), function-name markers (`/name/`), tab-visibility checks (`/istabactive/`), alphabetic characters, whitespace, numeric strings, parentheses, quotes, and arithmetic operators.【F:lang.js†L5-L31】 By consolidating the helpers in one module, other tooling can share consistent semantics when interpreting source text.

### Example: using lexical helpers

```devy
/add/ compute-sum
/name/ aggregator
( + 4 5 )
"istabactive"
```

The first two lines exercise the `/add/` and `/name/` markers that `functionhelpers.combined` can detect, while the parenthesized arithmetic and quoted string hit the shared predicates for parentheses, operators, numbers, and quotes. The trailing `"istabactive"` literal matches the exported tab-visibility regular expression, providing a quick tour through the bundled lexical helpers.【F:lang.js†L5-L31】【F:lang.js†L45-L51】

### Example: building derived helpers

```devy
(+)
(+ )
```

The first form supplies the minimal three-character sequence that a derived predicate could validate using the parenthesis and operator helpers, whereas the second form adds a trailing space that the same helper would reject, illustrating how exported primitives can be composed into higher-level recognizers without duplicating regular expressions.

## Error handling primitives

The `error` factory in `lang.js` builds a structured error descriptor with a human-readable message and a helper that produces a rejected promise. This is exposed through the `ERRORHANDLE` instance and the `CUSTOMERRORHANDLER` shortcut, offering a consistent way to surface asynchronous errors tied to particular function tokens.【F:lang.js†L35-L55】

When building additional tooling, prefer to reuse this factory so that new features integrate cleanly with existing error-reporting semantics.

### Example: raising a custom error

```devy
/add/ feature-loader
/name/ devy:preview
( load devy:preview )
( load legacy-tool )
```

The second `load` expression deliberately omits the `devy:` prefix that surrounding infrastructure expects; when encountered at runtime, the shared `CUSTOMERRORHANDLER` helper would surface a consistent "Unsupported feature" message while preserving context about the failing token.【F:lang.js†L35-L55】

## Tokenization workflow

The tokenizer currently recognizes two token types:

1. **Parenthesis** tokens for `(` and `)` characters, identified using the shared helper module.【F:tokenize.js†L10-L18】
2. **CursorType** tokens, a placeholder hook for future cursor-aware constructs in editors or runtimes.【F:tokenize.js†L20-L27】

Any other character causes the tokenizer to throw an error, making it clear that the lexical grammar is intentionally narrow at this stage.【F:tokenize.js†L30-L34】 Extending Devy involves augmenting `helpers` with new predicates (for example, to support identifiers or literals) and updating `tokenize.js` with matching cases.

### Example: tokenizing a string

```devy
(())
```

Feeding this fragment into `tokenize` yields four `Parenthesis` tokens, demonstrating the tokenizer's current focus on balanced delimiters. Any additional character outside that narrow grammar would be rejected until corresponding helpers and tokenizer branches are introduced.

> **Note:** `helpers.isCursorType` is referenced by the tokenizer but is not yet implemented in `lang.js`, so cursor-aware tokens will currently throw an error.【F:tokenize.js†L20-L27】【F:lang.js†L23-L32】

### Example: extending the tokenizer

```devy
(1+)
```

Once numeric and operator branches are added to the tokenizer, a snippet like `(1+)` can expand into a richer token stream that blends parentheses, number literals, and arithmetic operators without redefining the underlying character-class helpers.【F:lang.js†L13-L21】 This highlights the incremental path for broadening Devy's grammar.

## File extension integration

`fileext.js` demonstrates how `.devy` files can be registered and how supporting assets such as `lang.js` and `tokenize.js` can be loaded asynchronously. Tooling that runs in a browser can adopt the same pattern to ensure language services are fetched alongside source files.【F:fileext.js†L1-L3】 This pattern keeps the core language modules decoupled and ready for reuse across editors, playgrounds, or build pipelines.

### Example: dynamically loading language assets

```devy
/add/ bootstrap
/name/ runtime
( () )
```

A `.devy` bootstrap script like the above can be associated with the registered MIME type, ensuring that editor extensions or playgrounds load the language helpers and tokenizer alongside the source before evaluating the empty invocation form.

## Roadmap and customization notes

- The helpers currently do not expose an `isCursorType` predicate even though the tokenizer expects one, highlighting an area that needs implementation before cursor tokens can be recognized properly.【F:tokenize.js†L20-L27】【F:lang.js†L23-L32】
- Additional helpers (for identifiers, literals, comments, etc.) and corresponding tokenizer branches are expected as the language matures.
- Downstream tools may leverage the imported `useDeferredValue` and `visibilityjs` utilities in `lang.js` to respond to UI state, although these are not yet wired into the exported helpers.【F:lang.js†L1-L2】

Contributions that expand the helper set, tighten the tokenizer, or document higher-level language constructs are welcome and should build upon the shared primitives established in this repository.
