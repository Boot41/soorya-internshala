# tests/lib/test_security.py

from app.lib.security import get_password_hash, verify_password


def test_password_hash_and_verify_success():
    plain = "S3cr3t!"
    hashed = get_password_hash(plain)

    assert hashed and isinstance(hashed, str)
    assert hashed != plain  # should not equal plaintext
    assert verify_password(plain, hashed) is True


def test_verify_password_failure():
    plain = "S3cr3t!"
    hashed = get_password_hash(plain)

    assert verify_password("wrong", hashed) is False


def test_hash_is_salted():
    plain = "same-password"
    h1 = get_password_hash(plain)
    h2 = get_password_hash(plain)

    # With bcrypt, two hashes for same password should differ due to salt
    assert h1 != h2
