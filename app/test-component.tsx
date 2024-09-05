// app/test-attach-input-field.tsx
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import AttachInputField from '~/app/custom-components/DocumentAttachment';
import * as DocumentPicker from 'expo-document-picker';

const TestAttachInputField = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const handleFileSelected = (file: DocumentPicker.DocumentPickerSuccessResult) => {
    console.log('Selected file:', file);
    setSelectedFile(file);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <AttachInputField onFileSelected={handleFileSelected} selectedFile={selectedFile} />
      </View>
    </SafeAreaView>
  );
};

export default TestAttachInputField;