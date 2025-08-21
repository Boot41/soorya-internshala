from fastapi import Response


def clear_refresh_token_controller(response: Response):
    """Clears the refresh token cookie on the client.

    We scope deletion to the same path used when setting the cookie to ensure
    the browser removes the correct cookie.
    """
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth/refresh",
        samesite="lax",
        secure=True,
        httponly=True,
    )
    return {"message": "Logged out successfully"}
