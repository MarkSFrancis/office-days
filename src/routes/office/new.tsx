import { useSubmission } from '@solidjs/router';
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
import { TextField, TextFieldLabel } from '~/components/ui/text-field';
import { officeApi, OfficeSchema } from '~/features/office/api';

export default function NewOfficePage() {
  const creatingOffice = useSubmission(officeApi.create);

  return (
    <Form class="w-full" action={officeApi.create} schema={OfficeSchema}>
      <fieldset
        disabled={creatingOffice.pending}
        class="flex justify-center items-center"
      >
        <Card class="mx-auto mt-4 max-w-sm md:max-w-lg w-full">
          <CardHeader class="md:px-16 md:pt-8">
            <CardTitle class="text-2xl font-light">New office</CardTitle>
            <CardDescription>Create a new office here</CardDescription>
          </CardHeader>
          <CardContent class="md:px-16">
            <div class="grid gap-4">
              <TextField name="id" class="hidden">
                <FormInput
                  name="id"
                  type="hidden"
                  value={crypto.randomUUID()}
                />
              </TextField>
              <TextField name="displayName">
                <TextFieldLabel>Office name</TextFieldLabel>
                <FormInput name="displayName" />
              </TextField>
              <Button
                type="submit"
                class="w-full"
                isPending={creatingOffice.pending}
              >
                Create office
              </Button>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </Form>
  );
}
