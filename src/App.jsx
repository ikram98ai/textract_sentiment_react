import React, { useState } from 'react';
import { Box, Button, Input, Textarea, Spinner, VStack, Heading, Badge } from '@chakra-ui/react';
import axios from 'axios';
import { Image } from "@chakra-ui/react"


function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState({ extractedText: '', sentiment: '' });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For previewing the image

 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Update the imagePreview state with Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return alert("Please upload an image!");
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      setLoading(true);
      try {
        // Extract Base64 part from the result
        const base64String = reader.result.split(",")[1];
  
        const response = await axios.post(
          'https://wnepwk20nj.execute-api.us-east-1.amazonaws.com/dev',
          { body: base64String },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const responseData = JSON.parse(response.data.body); // Lambda sends the body as JSON string
        
        setResult({
          extractedText: responseData.extractedText,
          sentiment: responseData.sentiment,
      });

        console.log("result",result)
      } catch (err) {
        console.error(err);
        alert("Failed to process the image.");
      }
      setLoading(false);
    };
    reader.readAsDataURL(image);
  };
  return (
    <Box p={6} maxW="600px" mx="auto">
      <Heading mb={6} textAlign="center">
        Text extraction & Sentiment App
      </Heading>
      <VStack spacing={4}>
      <Box>
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          display="none"
        />
        <Button as='label' bg='gray.700' color='white' htmlFor="file-upload" cursor="pointer">
          Upload Image
        </Button>

        
      </Box>
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Uploaded preview"
            // boxSize="300px"
            objectFit="cover"
            borderRadius="md"
          />
        )}
         {imagePreview && (<Button colorScheme="blue" onClick={handleAnalyze} isDisabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Analyze Image'}
        </Button>
        )}
        {result.extractedText && (
          <>
            <Textarea autoresize resize="none" scrollBehavior={'smooth'}  value={result.extractedText} readOnly placeholder="Extracted Text" />
            {/* <Box bg="gray.900" p={4} borderRadius="md" w="100%">
              <strong>Sentiment:</strong> {result.sentiment}
            </Box> */}

            <Box>
            <strong>Sentiment:</strong> 
              <Badge
                colorScheme={
                  result.sentiment === "POSITIVE"
                    ? "green"
                    : result.sentiment === "NEGATIVE"
                    ? "red"
                    : "gray"
                }
                fontSize="lg"
                p={2}
                borderRadius="md"
              >
                {result.sentiment}
              </Badge>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}

export default App;


