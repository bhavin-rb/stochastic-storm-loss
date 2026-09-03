"""Pure Premium = Expected Frequency x Expected Severity (thesis eq. 1)."""


def compute_pure_premium(expected_frequency: float, severity_result: dict) -> dict:
    expected_severity = severity_result["expected_severity"]

    if expected_severity is None:
        return {
            "pure_premium": None,
            "is_infinite": True,
            "reason": (
                "Expected severity is infinite because the GPD shape parameter "
                "(xi) is >= 1, indicating a heavy-tailed distribution."
            ),
            "expected_frequency": expected_frequency,
            "expected_severity": None,
        }

    return {
        "pure_premium": expected_frequency * expected_severity,
        "is_infinite": False,
        "reason": None,
        "expected_frequency": expected_frequency,
        "expected_severity": expected_severity,
    }
