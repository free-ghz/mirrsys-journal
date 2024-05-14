# mirrsys-journal

### folder structure

Each entry is its own folder. This folder should be placed in the `input/` folder. For it to be picked up, an `index.777` file should be present. This is the main text. (See _markup language_ section)

### metadata

Metadata for an entry should be placed in a `meta` file. It takes the form of key-value(s) pairs. These pairs are separated by two newlines. Keys and values are separated by a single newline. The first line in a group (that is, after two newlines) is the key, the rest are values.

Example:

```
date
2024-05-14

author
free-ghz

tags
examples
documentation
yadda yadda
you can have spaces and shit
```

### markup language

Based around nesting blocks. Blocks look like this:

```
[:options
content
:]
```

Options can be empty. Content can be text and/or other blocks.

```
[:
Here's some stuff
[:
A nested block
:]
:]
```

The `[:` and `:]` markers must appear on their own lines, at the start. For lines with text, no whitespace is stripped - indentation is reflected in the output.

#### Options

Options for blocks are as follows:

- `border` (true|false|"title") default false
- `decoration` (true|false) default false

You can also specify a container type (useful for nesting), either `horizontal` or `vertical` (default vertical). For blocks that end up containing only text, this is ignored.

Encode the options as `key-value` delimited by `:`. The container type is specified only by `type`. The default settings would be specified like so:

```
border-false:decoration-false:vertical
```

#### Links

Supports markdown style links: `[source](target)`.

#### Example

```
[:
Welcome in the house! Mushroom house
:]
[:decoration-true:border-true:horizontal
And now! nesting!
What even. LOL
yea
[:decoration-false:border-true
&looklynx;
^doesntmeananything
:]
:]
[:border-freetext
this box will have a title "freetext".
that's cool i guess.
here's a link [to a super cool page!!!!](https://example.com/)
:]
```

This will output something like:

```
Welcome in the house! Mushroom house    
┌──────────────────────────────────────┐
│And now! nesting!┌───────────────────┐│
│What even. LOL   │&looklynx;         ││
│yea              │^doesntmeananything││
│                 └───────────────────┘│
└──────────────────────────────────────┘
┌┤freetext├────────────────────────────┐
│this box will have a title "freetext".│
│that's cool i guess.                  │
└──────────────────────────────────────┘
```