---

# LocalLLM Website

Base idea is to have the chatarea for localllm model.

This project provides a simple web interface (using Flask) to interact with local LLM backends like [Ollama](https://github.com/ollama/ollama) and [LM Studio](https://lmstudio.ai/). Users can enter prompts via a web UI and get streamed model responses in real time.

## Features

- 🌐 Simple Flask web server with chat interface
- 🦙 Connects to Ollama (default: `localhost:11434`)
- 🤖 Connects to LM Studio (default: `localhost:1234`)
- 🔄 Streams model responses using Server-Sent Events (SSE)
- 📝 Easy to customize and extend

## Requirements

- Python 3.7+
- [Ollama](https://github.com/ollama/ollama) and/or [LM Studio](https://lmstudio.ai/) running locally
- pip

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adalkondan/localllm_website.git
   cd localllm_website
   ```

2. **Install Python dependencies**

   ```bash
   pip install flask requests
   ```

3. **Start your local LLM backend**
   - For Ollama:  
     Follow [Ollama’s instructions](https://github.com/ollama/ollama) and make sure it’s running at `localhost:11434`.
   - For LM Studio:  
     Follow [LM Studio’s instructions](https://lmstudio.ai/docs/server-api) and ensure it’s running at `localhost:1234`.

4. **Run the web server**

   ```bash
   python app.py
   ```

5. **Open your browser and visit**

   ```
   http://localhost:5000/
   ```

## Usage

- Enter your prompt in the chat area.
- Select the LLM backend (Ollama or LM Studio) and (optionally) the model name.
- Get responses streamed in real time.

## Configuration

- **Ollama Endpoint:**  
  The backend expects Ollama’s API at `http://localhost:11434/api/generate`.
- **LM Studio Endpoint:**  
  The backend expects LM Studio’s API at `http://localhost:1234/v1/chat/completions`.

You can change these URLs in `app.py` if your setup differs.

## File Structure

```
localllm_website/
│
├── app.py                # Main Flask app
├── templates/
│   └── index.html        # Frontend chat interface
├── static/               # (Optional) CSS/JS assets
└── README.md             # This file
```

## Notes

- The Flask server streams model responses using Server-Sent Events (SSE).
- For LM Studio, set the correct model name in the frontend or modify the default in `app.py`.
- Make sure the required models are downloaded and loaded in your backend.

## Contributing

Feel free to open issues or submit pull requests for improvements!

## License

[MIT License](LICENSE)

---
