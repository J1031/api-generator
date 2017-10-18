# j-api-generator
An API generator that can easily export helpful api functions.

## Getting started

install the j-api-generator
```
npm install j-api-generator
```

then export apis with the function `generate` in a module

```
import {generate} from 'j-api-generator';

const defConfig = {}

const sufConfigs = {
    Sync: {async: false},
    WithoutCache: {cache: false},
}

export default generate({defConfig, sufConfigs});
```

then import the module, the generated function returns a `Promise` object.Example is shown as follows, where XXX is the name of the new module

```
import * as ApiUtils from XXX;

ApiUtils.jsonGETSync('http://example.com')
```



