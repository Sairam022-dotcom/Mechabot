# MechaBot 🤖

A modern, responsive AI chatbot application with a sleek black and green color theme. MechaBot allows you to chat with multiple AI models, manage multiple chat sessions, and provides a clean user interface.

## Features

- 🎨 **Modern UI**: Sleek black and green cyberpunk-inspired design
- 🤖 **Multiple AI Models**: Choose from 3 different AI models:
  - Google Gemini 2.0 Flash
  - DeepSeek R1T2 Chimera
  - GPT OSS 20B
- 💬 **Multi-Chat Support**: Create and manage multiple chat sessions
- 🗑️ **Chat Management**: Delete individual chats or the current active chat
- 💾 **Persistent Storage**: Chats are saved to browser localStorage
- 🐳 **Docker Support**: Easy deployment with Docker

## Getting Started

### Local Development

1. Simply open `index.html` in your web browser
2. No build process or dependencies required!

### Using Docker

#### Build the Docker image:
```bash
docker build -t mechabot .
```

#### Run the container:
```bash
docker run -d -p 8080:80 --name mechabot-app mechabot
```

#### Access the application:
Open your browser and navigate to `http://localhost:8080`

#### Stop the container:
```bash
docker stop mechabot-app
```

#### Remove the container:
```bash
docker rm mechabot-app
```

## Usage

1. **Select a Model**: Choose your preferred AI model from the dropdown in the sidebar
2. **Start Chatting**: Type your message in the input box and press Enter or click the send button
3. **Create New Chats**: Click the "+ New Chat" button to start a fresh conversation
4. **Switch Between Chats**: Click on any chat in the sidebar to switch to it
5. **Delete Chats**: Click the "×" button next to a chat or use the "Delete Chat" button in the header

## Technology Stack

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **API**: OpenRouter API for AI model access
- **Deployment**: Nginx (Docker)

## API Configuration

The application uses the OpenRouter API with the following configuration:
- API Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Supported Models:
  - `google/gemini-2.0-flash-exp:free`
  - `tngtech/deepseek-r1t2-chimera:free`
  - `openai/gpt-oss-20b:free`

## Project Structure

```
Mechchat/
├── index.html          # Main HTML structure
├── styles.css          # Styling and theme
├── script.js           # Application logic
├── Dockerfile          # Docker configuration
├── .dockerignore       # Docker ignore file
└── README.md          # This file
```

## Features in Detail

### Chat Management
- Automatically saves all conversations to browser localStorage
- First user message becomes the chat title
- Chat titles are truncated to 30 characters for display
- Prevents deletion of the last remaining chat

### UI/UX
- Responsive design that works on desktop and mobile
- Smooth animations and transitions
- Typing indicator while AI is responding
- Error handling with user-friendly messages
- Custom scrollbars matching the theme
- Auto-expanding text input

### Security
- API key is included in the code (for demonstration purposes)
- In production, consider using environment variables or a backend proxy

## Browser Compatibility

- Modern browsers with ES6+ support
- LocalStorage API support required
- Tested on Chrome, Firefox, Edge, and Safari

## License

This project is open source and available for personal and commercial use.

## Contributing

Feel free to submit issues and enhancement requests!

---

Made with 💚 by the MechaBot team
