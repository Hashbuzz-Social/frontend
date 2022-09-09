# Set the base image to node:1-6alpine
FROM node:16-alpine as build

# Specify where our app will live in the container
WORKDIR /app

# Copy the React App to the container
COPY . /app/

# Prepare the container for building React
RUN npm install
#RUN npm install react-scripts@3.2.0 -g
# We want the production version

ENV REACT_APP_NETWORK "testnet"
ENV REACT_APP_BASE_URL "https://sea-lion-app-dhl7x.ondigitalocean.app"
ENV REACT_APP_DAPP_API "https://dapp-backend9-ws9ps.ondigitalocean.app/api/"

RUN npm run build

# Prepare nginx for frontend
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Fire up nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
