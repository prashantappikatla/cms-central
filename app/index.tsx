import * as React from 'react';
import { View, Alert } from 'react-native';
import { Info } from '~/lib/icons/Info';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import AttachInputField from '~/app/custom-components/DocumentAttachment';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

export default function Screen() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    documents: null, // Start with null to indicate no document attached
  });

  // Handler for input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to handle the selected file
  const handleFileSelected = (file: any) => {
    setFormData((prev) => ({
      ...prev,
      documents: file, // Attach the selected file to documents
    }));
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.documents) {
      Alert.alert('Error', 'Please fill out all fields, including attaching a document.');
      return;
    }
    // Logic to kick off the process (e.g., API call)
    Alert.alert('Success', 'Process started successfully!');
    // Optionally reset form or navigate
    setFormData({ name: '', email: '', documents: null });
  };

  return (
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
            <AttachInputField onFileSelected={handleFileSelected} />
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
  );
}