# -----------------------------
# Base Image
# -----------------------------
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# -----------------------------
# Install Node.js 22
# -----------------------------
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    fontconfig \
    fonts-dejavu \
    libgraphite2-3 \
    libharfbuzz0b \
    libfreetype6 \
    libfontconfig1 \
    unzip \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# -----------------------------
# Install Tectonic
# -----------------------------
RUN curl -L \
https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic@0.16.0/tectonic-0.16.0-x86_64-unknown-linux-gnu.tar.gz \
-o tectonic.tar.gz \
&& tar -xzf tectonic.tar.gz \
&& mv tectonic /usr/local/bin/tectonic \
&& chmod +x /usr/local/bin/tectonic \
&& rm tectonic.tar.gz

# Verify installation
RUN node -v && npm -v && tectonic --help

# -----------------------------
# Install Dependencies
# -----------------------------
COPY package*.json ./

RUN npm ci

# -----------------------------
# Copy Source
# -----------------------------
COPY . .

EXPOSE 5000

CMD ["npm","start"]