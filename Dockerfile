FROM node:14.18.2-alpine3.13
WORKDIR /farzan
COPY package.json .
RUN npm install
COPY . .
ENV PORT=5000
ENV MONGODB_URI=mongodb+srv://Farzan:Mongodb@123@cluster0.gkqpe.mongodb.net/NoorNFT?retryWrites=true&w=majority
ENV JWT_KEY=secretkey
ENV pinatakey1=2a43b0773cb246a17bdf
ENV pinatakey2=81a70cf364fd4cd321048de910bfada6698db57655cb0b192df80e8bd7c839f0
ENV heroku=https://noor-nft-v1.herokuapp.com
ENV server=http://165.227.195.188:5000
EXPOSE 5000
CMD ["npm", "start"]