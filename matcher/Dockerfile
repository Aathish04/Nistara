FROM python:3.12.4-slim-bullseye
WORKDIR /root/matcher
USER root
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y python3-pip
COPY . /root/matcher
RUN pip install -r requirements.txt
ENTRYPOINT [ "python3" ]
CMD [ "matcher.py" ]
