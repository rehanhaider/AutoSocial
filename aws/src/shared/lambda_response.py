# ruff: noqa: Q000
"""
# --coding: utf-8 --
Contains the lambda response functions and headers

Returns:
    dict: The lambda response
"""

HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
}


def RESPONSE(body: dict, status_code: int = 200, headers: dict = HEADERS) -> dict:  # noqa: N802
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': body,
    }
