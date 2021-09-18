FROM ubuntu:18.04 as baseImage

RUN mkdir /usr/app
WORKDIR /usr/app

RUN apt update
RUN apt install -y wget curl

#Installing GO
#RUN curl -O https://storage.googleapis.com/golang/go1.13.5.linux-amd64.tar.gz
#RUN tar -xvf go1.13.5.linux-amd64.tar.gz
#RUN mv go /usr/local
#RUN echo "export GOPATH=$HOME" >> ~/.profile
#RUN echo "export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin" >> ~/.profile
#RUN echo "export GOPATH=$HOME" >> ~/.bashrc
#RUN echo "export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin" >> ~/.bashrc
#RUN /bin/sh ~/.bashrc
#RUN /bin/sh ~/.profile
#RUN go version

#Installing node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
RUN /bin/sh nodesource_setup.sh
RUN apt install -y nodejs
RUN node -v

#Installing python3
RUN apt install -y python3.8
RUN python3 --version

#Installing C++
RUN apt install -y g++
RUN g++ --version

COPY ./ ./
WORKDIR /usr/app

RUN npm install -g yarn
RUN yarn

CMD node app/server.js