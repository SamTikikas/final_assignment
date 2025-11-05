# Screen Recorder App - MERN Stack  

A full-stack screen recording application built with React, Node.js, Express, and MySQL that allows users to record their browser screen with audio, preview recordings, and manage uploaded files.  

---

## 🚀 Features  
- **Native Screen Recording**: Uses `navigator.mediaDevices.getDisplayMedia()` API  
- **Audio Capture**: Records both screen audio and microphone  
- **Live Timer**: Real-time recording timer with 3-minute limit  
- **Live Preview**: Shows recording in real-time  
- **Download & Upload**: Save recordings locally or upload to server  
- **Recordings Manager**: View and play all uploaded recordings  
- **Responsive Design**: Bootstrap-powered responsive UI  
- **RESTful API**: Complete backend with MySQL database  

---

## 🛠️ Tech Stack  

### Frontend  
- **React** 18.2.0  
- **Bootstrap** 5.3.0 & React-Bootstrap  
- **Axios** for API calls  
- **Native MediaRecorder API**  

### Backend  
- **Node.js** with Express.js  
- **MySQL** database with mysql2  
- **Multer** for file uploads  
- **CORS** for cross-origin requests  

---

## 📋 Prerequisites  
- Node.js 14+  
- MySQL 8.0+  
- Chrome/Edge browser (for screen recording)  
- Git  

---

## 🔧 Installation & Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/yourusername/mern-screen-recorder.git
cd mern-screen-recorder
