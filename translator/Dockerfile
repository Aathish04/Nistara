FROM python:3.12.4-slim-bullseye
WORKDIR /root/translator
USER root
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y git
RUN apt-get install -y python3-pip
COPY . /root/translator
RUN pip install -r requirements.txt
ENTRYPOINT [ "python3" ]
CMD [ "translator.py" ]