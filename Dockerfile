# Base the image off of the NodeJS image
FROM node

# Set the working directory to be the HOME directory
WORKDIR /root

# Install NPM dependencies early in the build process
COPY ./package.json /root
COPY ./package-lock.json /root
RUN npm install

# Specify what port will be available - necessary for VPC network
EXPOSE 3000
EXPOSE 5432

# Copy our application files to the image
COPY ./api /root/api

# Start the container running our Node app
CMD ["npm", "run", "go"]
