#!/bin/bash

npm run fix
cp patch/build/publish/utils.js build/utils.js && cp patch/config/publish/index.js config/index.js