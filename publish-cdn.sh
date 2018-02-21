# !/bin/bash
npm run build-cdn
aws s3 sync --acl public-read ./dist-cdn s3://touchvie-pro-cdn/sdkweb || exit 1
aws configure set preview.cloudfront true || exit 1
aws cloudfront create-invalidation --distribution-id E1EOJ4G5NRI0GG --paths /sdkweb/* || exit 1
# URL DE SUBIDA: https://cdn.dive.tv/sdkweb/