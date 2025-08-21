# tests/lib/test_jwt.py

from datetime import timedelta

import pytest

from app.lib.jwt import create_access_token, create_refresh_token, decode_token
from app.core.config import settings


def test_access_token_encode_decode_roundtrip():
    token = create_access_token({"sub": "user@example.com"})
    claims = decode_token(token)
    assert claims is not None
    assert claims["sub"] == "user@example.com"
    assert "exp" in claims


def test_refresh_token_encode_decode_roundtrip():
    token = create_refresh_token({"sub": "user@example.com"})
    claims = decode_token(token)
    assert claims is not None
    assert claims["sub"] == "user@example.com"
    assert "exp" in claims


def test_expired_token_returns_none():
    # Create an already-expired token by using a negative timedelta
    token = create_access_token({"sub": "user@example.com"}, expires_delta=timedelta(seconds=-1))
    assert decode_token(token) is None


def test_invalid_signature_returns_none(monkeypatch):
    token = create_access_token({"sub": "user@example.com"})
    # Change secret to break signature verification
    monkeypatch.setattr(settings, "SECRET_KEY", "different-secret-key")
    assert decode_token(token) is None
