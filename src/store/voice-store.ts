import { create } from 'zustand';
import { elevenlabs, upload } from '@devvai/devv-code-backend';

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  recordedAudio: Blob | null;
  transcription: string;
  audioUrl: string;
  
  // TTS State
  isSynthesizing: boolean;
  synthesizedAudioUrl: string;
  
  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  processAudio: (audioBlob: Blob) => Promise<string>;
  textToSpeech: (text: string, voiceId?: string) => Promise<string>;
  clearAudio: () => void;
}

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export const useVoiceStore = create<VoiceState>((set, get) => ({
  isRecording: false,
  isProcessing: false,
  recordedAudio: null,
  transcription: '',
  audioUrl: '',
  isSynthesizing: false,
  synthesizedAudioUrl: '',

  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        set({ recordedAudio: audioBlob });
        
        // Auto-process the audio
        get().processAudio(audioBlob);
        
        // Stop all tracks to free up microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000); // Collect data every second
      set({ isRecording: true });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Microphone access denied or not available');
    }
  },

  stopRecording: async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      set({ isRecording: false });
    }
  },

  processAudio: async (audioBlob: Blob) => {
    set({ isProcessing: true });
    
    try {
      // Upload audio file first
      const audioFile = new File([audioBlob], 'recording.webm', { 
        type: 'audio/webm;codecs=opus' 
      });
      
      const uploadResult = await upload.uploadFile(audioFile);
      
      if (upload.isErrorResponse(uploadResult)) {
        throw new Error('Failed to upload audio file');
      }
      
      // Process with ElevenLabs STT
      const sttResult = await elevenlabs.speechToText({
        audio_url: uploadResult.link
      });
      
      set({ 
        transcription: sttResult.text,
        audioUrl: uploadResult.link,
        isProcessing: false,
      });
      
      return sttResult.text;
      
    } catch (error) {
      set({ isProcessing: false });
      console.error('Audio processing error:', error);
      throw error;
    }
  },

  textToSpeech: async (text: string, voiceId?: string) => {
    set({ isSynthesizing: true });
    
    try {
      const ttsResult = await elevenlabs.textToSpeech({
        text,
        voice_id: voiceId || '21m00Tcm4TlvDq8ikWAM', // Default voice
        stability: 0.5,
        similarity_boost: 0.75,
      });
      
      set({ 
        synthesizedAudioUrl: ttsResult.audio_url,
        isSynthesizing: false,
      });
      
      return ttsResult.audio_url;
      
    } catch (error) {
      set({ isSynthesizing: false });
      console.error('TTS error:', error);
      throw error;
    }
  },

  clearAudio: () => {
    set({
      recordedAudio: null,
      transcription: '',
      audioUrl: '',
      synthesizedAudioUrl: '',
    });
  },
}));