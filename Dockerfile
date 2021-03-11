# Base the image off of the NodeJS image
FROM node

ENV HOST 0.0.0.0

# Set the working directory to be the HOME directory
WORKDIR /root

# Install NPM dependencies early in the build process
COPY ./package.json /root
COPY ./package-lock.json /root
COPY ./tsconfig.json /root
COPY ./jest.config.js /root
COPY ./jsconfig.json /root
COPY ./nuxt.config.js /root
RUN npm install

# Specify what port will be available - necessary for VPC network
EXPOSE 3000
EXPOSE 5432

# Copy our application files to the image
COPY ./api /root/api
COPY ./assets /root/assets
COPY ./components /root/components
COPY ./layouts /root/layouts
COPY ./middleware /root/middleware
COPY ./pages /root/pages
COPY ./plugins /root/plugins
COPY ./static /root/static
COPY ./store /root/store
COPY ./test /root/test

# Start the container running our Node app
CMD ["npm", "run", "dev"]
