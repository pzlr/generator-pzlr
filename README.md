Pzlr Generator
==============

Generate pages, interfaces, blocks and global elements.

## Install

You can use `yarn` or `npm` for install this generator:

* for use yarn
```
yarn add generator-pzlr
```

* for use npm
```
npm install generator-pzlr
```

Done, you are awesome!

## Use

### First start

You can change default path to the block directiory:

```
yo pzlr
```

### Create blocks

You can create new block for two ways:

* without anything params

```
yo pzlr:b
```

* with name*

```
yo pzlr:b b-name
```

*P.S. All your names should match pattern `"^[gibp]-[a-z0-9-]+$"`

#### Example

* Good names:

```
yo pzlr:b g-name
yo pzlr:b i-name
yo pzlr:b b-name
yo pzlr:b p-name
```

* Bad names:

```
yo pzlr:b s-name
yo pzlr:b name
```

G - global, I - interfaces, B - block, P - page

## Uninstal

Like a install, `yarn` or `npm` can remove this generator.

* for use yarn
```
yarn remove generator-pzlr
```

* for use npm
```
npm uninstall generator-pzlr
```
