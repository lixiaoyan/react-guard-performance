#!/bin/bash

SEED="$RANDOM"

node ./runner.js --seed "$SEED" --name "React"
node ./runner.js --seed "$SEED" --name "React (react-guard)" --use-guard
