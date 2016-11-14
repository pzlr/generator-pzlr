# generator-pzlr

Yeoman generator for pzlr.

## Install

You can use `yarn` or `npm` to install this generator:

### yarn

```
yarn add generator-pzlr --dev
```

### npm

```
npm install generator-pzlr --save-dev
```

## Using

### Create blocks

You can create a block in two ways:

- no params

  ```
  yo pzlr:b
  ```

- with name

  ```
  yo pzlr:b b-name
  ```

> **Note**: block names should match pattern `"^[gibp]-[a-z0-9-]+$"`

#### Example

- Good names:

  ```
  yo pzlr:b g-name
  yo pzlr:b i-name
  yo pzlr:b b-name
  yo pzlr:b p-name
  ```

- Bad names:

  ```
  yo pzlr:b s-name
  yo pzlr:b name
  ```
  
#### Block types
  - `g`: global
  - `i`: interface
  - `b`: block
  - `p`: page

## License

[MIT](https://github.com/pzlr/generator-pzlr/blob/master/LICENSE)
