FROM python:3.12.4-slim-bullseye

WORKDIR /root/classifier
USER root
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y python3-pip
COPY . /root/classifier
RUN pip install -r requirements.txt

ENTRYPOINT [ "python3" ]
CMD [ "llm.py" ]