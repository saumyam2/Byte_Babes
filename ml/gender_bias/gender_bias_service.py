import os
from googleapiclient import discovery
from dotenv import load_dotenv

load_dotenv()

PERSPECTIVE_API_KEY = os.environ.get("PERSPECTIVE_API_KEY")


def map_score_to_custom_scale(score):
    # Map 0.15 -> 70 and 0.2 -> 90 using linear interpolation
    if score <= 0.15:
        return 0
    elif score >= 0.2:
        return 100
    else:
        return round(70 + ((score - 0.15) / (0.2 - 0.15)) * (90 - 70))


def get_bias(text):
    client = discovery.build(
        "commentanalyzer",
        "v1alpha1",
        developerKey=PERSPECTIVE_API_KEY,
        discoveryServiceUrl="https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1",
        static_discovery=False,
    )

    analyze_request = {
        "comment": {"text": text},
        "requestedAttributes": {"TOXICITY": {}},
    }

    response = client.comments().analyze(body=analyze_request).execute()
    score = response["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
    scaled_score = map_score_to_custom_scale(score)
    is_toxic = score > 0.15

    return is_toxic, scaled_score


if __name__ == "__main__":
    # Example usage
    result = get_bias("can you help me find job openings for women?")
    print(f"Toxic: {result[0]}, Scaled Score: {result[1]}")
