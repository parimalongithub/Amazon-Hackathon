import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Button, Box, InputBase, Typography } from '@mui/material';
import axios from 'axios';

const PriceNegotiator = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const baseprice = 50;

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      const formData = new FormData();
      formData.append('basePrice', baseprice);
      formData.append('userMessage', input);

      try {
        const response = await axios.post("http://localhost:8080/negotiate", formData, {
          headers: { 'Content-Type': 'multipart/form-data' } 
        });

        if (response.data) {
          const aiResponse = { id: messages.length + 2, text: response.data, sender: 'ai' };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          throw new Error("No response data received");
        }
      } catch (error) {
        console.error("Error sending message to backend:", error);
        setMessages((prev) => [
          ...prev,
          { id: messages.length + 2, text: `Error: ${error.message}`, sender: 'ai' }
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a message.");
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [messages]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Replace with actual SideNavbar component */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          <CardHeader title="Price Negotiator" sx={{ paddingBottom: 0 }} />
          <CardContent sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px', color: 'black' }}>
            {messages.map((message) => (
              <Box key={message.id} sx={{ display: 'flex', marginBottom: '12px', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Avatar sx={{ bgcolor: message.sender === 'user' ? '#1976d2' : '#f50057' }}>
                  {message.sender === 'user' ? 'U' : 'AI'}
                </Avatar>
                <Box sx={{
                  padding: '10px',
                  borderRadius: '12px',
                  maxWidth: '70%',
                  backgroundColor: message.sender === 'user' ? '#1976d2' : '#e0e0e0',
                  color: message.sender === 'user' ? 'white' : 'black',
                  marginLeft: message.sender === 'user' ? '10px' : '0',
                  marginRight: message.sender === 'user' ? '0' : '10px'
                }}>
                  {message.text}
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{
                    width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1976d2', margin: '0 2px',
                    animation: 'dot-blink 1s infinite alternate'
                  }} />
                  <Box sx={{
                    width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1976d2', margin: '0 2px',
                    animation: 'dot-blink 1s 0.2s infinite alternate'
                  }} />
                  <Box sx={{
                    width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1976d2', margin: '0 2px',
                    animation: 'dot-blink 1s 0.4s infinite alternate'
                  }} />
                </Typography>
              </Box>
            )}
          </CardContent>
          <CardActions sx={{ padding: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '10px', backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
                <InputBase
                  inputRef={inputRef}
                  placeholder="Type your message..."
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  sx={{ padding: '10px', border: '1px solid #ccc', borderRadius: '12px', marginRight: '10px', backgroundColor: '#ffffff', color: 'black' }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSend} 
                  disabled={!input.trim() || loading} 
                  sx={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '12px' }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </CardActions>
        </Card>
      </Box>
      <style>{`
        @keyframes dot-blink {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default PriceNegotiator;
