import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatWithAI as chatWithAIApi } from '../services/ai.api';

export const sendMessage = createAsyncThunk(
    'ai/sendMessage',
    async ({ message, history }, { rejectWithValue }) => {
        try {
            const response = await chatWithAIApi(message, history);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to connect to AI Assistant");
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState: {
        messages: [
            { role: 'model', parts: [{ text: "Hello! I'm your SNITCH AI Assistant. How can I help you find your perfect style today?" }] }
        ],
        isOpen: false,
        loading: false,
        error: null,
        lastAction: null
    },
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },
        clearError: (state) => {
            state.error = null;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        resetAction: (state) => {
            state.lastAction = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Add user message to history before API call
                state.messages.push({ role: 'user', parts: [{ text: action.meta.arg.message }] });
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push({ role: 'model', parts: [{ text: action.payload.message }] });
                if (action.payload.action) {
                    state.lastAction = action.payload.action;
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.messages.push({ role: 'model', parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] });
            });
    }
});

export const { toggleChat, clearError, addMessage, resetAction } = aiSlice.actions;
export default aiSlice.reducer;
