import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const HelloWorld = () => (
  <div class="min-h-screen min-w-screen flex justify-center items-center">
    <Card class="flex flex-col items-start gap-4">
      <CardHeader>
        <CardTitle class="text-4xl font-light">Hello world!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{import.meta.env.VITE_SUPABASE_URL}</p>
      </CardContent>
    </Card>
  </div>
);
