#!/bin/bash

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
      
    if [ "$TRAVIS_BRANCH" == "master" ]; then
        echo "Set minor version and push on master branch, publishing lib to NPM"
        npm install
        npm run build
        npm version patch
        npm publish
        
    elif [ "$TRAVIS_BRANCH" == "beta" ]; then
        echo "beta version"
        echo "Set minor version and push on master branch, publishing lib to NPM"
        npm install
        npm run build
        npm version patch
        npm publish --tag beta
    else
        echo "Branch is not master, skipping NPM publish"
    fi
else
    echo "Pull request, skipping NPM publish"
fi
