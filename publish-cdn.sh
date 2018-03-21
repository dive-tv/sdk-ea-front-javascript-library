# !/bin/bash
npm run build-cdn
aws s3 sync --acl public-read ./dist-cdn s3://dive-pro-sdk-web || exit 1
aws configure set preview.cloudfront true || exit 1
aws cloudfront create-invalidation --distribution-id EEN8HBT1T2GNS --paths /* || exit 1
# URL DE SUBIDA: https://cdn.dive.tv/sdkweb/