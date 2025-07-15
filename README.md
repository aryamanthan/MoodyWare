# 🎭 MoodyWare: AI-Powered Mood-Based Song Recommender

A real-time mood detection web application that uses AI to analyze facial expressions and recommend songs based on your current mood.

## 🌟 Features

- **Real-time Face Detection**: Uses TensorFlow.js and face-api.js for live facial expression analysis
- **Mood Recognition**: Detects 7 different emotions (happy, sad, angry, surprised, neutral, fearful, disgusted)
- **Music Recommendations**: Curated song suggestions based on detected mood
- **Responsive Design**: Works on desktop and mobile devices
- **Privacy-First**: All processing happens locally in your browser

## 🚀 Live Demo

Visit: [Your GitHub Pages URL]

## 📱 Usage

1. Allow camera permissions when prompted
2. Look into your camera
3. The AI will detect your mood in real-time
4. Enjoy personalized song recommendations!

## 🛠️ Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Models**: face-api.js (TinyFaceDetector + FaceExpressionNet)
- **Camera**: WebRTC getUserMedia API
- **Deployment**: GitHub Pages

## 🔧 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MoodyWare.git
   cd MoodyWare
   ```

2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

3. Open `http://localhost:8000` in your browser

## 🌐 Deployment to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source: "Deploy from a branch"
4. Choose "main" branch
5. Your site will be available at `https://yourusername.github.io/MoodyWare`

### Important Notes for GitHub Pages:
- ✅ Uses CDN for face-api.js (no node_modules needed)
- ✅ HTTPS is automatically enabled (required for camera access)
- ✅ All AI models are included in the repository
- ✅ No server-side processing required

## 🎵 Supported Moods & Songs

- **Happy**: Upbeat, energetic songs
- **Sad**: Melancholic, reflective tracks
- **Angry**: Intense, powerful music
- **Surprised**: Uplifting, energetic songs
- **Neutral**: Balanced, popular tracks
- **Fearful**: Empowering, confidence-building songs
- **Disgusted**: Comforting, soothing music

## 🔒 Privacy & Security

- **No Data Collection**: Your camera feed is processed locally
- **No Server Communication**: All AI processing happens in your browser
- **No Storage**: Expressions are analyzed in real-time, nothing is saved

## 🐛 Troubleshooting

### Camera Not Working:
- Ensure you're using HTTPS (required for GitHub Pages)
- Grant camera permissions
- Check if your browser supports WebRTC
- Try refreshing the page

### AI Models Not Loading:
- Check your internet connection
- Verify model files are present in `/models` folder
- Clear browser cache and try again

### Performance Issues:
- Close other browser tabs
- Ensure good lighting for better detection
- Use a modern browser (Chrome, Firefox, Safari, Edge)

## 📊 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) for AI models
- [TensorFlow.js](https://www.tensorflow.org/js) for machine learning
- Music recommendations curated from popular streaming platforms

---

**Made with ❤️ and AI**
