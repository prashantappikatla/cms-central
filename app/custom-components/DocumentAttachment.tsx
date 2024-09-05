import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button } from '~/components/ui/button';
import * as DocumentPicker from 'expo-document-picker';

interface AttachInputFieldProps {
  onFileSelected: (file: DocumentPicker.DocumentPickerSuccessResult) => void;
  selectedFile: DocumentPicker.DocumentPickerResult | null;
}

const AttachInputField: React.FC<AttachInputFieldProps> = ({ onFileSelected, selectedFile }) => {
  const [localSelectedFile, setLocalSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  useEffect(() => {
    console.log('Local selected file state changed:', localSelectedFile);
  }, [localSelectedFile]);

  useEffect(() => {
    console.log('Parent selected file prop changed:', selectedFile);
  }, [selectedFile]);

  const handlePickDocument = async () => {
    if (Platform.OS === 'web') {
      // For web, use a simple file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const fileResult = {
            type: 'success',
            uri: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
          } as DocumentPicker.DocumentPickerSuccessResult;
          console.log('Web selected file:', fileResult);
          setLocalSelectedFile(fileResult);
          onFileSelected(fileResult);
        }
      };
      input.click();
    } else {
      // For mobile, use Expo Document Picker
      try {
        console.log('Opening document picker...');
        const result: DocumentPicker.DocumentResult = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });

        console.log('Document picker result:', result);

        if (result.type === 'success') {
          console.log('File selected:', result);
          setLocalSelectedFile(result);
          onFileSelected(result);
        } else if (result.type === 'cancel') {
          console.log('Document picking was canceled');
        }
      } catch (error) {
        console.error('Error picking document:', error);
      }
    }
  };

  return (
    <View style={{ width: '100%', alignItems: 'right' }}>
      <Button 
        variant='outline'
        className='shadow shadow-foreground/5'
        onPress={handlePickDocument}
      >
        <Text className='text-foreground/70'>
          {localSelectedFile ? 'Change Files' : 'Attach Files'}
        </Text>
      </Button>

      {localSelectedFile?.type === 'success' && (
        <Text className='text-foreground/70 mt-4'>
          {localSelectedFile.name}
        </Text>
      )}
    </View>
  );
};

export default AttachInputField;