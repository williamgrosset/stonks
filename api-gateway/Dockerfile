FROM openresty/openresty:latest

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    build-essential \
    libssl-dev \
    libreadline-dev \
    libncurses5-dev \
    libpcre3-dev \
    perl \
    git \
    liblua5.1-dev \
    && rm -rf /var/lib/apt/lists/*

# Install LuaRocks manually (latest stable version)
WORKDIR /usr/local/
RUN git clone https://github.com/luarocks/luarocks.git \
    && cd luarocks \
    && git checkout v3.9.1 \
    && ./configure --with-lua=/usr/local/openresty/luajit \
    && make -j$(nproc) \
    && make install \
    && cd .. \
    && rm -rf luarocks

# Set correct environment variables for LuaRocks & OpenResty
ENV PATH="/usr/local/openresty/luajit/bin:$PATH"
ENV LUA_PATH="/usr/local/openresty/luajit/share/lua/5.1/?.lua;;"
ENV LUA_CPATH="/usr/local/openresty/luajit/lib/lua/5.1/?.so;;"

# Install Lua modules using the updated LuaRocks
RUN luarocks install lua-resty-jwt \
    && luarocks install lua-resty-http \
    && luarocks install lua-resty-string \
    && luarocks install lua-resty-session

# Set working directory
WORKDIR /usr/local/openresty/nginx/conf/

# Copy configuration and Lua script
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY cors.conf /usr/local/openresty/nginx/conf/cors.conf
COPY jwt.lua /usr/local/openresty/nginx/conf/jwt.lua

# Expose port 80 for OpenResty
EXPOSE 80

# Start OpenResty when the container runs
CMD ["openresty", "-g", "daemon off;"]
