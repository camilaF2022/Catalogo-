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

# Set work directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Ensure the entrypoint script has the correct permissions
RUN chmod +x /app/entrypoint.sh

# Use CMD instead of ENTRYPOINT
CMD ["/bin/sh", "/app/entrypoint.sh"]