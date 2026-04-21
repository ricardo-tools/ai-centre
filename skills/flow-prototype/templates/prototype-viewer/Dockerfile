FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy app source (projects/ and data/ are mounted as volumes)
COPY . .

# Setup DB + start dev server
EXPOSE 4242
CMD ["npm", "run", "dev"]
