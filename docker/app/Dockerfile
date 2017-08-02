FROM centos:7
MAINTAINER Visgence Inc <info@visgence.com>

RUN yum install -y epel-release
# bzip2 required by phantomjs
# git required by bower, bower required by bootstrap-treeview.
RUN yum install -y screen vim wget bzip2 git && yum clean all

RUN yum install -y python-setuptools && yum clean all
RUN easy_install pip

ADD requirements.txt .
RUN pip install -r requirements.txt

#Install node from package
RUN wget https://nodejs.org/download/release/v6.10.2/node-v6.10.2-linux-x64.tar.gz
RUN tar --strip-components 1 -xzvf node-v* -C /usr/local

VOLUME ["/home/miniceptor"]
WORKDIR /home/miniceptor

expose 8000
