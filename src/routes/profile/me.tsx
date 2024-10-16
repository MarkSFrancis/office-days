import { createAsync, RouteDefinition, useSubmission } from '@solidjs/router';
import { Form } from '~/components/form/Form';
import { FormInput } from '~/components/form/FormInput';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';
import { authApi } from '~/features/auth/api';
import { createUserSubscription } from '~/features/auth/hooks';
import { profileApi, ProfileSchema } from '~/features/profile/api';

export const route = {
  preload: async () => {
    await Promise.all([profileApi.getProfile(), authApi.getUser()]);
  },
} satisfies RouteDefinition;

export default function ProfilePage() {
  const user = createUserSubscription({
    deferStream: true,
  });
  const profile = createAsync(() => profileApi.getProfile(), {
    deferStream: true,
  });
  const updatingProfile = useSubmission(profileApi.updateProfile);

  return (
    <Form
      class="w-full"
      action={profileApi.updateProfile}
      schema={ProfileSchema}
      initialValues={profile()}
    >
      <fieldset
        disabled={updatingProfile.pending}
        class="flex justify-center items-center"
      >
        <Card class="mx-auto mt-4 max-w-sm md:max-w-lg w-full">
          <CardHeader class="md:px-16 md:pt-8">
            <CardTitle class="text-2xl font-light">My profile</CardTitle>
            <CardDescription>Make changes to your profile here</CardDescription>
          </CardHeader>
          <CardContent class="md:px-16">
            <div class="grid gap-4">
              <TextField name="email">
                <TextFieldLabel>Email</TextFieldLabel>
                <TextFieldInput
                  type="email"
                  name="email"
                  value={user()?.email}
                  disabled
                />
              </TextField>
              <TextField name="avatarUrl">
                <TextFieldLabel>Avatar URL</TextFieldLabel>
                <FormInput type="url" name="avatarUrl" />
              </TextField>
              <TextField name="firstName">
                <TextFieldLabel>Given name</TextFieldLabel>
                <FormInput name="firstName" autocomplete="given-name" />
              </TextField>
              <TextField name="lastName">
                <TextFieldLabel>Family name</TextFieldLabel>
                <FormInput name="lastName" autocomplete="family-name" />
              </TextField>
              <Button
                type="submit"
                class="w-full"
                isPending={updatingProfile.pending}
              >
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </Form>
  );
}
