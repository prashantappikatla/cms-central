import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from '~/components/ui/button';
import * as DocumentPicker from 'expo-document-picker';

// Define the props type explicitly
interface AttachInputFieldProps {
  onFileSelected: (file: DocumentPicker.DocumentPickerSuccessResult) => void;
}

const AttachInputField: React.FC<AttachInputFieldProps> = ({ onFileSelected }) => {
  // State to hold the selected file, specifically of type DocumentPickerSuccessResult or null
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerSuccessResult | null>(null);

  const handlePickDocument = async () => {
    try {
      const result: DocumentPicker.DocumentResult = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: false, // Optional: adjust according to your needs
      });

      // Handle only successful document picks
      if (result.type === 'success') {
        setSelectedFile(result);
        onFileSelected(result); // Pass the successful result to the parent component
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <View style={{ width: '100%', alignItems: 'right' }}>
      <Button
        variant='outline'
        className='shadow shadow-foreground/5'
        onPress={handlePickDocument}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          {selectedFile ? 'Change Files' : 'Attach Files'}
        </Text>
      </Button>
      {selectedFile && (
        <Text style={{ marginTop: 10, color: '#333', fontSize: 14, textAlign: 'center' }}>
          {selectedFile.name}
        </Text>
      )}
    </View>
  );
};

export default AttachInputField;