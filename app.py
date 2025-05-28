import requests
import json
from flask import Flask, render_template, request, Response

app = Flask(__name__)

@app.route('/')
def index():
    # Serves the main HTML page
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    # Handles requests to the Ollama /generate endpoint
    user_prompt = request.form.get('prompt')
    model = request.form.get('model', 'gemma3') # Default model if not specified
    
    api_url = "http://localhost:11434/api/generate" # Ollama API URL
    headers = {"Content-Type": "application/json"}
    data = {
        "prompt": user_prompt,
        "model": model,
        "stream": True # Ensure streaming is enabled for Ollama
    }
    
    def generate_response_ollama():
        # Generator function to stream responses from Ollama
        try:
            # Make a POST request to the Ollama API with streaming enabled
            response = requests.post(api_url, headers=headers, json=data, stream=True)
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
            
            # Iterate over the response lines (each line is a JSON object)
            for line in response.iter_lines():
                if line:
                    try:
                        decoded_line = line.decode('utf-8')
                        json_data = json.loads(decoded_line)
                        # Check if the 'response' key (for Ollama) exists and contains text
                        if 'response' in json_data and json_data['response']:
                            # Yield the text content as a Server-Sent Event (SSE)
                            yield f"data: {json.dumps({'text': json_data['response']})}\n\n"
                        # Check if Ollama indicates it's done with the response
                        if json_data.get('done', False):
                            yield f"data: {json.dumps({'status': 'done'})}\n\n" # Signal end of stream
                            break 
                    except json.JSONDecodeError:
                        # Handle cases where a line is not valid JSON
                        app.logger.error(f"Error decoding JSON: {decoded_line}")
                        yield f"data: {json.dumps({'error': f'Error decoding JSON chunk', 'details': decoded_line})}\n\n"
                    except Exception as e:
                        app.logger.error(f"Error processing stream line: {e}")
                        yield f"data: {json.dumps({'error': f'Error processing stream line: {str(e)}'})}\n\n"
        except requests.exceptions.RequestException as e:
            # Handle network or API errors
            app.logger.error(f"Error making API call to Ollama: {e}")
            yield f"data: {json.dumps({'error': f'Error making API call to Ollama: {str(e)}'})}\n\n"
        except Exception as e:
            # Handle any other unexpected errors
            app.logger.error(f"Unexpected error in Ollama stream: {e}")
            yield f"data: {json.dumps({'error': f'Unexpected error in Ollama stream: {str(e)}'})}\n\n"
            
    # Return a streaming response
    return Response(generate_response_ollama(), mimetype='text/event-stream')

@app.route('/lmstudio', methods=['POST'])
def lmstudio():
    # Handles requests to the LM Studio compatible endpoint
    user_prompt = request.form.get('prompt')
    # Default model if not specified, ensure this matches a loaded model in LM Studio
    model = request.form.get('model', 'your_loaded_model_name_in_lm_studio') 
    
    api_url = "http://localhost:1234/v1/chat/completions" # LM Studio API URL
    headers = {"Content-Type": "application/json"}
    data = {
        "model": model,
        "messages": [{"role": "user", "content": user_prompt}],
        "stream": True # Enable streaming for LM Studio
    }
    
    def generate_response_lmstudio():
        # Generator function to stream responses from LM Studio
        try:
            # Make a POST request to the LM Studio API with streaming enabled
            response = requests.post(api_url, headers=headers, json=data, stream=True)
            response.raise_for_status() # Raise an exception for bad status codes
            
            # Iterate over the response lines
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    # LM Studio streams data with a "data: " prefix for each JSON object
                    if decoded_line.startswith('data: '):
                        json_str = decoded_line[len('data: '):]
                        if json_str.strip() == "[DONE]": # Check for LM Studio's stream termination signal
                            yield f"data: {json.dumps({'status': 'done'})}\n\n"
                            break
                        try:
                            json_data = json.loads(json_str)
                            # Extract the content from the delta part of the choice
                            if 'choices' in json_data and len(json_data['choices']) > 0:
                                delta = json_data['choices'][0].get('delta', {})
                                content = delta.get('content')
                                if content:
                                    # Yield the text content as an SSE
                                    yield f"data: {json.dumps({'text': content})}\n\n"
                        except json.JSONDecodeError:
                            app.logger.error(f"Error decoding JSON from LM Studio: {json_str}")
                            yield f"data: {json.dumps({'error': 'Error decoding JSON from LM Studio', 'details': json_str})}\n\n"
                        except Exception as e:
                            app.logger.error(f"Error processing LM Studio stream line: {e}")
                            yield f"data: {json.dumps({'error': f'Error processing LM Studio stream line: {str(e)}'})}\n\n"
        except requests.exceptions.RequestException as e:
            # Handle network or API errors
            app.logger.error(f"Error making API call to LM Studio: {e}")
            yield f"data: {json.dumps({'error': f'Error making API call to LM Studio: {str(e)}'})}\n\n"
        except Exception as e:
            # Handle any other unexpected errors
            app.logger.error(f"Unexpected error in LM Studio stream: {e}")
            yield f"data: {json.dumps({'error': f'Unexpected error in LM Studio stream: {str(e)}'})}\n\n"

    # Return a streaming response
    return Response(generate_response_lmstudio(), mimetype='text/event-stream')

if __name__ == '__main__':
    # Run the Flask app
    # Ensure you have a 'templates' folder in the same directory as app.py
    # and index.html is inside the 'templates' folder.
    app.run(debug=True, port=5000)
