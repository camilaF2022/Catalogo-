FROM python:3.8.5-alpine

ENV PYTHONUNBUFFERED=1

# Install build tools and dependencies
RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    postgresql-dev \
    build-base

# Upgrade pip
RUN pip install --upgrade pip

# Copy the requirements file and install dependencies
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt

# Copy the application code
COPY . /app

