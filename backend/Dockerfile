FROM python:3.8.5-alpine

ENV PYTHONUNBUFFERED=1

# Install build tools, dependencies, and PostgreSQL client tools
RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    postgresql-dev \
    postgresql-client \
    build-base

# Upgrade pip
RUN pip install --upgrade pip

# Set work directory
WORKDIR /app/catalogo_arqueologico

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh

# Ensure the entrypoint script has the correct permissions
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Set the default command to run the backend application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
