# !/bin/bash

echo "#################"
echo "NPM Build for CDN"
echo "#################"
npm run build-cdn
if ($? -ne 0) { exit 1 }

echo "##################"
echo "Upload code to CDN"
echo "##################"
aws s3 sync --acl public-read ./dist-cdn s3://touchvie-pro-cdn/sdkweb
if ($? -ne 0) { exit 1 }

echo "#############"
echo "Configure CDN"
echo "#############"
aws configure set preview.cloudfront true
if ($? -ne 0) { exit 1 }

echo "####################"
echo "Invalidate CDN cache"
echo "####################"
aws cloudfront create-invalidation --distribution-id E1EOJ4G5NRI0GG --paths /sdkweb/*
# URL DE SUBIDA: https://cdn.dive.tv/sdkweb/
if ($? -ne 0) { exit 1 }

echo "#########"
echo "Upload OK"
echo "#########"