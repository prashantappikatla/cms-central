import * as React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { Info } from '~/lib/icons/Info';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import AttachInputField from '~/app/custom-components/DocumentAttachment';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import * as DocumentPicker from 'expo-document-picker';
import toast from 'react-hot-toast';

export default function Screen() {
  // Local state to manage form data
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    documents: null as DocumentPicker.DocumentPickerSuccessResult | null, // State to manage the selected document
  });

  // Handler for input changes, updates state based on the input field
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(`Updated ${field}:`, value); // Debug: log the updated field value
  };

  // Function to handle the selected file, updates state with the selected document
  const handleFileSelected = (file: DocumentPicker.DocumentPickerSuccessResult) => {
    if (file.type === 'success') {
      setFormData((prev) => ({
        ...prev,
        documents: file,
      }));
      console.log('Selected file:', file.name); // Debug: log the selected file name
    } else {
      console.error('File selection was not successful');
    }
  };

  // Function to handle form submission, checks if all fields are filled and sends data to the API
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.documents) {
      Alert.alert('Error', 'Please fill out all fields, including attaching a document.');
      return;
    }

    try {
      console.log('Submitting form with data:', formData); // Debug: log form data before submission

      // Fetch the file to get a Blob object
      const fileUri = formData.documents.uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Prepare the form data to be sent to the API
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('document', blob, formData.documents.name || 'document');

      console.log('FormData prepared:', formDataToSend); // Debug: log the prepared FormData

      toast.custom((t) => (
        <div style={{
          ...t.style, // Inherit global styles
          overflowX: 'auto',
          fontFamily: 'monospace', // Customize to show JSON with monospace font
          whiteSpace: 'pre-wrap', // Preserve JSON formatting
        }}>
        <strong>
          Dispute Details Entered:
        </strong>
        <pre>{JSON.stringify({
          name: formData.name, 
          email: formData.email, 
          document: formData.documents.name 
          }, null, 2)}</pre>
      </div>
      ));

      // Send the form data to your Express API
      const apiResponse = await fetch('http://localhost:8000/api/dispute', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('API Response status:', apiResponse.status); // Debug: log the API response status

       // Show toast with the status of the request
       if (apiResponse.ok) {
        toast.success(`Success! Status: ${apiResponse.status}`);
        Alert.alert('Success', 'Process started successfully!');
        // Optionally reset form or navigate
        setFormData({ name: '', email: '', documents: null });
      } else {
        const errorText = await apiResponse.text(); // Get error details if available
        console.error('Failed to start the process. Error:', errorText);
        toast.error(`Error! Status: ${apiResponse.status} - ${errorText}`);
        Alert.alert('Error', 'Failed to start the process. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
        {/* Title for the Landing Page */}
        <Text className='text-6xl font-bold mb-20 text-center'>Camunda Dispute Management System</Text>
        {/* Form Card to Kick off the Process */}
        <Card className='w-full max-w-sm p-6 mt-20 rounded-2xl'>
          <CardHeader className='items-center'>
            <View className='flex-row'>
              <CardTitle className='pb-2 text-left mb-8'>Start a New Dispute Process</CardTitle>
              <Tooltip delayDuration={150}>
                <TooltipTrigger className='px-2 pb-0.5 active:opacity-50'>
                  <Info size={14} strokeWidth={2.5} className='w-4 h-4 text-foreground/70' />
                </TooltipTrigger>
                <TooltipContent className='py-2 px-4 shadow'>
                  <Text className='native:text-lg'>Enter the required information to begin.</Text>
                </TooltipContent>
              </Tooltip>
            </View>
          </CardHeader>
          <CardContent>
            <View className='flex-col gap-3'>
              <Text className='text-foreground/70'>Submitter Name</Text>
              <Input
                placeholder='Enter your name'
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                aria-labelledby='inputLabel'
                aria-errormessage='inputError'
              />
              <Text className='text-foreground/70'>Submitter Email</Text>
              <Input
                placeholder='Enter your email'
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                aria-labelledby='inputLabel'
                aria-errormessage='inputError'
                keyboardType='email-address'
              />
              <Text className='text-foreground/70'>Dispute Evidence Files</Text>
              <AttachInputField 
                onFileSelected={handleFileSelected} 
                selectedFile={formData.documents} // Correctly passing selected file
              />
            </View>
          </CardContent>
          <CardFooter className='flex-col gap-3 pb-0'>
            <Button
              variant='outline'
              className='shadow shadow-foreground/5 mt-4'
              onPress={handleSubmit}
            >
              <Text>Submit</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    </ScrollView>
  );
}