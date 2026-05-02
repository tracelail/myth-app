import os

# Must be set before myth_app is imported so database.py picks up the in-memory URL
os.environ["DATABASE_URL"] = "sqlite://"
