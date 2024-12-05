import boto3
import json
import base64

headers =  {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers": "Content-Type"
            }

def lambda_handler(event, context):
    textract_client = boto3.client('textract')
    comprehend_client = boto3.client('comprehend')

    try:
        # Parse image data from event
        body = event.get('body', '')
        if not body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing image data'}),
                "headers":headers
            }

        # Strip Base64 prefix if present
        if body.startswith("data:image"):
            body = body.split(",")[1]

        image_data = base64.b64decode(body)

        # Call Textract
        response = textract_client.detect_document_text(
            Document={'Bytes': image_data}
        )

        # Extract detected text
        extracted_text = " ".join([item["Text"] for item in response["Blocks"] if item["BlockType"] == "LINE"])

        # Perform sentiment analysis using Comprehend
        sentiment_response = comprehend_client.detect_sentiment(
            Text=extracted_text,
            LanguageCode='en'
        )

        # Return response
        return {
            'statusCode': 200,
            'body': json.dumps({
                'extractedText': extracted_text,
                'sentiment': sentiment_response['Sentiment']
            }),
            "headers": headers
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            "headers": headers
        }
