// NavigationMenuComponent.tsx
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TextRef } from '@rn-primitives/types';
import { cn } from '~/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';
import { Sparkles } from '~/lib/icons/Sparkles';
import { Text } from '~/components/ui/text';

const documents: { title: string; href: string; description: string }[] = [
  {
    title: 'Architecture Documentation',
    href: '/architecture-documentation',
    description:
      'Overall Architecture Documentation that covers all microapps involved in Dispute Case Management.',
  },
  {
    title: 'Documentation 2',
    href: '/documentation-2',
    description: 'Description for documentation 2.',
  },
  {
    title: 'Documentation 3',
    href: '/documentation-3',
    description: 'Description for documentation 3.',
  },
];

const NavigationMenuComponent = () => {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const [value, setValue] = React.useState<string>();

  function closeAll() {
    setValue('');
  }

  return (
    <View>
      <NavigationMenu value={value} onValueChange={setValue}>
        <NavigationMenuList>
          <NavigationMenuItem value='cms-pages'>
            <NavigationMenuTrigger>
              <Text>CMS Pages</Text>
            </NavigationMenuTrigger>
            <NavigationMenuContent insets={contentInsets}>
              <View
                role='list'
                className='web:grid gap-3 p-6 md:w-[400px] lg:w-[500px] web:lg:grid-cols-[.75fr_1fr]'
              >
                <View role='listitem' className='web:row-span-3'>
                  <NavigationMenuLink asChild>
                    <View className='flex web:select-none flex-col justify-end rounded-md web:bg-gradient-to-b web:from-muted/50 web:to-muted native:border native:border-border p-6 web:no-underline web:outline-none web:focus:shadow-md web:focus:shadow-foreground/5'>
                      <Sparkles size={16} className='text-foreground' />
                      <Text className='mb-2 mt-4 text-lg native:text-2xl font-medium'>
                        Dispute Case Management System
                      </Text>
                      <Text className='text-sm native:text-base leading-tight text-muted-foreground'>
                        Pages created for demo/poc. Each page redirects to a different microapp.
                      </Text>
                    </View>
                  </NavigationMenuLink>
                </View>
                <ListItem href='/cms' title='Central-Case-Management-Hub'>
                  <Text>
                    Main Interface for all Cases - Tracks the lifecycle of all cases (Consists of CSR, DA, Fraud, CO, Ops)
                  </Text>
                </ListItem>
                <ListItem href='/docview' title='Document-Management-Module'>
                  <Text>Document Management Module - Integrated into the CMS</Text>
                </ListItem>
                <ListItem href='/notesview' title='Notes-Module'>
                  <Text>Notes Module - Integrated into the CMS</Text>
                </ListItem>
                <ListItem href='/decisionview' title='Decision-Module'>
                  <Text>Decision Module - Integrated into the CMS</Text>
                </ListItem>
                <ListItem href='/taskview' title='Task-Module'>
                  <Text>Task Module - Integrated into the CMS</Text>
                </ListItem>
              </View>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value='documentation'>
            <NavigationMenuTrigger>
              <Text className='text-foreground'>Documentation</Text>
            </NavigationMenuTrigger>
            <NavigationMenuContent insets={contentInsets}>
              <View
                role='list'
                className='web:grid w-[400px] gap-3 p-4 md:w-[500px] web:md:grid-cols-2 lg:w-[600px]'
              >
                {documents.map((document) => (
                  <ListItem key={document.title} title={document.title} href={document.href}>
                    {document.description}
                  </ListItem>
                ))}
              </View>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value='personal'>
            <NavigationMenuLink onPress={closeAll} className={navigationMenuTriggerStyle()}>
              <Text>Personal</Text>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </View>
  );
};

const ListItem = React.forwardRef<
  TextRef,
  React.ComponentPropsWithoutRef<typeof Text> & { title: string; href: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <View role='listitem'>
      <NavigationMenuLink
        ref={ref}
        className={cn(
          'web:block web:select-none gap-1 rounded-md p-3 leading-none no-underline text-foreground web:outline-none web:transition-colors web:hover:bg-accent active:bg-accent web:hover:text-accent-foreground web:focus:bg-accent web:focus:text-accent-foreground',
          className
        )}
        {...props}
      >
        <Text className='text-sm native:text-base font-medium text-foreground leading-none'>
          {title}
        </Text>
        <Text className='line-clamp-2 text-sm native:text-base leading-snug text-muted-foreground'>
          {children}
        </Text>
      </NavigationMenuLink>
    </View>
  );
});
ListItem.displayName = 'ListItem';

export default NavigationMenuComponent;