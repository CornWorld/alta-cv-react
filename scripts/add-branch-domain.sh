#!/usr/bin/env bash
# 为分支自动注册 custom domain: {branch}.cv.corn.im → {branch}.cv-7mm.pages.dev
# 需要环境变量: CF_API_TOKEN, CF_ACCOUNT_ID, CF_ZONE_ID, BRANCH
# 可选: PROJECT(cv), PROJ_SUBDOMAIN(cv-7mm), BASE_DOMAIN(cv.corn.im)
set -euo pipefail

CF_API="${CF_API_TOKEN:?}"
CF_ACCOUNT_ID="${CF_ACCOUNT_ID:?}"
CF_ZONE_ID="${CF_ZONE_ID:?}"
BRANCH="${BRANCH:?}"
PROJECT="${PROJECT:-cv}"
PROJ_SUBDOMAIN="${PROJ_SUBDOMAIN:-cv-7mm}"
BASE_DOMAIN="${BASE_DOMAIN:-cv.corn.im}"
API="https://api.cloudflare.com/client/v4"

# 与 CF Pages 分支别名一致: 小写 + 非字母数字转 -
alias_name=$(echo "$BRANCH" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
[ -n "$alias_name" ] || { echo "分支名转别名后为空: $BRANCH"; exit 1; }

SUBDOMAIN="${alias_name}.${BASE_DOMAIN}"   # e.g. vis-test.cv.corn.im
PAGES_ALIAS="${alias_name}.${PROJ_SUBDOMAIN}.pages.dev"  # e.g. vis-test.cv-7mm.pages.dev

echo "==> 分支: $BRANCH → 别名: $alias_name"
echo "==> 域名: $SUBDOMAIN → $PAGES_ALIAS"

# 1. 确保 CNAME 存在且指向项目根(让 Pages 验证通过)
echo "--- 1. 检查/创建 CNAME → ${PROJ_SUBDOMAIN}.pages.dev"
existing=$(curl -s -H "Authorization: Bearer $CF_API" \
  "$API/zones/$CF_ZONE_ID/dns_records?name=$SUBDOMAIN&type=CNAME")
cname_id=$(echo "$existing" | python3 -c "import sys,json; r=json.load(sys.stdin)['result']; print(r[0]['id'] if r else '')")
if [ -n "$cname_id" ]; then
  curl -s -X PATCH -H "Authorization: Bearer $CF_API" -H "Content-Type: application/json" \
    "$API/zones/$CF_ZONE_ID/dns_records/$cname_id" \
    -d "{\"type\":\"CNAME\",\"name\":\"$SUBDOMAIN\",\"content\":\"${PROJ_SUBDOMAIN}.pages.dev\",\"proxied\":true}" > /dev/null
  echo "   CNAME 已存在(id=$cname_id),重置指向根"
else
  cname_id=$(curl -s -X POST -H "Authorization: Bearer $CF_API" -H "Content-Type: application/json" \
    "$API/zones/$CF_ZONE_ID/dns_records" \
    -d "{\"type\":\"CNAME\",\"name\":\"$SUBDOMAIN\",\"content\":\"${PROJ_SUBDOMAIN}.pages.dev\",\"proxied\":true}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['id'])")
  echo "   CNAME 已创建(id=$cname_id)"
fi

# 2. 注册域名到 Pages 项目(已存在会报错,忽略)
echo "--- 2. 注册域名到 Pages"
curl -s -X POST -H "Authorization: Bearer $CF_API" -H "Content-Type: application/json" \
  "$API/accounts/$CF_ACCOUNT_ID/pages/projects/$PROJECT/domains" \
  -d "{\"name\":\"$SUBDOMAIN\"}" > /dev/null || true

# 3. 轮询直到域名 active(最多 ~5 分钟)
echo "--- 3. 等待域名激活"
for i in $(seq 1 20); do
  status=$(curl -s -H "Authorization: Bearer $CF_API" \
    "$API/accounts/$CF_ACCOUNT_ID/pages/projects/$PROJECT/domains/$SUBDOMAIN" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['status'])")
  echo "   [${i}] status=$status"
  [ "$status" = "active" ] && break
  [ "$status" = "error" ] && { echo "!! 域名进入 error 状态"; exit 1; }
  sleep 15
done

# 4. 改 CNAME 指向分支别名
echo "--- 4. 改 CNAME → $PAGES_ALIAS"
curl -s -X PATCH -H "Authorization: Bearer $CF_API" -H "Content-Type: application/json" \
  "$API/zones/$CF_ZONE_ID/dns_records/$cname_id" \
  -d "{\"type\":\"CNAME\",\"name\":\"$SUBDOMAIN\",\"content\":\"$PAGES_ALIAS\",\"proxied\":true}" \
  | python3 -c "import sys,json; r=json.load(sys.stdin)['result']; print('   →', r['content'])"

# 5. 验证
echo "--- 5. 验证 https://$SUBDOMAIN"
sleep 10
code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "https://$SUBDOMAIN")
echo "   HTTP $code"
echo "✅ https://$SUBDOMAIN → $PAGES_ALIAS"
