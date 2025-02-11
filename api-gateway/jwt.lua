local jwt = require "resty.jwt"

local SECRET_KEY = "supersecret"

local jwt_cache = ngx.shared.jwt_cache

local function verify_jwt()
  ngx.log(ngx.ERR, "[JWT] running verify_jwt() middleware...")

  local headers = ngx.req.get_headers()
  local token = headers["Authorization"]

  if not token then
    ngx.log(ngx.ERR, "[JWT] Missing Authorization header")
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("{\"error\": \"Missing Authorization header\"}")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
  end

  local _, _, extracted_token = string.find(token, "Bearer%s+(.+)")

  if not extracted_token then
    ngx.log(ngx.ERR, "[JWT] Invalid Authorization format")
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("{\"error\": \"Invalid Authorization format\"}")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
  end

  local cached_user_id = jwt_cache:get(extracted_token)

  if cached_user_id then
    ngx.log(ngx.ERR, "[JWT] Token found in cache")
    ngx.req.set_header("X-User-ID", cached_user_id)
    return
  end

  local jwt_obj = jwt:verify(SECRET_KEY, extracted_token)

  if not jwt_obj.verified then
    ngx.log(ngx.ERR, "[JWT] Invalid JWT token")
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("{\"error\": \"Invalid JWT token\"}")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
  end

  local user_id = jwt_obj.payload.user_id

  if not user_id then
    ngx.log(ngx.ERR, "[JWT] Missing user_id in token")
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("{\"error\": \"Missing user_id in token\"}")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
  end

  jwt_cache:set(extracted_token, user_id, 300)

  ngx.req.set_header("X-User-ID", user_id)

  ngx.log(ngx.ERR, "[JWT] JWT verified successfully for user_id: " .. user_id)
end

verify_jwt()
