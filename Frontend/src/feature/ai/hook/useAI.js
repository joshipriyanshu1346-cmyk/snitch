import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, toggleChat, resetAction } from '../state/ai.slice';

export const useAI = () => {
    const dispatch = useDispatch();
    const { messages, isOpen, loading, error, lastAction } = useSelector((state) => state.ai);

    const handleSendMessage = (message) => {
        dispatch(sendMessage({ message, history: messages }));
    };

    const handleToggleChat = () => {
        dispatch(toggleChat());
    };

    const handleResetAction = () => {
        dispatch(resetAction());
    };

    return {
        messages,
        isOpen,
        loading,
        error,
        lastAction,
        sendMessage: handleSendMessage,
        toggleChat: handleToggleChat,
        resetAction: handleResetAction
    };
};
