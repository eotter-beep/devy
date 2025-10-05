# Devy Programming Language

Devy is an experimental programming-language toolkit that focuses on token-level helpers, basic tokenization, and a small set of runtime utilities. The current codebase is intentionally compact so that contributors can inspect every moving part and extend it with their own ideas for syntax or tooling.

> **Preview notice:** Devy is in public preview so that early adopters can exercise the language, share feedback, and help shape its evolution. Because the toolkit is open source, the community is encouraged to fork it, craft new Devy flavors, and publish custom distributions that extend the helpers documented below.

## Repository layout

- `lang.js` exports the default `helpers` object with predicates for letters, whitespace, numbers, parentheses, quotes, and arithmetic operators. It also bundles the regular-expression metadata and factory utilities used by higher-level tooling.【F:lang.js†L5-L52】
- `tokenize.js` defines a minimal tokenizer that iterates through an input string and produces tokens for parentheses while reserving a future `CursorType` classification.【F:tokenize.js†L3-L33】
- `fileext.js` registers `.devy` as a recognized extension and illustrates how consumer tooling can fetch the language helpers and tokenizer modules on demand.【F:fileext.js†L1-L3】

## Lexical helpers

`lang.js` centralizes the regular expressions that describe Devy’s core character classes. Besides the `helpers` predicates, the module exposes `functionhelpers.combined` for matching `/add/` and `/name/` markers together and a `checktab` pattern that checks tab-visibility hints within `.devy` scripts.【F:lang.js†L5-L31】【F:lang.js†L45-L51】 These exports are designed to be shared across future parsers, editor integrations, or analysis tools.

### Example: using lexical helpers

```devy
/add/ compute-sum
/name/ aggregator
( + 4 5 )
"istabactive"
```

The first two lines exercise the `/add/` and `/name/` markers that `functionhelpers.combined` can detect, while the parenthesized arithmetic and quoted string rely on the shared predicates for parentheses, operators, numbers, and quotes.【F:lang.js†L5-L31】【F:lang.js†L45-L51】 The literal `"istabactive"` demonstrates how downstream tooling can reuse the tab-visibility regular expression without redefining it.

### Example: composing derived helpers

```devy
(+)
(+ )
```

The first form supplies the minimal three-character sequence that a derived predicate could validate using the parenthesis and operator helpers. The second form includes a trailing space, highlighting how the exported primitives can be combined to build stricter recognizers without duplicating regular expressions.

## Error handling primitives

The `error` factory in `lang.js` produces a structured descriptor with a human-readable message and a helper that yields a rejected promise. This pattern is bundled into the `ERRORHANDLE` singleton and its `CUSTOMERRORHANDLER` shortcut so that asynchronous failures stay consistent across utilities that depend on the same function markers.【F:lang.js†L33-L55】

When extending Devy, prefer to reuse this factory instead of inventing new error-surfacing conventions. Doing so ensures new helpers integrate cleanly with the established semantics.

### Example: raising a custom error

```devy
/add/ feature-loader
/name/ devy:preview
( load devy:preview )
( load legacy-tool )
```

The second `load` expression intentionally violates a hypothetical rule that all features must be prefixed with `devy:`. Downstream tooling could call `CUSTOMERRORHANDLER()` to throw a consistent "Error in /name/" message while preserving context about the function token that triggered the failure.【F:lang.js†L33-L55】

## Tokenization workflow

The tokenizer focuses on a deliberately small grammar:

1. **Parenthesis** tokens for `(` and `)` characters, driven by the shared `helpers.isParenthesis` predicate.【F:tokenize.js†L10-L18】
2. A placeholder **CursorType** branch that reserves space for cursor-aware constructs. The supporting predicate is not yet implemented, so the branch effectively documents upcoming work.【F:tokenize.js†L20-L27】

Any other character causes the tokenizer to throw an error, making the current lexical scope explicit and easy to modify.【F:tokenize.js†L29-L33】 Extending Devy involves expanding `lang.js` with new predicates (for identifiers, numbers, or comments) and teaching `tokenize.js` how to emit the corresponding tokens.

### Example: tokenizing a string

```devy
(())
```

Feeding this fragment into `tokenize` yields four `Parenthesis` tokens, demonstrating the tokenizer’s emphasis on balanced delimiters. Introducing any unsupported character will raise an error until the helper set and tokenizer are expanded to cover it.

> **Note:** `helpers.isCursorType` is referenced by the tokenizer but not yet exported from `lang.js`, so cursor tokens currently fall back to the error path. This is one of the first areas the preview community is invited to tackle.【F:tokenize.js†L20-L27】【F:lang.js†L23-L31】

### Example: planning a tokenizer extension

```devy
(1+)
```

Once numeric and operator branches are implemented, a snippet like `(1+)` can expand into a token stream that mixes parentheses, number literals, and arithmetic operators without redefining the underlying character-class helpers.【F:lang.js†L13-L21】 This illustrates the incremental path toward richer grammar support.

## File extension integration

`fileext.js` registers `.devy` with a custom MIME type and demonstrates how to fetch `lang.js` and `tokenize.js` dynamically. Browser-based tooling can mirror this approach to ensure language services load alongside source files without bundling the helpers directly.【F:fileext.js†L1-L3】

### Example: dynamically loading language assets

```devy
/add/ bootstrap
/name/ runtime
( () )
```

A `.devy` bootstrap script like the above can be associated with the registered MIME type so that editor extensions or playgrounds fetch the language helpers and tokenizer before evaluating the empty invocation form. This keeps Devy distributions modular and ready for experimentation.

## Roadmap and customization notes

- Implement `helpers.isCursorType` so the tokenizer’s reserved branch can emit cursor tokens without throwing.【F:tokenize.js†L20-L27】【F:lang.js†L23-L31】
- Introduce helpers for identifiers, literals, and comments, and extend `tokenize.js` to recognize the new tokens as the grammar matures.【F:lang.js†L9-L29】【F:tokenize.js†L3-L33】
- Investigate wiring the imported `useDeferredValue` React helper and `visibilityjs` utility into higher-level tooling, since they are currently unused but hint at UI integrations Devy may grow into.【F:lang.js†L1-L2】

Contributions that expand the helper set, tighten the tokenizer, or document higher-level language constructs are welcome. Fork the repository, prototype new Devy flavors, and share the distributions back with the community while the language remains in preview.
