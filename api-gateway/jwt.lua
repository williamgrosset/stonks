local jwt = require "resty.jwt"

local SECRET_KEY = "supersecret"

local jwt_cache = ngx.shared.jwt_cache

local function verify_jwt()
  local headers = ngx.req.get_headers()
  local token = headers["token"]

  if not token then
    ngx.log(ngx.ERR, "[JWT] Missing token header")
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.say("{\"error\": \"Missing token header\"}")
    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
  end

  local cached_user_id = jwt_cache:get(token)

  if cached_user_id then
    ngx.req.set_header("X-User-ID", cached_user_id)
    return
  end

  local jwt_obj = jwt:verify(SECRET_KEY, token)

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

  jwt_cache:set(token, user_id, 300)

  ngx.req.set_header("X-User-ID", user_id)
end

verify_jwt()
