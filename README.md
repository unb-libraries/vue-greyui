# GreyUI

GreyUI provides type-safe Vue composables featuring reusable component logic simplifying the implementation of styled UI components with any CSS framework.

## Getting Started

Install by running the following command from inside your project folder:

```sh
npm install -D @unb-libraries/vue-greyui
```

## Features

GreyUI provides the following composables:

- [useDataProvider](#useDataprovider)

### useDataProvider
Define and reactively manipulate data provider.

```typescript
import { useDataProvider } from "@unb-libraries/vue-greyui"

const { data, add, filter, remove, set, sort } = useDataProvider(["grey", "dark-grey", "light-grey"])

add("ultra-light-grey")
// data.value => ["grey", "dark-grey", "light-grey", "medium-grey"]

filter((color) => color.indexOf("-") < 0)
// data.value => ["grey"]
filter(() => true)
// data.value => ["grey", "dark-grey", "light-grey", "ultra-light-grey"]

remove(3)
// data.value => ["grey", "dark-grey", "light-grey"]

set(["white", "grey", "black"])
// data.value => ["white", "grey", "black"]

sort((a, b) => a < b ? -1 : b < a ? 1 : 0)
// data.value => ["black", "grey", "white"]
```

## Testing

The project uses [Vitest](https://github.com/vitest-dev/vitest) and [Vue Test Utils](https://github.com/vuejs/test-utils/) to run unit tests. Test coverage reports are generated with [V8](https://github.com/v8/v8).

To execute tests (watch mode) and create test coverage reports, run

```sh
npm run test:unit:watch -- --coverage
```

HTML reports are placed in _./vitest_.

## License

[MIT](./LICENSE)


