# js-api-wrapper
An API wrapper that can easily export helpful api functions.

## Getting started

install the js-api-wrapper
```
npm install js-api-wrapper
```

then export apis with the function `wrap` in a module

```
import {wrap} from 'js-api-wrapper';

const defConfig = {}

const sufConfigs = {
    Sync: {async: false},
    WithoutCache: {cache: false},
}

export default wrap({defConfig, sufConfigs});
```

then import the module, the wrapped function returns a `Promise` object.Example is shown as follows, where XXX is the name of the new module

```
import * as ApiUtils from XXX;

ApiUtils.jsonGETSync('http://example.com')
```



